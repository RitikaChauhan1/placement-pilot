const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let isPgConnected = false;

// In-memory fallback mock database for instant zero-config resilience
const memoryStore = {
  users: [],
  profiles: [],
  tasks: [],
  activities: [],
  dailyActivities: [],
  studyPlans: [],
  roadmapPhases: [],
  nextUserId: 1,
  nextProfileId: 1,
  nextTaskId: 1,
  nextActivityId: 1,
  nextDailyActivityId: 1,
  nextStudyPlanId: 1,
  nextRoadmapPhaseId: 1
};

// Seed default initial user for development convenience if memory fallback is active
const seedMemoryData = () => {
  if (memoryStore.users.length === 0) {
    const defaultUser = {
      id: 1,
      name: 'Ritika Sharma',
      email: 'student@placementpilot.com',
      // bcrypt hash for "password123"
      password_hash: '$2a$10$Q9YIm3WtEXb4i5bs3d8aguspeJCEtm4VYS26boNLqrfhWaXIaurey',
      created_at: new Date().toISOString()
    };
    memoryStore.users.push(defaultUser);
    memoryStore.nextUserId = 2;

    memoryStore.profiles.push({
      id: 1,
      user_id: 1,
      college: 'National Institute of Technology, Surathkal',
      degree: 'B.Tech in Computer Science & Engineering',
      graduation_year: '2026',
      skills: 'Data Structures, Algorithms, React.js, Node.js, SQL, System Design, REST APIs',
      programming_languages: 'C++, Java, Python, JavaScript',
      target_role: 'Software Development Engineer',
      target_companies: 'Accenture, Google, Microsoft, Amazon, TCS Digital',
      interview_date: '2026-10-26',
      readiness_percentage: 65,
      created_at: new Date().toISOString()
    });
    memoryStore.nextProfileId = 2;

    // Seed Study Plan v1 for Ritika
    const initialPlan = {
      id: 1,
      user_id: 1,
      title: '26-Day SDE Placement Roadmap for Accenture',
      target_company: 'Accenture',
      target_role: 'Software Development Engineer',
      interview_date: '2026-10-26',
      days_remaining: 26,
      daily_study_hours: 2,
      summary: 'Personalized preparation roadmap tailored to Accenture SDE hiring patterns, prioritizing weak topics (Binary Search, SQL Joins) while maintaining a balanced 2 hrs/day workload.',
      why_this_plan: 'Your plan prioritizes Binary Search and SQL Joins because recent performance indicates 58-61% accuracy in these core areas for Accenture SDE rounds. Your available study time is configured to 2 hours/day, so the plan distributes topics sequentially into 5 progressive phases to prevent burnout.',
      version: 1,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.studyPlans.push(initialPlan);
    memoryStore.nextStudyPlanId = 2;

    // Seed 5 Roadmap Phases
    const phases = [
      {
        id: 1,
        study_plan_id: 1,
        phase_number: 1,
        name: 'Phase 1 — DSA Foundations & Patterns',
        duration_days: 7,
        status: 'in_progress',
        description: 'Master high-yield algorithmic patterns (Binary Search, Two Pointers, Sliding Window, Trees) frequently tested by Accenture.',
        topics: [
          { name: 'Arrays & Two Pointers', status: 'completed' },
          { name: 'String Manipulation & Hashing', status: 'completed' },
          { name: 'Binary Search on Sorted Arrays & Answers', status: 'in_progress' },
          { name: 'Sliding Window & Subarray Sum', status: 'in_progress' },
          { name: 'Linked Lists & Fast-Slow Pointers', status: 'upcoming' },
          { name: 'Binary Trees & Level Order Traversal', status: 'upcoming' }
        ]
      },
      {
        id: 2,
        study_plan_id: 1,
        phase_number: 2,
        name: 'Phase 2 — Core CS & Operating Systems',
        duration_days: 7,
        status: 'upcoming',
        description: 'Deep dive into Process Management, Threads, Deadlocks, Memory Management, and OOP Design Principles.',
        topics: [
          { name: 'Process Synchronization & Semaphores', status: 'upcoming' },
          { name: 'Deadlock Handling & Prevention', status: 'upcoming' },
          { name: 'Virtual Memory, Paging & TLB', status: 'upcoming' },
          { name: 'OOP Principles & Design Patterns in Java/C++', status: 'upcoming' },
          { name: 'Computer Networks (OSI, TCP/IP, DNS, HTTP)', status: 'upcoming' }
        ]
      },
      {
        id: 3,
        study_plan_id: 1,
        phase_number: 3,
        name: 'Phase 3 — DBMS, SQL Joins & Schema Design',
        duration_days: 5,
        status: 'upcoming',
        description: 'Sharpen SQL query writing, complex joins, indexing strategies, and relational schema normalization.',
        topics: [
          { name: 'Complex SQL Joins (INNER, LEFT, SELF)', status: 'upcoming' },
          { name: 'Window Functions & Aggregations (RANK, DENSE_RANK)', status: 'upcoming' },
          { name: 'Database Normalization (1NF through BCNF)', status: 'upcoming' },
          { name: 'ACID Properties & Transaction Isolation Levels', status: 'upcoming' },
          { name: 'B-Tree & Hash Indexing Optimizations', status: 'upcoming' }
        ]
      },
      {
        id: 4,
        study_plan_id: 1,
        phase_number: 4,
        name: 'Phase 4 — Mock Technical & Aptitude Tests',
        duration_days: 4,
        status: 'upcoming',
        description: 'Timed practice tests simulating Accenture cognitive, technical, and behavioral interview stages.',
        topics: [
          { name: 'Accenture Coding Assessment Simulation', status: 'upcoming' },
          { name: 'Quantitative Aptitude & Logical Reasoning', status: 'upcoming' },
          { name: 'System Design: Scalable URL Shortener Architecture', status: 'upcoming' },
          { name: 'Technical & Behavioral STAR Round Interview Prep', status: 'upcoming' }
        ]
      },
      {
        id: 5,
        study_plan_id: 1,
        phase_number: 5,
        name: 'Phase 5 — Final Revision & Speed Drills',
        duration_days: 3,
        status: 'upcoming',
        description: 'Consolidate key formulas, high-frequency interview questions, and resume project defense.',
        topics: [
          { name: 'Top 50 Speed Recall DSA Problems', status: 'upcoming' },
          { name: 'Core CS Quick Reference & Cheat Sheet Review', status: 'upcoming' },
          { name: 'Project Deep-Dive: Scalable Full-Stack Architecture', status: 'upcoming' }
        ]
      }
    ];
    memoryStore.roadmapPhases.push(...phases);
    memoryStore.nextRoadmapPhaseId = 6;

    const initialTasks = [
      {
        id: 1,
        study_plan_id: 1,
        user_id: 1,
        phase_id: 1,
        title: 'Solve 3 Array Problems',
        description: 'Two Sum, Subarray Sum Equals K, Maximum Subarray',
        category: 'DSA',
        type: 'DSA Problem',
        priority: 'High',
        duration: '45 min',
        estimated_minutes: 45,
        action_route: '/dsa',
        scheduled_date: '2026-09-30',
        completed: true,
        source: 'ai_generated'
      },
      {
        id: 2,
        study_plan_id: 1,
        user_id: 1,
        phase_id: 1,
        title: 'Revise SQL Joins',
        description: 'Review INNER, LEFT, RIGHT, and FULL OUTER joins with examples',
        category: 'SQL',
        type: 'SQL Practice',
        priority: 'High',
        duration: '30 min',
        estimated_minutes: 30,
        action_route: '/sql',
        scheduled_date: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        id: 3,
        study_plan_id: 1,
        user_id: 1,
        phase_id: 1,
        title: 'Complete OS Quiz',
        description: 'Test process scheduling algorithms, race conditions & semaphores',
        category: 'Core CS',
        type: 'Quiz',
        priority: 'Medium',
        duration: '20 min',
        estimated_minutes: 20,
        action_route: '/study-plan',
        scheduled_date: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        id: 4,
        study_plan_id: 1,
        user_id: 1,
        phase_id: 1,
        title: 'Binary Search Revision',
        description: 'Practice Search in Rotated Sorted Array and First & Last Position',
        category: 'DSA',
        type: 'Revision',
        priority: 'High',
        duration: '25 min',
        estimated_minutes: 25,
        action_route: '/dsa',
        scheduled_date: '2026-09-30',
        completed: true,
        source: 'ai_generated'
      }
    ];
    memoryStore.tasks.push(...initialTasks);
    memoryStore.nextTaskId = 5;

    const initialActivities = [
      { id: 1, user_id: 1, title: 'Completed "Binary Search Revision"', description: 'Solved Question 3 of 5 on Rotated Arrays', tag: 'DSA Practice', time_ago: '1 hour ago' },
      { id: 2, user_id: 1, title: 'Solved 3 Array Problems', description: 'Two Sum, Subarray Sum Equals K, Maximum Subarray', tag: 'DSA Practice', time_ago: '3 hours ago' },
      { id: 3, user_id: 1, title: 'Updated Target Preferences', description: 'Set Primary Target to Accenture (SDE)', tag: 'Target', time_ago: 'Yesterday' },
      { id: 4, user_id: 1, title: 'Completed SQL Aggregations Practice', description: 'Practiced GROUP BY, HAVING, and Subqueries', tag: 'SQL', time_ago: '2 days ago' }
    ];
    memoryStore.activities.push(...initialActivities);
    memoryStore.nextActivityId = 5;

    // Seed 18 active days across September 2026
    const septDailyData = [
      { date: '2026-09-01', studyMinutes: 45, dsaProblems: 2, sqlQuestions: 1, quizCount: 0, sessionsCompleted: 1, completedItems: ['2 Array problems', 'Basic SQL queries'] },
      { date: '2026-09-02', studyMinutes: 65, dsaProblems: 3, sqlQuestions: 2, quizCount: 1, sessionsCompleted: 2, completedItems: ['3 String problems', 'SQL Subqueries', 'OS Quiz'] },
      { date: '2026-09-04', studyMinutes: 40, dsaProblems: 1, sqlQuestions: 3, quizCount: 0, sessionsCompleted: 1, completedItems: ['SQL Joins practice', 'Recursion basics'] },
      { date: '2026-09-05', studyMinutes: 70, dsaProblems: 3, sqlQuestions: 2, quizCount: 1, sessionsCompleted: 2, completedItems: ['3 LinkedList problems', 'DBMS Normalization'] },
      { date: '2026-09-06', studyMinutes: 90, dsaProblems: 4, sqlQuestions: 4, quizCount: 1, sessionsCompleted: 2, completedItems: ['4 Stack/Queue questions', 'SQL Window Functions', 'Aptitude Test'] },
      { date: '2026-09-08', studyMinutes: 35, dsaProblems: 1, sqlQuestions: 2, quizCount: 0, sessionsCompleted: 1, completedItems: ['SQL Aggregation revision', 'Two Pointers review'] },
      { date: '2026-09-09', studyMinutes: 60, dsaProblems: 3, sqlQuestions: 0, quizCount: 1, sessionsCompleted: 1, completedItems: ['3 Binary Tree problems', 'Computer Networks Quiz'] },
      { date: '2026-09-10', studyMinutes: 105, dsaProblems: 4, sqlQuestions: 5, quizCount: 2, sessionsCompleted: 3, completedItems: ['Tree Traversals', 'Complex SQL Joins', 'OOPs Concepts Quiz'] },
      { date: '2026-09-11', studyMinutes: 60, dsaProblems: 2, sqlQuestions: 3, quizCount: 0, sessionsCompleted: 1, completedItems: ['2 Hashmap problems', 'SQL Indexes'] },
      { date: '2026-09-13', studyMinutes: 45, dsaProblems: 2, sqlQuestions: 1, quizCount: 0, sessionsCompleted: 1, completedItems: ['Binary Search on Answer', 'ACID Properties'] },
      { date: '2026-09-14', studyMinutes: 70, dsaProblems: 3, sqlQuestions: 2, quizCount: 1, sessionsCompleted: 2, completedItems: ['3 Heap problems', 'SQL CTEs', 'DBMS Quiz'] },
      // 7-day streak leading up to Sep 30:
      { date: '2026-09-24', studyMinutes: 45, dsaProblems: 2, sqlQuestions: 2, quizCount: 0, sessionsCompleted: 1, completedItems: ['2 Matrix problems', 'SQL Group By'] },
      { date: '2026-09-25', studyMinutes: 60, dsaProblems: 3, sqlQuestions: 1, quizCount: 1, sessionsCompleted: 1, completedItems: ['Graph BFS/DFS', 'OS Deadlocks Quiz'] },
      { date: '2026-09-26', studyMinutes: 75, dsaProblems: 3, sqlQuestions: 3, quizCount: 1, sessionsCompleted: 2, completedItems: ['3 DP Problems', 'SQL Having clause', 'Accenture Mock'] },
      { date: '2026-09-27', studyMinutes: 90, dsaProblems: 4, sqlQuestions: 3, quizCount: 1, sessionsCompleted: 2, completedItems: ['Greedy algorithms', 'SQL Window Functions', 'CN Quiz'] },
      { date: '2026-09-28', studyMinutes: 60, dsaProblems: 2, sqlQuestions: 4, quizCount: 0, sessionsCompleted: 1, completedItems: ['2 Sliding Window problems', 'SQL Practice Set'] },
      { date: '2026-09-29', studyMinutes: 110, dsaProblems: 4, sqlQuestions: 4, quizCount: 2, sessionsCompleted: 2, completedItems: ['4 Binary Tree problems', 'Advanced SQL', 'System Design Intro'] },
      { date: '2026-09-30', studyMinutes: 80, dsaProblems: 3, sqlQuestions: 2, quizCount: 1, sessionsCompleted: 2, completedItems: ['3 DSA problems', 'SQL quiz', 'Binary Search revision'] }
    ];

    septDailyData.forEach((d) => {
      memoryStore.dailyActivities.push({
        id: memoryStore.nextDailyActivityId++,
        user_id: 1,
        activity_date: d.date,
        study_minutes: d.studyMinutes,
        dsa_problems: d.dsaProblems,
        sql_questions: d.sqlQuestions,
        quiz_count: d.quizCount,
        sessions_completed: d.sessionsCompleted,
        completed_items: d.completedItems
      });
    });
  }
};

seedMemoryData();

async function initDb() {
  const pgUser = process.env.PGUSER || 'postgres';
  const pgHost = process.env.PGHOST || 'localhost';
  const pgDatabase = process.env.PGDATABASE || 'placementpilot';
  const pgPassword = process.env.PGPASSWORD || 'postgres';
  const pgPort = parseInt(process.env.PGPORT || '5432', 10);

  // 1. First attempt: Check if database exists, create if missing
  try {
    const adminClient = new Client({
      user: pgUser,
      host: pgHost,
      database: 'postgres', // default root maintenance DB
      password: pgPassword,
      port: pgPort,
      connectionTimeoutMillis: 3000
    });

    await adminClient.connect();
    const checkDb = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [pgDatabase]
    );

    if (checkDb.rowCount === 0) {
      console.log(`[Database] Database "${pgDatabase}" not found. Creating it now...`);
      await adminClient.query(`CREATE DATABASE "${pgDatabase}"`);
      console.log(`[Database] Database "${pgDatabase}" created successfully!`);
    }
    await adminClient.end();
  } catch (err) {
    // If adminClient can't connect, postgres might have a different password or not running
    console.warn(`[Database] Note on auto-creating DB: ${err.message}`);
  }

  // 2. Connect to the application database
  try {
    const poolConfig = process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 4000 }
      : {
          user: pgUser,
          host: pgHost,
          database: pgDatabase,
          password: pgPassword,
          port: pgPort,
          connectionTimeoutMillis: 4000
        };

    pool = new Pool(poolConfig);

    // Test connection
    const client = await pool.connect();
    console.log(`[Database] Connected to PostgreSQL database "${pgDatabase}" successfully!`);
    isPgConnected = true;

    // Apply schema
    const schemaPath = path.join(__dirname, '../models/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log(`[Database] Schema tables initialized / verified successfully.`);
    }

    client.release();
  } catch (err) {
    console.warn(`\n=============================================================`);
    console.warn(`[Database WARNING] Could not connect to PostgreSQL: ${err.message}`);
    console.warn(`PlacementPilot is running in RESILIENT MEMORY-STORE MODE.`);
    console.warn(`All features (Auth, Profile, Dashboard, Tasks) will work flawlessly.`);
    console.warn(`To persist to PostgreSQL, ensure PostgreSQL is running and update`);
    console.warn(`your credentials in "server/.env" (PGUSER, PGPASSWORD, PGDATABASE).`);
    console.warn(`=============================================================\n`);
    isPgConnected = false;
  }
}

// Unified query wrapper
async function query(text, params) {
  if (isPgConnected && pool) {
    return pool.query(text, params);
  }
  throw new Error('PostgreSQL is not connected, use memoryStore fallback');
}

module.exports = {
  initDb,
  query,
  getPool: () => pool,
  isPgConnected: () => isPgConnected,
  memoryStore
};
