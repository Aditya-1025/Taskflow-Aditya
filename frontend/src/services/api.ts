import axios from 'axios';
import { 
  Project, Task, User, DashboardStats, 
  PageResponse, ActivityLog, Status, Priority 
} from '../types';

declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_URL?: string;
    };
  }
}

const normalizeApiUrl = (url: string) => {
  const trimmedUrl = url.replace(/\/+$/, '');
  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const API_URL = normalizeApiUrl(
  window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080'
);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskmanager_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  signup: (userData: any) => api.post('/auth/signup', userData),
};

export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (data: any) => api.post<Project>('/projects', data),
  update: (id: number, data: any) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  addMember: (projectId: number, data: any) => api.post(`/projects/${projectId}/members`, data),
  removeMember: (projectId: number, userId: number) => api.delete(`/projects/${projectId}/members/${userId}`),
  getMembers: (projectId: number) => api.get(`/projects/${projectId}/members`),
};

export interface TaskFilters {
  projectId?: number;
  assigneeId?: number;
  status?: Status;
  priority?: Priority;
  page?: number;
  size?: number;
}

export const taskService = {
  getTasks: (filters: TaskFilters) => api.get<PageResponse<Task>>('/tasks', { params: filters }),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (projectId: number, data: any) => api.post<Task>(`/projects/${projectId}/tasks`, data),
  update: (id: number, data: any) => api.put<Task>(`/tasks/${id}`, data),
  updateStatus: (id: number, status: Status) => api.patch<Task>(`/tasks/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  addComment: (id: number, content: string) => api.post(`/tasks/${id}/comments`, { content }),
};

export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export const activityService = {
  getLogs: (params: { projectId?: number; taskId?: number; page?: number }) => 
    api.get<PageResponse<ActivityLog>>('/activity', { params }),
};

export default api;
