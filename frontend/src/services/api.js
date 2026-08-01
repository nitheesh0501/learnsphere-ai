import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('learnsphere_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const studentAPI = {
  getDashboard: async () => {
    try {
      const response = await api.get('/student/dashboard');
      return response.data;
    } catch (err) {
      console.warn('Backend offline, returning fallback student data');
      return {
        student_name: 'Rohan Mehta',
        details: 'Sem 4 • CSE • GPA 3.82',
        readiness_score: 78.0,
        readiness_status: 'On Track',
        target_score: 85.0,
        subjects: [
          { name: 'Mathematics III', internal_marks: 44, percentage: 88.0, status: 'Strong', badge_color: 'emerald' },
          { name: 'Physics II', internal_marks: 31, percentage: 62.0, status: 'Average', badge_color: 'amber' },
          { name: 'Programming in C++', internal_marks: 22.5, percentage: 45.0, status: 'Weak', badge_color: 'rose' }
        ]
      };
    }
  },
  analyzeMarks: async (subjects) => {
    try {
      const response = await api.post('/student/analyze', { subjects });
      return response.data;
    } catch (err) {
      return null;
    }
  },
  uploadMarksheet: async (formData) => {
    try {
      const response = await api.post('/student/upload-marksheet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      return { readiness_score: 78.0, status: 'On Track' };
    }
  },
  startQuiz: async (week) => {
    try {
      const response = await api.post('/student/quiz/start', { week });
      return response.data;
    } catch (err) {
      return null;
    }
  },
  submitQuiz: async (score, total) => {
    try {
      const response = await api.post('/student/quiz/submit', { score, total });
      return response.data;
    } catch (err) {
      return null;
    }
  }
};

export const teacherAPI = {
  getDashboard: async () => {
    try {
      const response = await api.get('/teacher/dashboard');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  interveneStudent: async (studentId, action) => {
    try {
      const response = await api.post('/teacher/intervene', { student_id: studentId, action });
      return response.data;
    } catch (err) {
      return null;
    }
  }
};

export default api;
