const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with token injection and error formatting
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('placementpilot_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // If 401 Unauthorized, token might be expired
      if (response.status === 401) {
        // Optionally clear token if invalid
        // localStorage.removeItem('placementpilot_token');
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error: ${endpoint}]`, error.message);
    throw error;
  }
}

export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request('/auth/me', {
      method: 'GET',
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const profileApi = {
  getProfile: () =>
    request('/profile', {
      method: 'GET',
    }),

  updateProfile: (profileData) =>
    request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Education
  addEducation: (data) =>
    request('/profile/education', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEducation: (id, data) =>
    request(`/profile/education/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteEducation: (id) =>
    request(`/profile/education/${id}`, {
      method: 'DELETE',
    }),

  // Skills
  addSkill: (data) =>
    request('/profile/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSkill: (id, data) =>
    request(`/profile/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteSkill: (id) =>
    request(`/profile/skills/${id}`, {
      method: 'DELETE',
    }),

  // Experience
  addExperience: (data) =>
    request('/profile/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateExperience: (id, data) =>
    request(`/profile/experience/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteExperience: (id) =>
    request(`/profile/experience/${id}`, {
      method: 'DELETE',
    }),

  // Projects
  addProject: (data) =>
    request('/profile/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id, data) =>
    request(`/profile/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteProject: (id) =>
    request(`/profile/projects/${id}`, {
      method: 'DELETE',
    }),

  // Achievements
  addAchievement: (data) =>
    request('/profile/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAchievement: (id, data) =>
    request(`/profile/achievements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteAchievement: (id) =>
    request(`/profile/achievements/${id}`, {
      method: 'DELETE',
    }),

  // Certifications
  addCertification: (data) =>
    request('/profile/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCertification: (id, data) =>
    request(`/profile/certifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCertification: (id) =>
    request(`/profile/certifications/${id}`, {
      method: 'DELETE',
    }),

  // Coding Profiles
  addCodingProfile: (data) =>
    request('/profile/coding-profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCodingProfile: (id, data) =>
    request(`/profile/coding-profiles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCodingProfile: (id) =>
    request(`/profile/coding-profiles/${id}`, {
      method: 'DELETE',
    }),

  // Socials
  addSocial: (data) =>
    request('/profile/socials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSocial: (id, data) =>
    request(`/profile/socials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteSocial: (id) =>
    request(`/profile/socials/${id}`, {
      method: 'DELETE',
    }),

  // Resume
  updateResume: (data) =>
    request('/profile/resume', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteResume: () =>
    request('/profile/resume', {
      method: 'DELETE',
    }),

  // Placement Target
  getPlacementTarget: () =>
    request('/profile/placement-target', {
      method: 'GET',
    }),
  updatePlacementTarget: (data) =>
    request('/profile/placement-target', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const dashboardApi = {
  getSummary: () =>
    request('/dashboard/summary', {
      method: 'GET',
    }),

  toggleTask: (taskId) =>
    request(`/dashboard/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    }),

  addTask: (taskData) =>
    request('/dashboard/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),
};

export const studyPlanApi = {
  getStudyPlan: () =>
    request('/study-plan', {
      method: 'GET',
    }),

  generatePlan: (params = {}) =>
    request('/study-plan/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  adjustHours: (dailyStudyHours) =>
    request('/study-plan/adjust-hours', {
      method: 'PUT',
      body: JSON.stringify({ dailyStudyHours }),
    }),

  aiChat: (message) =>
    request('/study-plan/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  applyAiChanges: (proposal) =>
    request('/study-plan/ai/apply-changes', {
      method: 'POST',
      body: JSON.stringify({ proposal }),
    }),

  createTask: (taskData) =>
    request('/study-plan/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  updateTask: (id, updates) =>
    request(`/study-plan/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteTask: (id) =>
    request(`/study-plan/tasks/${id}`, {
      method: 'DELETE',
    }),

  searchTopics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/study-plan/topics/search${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  addTopicToPlan: (topicData) =>
    request('/study-plan/topics/add-to-plan', {
      method: 'POST',
      body: JSON.stringify(topicData),
    }),

  getResources: (category = 'All') =>
    request(`/study-plan/resources?category=${encodeURIComponent(category)}`, {
      method: 'GET',
    }),
};

export default {
  auth: authApi,
  profile: profileApi,
  dashboard: dashboardApi,
  studyPlan: studyPlanApi,
};
