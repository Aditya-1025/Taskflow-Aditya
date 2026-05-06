export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Comment {
  id: number;
  content: string;
  userId: number;
  userName: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  overdue: boolean;
  projectId: number;
  projectName: string;
  assigneeId?: number;
  assigneeName?: string;
  assigneeEmail?: string;
  creatorId: number;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  currentUserRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  memberCount: number;
  taskCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  overdueCount: number;
  lowPriorityCount: number;
  mediumPriorityCount: number;
  highPriorityCount: number;
  criticalPriorityCount: number;
  recentTasks: Task[];
  myTasks: Task[];
}

export interface ActivityLog {
  id: number;
  action: string;
  description: string;
  user: User;
  projectId?: number;
  taskId?: number;
  createdAt: string;
}
