const { query, isPgConnected, memoryStore } = require('../config/db');

/**
 * @route   GET /api/profile
 * @desc    Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isPgConnected()) {
      const result = await query(
        `SELECT u.id, u.name, u.email, u.created_at,
                p.college, p.degree, p.graduation_year, p.skills,
                p.programming_languages, p.target_role, p.target_companies,
                p.interview_date, p.readiness_percentage
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
      }

      return res.status(200).json({ success: true, profile: result.rows[0] });
    } else {
      const user = memoryStore.users.find(u => u.id === userId);
      const profile = memoryStore.profiles.find(p => p.user_id === userId) || {};

      if (!user) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
      }

      return res.status(200).json({
        success: true,
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          ...profile
        }
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

/**
 * @route   PUT /api/profile
 * @desc    Update current user profile and name
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      college,
      degree,
      graduation_year,
      skills,
      programming_languages,
      target_role,
      target_companies,
      interview_date,
      readiness_percentage
    } = req.body;

    if (isPgConnected()) {
      // 1. Update user name if provided
      if (name && name.trim()) {
        await query('UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2', [name.trim(), userId]);
      }

      // 2. Upsert profile
      const checkProfile = await query('SELECT id FROM profiles WHERE user_id = $1', [userId]);

      let updatedProfile;
      if (checkProfile.rows.length > 0) {
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
            college,
            degree,
            graduation_year,
            skills,
            programming_languages,
            target_role,
            target_companies,
            interview_date || null,
            readiness_percentage ? parseInt(readiness_percentage, 10) : null,
            userId
          ]
        );
        updatedProfile = updateResult.rows[0];
      } else {
        const insertResult = await query(
          `INSERT INTO profiles
            (user_id, college, degree, graduation_year, skills, programming_languages, target_role, target_companies, interview_date, readiness_percentage)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *`,
          [
            userId,
            college || 'National Institute of Technology',
            degree || 'B.Tech in Computer Science',
            graduation_year || '2026',
            skills || 'Data Structures, Algorithms, React, Node.js',
            programming_languages || 'C++, Java, Python, JavaScript',
            target_role || 'Software Development Engineer',
            target_companies || 'Google, Microsoft, Amazon',
            interview_date || null,
            readiness_percentage ? parseInt(readiness_percentage, 10) : 70
          ]
        );
        updatedProfile = insertResult.rows[0];
      }

      // Add recent activity
      await query(
        'INSERT INTO recent_activities (user_id, title, description, tag, time_ago) VALUES ($1, $2, $3, $4, $5)',
        [userId, 'Updated Profile Information', 'Saved career goals, skills, and target companies', 'Profile', 'Just now']
      );

      // Fetch user updated info
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
      // Memory store fallback
      const user = memoryStore.users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name && name.trim()) {
        user.name = name.trim();
      }

      let profile = memoryStore.profiles.find(p => p.user_id === userId);
      if (!profile) {
        profile = {
          id: memoryStore.nextProfileId++,
          user_id: userId
        };
        memoryStore.profiles.push(profile);
      }

      if (college !== undefined) profile.college = college;
      if (degree !== undefined) profile.degree = degree;
      if (graduation_year !== undefined) profile.graduation_year = graduation_year;
      if (skills !== undefined) profile.skills = skills;
      if (programming_languages !== undefined) profile.programming_languages = programming_languages;
      if (target_role !== undefined) profile.target_role = target_role;
      if (target_companies !== undefined) profile.target_companies = target_companies;
      if (interview_date !== undefined) profile.interview_date = interview_date;
      if (readiness_percentage !== undefined) profile.readiness_percentage = parseInt(readiness_percentage, 10);
      profile.updated_at = new Date().toISOString();

      memoryStore.activities.unshift({
        id: memoryStore.nextActivityId++,
        user_id: userId,
        title: 'Updated Profile Information',
        description: 'Saved career goals, skills, and target companies',
        tag: 'Profile',
        time_ago: 'Just now'
      });

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          ...profile
        }
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
