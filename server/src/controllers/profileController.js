const { query, isPgConnected, memoryStore } = require('../config/db');

/**
 * Calculate dynamic profile completion percentage based on actual fields
 */
const calculateProfileCompletion = (profile, user) => {
  let score = 0;

  // Basic Info (10%)
  if (user?.name && profile?.college && profile?.degree && profile?.location) score += 10;
  else if (user?.name) score += 5;

  // About / Bio (10%)
  if (profile?.bio && profile.bio.trim().length > 20) score += 10;

  // Education (10%)
  if (profile?.education && profile.education.length > 0) score += 10;

  // Skills (15%)
  if (profile?.skills_list && profile.skills_list.length >= 3) score += 15;
  else if (profile?.skills_list && profile.skills_list.length > 0) score += 8;

  // Projects (15%)
  if (profile?.projects && profile.projects.length >= 2) score += 15;
  else if (profile?.projects && profile.projects.length > 0) score += 8;

  // Experience (10%)
  if (profile?.experience && profile.experience.length > 0) score += 10;

  // Achievements (10%)
  if (profile?.achievements && profile.achievements.length > 0) score += 10;

  // Certifications (5%)
  if (profile?.certifications && profile.certifications.length > 0) score += 5;

  // Coding Profiles & Socials (5%)
  if (profile?.coding_profiles && profile.coding_profiles.length > 0) score += 5;

  // Resume (5%)
  if (profile?.resume && profile.resume.fileName) score += 5;

  // Placement Target (5%)
  if (profile?.target_role && profile?.target_companies) score += 5;

  return Math.min(100, Math.max(20, score));
};

/**
 * Helper to compute stats dynamically
 */
const calculateDynamicStats = (profile) => {
  let dsaProblems = 0;
  if (profile.coding_profiles && Array.isArray(profile.coding_profiles)) {
    profile.coding_profiles.forEach(cp => {
      if (cp.solved) dsaProblems += parseInt(cp.solved, 10);
    });
  }
  if (dsaProblems === 0) dsaProblems = profile.stats?.dsa_problems || 124;

  return {
    dsa_problems: dsaProblems,
    projects: profile.projects ? profile.projects.length : 0,
    certifications: profile.certifications ? profile.certifications.length : 0,
    achievements: profile.achievements ? profile.achievements.length : 0,
  };
};

/**
 * @route   GET /api/profile
 * @desc    Get complete user developer profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isPgConnected()) {
      const result = await query(
        `SELECT u.id, u.name, u.email, u.created_at,
                p.*
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
      }

      const row = result.rows[0];
      const stats = calculateDynamicStats(row);
      const completion = calculateProfileCompletion(row, { name: row.name });

      return res.status(200).json({
        success: true,
        profile: {
          ...row,
          stats,
          completion_percentage: completion,
        }
      });
    } else {
      const user = memoryStore.users.find(u => u.id === userId);
      const profile = memoryStore.profiles.find(p => p.user_id === userId) || {};

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const stats = calculateDynamicStats(profile);
      const completion = calculateProfileCompletion(profile, user);

      return res.status(200).json({
        success: true,
        profile: {
          ...profile,
          id: user.id,
          name: user.name || profile.name || 'Ritika Chauhan',
          email: user.email,
          created_at: user.created_at,
          stats,
          completion_percentage: completion,
        }
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

/**
 * @route   PUT /api/profile or PATCH /api/profile
 * @desc    Update current user profile and persist changes
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    if (isPgConnected()) {
      // 1. Update users name if provided
      if (updates.name && updates.name.trim()) {
        await query('UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2', [updates.name.trim(), userId]);
      }

      // 2. Fetch or update profile
      const checkProfile = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);

      let updatedProfile;
      if (checkProfile.rows.length > 0) {
        const current = checkProfile.rows[0];
        const merged = { ...current, ...updates };

        const updateResult = await query(
          `UPDATE profiles SET
            college = COALESCE($1, college),
            degree = COALESCE($2, degree),
            graduation_year = COALESCE($3, graduation_year),
            skills = COALESCE($4, skills),
            programming_languages = COALESCE($5, programming_languages),
            target_role = COALESCE($6, target_role),
            target_companies = COALESCE($7, target_companies),
            interview_date = COALESCE($8, interview_date),
            readiness_percentage = COALESCE($9, readiness_percentage),
            updated_at = NOW()
          WHERE user_id = $10
          RETURNING *`,
          [
            merged.college,
            merged.degree,
            merged.graduation_year,
            typeof merged.skills === 'string' ? merged.skills : JSON.stringify(merged.skills || []),
            typeof merged.programming_languages === 'string' ? merged.programming_languages : JSON.stringify(merged.programming_languages || []),
            merged.target_role,
            merged.target_companies || merged.target_company,
            merged.interview_date || null,
            merged.readiness_percentage || null,
            userId
          ]
        );
        updatedProfile = updateResult.rows[0];
      }

      const userRes = await query('SELECT id, name, email FROM users WHERE id = $1', [userId]);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        profile: {
          ...updatedProfile,
          ...userRes.rows[0]
        }
      });
    } else {
      // Memory store update
      const user = memoryStore.users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (updates.name && updates.name.trim()) {
        user.name = updates.name.trim();
      }

      let profile = memoryStore.profiles.find(p => p.user_id === userId);
      if (!profile) {
        profile = { id: memoryStore.nextProfileId++, user_id: userId };
        memoryStore.profiles.push(profile);
      }

      // Merge all top-level properties safely
      Object.assign(profile, updates);

      // Harmonize target company alias
      if (updates.target_company && !updates.target_companies) {
        profile.target_companies = updates.target_company;
      }
      if (updates.target_companies) {
        profile.target_company = updates.target_companies.split(',')[0].trim();
      }

      profile.updated_at = new Date().toISOString();

      const stats = calculateDynamicStats(profile);
      const completion = calculateProfileCompletion(profile, user);

      memoryStore.activities.unshift({
        id: memoryStore.nextActivityId++,
        user_id: userId,
        title: 'Updated Profile Information',
        description: 'Saved changes to developer profile sections',
        tag: 'Profile',
        time_ago: 'Just now'
      });

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        profile: {
          ...profile,
          id: user.id,
          name: user.name,
          email: user.email,
          stats,
          completion_percentage: completion,
        }
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

/**
 * Generic Sub-Entity Helper for memoryStore CRUD
 */
const getProfileAndList = (userId, field) => {
  const profile = memoryStore.profiles.find(p => p.user_id === userId);
  if (!profile) return { profile: null, list: [] };
  if (!profile[field]) profile[field] = [];
  return { profile, list: profile[field] };
};

// -------------------------------------------------------------
// SECTION-SPECIFIC CRUD HANDLERS
// -------------------------------------------------------------

// Education
const addEducation = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'education');
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

  const newItem = {
    id: Date.now(),
    institution: req.body.institution,
    degree: req.body.degree,
    field_of_study: req.body.field_of_study || '',
    start_year: req.body.start_year || '2022',
    end_year: req.body.end_year || '2026',
    period: `${req.body.start_year || '2022'} - ${req.body.end_year || '2026'}`,
    grade: req.body.grade || '',
    location: req.body.location || 'India',
    description: req.body.description || '',
    coursework: req.body.coursework || []
  };

  list.unshift(newItem);
  return res.status(201).json({ success: true, message: 'Education added successfully!', item: newItem, list });
};

const updateEducation = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'education');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Education record not found.' });

  const item = list[idx];
  Object.assign(item, req.body);
  if (req.body.start_year || req.body.end_year) {
    item.period = `${req.body.start_year || item.start_year} - ${req.body.end_year || item.end_year}`;
  }

  return res.status(200).json({ success: true, message: 'Education updated!', item, list });
};

const deleteEducation = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'education');
  const id = parseInt(req.params.id, 10);
  profile.education = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Education record deleted.', list: profile.education });
};

// Skills
const addSkill = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'skills_list');
  const { name, category = 'Other', proficiency = 'Intermediate' } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Skill name required.' });

  // Prevent duplicate skill names
  const existing = list.find(s => s.name.toLowerCase() === name.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Skill already exists in your profile.' });
  }

  const newItem = {
    id: Date.now(),
    name: name.trim(),
    category,
    proficiency
  };

  list.push(newItem);
  // Also keep simple string list updated
  if (!profile.skills) profile.skills = [];
  if (Array.isArray(profile.skills)) {
    if (!profile.skills.includes(newItem.name)) profile.skills.push(newItem.name);
  }

  return res.status(201).json({ success: true, message: 'Skill added successfully!', item: newItem, list });
};

const updateSkill = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'skills_list');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Skill not found.' });

  Object.assign(list[idx], req.body);
  return res.status(200).json({ success: true, message: 'Skill updated!', item: list[idx], list });
};

const deleteSkill = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'skills_list');
  const id = parseInt(req.params.id, 10);
  profile.skills_list = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Skill removed.', list: profile.skills_list });
};

// Experience
const addExperience = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'experience');
  const newItem = {
    id: Date.now(),
    company: req.body.company,
    role: req.body.role,
    employment_type: req.body.employment_type || 'Internship',
    location: req.body.location || 'Remote',
    start_date: req.body.start_date || '',
    end_date: req.body.currently_working ? 'Present' : (req.body.end_date || ''),
    period: `${req.body.start_date || ''} - ${req.body.currently_working ? 'Present' : (req.body.end_date || '')}`,
    currently_working: !!req.body.currently_working,
    description: req.body.description || '',
    technologies: req.body.technologies || ''
  };

  list.unshift(newItem);
  return res.status(201).json({ success: true, message: 'Experience added successfully!', item: newItem, list });
};

const updateExperience = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'experience');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Experience not found.' });

  const item = list[idx];
  Object.assign(item, req.body);
  item.end_date = item.currently_working ? 'Present' : item.end_date;
  item.period = `${item.start_date || ''} - ${item.end_date || ''}`;

  return res.status(200).json({ success: true, message: 'Experience updated!', item, list });
};

const deleteExperience = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'experience');
  const id = parseInt(req.params.id, 10);
  profile.experience = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Experience removed.', list: profile.experience });
};

// Projects
const addProject = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'projects');
  const newItem = {
    id: Date.now(),
    title: req.body.title || req.body.name,
    description: req.body.description || '',
    technologies: req.body.technologies || '',
    tags: typeof req.body.technologies === 'string'
      ? req.body.technologies.split(',').map(s => s.trim()).filter(Boolean)
      : (req.body.tags || []),
    github: req.body.github || '',
    live: req.body.live || '',
    project_image: req.body.project_image || '',
    start_date: req.body.start_date || '',
    end_date: req.body.end_date || 'Present',
    role: req.body.role || 'Full-Stack Developer',
    featured: !!req.body.featured
  };

  list.unshift(newItem);
  return res.status(201).json({ success: true, message: 'Project added successfully!', item: newItem, list });
};

const updateProject = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'projects');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Project not found.' });

  const item = list[idx];
  Object.assign(item, req.body);
  if (req.body.technologies) {
    item.tags = typeof req.body.technologies === 'string'
      ? req.body.technologies.split(',').map(s => s.trim()).filter(Boolean)
      : req.body.tags;
  }

  return res.status(200).json({ success: true, message: 'Project updated!', item, list });
};

const deleteProject = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'projects');
  const id = parseInt(req.params.id, 10);
  profile.projects = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Project removed.', list: profile.projects });
};

// Achievements
const addAchievement = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'achievements');
  const newItem = {
    id: Date.now(),
    title: req.body.title,
    organization: req.body.organization || '',
    issuer: req.body.organization || '',
    date: req.body.date || '',
    achievement_url: req.body.achievement_url || '',
    certificate_url: req.body.certificate_url || '',
    description: req.body.description || ''
  };

  list.unshift(newItem);
  return res.status(201).json({ success: true, message: 'Achievement added successfully!', item: newItem, list });
};

const updateAchievement = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'achievements');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Achievement not found.' });

  Object.assign(list[idx], req.body);
  return res.status(200).json({ success: true, message: 'Achievement updated!', item: list[idx], list });
};

const deleteAchievement = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'achievements');
  const id = parseInt(req.params.id, 10);
  profile.achievements = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Achievement removed.', list: profile.achievements });
};

// Certifications
const addCertification = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'certifications');
  const newItem = {
    id: Date.now(),
    name: req.body.name,
    issuing_organization: req.body.issuing_organization || '',
    issue_date: req.body.issue_date || '',
    expiry_date: req.body.expiry_date || '',
    credential_id: req.body.credential_id || '',
    credential_url: req.body.credential_url || ''
  };

  list.unshift(newItem);
  return res.status(201).json({ success: true, message: 'Certification added successfully!', item: newItem, list });
};

const updateCertification = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'certifications');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Certification not found.' });

  Object.assign(list[idx], req.body);
  return res.status(200).json({ success: true, message: 'Certification updated!', item: list[idx], list });
};

const deleteCertification = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'certifications');
  const id = parseInt(req.params.id, 10);
  profile.certifications = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Certification removed.', list: profile.certifications });
};

// Coding Profiles
const addCodingProfile = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'coding_profiles');
  const newItem = {
    id: Date.now(),
    platform: req.body.platform,
    username: req.body.username,
    url: req.body.url,
    rating: req.body.rating || null,
    solved: req.body.solved ? parseInt(req.body.solved, 10) : null
  };

  list.push(newItem);
  return res.status(201).json({ success: true, message: 'Coding platform added!', item: newItem, list });
};

const updateCodingProfile = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'coding_profiles');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Coding profile not found.' });

  Object.assign(list[idx], req.body);
  return res.status(200).json({ success: true, message: 'Coding platform updated!', item: list[idx], list });
};

const deleteCodingProfile = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'coding_profiles');
  const id = parseInt(req.params.id, 10);
  profile.coding_profiles = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Coding profile removed.', list: profile.coding_profiles });
};

// Socials
const addSocial = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'socials');
  const newItem = {
    id: Date.now(),
    platform: req.body.platform,
    display_name: req.body.display_name || req.body.url,
    url: req.body.url
  };

  list.push(newItem);
  return res.status(201).json({ success: true, message: 'Social profile added!', item: newItem, list });
};

const updateSocial = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'socials');
  const id = parseInt(req.params.id, 10);
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Social link not found.' });

  Object.assign(list[idx], req.body);
  return res.status(200).json({ success: true, message: 'Social link updated!', item: list[idx], list });
};

const deleteSocial = async (req, res) => {
  const { profile, list } = getProfileAndList(req.user.id, 'socials');
  const id = parseInt(req.params.id, 10);
  profile.socials = list.filter(i => i.id !== id);
  return res.status(200).json({ success: true, message: 'Social link removed.', list: profile.socials });
};

// Resume
const updateResume = async (req, res) => {
  const profile = memoryStore.profiles.find(p => p.user_id === req.user.id);
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

  profile.resume = {
    fileName: req.body.fileName || 'Resume.pdf',
    url: req.body.url || '#',
    uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    fileSize: req.body.fileSize || '450 KB'
  };

  return res.status(200).json({ success: true, message: 'Resume uploaded successfully!', resume: profile.resume });
};

const deleteResume = async (req, res) => {
  const profile = memoryStore.profiles.find(p => p.user_id === req.user.id);
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

  profile.resume = null;
  return res.status(200).json({ success: true, message: 'Resume removed from profile.' });
};

// Placement Target
const getPlacementTarget = async (req, res) => {
  const profile = memoryStore.profiles.find(p => p.user_id === req.user.id);
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

  const target = profile.placement_target || {
    role: profile.target_role,
    target_role: profile.target_role,
    target_companies: profile.target_companies ? profile.target_companies.split(',').map(s => s.trim()) : ['Accenture', 'Google'],
    readiness: profile.readiness_percentage || 75,
    target_date: profile.interview_date || '2026-10-26',
    target_salary: profile.target_salary || '14 - 24 LPA',
    job_type: 'Full-time (Campus Placement)',
    preferred_technologies: profile.preferred_technologies ? profile.preferred_technologies.split(',').map(s => s.trim()) : []
  };

  return res.status(200).json({ success: true, placement_target: target, target });
};

const updatePlacementTarget = async (req, res) => {
  const profile = memoryStore.profiles.find(p => p.user_id === req.user.id);
  if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

  const {
    role,
    target_role,
    target_companies,
    companies,
    readiness,
    target_date,
    target_salary,
    job_type,
    preferred_technologies
  } = req.body;

  const resolvedRole = role || target_role || profile.target_role;
  const resolvedCompanies = target_companies || companies || (profile.target_companies ? profile.target_companies.split(',').map(s => s.trim()) : ['Accenture']);
  const resolvedReadiness = readiness !== undefined ? readiness : (profile.readiness_percentage || 75);

  profile.target_role = resolvedRole;
  profile.target_companies = Array.isArray(resolvedCompanies) ? resolvedCompanies.join(', ') : resolvedCompanies;
  profile.target_company = Array.isArray(resolvedCompanies) ? resolvedCompanies[0] : resolvedCompanies;
  profile.readiness_percentage = resolvedReadiness;
  if (target_date) profile.interview_date = target_date;
  if (target_salary) profile.target_salary = target_salary;

  profile.placement_target = {
    role: resolvedRole,
    target_role: resolvedRole,
    target_companies: Array.isArray(resolvedCompanies) ? resolvedCompanies : [resolvedCompanies],
    readiness: resolvedReadiness,
    target_date: target_date || profile.interview_date,
    target_salary: target_salary || profile.target_salary,
    job_type: job_type || 'Full-time (Campus Placement)',
    preferred_technologies: preferred_technologies || []
  };

  // Sync with Study Plan if present
  const studyPlan = memoryStore.studyPlans.find(sp => sp.user_id === req.user.id);
  if (studyPlan) {
    studyPlan.target_role = resolvedRole;
    studyPlan.target_company = Array.isArray(resolvedCompanies) ? resolvedCompanies[0] : resolvedCompanies;
  }

  return res.status(200).json({
    success: true,
    message: 'Placement target updated successfully and synchronized with AI Study Plan!',
    placement_target: profile.placement_target,
    target: profile.placement_target
  });
};

module.exports = {
  getProfile,
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  addProject,
  updateProject,
  deleteProject,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addCertification,
  updateCertification,
  deleteCertification,
  addCodingProfile,
  updateCodingProfile,
  deleteCodingProfile,
  addSocial,
  updateSocial,
  deleteSocial,
  updateResume,
  deleteResume,
  getPlacementTarget,
  updatePlacementTarget
};
