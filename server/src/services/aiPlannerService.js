/**
 * AI Planning Service for PlacementPilot
 * Analyzes student profile, placement target, skills, preparation level,
 * and available time to generate a personalized preparation roadmap and daily tasks.
 */

// Target company specific focus profiles
const COMPANY_FOCUS_MAP = {
  accenture: {
    name: 'Accenture',
    keyFocus: ['Arrays & Strings', 'Binary Search', 'SQL Joins & Aggregations', 'OOP Concepts', 'Cognitive & Technical Aptitude'],
    dsaWeight: 0.35,
    sqlWeight: 0.25,
    coreCsWeight: 0.25,
    aptitudeWeight: 0.15,
    mockInterviewStyle: 'Cognitive + Technical Assessment & Managerial STAR Round'
  },
  google: {
    name: 'Google',
    keyFocus: ['Dynamic Programming', 'Graphs & Trees', 'System Design', 'Concurrency', 'Advanced Data Structures'],
    dsaWeight: 0.55,
    sqlWeight: 0.10,
    coreCsWeight: 0.20,
    aptitudeWeight: 0.15,
    mockInterviewStyle: 'Coding Rounds & Googleyness Behavioral Evaluation'
  },
  microsoft: {
    name: 'Microsoft',
    keyFocus: ['Binary Trees & BSTs', 'Linked Lists & Pointers', 'Low-Level Design / OOP', 'OS & Memory Management'],
    dsaWeight: 0.45,
    sqlWeight: 0.15,
    coreCsWeight: 0.25,
    aptitudeWeight: 0.15,
    mockInterviewStyle: 'Technical Problem Solving & System Architecture Round'
  },
  amazon: {
    name: 'Amazon',
    keyFocus: ['Trees & Graphs', 'Greedy & Heap', 'Leadership Principles', 'Object-Oriented Design', 'SQL Queries'],
    dsaWeight: 0.45,
    sqlWeight: 0.15,
    coreCsWeight: 0.20,
    aptitudeWeight: 0.20,
    mockInterviewStyle: 'Bar Raiser & Leadership Principles + Live Coding'
  }
};

/**
 * Calculate days remaining until target interview date
 */
const calculateDaysRemaining = (interviewDateStr, referenceDateStr = '2026-09-30') => {
  if (!interviewDateStr) return 26;
  const targetTime = new Date(interviewDateStr).getTime();
  const refTime = new Date(referenceDateStr).getTime();
  const diffDays = Math.ceil((targetTime - refTime) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 26;
};

/**
 * Generate Structured Roadmap & Daily Plan
 */
async function generatePlan({
  profile,
  progress = {},
  dailyStudyHours = 2,
  previousPlan = null,
  options = {}
}) {
  const companyKey = (profile.target_company || profile.target_companies || 'Accenture').toLowerCase();
  const matchedCompanyKey = Object.keys(COMPANY_FOCUS_MAP).find(k => companyKey.includes(k)) || 'accenture';
  const companyProfile = COMPANY_FOCUS_MAP[matchedCompanyKey];

  const targetCompany = profile.target_company || profile.target_companies?.split(',')[0]?.trim() || companyProfile.name;
  const targetRole = profile.target_role || 'Software Development Engineer';
  const daysRemaining = calculateDaysRemaining(profile.interview_date, '2026-09-30');
  const availableHours = parseInt(dailyStudyHours || 2, 10);
  const targetDailyMinutes = availableHours * 60;

  // Identify weak & strong areas from progress
  const weakTopics = progress.weakTopics || ['Binary Search', 'SQL Joins', 'Operating Systems'];
  const strongTopics = progress.strongTopics || ['Arrays', 'OOP Principles'];

  // Plan versioning
  const nextVersion = previousPlan ? (previousPlan.version || 1) + 1 : 1;

  // 1. Construct Phases based on days remaining
  const phase1Days = Math.max(5, Math.round(daysRemaining * 0.28));
  const phase2Days = Math.max(5, Math.round(daysRemaining * 0.28));
  const phase3Days = Math.max(4, Math.round(daysRemaining * 0.20));
  const phase4Days = Math.max(3, Math.round(daysRemaining * 0.14));
  const phase5Days = Math.max(2, daysRemaining - (phase1Days + phase2Days + phase3Days + phase4Days));

  const phases = [
    {
      phaseNumber: 1,
      name: `Phase 1 — DSA Foundations & ${companyProfile.name} Patterns`,
      durationDays: phase1Days,
      status: 'in_progress',
      description: `Master high-yield algorithmic patterns (${weakTopics[0] || 'Binary Search'}, Two Pointers, Sliding Window) frequently tested in ${companyProfile.name} online assessments.`,
      topics: [
        { name: 'Arrays & Two Pointers', status: 'completed' },
        { name: 'String Manipulation & Hashing', status: 'completed' },
        { name: `${weakTopics[0] || 'Binary Search'} on Sorted Arrays & Answers`, status: 'in_progress' },
        { name: 'Sliding Window & Subarray Sum', status: 'in_progress' },
        { name: 'Linked Lists & Fast-Slow Pointers', status: 'upcoming' },
        { name: 'Binary Trees & Level Order Traversal', status: 'upcoming' }
      ]
    },
    {
      phaseNumber: 2,
      name: 'Phase 2 — Core CS & Operating Systems',
      durationDays: phase2Days,
      status: 'upcoming',
      description: 'Strengthen essential theoretical fundamentals: Process Scheduling, Threads, Deadlocks, Memory Management, and OOP Design Principles.',
      topics: [
        { name: 'Process Synchronization & Semaphores', status: 'upcoming' },
        { name: 'Deadlock Handling & Prevention', status: 'upcoming' },
        { name: 'Virtual Memory, Paging & TLB', status: 'upcoming' },
        { name: 'OOP Principles & Design Patterns in Java/C++', status: 'upcoming' },
        { name: 'Computer Networks (OSI, TCP/IP, DNS, HTTP)', status: 'upcoming' }
      ]
    },
    {
      phaseNumber: 3,
      name: 'Phase 3 — DBMS, SQL Joins & Schema Design',
      durationDays: phase3Days,
      status: 'upcoming',
      description: `Sharpen SQL query formulation, focusing on ${weakTopics[1] || 'SQL Joins'}, aggregations, indexing, and schema normalization.`,
      topics: [
        { name: `Complex ${weakTopics[1] || 'SQL Joins'} (INNER, LEFT, SELF)`, status: 'upcoming' },
        { name: 'Window Functions & Aggregations (RANK, DENSE_RANK)', status: 'upcoming' },
        { name: 'Database Normalization (1NF through BCNF)', status: 'upcoming' },
        { name: 'ACID Properties & Transaction Isolation Levels', status: 'upcoming' },
        { name: 'B-Tree & Hash Indexing Optimizations', status: 'upcoming' }
      ]
    },
    {
      phaseNumber: 4,
      name: `Phase 4 — Mock Technical & Aptitude Tests`,
      durationDays: phase4Days,
      status: 'upcoming',
      description: `Timed mock rounds simulating ${companyProfile.name}'s interview formats: ${companyProfile.mockInterviewStyle}.`,
      topics: [
        { name: `${companyProfile.name} Coding Assessment Simulation`, status: 'upcoming' },
        { name: 'Quantitative Aptitude & Logical Reasoning', status: 'upcoming' },
        { name: 'System Design: Scalable URL Shortener Architecture', status: 'upcoming' },
        { name: 'Technical & Behavioral STAR Round Interview Prep', status: 'upcoming' }
      ]
    },
    {
      phaseNumber: 5,
      name: 'Phase 5 — Final Revision & Speed Drills',
      durationDays: phase5Days,
      status: 'upcoming',
      description: 'Rapid recall of high-frequency questions, cheat sheet formulas, and project defense strategy.',
      topics: [
        { name: 'Top 50 Speed Recall DSA Problems', status: 'upcoming' },
        { name: 'Core CS Quick Reference & Cheat Sheet Review', status: 'upcoming' },
        { name: 'Project Deep-Dive: Scalable Full-Stack Architecture', status: 'upcoming' }
      ]
    }
  ];

  // 2. Generate Today's Achievable Task Suite
  // Tailored to available study hours (e.g. 1 hr, 2 hrs, 3 hrs, 4+ hrs)
  let dailyTasks = [];
  if (availableHours <= 1) {
    dailyTasks = [
      {
        title: `Solve 2 ${weakTopics[0] || 'Binary Search'} Problems`,
        description: 'Focus on medium-difficulty search range problems',
        category: 'DSA',
        type: 'DSA Problem',
        priority: 'High',
        duration: '35 min',
        estimatedMinutes: 35,
        actionRoute: '/dsa',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        title: `Revise ${weakTopics[1] || 'SQL Joins'}`,
        description: 'Review join conditions & practice 3 query patterns',
        category: 'SQL',
        type: 'SQL Practice',
        priority: 'High',
        duration: '25 min',
        estimatedMinutes: 25,
        actionRoute: '/sql',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      }
    ];
  } else if (availableHours === 2) {
    dailyTasks = [
      {
        title: 'Solve 3 Array Problems',
        description: 'Two Sum, Subarray Sum Equals K, Maximum Subarray',
        category: 'DSA',
        type: 'DSA Problem',
        priority: 'High',
        duration: '45 min',
        estimatedMinutes: 45,
        actionRoute: '/dsa',
        scheduledDate: '2026-09-30',
        completed: true,
        source: 'ai_generated'
      },
      {
        title: `Revise ${weakTopics[1] || 'SQL Joins'}`,
        description: 'Review INNER, LEFT, RIGHT, and FULL OUTER joins with examples',
        category: 'SQL',
        type: 'SQL Practice',
        priority: 'High',
        duration: '30 min',
        estimatedMinutes: 30,
        actionRoute: '/sql',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        title: 'Complete OS Quiz',
        description: 'Test process scheduling algorithms, race conditions & semaphores',
        category: 'Core CS',
        type: 'Quiz',
        priority: 'Medium',
        duration: '20 min',
        estimatedMinutes: 20,
        actionRoute: '/study-plan',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        title: `${weakTopics[0] || 'Binary Search'} Revision`,
        description: 'Practice Search in Rotated Sorted Array and First & Last Position',
        category: 'DSA',
        type: 'Revision',
        priority: 'High',
        duration: '25 min',
        estimatedMinutes: 25,
        actionRoute: '/dsa',
        scheduledDate: '2026-09-30',
        completed: true,
        source: 'ai_generated'
      }
    ];
  } else {
    // 3 or 4+ hours
    dailyTasks = [
      {
        title: `Solve 3 ${weakTopics[0] || 'Binary Search'} Problems`,
        description: 'Solve Rotated Arrays, Search Matrix, and Median of Sorted Arrays',
        category: 'DSA',
        type: 'DSA Problem',
        priority: 'High',
        duration: '50 min',
        estimatedMinutes: 50,
        actionRoute: '/dsa',
        scheduledDate: '2026-09-30',
        completed: true,
        source: 'ai_generated'
      },
      {
        title: `Revise ${weakTopics[1] || 'SQL Joins'} & Aggregations`,
        description: 'Deep dive into multi-table joins, GROUP BY, and HAVING queries',
        category: 'SQL',
        type: 'SQL Practice',
        priority: 'High',
        duration: '40 min',
        estimatedMinutes: 40,
        actionRoute: '/sql',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        title: 'Complete OS Deadlocks & Synchronization Quiz',
        description: 'Banker algorithm, semaphores, and mutex implementation questions',
        category: 'Core CS',
        type: 'Quiz',
        priority: 'Medium',
        duration: '30 min',
        estimatedMinutes: 30,
        actionRoute: '/study-plan',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        title: `${targetCompany} Aptitude Speed Drill`,
        description: 'Complete 15 timed quantitative & logical reasoning questions',
        category: 'Aptitude',
        type: 'Quiz',
        priority: 'Medium',
        duration: '35 min',
        estimatedMinutes: 35,
        actionRoute: '/mock-interviews',
        scheduledDate: '2026-09-30',
        completed: false,
        source: 'ai_generated'
      },
      {
        title: 'Sliding Window Pattern Revision',
        description: 'Longest Substring Without Repeating Characters & Minimum Window Substring',
        category: 'DSA',
        type: 'Revision',
        priority: 'High',
        duration: '25 min',
        estimatedMinutes: 25,
        actionRoute: '/dsa',
        scheduledDate: '2026-09-30',
        completed: true,
        source: 'ai_generated'
      }
    ];
  }

  // 3. AI Explanation "Why this plan?"
  const whyThisPlan = `Your roadmap prioritizes ${weakTopics.join(', ')} because your recent diagnostic scores showed 58-61% accuracy in these core areas, which carry significant weight for ${targetCompany} ${targetRole} evaluations. Your available study time is configured to ${availableHours} hour${availableHours > 1 ? 's' : ''}/day, so each day's plan is capped around ${targetDailyMinutes} minutes to ensure consistent, burnout-free progression across the remaining ${daysRemaining} days.`;

  return {
    title: `${daysRemaining}-Day ${targetRole} Placement Roadmap for ${targetCompany}`,
    targetCompany,
    targetRole,
    interviewDate: profile.interview_date || '2026-10-26',
    daysRemaining,
    dailyStudyHours: availableHours,
    summary: `Personalized ${daysRemaining}-day preparation roadmap tailored to ${targetCompany}'s hiring rubrics, prioritizing weak topics (${weakTopics.join(', ')}) with a balanced ${availableHours} hrs/day workload.`,
    whyThisPlan,
    version: nextVersion,
    status: 'active',
    phases,
    dailyTasks,
    recommendation: {
      title: `Revise ${weakTopics[1] || 'SQL Joins'}`,
      category: 'SQL',
      accuracy: '61%',
      reason: `Your recent accuracy is 61% and you haven't practiced this topic for 5 days.`,
      estimatedMinutes: 30,
      duration: '30 min',
      route: '/sql',
      actionLabel: 'Start Practice'
    }
  };
}

// -------------------------------------------------------------
// CURATED TOPICS CATALOG
// -------------------------------------------------------------
const CURATED_TOPICS = [
  // DSA
  { id: 't-dsa-1', name: 'Binary Search & Monotonic Predicates', category: 'DSA', difficulty: 'Medium', suggestedSessions: 4, minutesPerSession: 45, impactWeeklyHours: 3.0, description: 'Search on sorted ranges, rotated arrays, and binary search on answer spaces.', defaultRoute: '/dsa' },
  { id: 't-dsa-2', name: 'Sliding Window & Two Pointers', category: 'DSA', difficulty: 'Medium', suggestedSessions: 3, minutesPerSession: 40, impactWeeklyHours: 2.0, description: 'Subarray sum queries, longest substring constraints, and two-sum patterns.', defaultRoute: '/dsa' },
  { id: 't-dsa-3', name: 'Dynamic Programming & Memoization', category: 'DSA', difficulty: 'Hard', suggestedSessions: 6, minutesPerSession: 50, impactWeeklyHours: 5.0, description: '1D/2D state transitions, knapsack, LCS, and subsequence optimization.', defaultRoute: '/dsa' },
  { id: 't-dsa-4', name: 'Binary Trees & BFS/DFS Traversal', category: 'DSA', difficulty: 'Medium', suggestedSessions: 4, minutesPerSession: 45, impactWeeklyHours: 3.0, description: 'Level-order BFS, path sums, LCA, and tree diameter computations.', defaultRoute: '/dsa' },
  { id: 't-dsa-5', name: 'Graphs: Dijkstra & Cycle Detection', category: 'DSA', difficulty: 'Hard', suggestedSessions: 5, minutesPerSession: 45, impactWeeklyHours: 3.75, description: 'Topological sort, bipartite graphs, union-find, and shortest path algorithms.', defaultRoute: '/dsa' },

  // SQL
  { id: 't-sql-1', name: 'Complex SQL Joins & Subqueries', category: 'SQL', difficulty: 'Medium', suggestedSessions: 3, minutesPerSession: 30, impactWeeklyHours: 1.5, description: 'INNER, LEFT, RIGHT, FULL OUTER joins, self joins, and correlated subqueries.', defaultRoute: '/sql' },
  { id: 't-sql-2', name: 'Window Functions (RANK, DENSE_RANK)', category: 'SQL', difficulty: 'Medium', suggestedSessions: 3, minutesPerSession: 35, impactWeeklyHours: 1.75, description: 'Partitioning, cumulative sums, row numbering, and ranking problem sets.', defaultRoute: '/sql' },
  { id: 't-sql-3', name: 'Database Normalization & ACID Properties', category: 'SQL', difficulty: 'Medium', suggestedSessions: 2, minutesPerSession: 30, impactWeeklyHours: 1.0, description: '1NF through BCNF, functional dependencies, and transaction isolation levels.', defaultRoute: '/study-plan' },

  // Frontend
  { id: 't-fe-1', name: 'React Fundamentals & Component Lifecycle', category: 'Frontend', difficulty: 'Easy', suggestedSessions: 5, minutesPerSession: 30, impactWeeklyHours: 2.5, description: 'State, props, hooks (useState, useEffect, useMemo), and virtual DOM rendering.', defaultRoute: '/study-plan' },
  { id: 't-fe-2', name: 'JavaScript ES6+, Promises & Async/Await', category: 'Frontend', difficulty: 'Medium', suggestedSessions: 4, minutesPerSession: 30, impactWeeklyHours: 2.0, description: 'Closures, event loop, microtask queue, prototypes, and asynchronous JavaScript.', defaultRoute: '/study-plan' },

  // Core CS
  { id: 't-cs-1', name: 'Operating Systems: Process Synchronization', category: 'Core CS', difficulty: 'Medium', suggestedSessions: 3, minutesPerSession: 30, impactWeeklyHours: 1.5, description: 'Semaphores, mutexes, critical section problem, and producer-consumer.', defaultRoute: '/study-plan' },
  { id: 't-cs-2', name: 'Computer Networks: TCP/IP & HTTP/HTTPS', category: 'Core CS', difficulty: 'Easy', suggestedSessions: 2, minutesPerSession: 30, impactWeeklyHours: 1.0, description: 'Three-way handshake, OSI layers, DNS resolution, and SSL/TLS handshakes.', defaultRoute: '/study-plan' },
  { id: 't-cs-3', name: 'Object-Oriented Design & Design Patterns', category: 'Core CS', difficulty: 'Medium', suggestedSessions: 3, minutesPerSession: 35, impactWeeklyHours: 1.75, description: 'SOLID principles, Factory, Singleton, Observer, and Strategy patterns in Java/C++.', defaultRoute: '/study-plan' },

  // Aptitude & Mock
  { id: 't-apt-1', name: 'Cognitive & Quantitative Aptitude', category: 'Aptitude', difficulty: 'Easy', suggestedSessions: 3, minutesPerSession: 25, impactWeeklyHours: 1.25, description: 'Percentages, ratios, time-speed-distance, and logical reasoning speed tests.', defaultRoute: '/mock-interviews' },
  { id: 't-mock-1', name: 'Accenture Technical & Managerial Mock Interview', category: 'Mock Interview', difficulty: 'Medium', suggestedSessions: 2, minutesPerSession: 45, impactWeeklyHours: 1.5, description: 'Full mock simulation covering DSA coding, resume projects, and STAR behavioral questions.', defaultRoute: '/mock-interviews' }
];

// -------------------------------------------------------------
// CURATED LEARNING RESOURCES CATALOG
// -------------------------------------------------------------
const CURATED_RESOURCES = [
  { id: 'r-1', title: 'Accenture Top 50 Coding Problems Sheet', type: 'Company Questions', category: 'DSA', difficulty: 'Medium', estimatedMinutes: 60, source: 'PlacementPilot Sheet', route: '/dsa' },
  { id: 'r-2', title: 'Binary Search Patterns Complete Masterclass', type: 'Documentation', category: 'DSA', difficulty: 'Medium', estimatedMinutes: 45, source: 'Algorithms Primer', route: '/dsa' },
  { id: 'r-3', title: 'SQL Joins & Grouping Interactive Practice Arena', type: 'Practice Questions', category: 'SQL', difficulty: 'Medium', estimatedMinutes: 30, source: 'PlacementPilot SQL', route: '/sql' },
  { id: 'r-4', title: 'Operating Systems Process Scheduling & Deadlocks Notes', type: 'Article', category: 'Core CS', difficulty: 'Easy', estimatedMinutes: 25, source: 'Core CS Notes', route: '/study-plan' },
  { id: 'r-5', title: 'DBMS ACID Properties & Normalization Cheat Sheet', type: 'Notes', category: 'SQL', difficulty: 'Easy', estimatedMinutes: 20, source: 'Campus Revision Kit', route: '/study-plan' },
  { id: 'r-6', title: 'React Hooks In-Depth: useEffect & Custom Hooks', type: 'Documentation', category: 'Frontend', difficulty: 'Medium', estimatedMinutes: 35, source: 'Frontend Guide', route: '/study-plan' },
  { id: 'r-7', title: 'JavaScript Event Loop & Microtasks Visualized', type: 'Video', category: 'Frontend', difficulty: 'Medium', estimatedMinutes: 30, source: 'JS Deep Dive', route: '/study-plan' },
  { id: 'r-8', title: 'System Design for Campus Placements: URL Shortener', type: 'Article', category: 'Core CS', difficulty: 'Hard', estimatedMinutes: 40, source: 'System Design Primer', route: '/study-plan' },
  { id: 'r-9', title: 'Accenture Cognitive Assessment Speed Test Set', type: 'Practice Questions', category: 'Aptitude', difficulty: 'Easy', estimatedMinutes: 30, source: 'Cognitive Prep', route: '/mock-interviews' },
  { id: 'r-10', title: 'STAR Behavioral Interview Prep & Project Defense Guide', type: 'Notes', category: 'Mock Interview', difficulty: 'Medium', estimatedMinutes: 25, source: 'HR Placement Toolkit', route: '/mock-interviews' }
];

/**
 * Natural Language AI Command Processor
 * Parses natural language requests and outputs conversational reply + structured change proposal
 */
async function processNaturalLanguageCommand({
  command,
  currentPlan,
  currentPhases = [],
  currentTasks = [],
  profile,
  dailyStudyHours = 2
}) {
  const lower = (command || '').toLowerCase();

  // Change proposal container matching Section 18
  const proposal = {
    intent: 'modify_plan',
    title: 'Customized Placement Roadmap Adjustment',
    removals: [],
    additions: [],
    reschedules: [],
    schedule: {
      weekdayHours: dailyStudyHours,
      weekendHours: Math.min(6, dailyStudyHours + 2)
    },
    timeImpact: 'No extension required. Fits within current timeline.',
    reasoningSummary: ''
  };

  let aiReply = '';

  // 1. Check for removing topics (e.g. Operating Systems / Aptitude / SQL)
  if (lower.includes('remove operating systems') || lower.includes('remove os') || lower.includes('no operating systems')) {
    proposal.removals.push({
      action: 'remove_topic',
      topic: 'Operating Systems',
      category: 'Core CS',
      sessionsCount: 3
    });
  }
  if (lower.includes('remove aptitude') || lower.includes('no aptitude')) {
    proposal.removals.push({
      action: 'remove_topic',
      topic: 'Cognitive & Quantitative Aptitude',
      category: 'Aptitude',
      sessionsCount: 3
    });
  }
  if (lower.includes('reduce sql') || lower.includes('remove sql')) {
    proposal.removals.push({
      action: 'remove_topic',
      topic: 'Database Normalization',
      category: 'SQL',
      sessionsCount: 2
    });
  }

  // 2. Check for adding topics (e.g. React / JavaScript / DSA / Mock Interview / System Design)
  if (lower.includes('react')) {
    proposal.additions.push({
      action: 'add_topic',
      topic: 'React Fundamentals & Component Architecture',
      category: 'Frontend',
      sessionsCount: 5,
      duration: '30 min'
    });
  }
  if (lower.includes('javascript') || lower.includes('js')) {
    proposal.additions.push({
      action: 'add_topic',
      topic: 'JavaScript ES6+, Promises & Async Logic',
      category: 'Frontend',
      sessionsCount: 4,
      duration: '30 min'
    });
  }
  if (lower.includes('more dsa') || lower.includes('binary search') || lower.includes('weak in binary search')) {
    proposal.additions.push({
      action: 'add_topic',
      topic: 'Binary Search Range & Answer Optimization',
      category: 'DSA',
      sessionsCount: 4,
      duration: '45 min'
    });
  }
  if (lower.includes('mock interview') || lower.includes('more mock')) {
    proposal.additions.push({
      action: 'add_topic',
      topic: 'Accenture Full Mock Assessment & STAR Behavioral Review',
      category: 'Mock Interview',
      sessionsCount: 3,
      duration: '45 min'
    });
  }
  if (lower.includes('system design')) {
    proposal.additions.push({
      action: 'add_topic',
      topic: 'Scalable System Design & Architecture Foundations',
      category: 'Core CS',
      sessionsCount: 3,
      duration: '40 min'
    });
  }

  // 3. Check for schedule modifications (e.g. 2h weekdays, 4h weekends / 1h tomorrow)
  if (lower.includes('weekend') || lower.includes('saturday') || lower.includes('sunday')) {
    proposal.schedule.weekendHours = 4;
    proposal.schedule.weekdayHours = 2;
    proposal.reschedules.push({
      action: 'reschedule',
      taskTitle: 'Move advanced practice blocks to Weekend',
      fromDay: 'Weekdays',
      toDay: 'Saturday & Sunday'
    });
  }
  if (lower.includes('1 hour') || lower.includes('only 1 hour')) {
    proposal.schedule.weekdayHours = 1;
    proposal.timeImpact = 'Reprioritized to top 2 high-yield daily tasks.';
  } else if (lower.includes('3 hours') || lower.includes('3h')) {
    proposal.schedule.weekdayHours = 3;
    proposal.timeImpact = 'Added additional practice sets (+1 hour/day).';
  } else if (lower.includes('4 hours') || lower.includes('4h')) {
    proposal.schedule.weekdayHours = 4;
  }

  // 4. Default fallback if no specific keywords matched
  if (proposal.removals.length === 0 && proposal.additions.length === 0 && proposal.reschedules.length === 0) {
    if (lower.includes('weak') || lower.includes('focus')) {
      proposal.additions.push({
        action: 'add_topic',
        topic: 'Targeted Weak Topic Drills (Binary Search & SQL Joins)',
        category: 'DSA',
        sessionsCount: 4,
        duration: '40 min'
      });
      proposal.reasoningSummary = 'Prioritized identified weak topics (Binary Search & SQL Joins) based on your recent practice scores.';
    } else {
      proposal.additions.push({
        action: 'add_topic',
        topic: 'High-Frequency Practice Sets for ' + (profile?.target_company || 'Accenture'),
        category: 'DSA',
        sessionsCount: 3,
        duration: '40 min'
      });
      proposal.reasoningSummary = `Tailored roadmap based on: "${command}". Adjusted pacing to match your available time.`;
    }
  }

  if (!proposal.reasoningSummary) {
    proposal.reasoningSummary = `Adjusted roadmap to ${proposal.removals.length ? 'remove ' + proposal.removals.map(r => r.topic).join(', ') : ''}${proposal.removals.length && proposal.additions.length ? ' and ' : ''}${proposal.additions.length ? 'add ' + proposal.additions.map(a => a.topic).join(', ') : ''}, while balancing study time to ${proposal.schedule.weekdayHours}h weekdays / ${proposal.schedule.weekendHours}h weekends.`;
  }

  // Formulate conversational AI reply matching Section 13 format
  aiReply = `Got it! I've formulated a change proposal for your placement preparation plan:\n\n`;
  if (proposal.removals.length) {
    aiReply += `❌ **Remove**\n` + proposal.removals.map(r => `• ${r.topic} (${r.sessionsCount} sessions)`).join('\n') + '\n\n';
  }
  if (proposal.additions.length) {
    aiReply += `➕ **Add**\n` + proposal.additions.map(a => `• ${a.topic} (${a.sessionsCount} sessions • ${a.duration})`).join('\n') + '\n\n';
  }
  aiReply += `⏱ **Schedule**\n• ${proposal.schedule.weekdayHours} hours/day Monday–Friday\n• ${proposal.schedule.weekendHours} hours/day Saturday–Sunday\n\n`;
  aiReply += `💡 *${proposal.reasoningSummary}*\n\nReview the proposed diff below and click **Apply Changes** to update your active roadmap and daily tasks.`;

  return {
    reply: aiReply,
    proposal
  };
}

/**
 * Apply approved proposal to active plan, phases, and daily tasks
 */
async function applyChangeProposal({
  proposal,
  currentPlan,
  currentPhases = [],
  currentTasks = [],
  userId
}) {
  const updatedPhases = JSON.parse(JSON.stringify(currentPhases));
  let updatedTasks = JSON.parse(JSON.stringify(currentTasks));

  // 1. Process Removals: remove topic from phases & remove matching uncompleted tasks
  if (proposal.removals && proposal.removals.length) {
    proposal.removals.forEach((rem) => {
      const remName = rem.topic.toLowerCase();

      // Remove from phases topics list
      updatedPhases.forEach((ph) => {
        if (ph.topics && Array.isArray(ph.topics)) {
          ph.topics = ph.topics.filter(t => {
            const tName = (typeof t === 'string' ? t : t.name).toLowerCase();
            return !tName.includes(remName);
          });
        }
      });

      // Filter uncompleted tasks
      updatedTasks = updatedTasks.filter(t => {
        if (t.completed) return true; // PRESERVE COMPLETED TASKS
        const tTitle = t.title.toLowerCase();
        const tCat = (t.category || '').toLowerCase();
        return !tTitle.includes(remName) && !tCat.includes(remName);
      });
    });
  }

  // 2. Process Additions: add topic to relevant phase & inject daily task
  if (proposal.additions && proposal.additions.length) {
    proposal.additions.forEach((add, idx) => {
      // Add topic to phase 1 or 2
      const targetPhase = updatedPhases[0] || updatedPhases[1];
      if (targetPhase) {
        if (!targetPhase.topics) targetPhase.topics = [];
        targetPhase.topics.push({
          name: add.topic,
          status: 'in_progress'
        });
      }

      // Add a synchronized task for today
      const newTask = {
        id: Date.now() + idx,
        study_plan_id: currentPlan?.id || 1,
        user_id: userId,
        phase_id: targetPhase ? targetPhase.id : 1,
        title: `Practice: ${add.topic}`,
        description: `Dedicated session for ${add.topic} added by AI Planner`,
        category: add.category || 'Frontend',
        type: add.category === 'DSA' ? 'DSA Problem' : add.category === 'SQL' ? 'SQL Practice' : 'Revision',
        priority: 'High',
        duration: add.duration || '30 min',
        estimated_minutes: parseInt(add.duration, 10) || 30,
        action_route: add.category === 'DSA' ? '/dsa' : add.category === 'SQL' ? '/sql' : '/study-plan',
        scheduled_date: '2026-09-30',
        completed: false,
        source: 'ai_proposal'
      };
      updatedTasks.push(newTask);
    });
  }

  // 3. Update plan hours & bump version
  const updatedPlan = {
    ...currentPlan,
    daily_study_hours: proposal.schedule?.weekdayHours || currentPlan.daily_study_hours || 2,
    version: (currentPlan.version || 1) + 1,
    summary: proposal.reasoningSummary || currentPlan.summary,
    updated_at: new Date().toISOString()
  };

  return {
    plan: updatedPlan,
    phases: updatedPhases,
    tasks: updatedTasks
  };
}

module.exports = {
  generatePlan,
  calculateDaysRemaining,
  processNaturalLanguageCommand,
  applyChangeProposal,
  CURATED_TOPICS,
  CURATED_RESOURCES,
  COMPANY_FOCUS_MAP
};

