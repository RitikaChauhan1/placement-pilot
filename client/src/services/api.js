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
};

export default {
  auth: authApi,
  profile: profileApi,
  dashboard: dashboardApi,
  studyPlan: studyPlanApi,
};
