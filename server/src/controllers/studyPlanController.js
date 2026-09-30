const { query, isPgConnected, memoryStore } = require('../config/db');
const {
  generatePlan,
  calculateDaysRemaining,
  processNaturalLanguageCommand,
  applyChangeProposal,
  CURATED_TOPICS,
  CURATED_RESOURCES
} = require('../services/aiPlannerService');

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
 * Helper to get active plan, phases, and tasks
 */
const getActivePlanData = async (userId) => {
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

  return { plan, phases, tasks };
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

    const { plan, phases, tasks } = await getActivePlanData(userId);

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
    const { dailyStudyHours = 2, preserveCompleted = true } = req.body;
    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(400).json({ success: false, message: 'Student profile not found. Please complete profile first.' });
    }

    const { plan: previousPlan, tasks: existingTasks } = await getActivePlanData(userId);

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

      // Preserve previously completed tasks if preserveCompleted is true
      const completedTaskTitles = preserveCompleted 
        ? existingTasks.filter(t => t.completed).map(t => t.title.toLowerCase())
        : [];

      // Remove uncompleted tasks
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
      const completedTitles = preserveCompleted
        ? existingTasks.filter(t => t.completed).map(t => t.title.toLowerCase())
        : [];

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
 * @desc    Adjust daily study time capacity (1, 2, 3, 4+ hours)
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

/**
 * @route   POST /api/study-plan/ai/chat
 * @desc    Interact with AI Study Planner using natural language commands
 */
const chatAiPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const profile = await getUserProfile(userId);
    const { plan, phases, tasks } = await getActivePlanData(userId);

    const result = await processNaturalLanguageCommand({
      command: message,
      currentPlan: plan,
      currentPhases: phases,
      currentTasks: tasks,
      profile,
      dailyStudyHours: plan?.daily_study_hours || 2
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ success: false, message: 'Server error during AI planning consultation.' });
  }
};

/**
 * @route   POST /api/study-plan/ai/apply-changes
 * @desc    Apply approved structured AI changes to the active study plan
 */
const applyAiChanges = async (req, res) => {
  try {
    const userId = req.user.id;
    const { proposal } = req.body;

    if (!proposal) {
      return res.status(400).json({ success: false, message: 'Structured change proposal is required.' });
    }

    const { plan, phases, tasks } = await getActivePlanData(userId);

    const applied = await applyChangeProposal({
      proposal,
      currentPlan: plan,
      currentPhases: phases,
      currentTasks: tasks,
      userId
    });

    if (isPgConnected()) {
      // Update plan
      if (applied.plan && plan) {
        await query(
          'UPDATE study_plans SET daily_study_hours = $1, version = $2, summary = $3, updated_at = NOW() WHERE id = $4',
          [applied.plan.daily_study_hours, applied.plan.version, applied.plan.summary, plan.id]
        );
      }

      // Update phases topics
      for (const ph of applied.phases) {
        if (ph.id) {
          await query(
            'UPDATE roadmap_phases SET topics = $1 WHERE id = $2',
            [JSON.stringify(ph.topics), ph.id]
          );
        }
      }

      // Sync tasks: preserve completed, update student_tasks
      await query('DELETE FROM student_tasks WHERE user_id = $1 AND completed = false', [userId]);
      for (const t of applied.tasks.filter(t => !t.completed)) {
        await query(
          `INSERT INTO student_tasks (user_id, title, category, duration, completed)
           VALUES ($1, $2, $3, $4, false)`,
          [userId, t.title, t.category, t.duration]
        );
      }
    } else {
      // Update in memoryStore
      if (plan) {
        plan.daily_study_hours = applied.plan.daily_study_hours;
        plan.version = applied.plan.version;
        plan.summary = applied.plan.summary;
        plan.updated_at = new Date().toISOString();
      }

      // Update phases
      applied.phases.forEach(ph => {
        const memPh = memoryStore.roadmapPhases.find(p => p.id === ph.id);
        if (memPh) {
          memPh.topics = ph.topics;
        }
      });

      // Update tasks
      memoryStore.tasks = memoryStore.tasks.filter(t => t.user_id !== userId || t.completed);
      applied.tasks.forEach(t => {
        if (!t.completed) {
          const newTask = {
            id: memoryStore.nextTaskId++,
            study_plan_id: plan ? plan.id : 1,
            user_id: userId,
            title: t.title,
            description: t.description || '',
            category: t.category,
            type: t.type || 'Practice',
            priority: t.priority || 'High',
            duration: t.duration,
            estimated_minutes: t.estimated_minutes || 30,
            action_route: t.action_route || '/dsa',
            scheduled_date: t.scheduled_date || '2026-09-30',
            completed: false,
            source: 'ai_proposal'
          };
          memoryStore.tasks.push(newTask);
        }
      });
    }

    const refreshed = await getActivePlanData(userId);

    return res.status(200).json({
      success: true,
      message: 'Plan successfully updated and synchronized with Dashboard!',
      data: refreshed
    });
  } catch (error) {
    console.error('Apply AI changes error:', error);
    return res.status(500).json({ success: false, message: 'Server error applying AI changes.' });
  }
};

/**
 * @route   POST /api/study-plan/tasks
 * @desc    Add a manual task to the study plan
 */
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      category = 'DSA',
      topic = '',
      duration = '30 min',
      estimatedMinutes = 30,
      priority = 'Medium',
      scheduledDate = '2026-09-30',
      resourceUrl = '',
      notes = ''
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    let createdTask = null;

    if (isPgConnected()) {
      const insert = await query(
        `INSERT INTO student_tasks (user_id, title, category, duration, completed)
         VALUES ($1, $2, $3, $4, false)
         RETURNING *`,
        [userId, title.trim(), category, duration]
      );
      createdTask = insert.rows[0];
    } else {
      createdTask = {
        id: memoryStore.nextTaskId++,
        study_plan_id: 1,
        user_id: userId,
        title: title.trim(),
        description: notes || topic || '',
        category,
        type: category === 'DSA' ? 'DSA Problem' : category === 'SQL' ? 'SQL Practice' : 'Revision',
        priority,
        duration,
        estimated_minutes: parseInt(estimatedMinutes, 10) || 30,
        action_route: category === 'DSA' ? '/dsa' : category === 'SQL' ? '/sql' : '/study-plan',
        scheduled_date: scheduledDate,
        completed: false,
        resource_url: resourceUrl,
        source: 'manual'
      };
      memoryStore.tasks.push(createdTask);
    }

    return res.status(201).json({
      success: true,
      message: 'Task added successfully.',
      task: createdTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ success: false, message: 'Server error adding task.' });
  }
};

/**
 * @route   PATCH /api/study-plan/tasks/:id
 * @desc    Update an existing task (toggle completion, reschedule, rename, etc.)
 */
const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const updates = req.body;
    const todayStr = '2026-09-30';

    if (isPgConnected()) {
      const checkTask = await query('SELECT * FROM student_tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
      if (checkTask.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }

      const prevTask = checkTask.rows[0];
      const newCompleted = updates.completed !== undefined ? updates.completed : prevTask.completed;
      const newTitle = updates.title || prevTask.title;
      const newDuration = updates.duration || prevTask.duration;
      const newCategory = updates.category || prevTask.category;

      const updated = await query(
        `UPDATE student_tasks 
         SET completed = $1, title = $2, duration = $3, category = $4 
         WHERE id = $5 RETURNING *`,
        [newCompleted, newTitle, newDuration, newCategory, taskId]
      );

      // If completion changed to true, update activity
      if (newCompleted && !prevTask.completed) {
        await query(
          'INSERT INTO recent_activities (user_id, title, description, tag, time_ago) VALUES ($1, $2, $3, $4, $5)',
          [userId, `Completed Task: ${newTitle}`, `Category: ${newCategory}`, 'Task', 'Just now']
        );
      }

      return res.status(200).json({ success: true, task: updated.rows[0] });
    } else {
      const task = memoryStore.tasks.find(t => t.id === taskId && t.user_id === userId);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }

      const prevCompleted = task.completed;
      Object.assign(task, updates);

      // If completed changed, sync with daily activity calendar
      if (task.completed && !prevCompleted) {
        memoryStore.activities.unshift({
          id: memoryStore.nextActivityId++,
          user_id: userId,
          title: `Completed Task: ${task.title}`,
          description: `Category: ${task.category}`,
          tag: 'Task',
          time_ago: 'Just now'
        });

        let todayAct = memoryStore.dailyActivities.find(d => d.user_id === userId && d.activity_date === todayStr);
        if (todayAct) {
          todayAct.study_minutes += 25;
          todayAct.sessions_completed += 1;
          if (!todayAct.completed_items.includes(task.title)) {
            todayAct.completed_items.push(task.title);
          }
        }
      }

      return res.status(200).json({ success: true, task });
    }
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating task.' });
  }
};

/**
 * @route   DELETE /api/study-plan/tasks/:id
 * @desc    Delete a task (requires confirmation on front-end for completed tasks)
 */
const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    if (isPgConnected()) {
      const check = await query('SELECT * FROM student_tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      await query('DELETE FROM student_tasks WHERE id = $1', [taskId]);
    } else {
      const idx = memoryStore.tasks.findIndex(t => t.id === taskId && t.user_id === userId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      memoryStore.tasks.splice(idx, 1);
    }

    return res.status(200).json({ success: true, message: 'Task removed from your study plan.' });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting task.' });
  }
};

/**
 * @route   GET /api/study-plan/topics/search
 * @desc    Search curated topics catalog by query and category
 */
const searchTopics = async (req, res) => {
  try {
    const { q = '', category = 'All' } = req.query;
    const queryLower = q.toLowerCase().trim();

    let results = CURATED_TOPICS;

    if (category && category !== 'All') {
      results = results.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (queryLower) {
      results = results.filter(t =>
        t.name.toLowerCase().includes(queryLower) ||
        t.category.toLowerCase().includes(queryLower) ||
        (t.description && t.description.toLowerCase().includes(queryLower))
      );
    }

    return res.status(200).json({
      success: true,
      topics: results
    });
  } catch (error) {
    console.error('Search topics error:', error);
    return res.status(500).json({ success: false, message: 'Server error searching topics.' });
  }
};

/**
 * @route   POST /api/study-plan/topics/add-to-plan
 * @desc    Directly add a curated topic to active roadmap and today's task list
 */
const addTopicToPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topicId, topicName, category = 'DSA', duration = '30 min', sessionsCount = 3 } = req.body;

    const name = topicName || 'New Practice Topic';
    const { plan, phases } = await getActivePlanData(userId);

    // Create a new task
    const newTask = {
      id: isPgConnected() ? null : memoryStore.nextTaskId++,
      study_plan_id: plan ? plan.id : 1,
      user_id: userId,
      title: `Practice: ${name}`,
      description: `Curated ${category} focus session added to your preparation roadmap.`,
      category,
      type: category === 'DSA' ? 'DSA Problem' : category === 'SQL' ? 'SQL Practice' : 'Revision',
      priority: 'High',
      duration,
      estimated_minutes: parseInt(duration, 10) || 30,
      action_route: category === 'DSA' ? '/dsa' : category === 'SQL' ? '/sql' : '/study-plan',
      scheduled_date: '2026-09-30',
      completed: false,
      source: 'topic_catalog'
    };

    if (isPgConnected()) {
      const ins = await query(
        `INSERT INTO student_tasks (user_id, title, category, duration, completed)
         VALUES ($1, $2, $3, $4, false) RETURNING *`,
        [userId, newTask.title, newTask.category, newTask.duration]
      );
      newTask.id = ins.rows[0].id;
    } else {
      memoryStore.tasks.push(newTask);
      // Append topic to phase 1
      if (phases && phases.length > 0) {
        if (!phases[0].topics) phases[0].topics = [];
        phases[0].topics.push({ name, status: 'in_progress' });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Added "${name}" to your study plan!`,
      task: newTask
    });
  } catch (error) {
    console.error('Add topic to plan error:', error);
    return res.status(500).json({ success: false, message: 'Server error adding topic to plan.' });
  }
};

/**
 * @route   GET /api/study-plan/resources
 * @desc    Get curated placement resources with optional category filter
 */
const getResources = async (req, res) => {
  try {
    const { category = 'All' } = req.query;
    let list = CURATED_RESOURCES;

    if (category && category !== 'All') {
      list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      resources: list
    });
  } catch (error) {
    console.error('Get resources error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving resources.' });
  }
};

module.exports = {
  getStudyPlan,
  generateStudyPlan,
  adjustStudyHours,
  chatAiPlan,
  applyAiChanges,
  createTask,
  updateTask,
  deleteTask,
  searchTopics,
  addTopicToPlan,
  getResources
};
