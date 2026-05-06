import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Status } from '../types';
import TaskCard from './TaskCard';
import { cn } from '../utils/cn';

interface KanbanColumnProps {
  id: string;
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  canUpdateStatus: (task: Task) => boolean;
  canDeleteTask: (task: Task) => boolean;
}

const STATUS_LABELS: Record<Status, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Completed'
};

const STATUS_COLORS: Record<Status, string> = {
  TODO: 'bg-slate-500',
  IN_PROGRESS: 'bg-amber-500',
  DONE: 'bg-emerald-500'
};

export default function KanbanColumn({ 
  id, 
  status, 
  tasks, 
  onEditTask, 
  onDeleteTask,
  canUpdateStatus,
  canDeleteTask
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-80 lg:w-96 rounded-2xl p-4 transition-colors duration-200",
        "bg-slate-100/50 dark:bg-slate-900/50",
        isOver && "bg-primary/5 ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", STATUS_COLORS[status])} />
          <h3 className="font-bold tracking-tight text-slate-700 dark:text-slate-200">
            {STATUS_LABELS[status]}
          </h3>
        </div>
        <span className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4 min-h-[500px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              canMoveTask={canUpdateStatus(task)}
              canDelete={canDeleteTask(task)}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center">
            <span className="text-sm text-slate-400 font-medium">Drop tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
}
