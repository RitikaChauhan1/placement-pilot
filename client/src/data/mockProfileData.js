/**
 * Standard developer profile dataset for PlacementPilot
 * Structured to integrate with PostgreSQL profile records & Codolio-style developer profile layout
 */

export const DEFAULT_DEVELOPER_PROFILE = {
  name: 'Ritika Chauhan',
  title: 'Software Developer / Computer Science Student',
  headline: 'Aspiring SDE | Full-Stack & Algorithm Enthusiast | Pre-Final Year CSE',
  location: 'India',
  college: 'National Institute of Technology',
  degree: 'B.Tech Computer Science',
  graduation_year: '2026',
  job_status: 'Open to Software Development Roles',
  target_role: 'Software Development Engineer',
  target_company: 'Accenture',
  readiness_percentage: 65,
  bio: 'Computer Science undergraduate passionate about building scalable web applications and algorithmic problem solving. Actively practicing Data Structures & Algorithms, System Design fundamentals, and modern web architectures. Seeking software engineering internships and full-time SDE roles.',

  stats: {
    dsa_problems: 124,
    projects: 5,
    certifications: 4,
    achievements: 8,
  },

  socials: {
    github: 'https://github.com/ritikachauhan',
    linkedin: 'https://linkedin.com/in/ritikachauhan',
    leetcode: 'https://leetcode.com/ritikachauhan',
    gfg: 'https://geeksforgeeks.org/user/ritika_c',
    codechef: 'https://codechef.com/users/ritikac',
    portfolio: 'https://ritikachauhan.dev',
  },

  resume: {
    url: '#',
    fileName: 'Ritika_Chauhan_Resume.pdf',
    lastUpdated: 'Sep 2026',
  },

  skills: [
    'Data Structures & Algorithms',
    'React.js',
    'Node.js',
    'PostgreSQL',
    'System Design Basics',
    'RESTful APIs',
    'Git & GitHub',
    'Tailwind CSS',
  ],

  programming_languages: ['C++', 'Java', 'Python', 'JavaScript', 'SQL'],

  categorized_skills: {
    languages: ['C++', 'Java', 'Python', 'JavaScript (ES6+)', 'SQL', 'HTML5/CSS3'],
    frameworks: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Redux Toolkit'],
    database_tools: ['PostgreSQL', 'MongoDB', 'Redis (Basics)', 'Git', 'Docker', 'Postman'],
    fundamentals: ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'Database Management Systems (DBMS)', 'Operating Systems', 'Computer Networks'],
  },

  education: [
    {
      id: 1,
      institution: 'National Institute of Technology',
      degree: 'Bachelor of Technology - Computer Science & Engineering',
      period: '2022 - 2026',
      grade: '8.85 CGPA',
      location: 'India',
      coursework: ['Data Structures & Algorithms', 'Design & Analysis of Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering'],
    },
    {
      id: 2,
      institution: 'Delhi Public School',
      degree: 'Senior Secondary Education (Class XII - CBSE, PCM + CS)',
      period: '2020 - 2022',
      grade: '95.4%',
      location: 'India',
      coursework: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science (Python)'],
    },
  ],

  experience: [
    {
      id: 1,
      role: 'Software Engineering Intern',
      company: 'TechNovation Labs',
      type: 'Internship',
      period: 'May 2025 - July 2025',
      location: 'Remote',
      description: 'Engineered responsive frontend modules using React and integrated REST APIs with PostgreSQL backend. Optimized client-side bundle size by 24% and authored unit tests with Vitest.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
    },
    {
      id: 2,
      role: 'Open Source Contributor',
      company: 'GirlScript Summer of Code / Hacktoberfest',
      type: 'Open Source',
      period: 'Oct 2024 - Dec 2024',
      location: 'Remote',
      description: 'Contributed 12+ pull requests to developer productivity tools, fixing accessibility issues and refactoring state handling in React repositories.',
      skills: ['React', 'JavaScript', 'Git', 'Documentation'],
    },
  ],

  projects: [
    {
      id: 1,
      title: 'PlacementPilot - AI Placement Preparation System',
      description: 'Full-stack platform tracking student readiness, personalized study plans, DSA focus topics, and company mock tests.',
      tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
      github: 'https://github.com/ritikachauhan/placement-pilot',
      live: 'https://placementpilot.dev',
      featured: true,
    },
    {
      id: 2,
      title: 'DevCollab - Realtime Collaborative Code Canvas',
      description: 'Web-based interactive code editor supporting multi-user synchronization with WebSockets, syntax highlighting, and live compilation.',
      tags: ['React', 'Socket.io', 'Monaco Editor', 'Node.js'],
      github: 'https://github.com/ritikachauhan/devcollab',
      live: '#',
      featured: true,
    },
    {
      id: 3,
      title: 'Algorithm Visualizer Suite',
      description: 'Interactive graphical visualization of graph algorithms (Dijkstra, BFS, DFS) and sorting algorithms with step-by-step playback.',
      tags: ['JavaScript', 'Canvas API', 'Algorithms', 'CSS3'],
      github: 'https://github.com/ritikachauhan/algo-visualizer',
      live: '#',
      featured: false,
    },
  ],

  achievements: [
    {
      id: 1,
      title: 'Global Rank 420 in LeetCode Biweekly Contest',
      issuer: 'LeetCode',
      date: 'Aug 2025',
      description: 'Ranked in the top 2% of over 25,000 international participants by solving 4 out of 4 algorithmic problems under contest time constraints.',
    },
    {
      id: 2,
      title: 'Finalist - Smart India Hackathon (SIH)',
      issuer: 'Ministry of Education, Govt. of India',
      date: 'Nov 2024',
      description: 'Developed an automated curriculum gap identification platform with an agile team of 6 engineers.',
    },
    {
      id: 3,
      title: '5-Star Coder in Problem Solving',
      issuer: 'HackerRank',
      date: 'Jan 2025',
      description: 'Attained Gold Badge across Data Structures and Algorithms domain tests.',
    },
    {
      id: 4,
      title: 'Academic Excellence Merit Scholarship',
      issuer: 'Institute Academic Council',
      date: '2023 - 2024',
      description: 'Awarded for maintaining top 5 percentile departmental CGPA in Computer Science Engineering.',
    },
  ],

  coding_profiles: {
    leetcode: {
      username: 'ritikachauhan',
      rating: 1782,
      badge: 'Knight',
      solved: 124,
      easy: 52,
      medium: 58,
      hard: 14,
      url: 'https://leetcode.com/ritikachauhan',
    },
    codechef: {
      username: 'ritikac',
      rating: 1640,
      stars: '3★',
      solved: 85,
      url: 'https://codechef.com/users/ritikac',
    },
    gfg: {
      username: 'ritika_c',
      score: 412,
      problemsSolved: 96,
      instituteRank: 12,
      url: 'https://geeksforgeeks.org/user/ritika_c',
    },
  },
};
