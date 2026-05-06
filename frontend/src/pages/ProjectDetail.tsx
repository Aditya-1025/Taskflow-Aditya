import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Settings, 
  Plus, 
  Search,
  Filter,
  History,
  Users,
  MessageCircle,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import { projectService, taskService, activityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { canDeleteTask, canEditTask, canUpdateTaskStatus, isProjectAdmin } from '../utils/rbac';
import KanbanBoard from '../components/KanbanBoard';
import { Task, Status, Priority } from '../types';
import TaskModal from '../components/TaskModal';
import { RoleBadge } from '../components/Badge';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id!);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<'board' | 'members' | 'activity'>('board');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | 'ALL'>('ALL');
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  // Fetch Project Details
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getById(projectId).then(res => res.data),
  });

  // Fetch Tasks
  const { data: taskPage, isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks', projectId, statusFilter, priorityFilter, searchTerm],
    queryFn: () => taskService.getTasks({
      projectId,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
      size: 100 // Load all for Kanban
    }).then(res => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number, status: Status }) => 
      taskService.updateStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => taskService.delete(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });

  if (isProjectLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!project) return <div>Project not found</div>;

  const projectAdmin = isProjectAdmin(project);

  const tasks = taskPage?.content || [];
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedTaskCanEdit = selectedTask ? canEditTask(selectedTask, project, user) : true;

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <RoleBadge role={project.currentUserRole} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
            <Users size={20} />
          </button>
          <button 
            onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
            className="btn btn-primary bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
          {[
            { id: 'board', label: 'Board', icon: LayoutGrid },
            { id: 'activity', label: 'Activity', icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-white dark:bg-slate-900 shadow-sm text-primary" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'board' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search board..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm outline-none"
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === 'board' ? (
          isTasksLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-primary/30" size={32} />
            </div>
          ) : (
            <KanbanBoard 
              tasks={filteredTasks}
              onStatusChange={(taskId, status) => {
                const task = tasks.find(t => t.id === taskId);
                if (task && canUpdateTaskStatus(task, project, user)) {
                  updateStatusMutation.mutate({ taskId, status });
                }
              }}
              onEditTask={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }}
              onDeleteTask={(taskId) => { 
                const task = tasks.find(t => t.id === taskId);
                if (task && canDeleteTask(project) && confirm('Delete task?')) {
                  deleteTaskMutation.mutate(taskId);
                }
              }}
              canUpdateStatus={(task) => canUpdateTaskStatus(task, project, user)}
              canDeleteTask={() => projectAdmin}
            />
          )
        ) : (
          <ActivityFeed projectId={projectId} />
        )}
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        projectId={projectId} 
        task={selectedTask} 
        canEdit={selectedTaskCanEdit}
      />
    </div>
  );
}

function ActivityFeed({ projectId }: { projectId: number }) {
  const { data: logPage, isLoading } = useQuery({
    queryKey: ['activity', projectId],
    queryFn: () => activityService.getLogs({ projectId }).then(res => res.data),
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading activity...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {logPage?.content.map((log) => (
        <div key={log.id} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <History size={14} />
            </div>
            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 group-last:bg-transparent mt-2" />
          </div>
          <div className="pb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{log.user?.name || 'System'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                {log.action.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-400">
                {format(new Date(log.createdAt), 'MMM d, h:mm a')}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{log.description}</p>
          </div>
        </div>
      ))}
      {logPage?.content.length === 0 && (
        <div className="text-center py-20 text-slate-500">No activity logged yet.</div>
      )}
    </div>
  );
}
