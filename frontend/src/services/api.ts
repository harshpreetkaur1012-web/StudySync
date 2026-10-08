import {
  User,
  Assignment,
  Subject,
  Note,
  AnalyticsData,
  AuthResponse,
} from '../types/index.js';

const BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('studysync_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status);
  }

  return data as T;
}

export const api = {
  // Auth API
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: {
      name: string;
      email: string;
      password: string;
      confirmPassword?: string;
      college?: string;
      course?: string;
      academicYear?: string;
    }) =>
      request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    getMe: () =>
      request<{ user: User }>('/api/auth/me'),

    updateProfile: (profile: Partial<User>) =>
      request<{ message: string; user: User }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      }),
  },

  // Assignments API
  assignments: {
    getAll: (params?: {
      subject?: string;
      priority?: string;
      status?: string;
      search?: string;
      sortBy?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.subject) searchParams.append('subject', params.subject);
      if (params?.priority) searchParams.append('priority', params.priority);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ assignments: Assignment[] }>(`/api/assignments${query}`);
    },

    getById: (id: string) =>
      request<{ assignment: Assignment }>(`/api/assignments/${id}`),

    create: (data: Partial<Assignment>) =>
      request<{ message: string; assignment: Assignment }>('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Assignment>) =>
      request<{ message: string; assignment: Assignment }>(`/api/assignments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    updateStatus: (id: string, status: string) =>
      request<{ message: string; assignment: Assignment }>(`/api/assignments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),

    delete: (id: string) =>
      request<{ message: string; id: string }>(`/api/assignments/${id}`, {
        method: 'DELETE',
      }),
  },

  // Subjects API
  subjects: {
    getAll: () =>
      request<{ subjects: Subject[] }>('/api/subjects'),

    getById: (id: string) =>
      request<{ subject: Subject }>(`/api/subjects/${id}`),

    create: (data: Partial<Subject>) =>
      request<{ message: string; subject: Subject }>('/api/subjects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Subject>) =>
      request<{ message: string; subject: Subject }>(`/api/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ message: string; id: string }>(`/api/subjects/${id}`, {
        method: 'DELETE',
      }),
  },

  // Notes API
  notes: {
    getAll: (params?: { search?: string; subject?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.subject) searchParams.append('subject', params.subject);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ notes: Note[] }>(`/api/notes${query}`);
    },

    getById: (id: string) =>
      request<{ note: Note }>(`/api/notes/${id}`),

    create: (data: Partial<Note>) =>
      request<{ message: string; note: Note }>('/api/notes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Note>) =>
      request<{ message: string; note: Note }>(`/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ message: string; id: string }>(`/api/notes/${id}`, {
        method: 'DELETE',
      }),
  },

  // Analytics API
  analytics: {
    get: () =>
      request<{ analytics: AnalyticsData }>('/api/analytics'),
  },
};
