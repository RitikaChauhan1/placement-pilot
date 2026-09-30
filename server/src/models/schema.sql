-- PlacementPilot PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college VARCHAR(255) DEFAULT 'National Institute of Technology',
  degree VARCHAR(255) DEFAULT 'B.Tech in Computer Science',
  graduation_year VARCHAR(50) DEFAULT '2026',
  skills TEXT DEFAULT 'Data Structures, Algorithms, React.js, Node.js, SQL, System Design',
  programming_languages TEXT DEFAULT 'C++, Java, Python, JavaScript',
  target_role VARCHAR(255) DEFAULT 'Software Development Engineer (SDE-1)',
  target_companies TEXT DEFAULT 'Google, Microsoft, Amazon, Accenture, TCS Digital',
  interview_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  readiness_percentage INTEGER DEFAULT 68,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'DSA',
  duration VARCHAR(50) DEFAULT '45 mins',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recent_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  tag VARCHAR(50) DEFAULT 'Practice',
  time_ago VARCHAR(50) DEFAULT 'Just now',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  study_minutes INTEGER DEFAULT 0,
  dsa_problems INTEGER DEFAULT 0,
  sql_questions INTEGER DEFAULT 0,
  quiz_count INTEGER DEFAULT 0,
  sessions_completed INTEGER DEFAULT 0,
  completed_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_date)
);

CREATE TABLE IF NOT EXISTS study_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  target_company VARCHAR(100) NOT NULL,
  target_role VARCHAR(150) NOT NULL,
  interview_date DATE,
  days_remaining INTEGER DEFAULT 26,
  daily_study_hours INTEGER DEFAULT 2,
  summary TEXT,
  why_this_plan TEXT,
  version INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roadmap_phases (
  id SERIAL PRIMARY KEY,
  study_plan_id INTEGER NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  duration_days INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'upcoming',
  topics JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON student_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON recent_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_act_user_date ON daily_activities(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_phases_plan_id ON roadmap_phases(study_plan_id);
