import axios from 'axios';
import { 
  User, 
  Workflow, 
  Task, 
  Issue, 
  Approval, 
  TaskActivityLog, 
  UserRole, 
  TaskStatus, 
  TaskPriority, 
  IssuePriority 
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wf_token');
    if (token && token !== 'demo-jwt-token-2026') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API Services
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<{ message: string; token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    departmentId?: string;
  }) => {
    const response = await apiClient.post<{ message: string; token: string; user: User }>('/auth/register', payload);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },
};

// Users API Services
export const userApi = {
  getUsers: async (params?: { departmentId?: string; role?: UserRole }) => {
    const response = await apiClient.get<{ users: User[] }>('/users', { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<{ user: User }>('/users/' + id);
    return response.data;
  },

  updateUser: async (id: string, data: { roleEnum?: UserRole; departmentId?: string; isActive?: boolean }) => {
    const response = await apiClient.put<{ message: string; user: User }>('/users/' + id, data);
    return response.data;
  },
};

// Workflows API Services
export const workflowApi = {
  getWorkflows: async () => {
    const response = await apiClient.get<{ workflows: Workflow[] }>('/workflows');
    return response.data;
  },

  getWorkflowById: async (id: string) => {
    const response = await apiClient.get<{ workflow: Workflow }>('/workflows/' + id);
    return response.data;
  },

  createWorkflow: async (payload: {
    name: string;
    description?: string;
    departmentId?: string;
    isTemplate?: boolean;
    stages: Array<{
      name: string;
      description?: string;
      orderIndex: number;
      color?: string;
      requiresApproval?: boolean;
    }>;
  }) => {
    const response = await apiClient.post<{ message: string; workflow: Workflow }>('/workflows', payload);
    return response.data;
  },

  updateWorkflow: async (id: string, payload: Partial<Workflow>) => {
    const response = await apiClient.put<{ message: string; workflow: Workflow }>('/workflows/' + id, payload);
    return response.data;
  },
};

// Tasks API Services
export const taskApi = {
  getTasks: async (params?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    workflowId?: string;
    stageId?: string;
    assigneeId?: string;
    myTasks?: boolean;
    search?: string;
  }) => {
    const response = await apiClient.get<{ tasks: Task[] }>('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await apiClient.get<{ task: Task }>('/tasks/' + id);
    return response.data;
  },

  createTask: async (payload: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    workflowId: string;
    currentStageId?: string;
    assigneeId?: string;
    dueDate?: string;
    estimatedHours?: number;
    tags?: string;
  }) => {
    const response = await apiClient.post<{ message: string; task: Task }>('/tasks', payload);
    return response.data;
  },

  updateTask: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      status?: TaskStatus;
      currentStageId?: string;
      assigneeId?: string;
      dueDate?: string;
      estimatedHours?: number;
      actualHours?: number;
      tags?: string;
      remarks?: string;
    }
  ) => {
    const response = await apiClient.put<{ message: string; task?: Task; requiresApproval?: boolean }>('/tasks/' + id, payload);
    return response.data;
  },

  // Issue Management
  reportIssue: async (
    taskId: string,
    payload: {
      title: string;
      description: string;
      priority?: IssuePriority;
    }
  ) => {
    const response = await apiClient.post<{ message: string; issue: Issue }>('/tasks/' + taskId + '/issues', payload);
    return response.data;
  },

  resolveIssue: async (taskId: string, issueId: string, payload: { resolutionDetails: string }) => {
    const response = await apiClient.put<{ message: string; issue: Issue; taskStatus: TaskStatus }>(
      '/tasks/' + taskId + '/issues/' + issueId + '/resolve',
      payload
    );
    return response.data;
  },

  // Approvals Gatekeeping
  processApproval: async (approvalId: string, payload: { status: 'APPROVED' | 'REJECTED'; comments?: string }) => {
    const response = await apiClient.put<{ message: string; approval: Approval }>(
      '/tasks/approvals/' + approvalId,
      payload
    );
    return response.data;
  },
};
