import { User, Task, Submission, Application, Message, UserRole } from '../types';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

let token: string | null = localStorage.getItem('velox_token');

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem('velox_token', newToken);
};

export const clearToken = () => {
  token = null;
  localStorage.removeItem('velox_token');
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
});

// ===== AUTH ENDPOINTS =====
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) setToken(data.token);
    return data;
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  updateProfile: async (updates: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  }
};

// ===== TASK ENDPOINTS =====
export const taskAPI = {
  getTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  getTaskById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(task)
    });
    return response.json();
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deleteTask: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return response.json();
  }
};

// ===== SUBMISSION ENDPOINTS =====
export const submissionAPI = {
  getSubmissions: async (filters?: { userId?: string; taskId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.taskId) params.append('taskId', filters.taskId);
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${API_BASE_URL}/submissions?${params.toString()}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  getSubmissionById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  createSubmission: async (submission: Omit<Submission, 'id' | 'createdAt' | 'reviewedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(submission)
    });
    return response.json();
  },

  updateSubmission: async (id: string, updates: Partial<Submission>) => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  reviewSubmission: async (id: string, review: { status: string; score?: number; remarks?: string }) => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}/review`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(review)
    });
    return response.json();
  },

  deleteSubmission: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return response.json();
  }
};

// ===== APPLICATION ENDPOINTS =====
export const applicationAPI = {
  getApplications: async (filters?: { status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${API_BASE_URL}/applications?${params.toString()}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  getApplicationById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  createApplication: async (app: Omit<Application, 'id' | 'createdAt' | 'reviewedAt' | 'status'>) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(app)
    });
    return response.json();
  },

  updateApplication: async (id: string, updates: { status: string; rejectionReason?: string }) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deleteApplication: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return response.json();
  }
};

// ===== MESSAGE ENDPOINTS =====
export const messageAPI = {
  getMessages: async (filters?: { userId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${API_BASE_URL}/messages?${params.toString()}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  getMessageById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'GET',
      headers: headers()
    });
    return response.json();
  },

  sendMessage: async (msg: Omit<Message, 'id' | 'createdAt' | 'answeredAt' | 'userId' | 'userName' | 'userEmail'> & { message: string }) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(msg)
    });
    return response.json();
  },

  replyMessage: async (id: string, answer: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}/reply`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ answer })
    });
    return response.json();
  },

  deleteMessage: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return response.json();
  }
};

// Fallback to localStorage if API fails (for offline support)
export const db = {
  users: {
    get: () => {
      const data = localStorage.getItem('velox_users');
      return data ? JSON.parse(data) : [];
    },
    save: (users: User[]) => localStorage.setItem('velox_users', JSON.stringify(users))
  },
  tasks: {
    get: () => {
      const data = localStorage.getItem('velox_tasks');
      return data ? JSON.parse(data) : [];
    },
    save: (tasks: Task[]) => localStorage.setItem('velox_tasks', JSON.stringify(tasks))
  },
  submissions: {
    get: () => {
      const data = localStorage.getItem('velox_submissions');
      return data ? JSON.parse(data) : [];
    },
    save: (submissions: Submission[]) => localStorage.setItem('velox_submissions', JSON.stringify(submissions))
  },
  applications: {
    get: () => {
      const data = localStorage.getItem('velox_applications');
      return data ? JSON.parse(data) : [];
    },
    save: (apps: Application[]) => localStorage.setItem('velox_applications', JSON.stringify(apps))
  },
  messages: {
    get: () => {
      const data = localStorage.getItem('velox_messages');
      return data ? JSON.parse(data) : [];
    },
    save: (messages: Message[]) => localStorage.setItem('velox_messages', JSON.stringify(messages))
  }
};
