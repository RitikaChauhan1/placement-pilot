/**
 * Mock data for the "Today's Focus" recommendation feature.
 * Structured so it can seamlessly be swapped with or overridden by a backend/AI endpoint.
 */
export const DEFAULT_TODAYS_FOCUS = {
  id: 'focus-bs-01',
  title: 'Binary Search',
  category: 'DSA',
  difficulty: 'Medium',
  taskCount: 3,
  estimatedMinutes: 45,
  description: 'Complete 3 problems to strengthen your binary-search problem-solving skills.',
  targetRoute: '/dsa',
  badge: 'AI RECOMMENDED',
  recommendedReason: 'Frequently asked in upcoming Accenture and Google technical rounds',
  topics: ['Array Search', 'Boundary Conditions', 'Rotated Arrays'],
};
