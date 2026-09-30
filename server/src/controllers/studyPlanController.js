const { query, isPgConnected, memoryStore } = require('../config/db');
const { generatePlan, calculateDaysRemaining } = require('../services/aiPlannerService');

/**
 * Helper to get user profile from DB or memoryStore
 */
const getUserProfile = async (userId) => {
  if (isPgConnected()) {
    const profRes = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    return profRes.rows[0] || null;
  }
  return memoryStore.profiles.find(p => p.user_id === userId) || null;
};

/**
 * @route   GET /api/study-plan
 * @desc    Get current active roadmap, phases, today's plan, and target sync status
 */
const getStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getUserProfile(userId);

    // Check essential profile fields
    const missingFields = [];
    if (!profile?.target_role) missingFields.push('Target role');
    if (!profile?.interview_date) missingFields.push('Interview date');
    if (!profile?.skills) missingFields.push('Current skills');

    let plan = null;
    let phases = [];
    let tasks = [];

    if (isPgConnected()) {
      const planRes = await query(
        'SELECT * FROM study_plans WHERE user_id = $1 AND status = $2 ORDER BY version DESC LIMIT 1',
        [userId, 'active']
      );
      plan = planRes.rows[0] || null;

      if (plan) {
        const phasesRes = await query(
          'SELECT * FROM roadmap_phases WHERE study_plan_id = $1 ORDER BY phase_number ASC',
          [plan.id]
        );
        phases = phasesRes.rows;

        const tasksRes = await query(
          'SELECT * FROM student_tasks WHERE user_id = $1 ORDER BY id ASC',
          [userId]
        );
        tasks = tasksRes.rows;
      }
    } else {
      plan = memoryStore.studyPlans.find(p => p.user_id === userId && p.status === 'active') || null;
      if (plan) {
        phases = memoryStore.roadmapPhases.filter(ph => ph.study_plan_id === plan.id);
        tasks = memoryStore.tasks.filter(t => t.user_id === userId);
      }
    }

    // Detect target company or role mismatch with profile
    let profileMismatch = null;
    const currentProfileCompany = profile?.target_companies ? profile.target_companies.split(',')[0].trim() : 'Accenture';
    const currentProfileRole = profile?.target_role || 'Software Development Engineer';

    if (plan && (plan.target_company.toLowerCase() !== currentProfileCompany.toLowerCase() ||
                 plan.target_role.toLowerCase() !== currentProfileRole.toLowerCase())) {
      profileMismatch = {
        planTargetCompany: plan.target_company,
        planTargetRole: plan.target_role,
        currentProfileCompany,
        currentProfileRole
      };
    }

    const daysRemaining = calculateDaysRemaining(profile?.interview_date, '2026-09-30');

    return res.status(200).json({
      success: true,
      data: {
        hasPlan: !!plan,
        plan,
        phases,
        tasks,
        profileMismatch,
        missingFields,
        canGenerate: missingFields.length === 0,
        goal: {
          targetCompany: currentProfileCompany,
          targetRole: currentProfileRole,
          interviewDate: profile?.interview_date || '2026-10-26',
          daysRemaining,
          dailyStudyHours: plan?.daily_study_hours || 2
        }
      }
    });
  } catch (error) {
    console.error('Get study plan error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving study plan.' });
  }
};

/**
 * @route   POST /api/study-plan/generate
 * @desc    Generate or regenerate a personalized AI roadmap and populate daily tasks
 */
const generateStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dailyStudyHours = 2, isRegeneration = false } = req.body;
    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(400).json({ success: false, message: 'Student profile not found. Please complete profile first.' });
    }

    // Find previous plan if any to maintain versioning and keep completed tasks
    let previousPlan = null;
    let existingTasks = [];

    if (isPgConnected()) {
      const prevPlanRes = await query(
        'SELECT * FROM study_plans WHERE user_id = $1 AND status = $2 ORDER BY version DESC LIMIT 1',
        [userId, 'active']
      );
      previousPlan = prevPlanRes.rows[0] || null;

      const tasksRes = await query('SELECT * FROM student_tasks WHERE user_id = $1', [userId]);
      existingTasks = tasksRes.rows;
    } else {
      previousPlan = memoryStore.studyPlans.find(p => p.user_id === userId && p.status === 'active') || null;
      existingTasks = memoryStore.tasks.filter(t => t.user_id === userId);
    }

    // Generate AI Plan
    const generated = await generatePlan({
      profile,
      progress: {
        weakTopics: ['Binary Search', 'SQL Joins', 'Operating Systems'],
        strongTopics: ['Arrays', 'OOP Principles']
      },
      dailyStudyHours,
      previousPlan
    });

    let newPlan = null;
    let savedPhases = [];
    let syncedTasks = [];

    if (isPgConnected()) {
      // Archive previous plan if regenerating
      if (previousPlan) {
        await query('UPDATE study_plans SET status = $1 WHERE id = $2', ['archived', previousPlan.id]);
      }

      const planInsert = await query(
        `INSERT INTO study_plans 
          (user_id, title, target_company, target_role, interview_date, days_remaining, daily_study_hours, summary, why_this_plan, version, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
         RETURNING *`,
        [
          userId,
          generated.title,
          generated.targetCompany,
          generated.targetRole,
          generated.interviewDate,
          generated.daysRemaining,
          generated.dailyStudyHours,
          generated.summary,
          generated.whyThisPlan,
          generated.version
        ]
      );
      newPlan = planInsert.rows[0];

      // Insert phases
      for (const ph of generated.phases) {
        const phInsert = await query(
          `INSERT INTO roadmap_phases 
            (study_plan_id, phase_number, name, duration_days, status, topics, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [newPlan.id, ph.phaseNumber, ph.name, ph.durationDays, ph.status, JSON.stringify(ph.topics), ph.description]
        );
        savedPhases.push(phInsert.rows[0]);
      }

      // Preserve previously completed tasks
      const completedTaskTitles = existingTasks.filter(t => t.completed).map(t => t.title.toLowerCase());

      // Replace or sync tasks
      await query('DELETE FROM student_tasks WHERE user_id = $1 AND completed = false', [userId]);

      for (const t of generated.dailyTasks) {
        const wasCompleted = completedTaskTitles.includes(t.title.toLowerCase()) || t.completed;
        const taskInsert = await query(
          `INSERT INTO student_tasks 
            (user_id, title, category, duration, completed)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [userId, t.title, t.category, t.duration, wasCompleted]
        );
        syncedTasks.push(taskInsert.rows[0]);
      }
    } else {
      if (previousPlan) {
        previousPlan.status = 'archived';
      }

      newPlan = {
        id: memoryStore.nextStudyPlanId++,
        user_id: userId,
        title: generated.title,
        target_company: generated.targetCompany,
        target_role: generated.targetRole,
        interview_date: generated.interviewDate,
        days_remaining: generated.daysRemaining,
        daily_study_hours: generated.dailyStudyHours,
        summary: generated.summary,
        why_this_plan: generated.whyThisPlan,
        version: generated.version,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      memoryStore.studyPlans.push(newPlan);

      // Save phases in memory
      generated.phases.forEach((ph) => {
        const phaseObj = {
          id: memoryStore.nextRoadmapPhaseId++,
          study_plan_id: newPlan.id,
          phase_number: ph.phaseNumber,
          name: ph.name,
          duration_days: ph.durationDays,
          status: ph.status,
          topics: ph.topics,
          description: ph.description
        };
        memoryStore.roadmapPhases.push(phaseObj);
        savedPhases.push(phaseObj);
      });

      // Preserve completed tasks
      const completedTitles = existingTasks.filter(t => t.completed).map(t => t.title.toLowerCase());

      // Filter out uncompleted tasks
      memoryStore.tasks = memoryStore.tasks.filter(t => t.user_id !== userId || t.completed);

      generated.dailyTasks.forEach((t) => {
        const isDone = completedTitles.includes(t.title.toLowerCase()) || t.completed;
        const taskObj = {
          id: memoryStore.nextTaskId++,
          study_plan_id: newPlan.id,
          user_id: userId,
          title: t.title,
          description: t.description || '',
          category: t.category,
          type: t.type || 'DSA Problem',
          priority: t.priority || 'High',
          duration: t.duration,
          estimated_minutes: t.estimatedMinutes,
          action_route: t.actionRoute || '/dsa',
          scheduled_date: t.scheduledDate || '2026-09-30',
          completed: isDone,
          source: 'ai_generated'
        };
        memoryStore.tasks.push(taskObj);
        syncedTasks.push(taskObj);
      });
    }

    return res.status(201).json({
      success: true,
      message: `Personalized ${generated.daysRemaining}-Day Roadmap generated successfully!`,
      data: {
        plan: newPlan,
        phases: savedPhases,
        tasks: syncedTasks
      }
    });
  } catch (error) {
    console.error('Generate study plan error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating study plan.' });
  }
};

/**
 * @route   PUT /api/study-plan/adjust-hours
 * @desc    Adjust daily study time capacity (1, 2, 3, 4+ hours) and rebalance tasks
 */
const adjustStudyHours = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dailyStudyHours } = req.body;

    const hours = parseInt(dailyStudyHours || 2, 10);

    if (isPgConnected()) {
      await query(
        'UPDATE study_plans SET daily_study_hours = $1, updated_at = NOW() WHERE user_id = $2 AND status = $3',
        [hours, userId, 'active']
      );
    } else {
      const activePlan = memoryStore.studyPlans.find(p => p.user_id === userId && p.status === 'active');
      if (activePlan) {
        activePlan.daily_study_hours = hours;
        activePlan.updated_at = new Date().toISOString();
      }
    }

    return res.status(200).json({
      success: true,
      message: `Daily preparation workload adjusted to ${hours} hour${hours > 1 ? 's' : ''}/day.`
    });
  } catch (error) {
    console.error('Adjust study hours error:', error);
    return res.status(500).json({ success: false, message: 'Server error adjusting study hours.' });
  }
};

module.exports = {
  getStudyPlan,
  generateStudyPlan,
  adjustStudyHours
};
