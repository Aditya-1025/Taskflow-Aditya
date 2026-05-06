import { Project, Task, User } from '../types';

export function isProjectAdmin(project: Project): boolean {
  return project.currentUserRole === 'OWNER' || project.currentUserRole === 'ADMIN';
}

export function canEditTask(task: Task, project: Project, user: User | null): boolean {
  return isProjectAdmin(project) || task.creatorId === user?.id;
}

export function canUpdateTaskStatus(task: Task, project: Project, user: User | null): boolean {
  return canEditTask(task, project, user) || task.assigneeId === user?.id;
}

export function canDeleteTask(project: Project): boolean {
  return isProjectAdmin(project);
}
