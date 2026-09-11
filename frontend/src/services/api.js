// EduNova Centralized API Service

const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('edunova_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Authentication
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Classes
  createClass: async (classData) => {
    const res = await fetch(`${BASE_URL}/classes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(classData),
    });
    return res.json();
  },

  joinClass: async (classCode) => {
    const res = await fetch(`${BASE_URL}/classes/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ classCode }),
    });
    const data = await res.json();
    return data;
  },

  getClasses: async () => {
    const res = await fetch(`${BASE_URL}/classes`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getActiveClasses: async () => {
    const res = await fetch(`${BASE_URL}/classes/active`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getClassById: async (classId) => {
    const res = await fetch(`${BASE_URL}/classes/${classId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  leaveClass: async (classId) => {
    const res = await fetch(`${BASE_URL}/classes/${classId}/leave`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  endClass: async (classId) => {
    const res = await fetch(`${BASE_URL}/classes/${classId}/end`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Questions & Doubts
  submitQuestion: async (questionData) => {
    const res = await fetch(`${BASE_URL}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    return res.json();
  },

  getClassQuestions: async (classId) => {
    const res = await fetch(`${BASE_URL}/questions/class/${classId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  upvoteQuestion: async (questionId) => {
    const res = await fetch(`${BASE_URL}/questions/${questionId}/vote`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Answers
  answerQuestionGroup: async (groupId, answerText) => {
    const res = await fetch(`${BASE_URL}/questions/${groupId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answer: answerText }),
    });
    return res.json();
  },

  // Class Summary
  getClassSummary: async (classId) => {
    const res = await fetch(`${BASE_URL}/summary/class/${classId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
