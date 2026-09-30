const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, isPgConnected, memoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'placementpilot_super_secret_jwt_key_2026_xyz';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper to generate JWT access token
const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Helper for email format validation
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && emailRegex.test(email.trim().toLowerCase());
};

// Helper for password basic strength requirement:
// At least 8 characters, at least 1 letter, and at least 1 number
const isValidPassword = (password) => {
  if (typeof password !== 'string' || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long.'
    };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return {
      valid: false,
      message: 'Password must contain at least one letter and one number.'
    };
  }
  return { valid: true };
};

/**
 * @route   POST /api/auth/register
 * @desc    Sign up with Full Name, Email, Password, and Confirm Password
 */
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name.'
      });
    }

    // 2. Validate email format
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 3. Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // 4. Validate confirm password if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    // 5. Prevent duplicate email registration
    if (isPgConnected()) {
      const existing = await query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }

      // Hash password securely with bcrypt
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Store the user in PostgreSQL
      const userResult = await query(
        'INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, email, created_at, updated_at',
        [trimmedName, trimmedEmail, passwordHash]
      );
      const newUser = userResult.rows[0];

      // Create linked profile for onboarding convenience
      const college = req.body.college?.trim() || 'National Institute of Technology';
      const degree = req.body.degree?.trim() || 'B.Tech in Computer Science';
      const graduationYear = req.body.graduation_year?.trim() || '2026';
      const targetRole = req.body.target_role?.trim() || 'Software Development Engineer (SDE-1)';

      const profileResult = await query(
        `INSERT INTO profiles 
          (user_id, college, degree, graduation_year, target_role, target_companies, skills, programming_languages, readiness_percentage)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
          newUser.id,
          college,
          degree,
          graduationYear,
          targetRole,
          'Google, Microsoft, Amazon, Accenture, TCS Digital',
          'Data Structures, Algorithms, React.js, Node.js, SQL, System Design',
          'C++, Java, Python, JavaScript',
          65
        ]
      );

      // Starter tasks
      const initialTasks = [
        ['Solve Two Sum and 3Sum problems on LeetCode', 'DSA', '45 mins'],
        ['Review Database Normalization and SQL Indexes', 'Core CS', '30 mins'],
        ['Complete Mock Placement Aptitude Quiz', 'Aptitude', '40 mins']
      ];
      for (const t of initialTasks) {
        await query(
          'INSERT INTO student_tasks (user_id, title, category, duration, completed) VALUES ($1, $2, $3, $4, $5)',
          [newUser.id, t[0], t[1], t[2], false]
        );
      }

      // Generate JWT access token
      const token = generateToken(newUser.id, newUser.email);

      // Return user without password_hash
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to PlacementPilot.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        },
        profile: profileResult.rows[0]
      });
    } else {
      // In-memory fallback
      const existing = memoryStore.users.find(u => u.email === trimmedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userId = memoryStore.nextUserId++;
      const now = new Date().toISOString();
      const newUser = {
        id: userId,
        name: trimmedName,
        email: trimmedEmail,
        password_hash: passwordHash,
        created_at: now,
        updated_at: now
      };
      memoryStore.users.push(newUser);

      const newProfile = {
        id: memoryStore.nextProfileId++,
        user_id: userId,
        college: req.body.college?.trim() || 'National Institute of Technology',
        degree: req.body.degree?.trim() || 'B.Tech in Computer Science',
        graduation_year: req.body.graduation_year?.trim() || '2026',
        skills: 'Data Structures, Algorithms, React.js, Node.js, SQL, System Design',
        programming_languages: 'C++, Java, Python, JavaScript',
        target_role: req.body.target_role?.trim() || 'Software Development Engineer (SDE-1)',
        target_companies: 'Google, Microsoft, Amazon, Accenture, TCS Digital',
        interview_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        readiness_percentage: 65,
        created_at: now,
        updated_at: now
      };
      memoryStore.profiles.push(newProfile);

      memoryStore.tasks.push(
        { id: memoryStore.nextTaskId++, user_id: userId, title: 'Solve Two Sum and 3Sum problems on LeetCode', category: 'DSA', duration: '45 mins', completed: false },
        { id: memoryStore.nextTaskId++, user_id: userId, title: 'Review Database Normalization and SQL Indexes', category: 'Core CS', duration: '30 mins', completed: false }
      );

      const token = generateToken(userId, trimmedEmail);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to PlacementPilot.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        },
        profile: newProfile
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT access token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    let user = null;
    let profile = null;

    if (isPgConnected()) {
      const userRes = await query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
      if (userRes.rows.length === 0) {
        // Return generic error message for security
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
      user = userRes.rows[0];

      const profileRes = await query('SELECT * FROM profiles WHERE user_id = $1', [user.id]);
      profile = profileRes.rows[0] || null;
    } else {
      user = memoryStore.users.find(u => u.email === trimmedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
      profile = memoryStore.profiles.find(p => p.user_id === user.id) || null;
    }

    // Verify credentials securely using bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT access token
    const token = generateToken(user.id, user.email);

    // Return response without password hash
    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      profile
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Log out current session
 */
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout.'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = null;

    if (isPgConnected()) {
      const profileRes = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
      profile = profileRes.rows[0] || null;
    } else {
      profile = memoryStore.profiles.find(p => p.user_id === userId) || null;
    }

    return res.status(200).json({
      success: true,
      user: req.user,
      profile
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user data.'
    });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Forgot Password endpoint (MVP structure without email delivery)
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // MVP Requirement: Return standard message without implementing email delivery
    return res.status(200).json({
      success: true,
      message: 'Password reset functionality will be available soon.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing password reset.'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword
};
