import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MessageSquare, 
  Clock, 
  Trash2
} from 'lucide-react';
import { Task } from '../types';
import { cn } from '../utils/cn';
import { format } from 'date-fns';
import { PriorityBadge } from './Badge';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  canMoveTask: boolean;
  canDelete: boolean;
}

export default function TaskCard({ 
  task, 
  isOverlay, 
  onEditTask, 
  onDeleteTask,
  canMoveTask,
  canDelete 
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: !canMoveTask });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass-card p-4 rounded-xl group",
        canMoveTask ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isOverlay && "cursor-grabbing ring-2 ring-primary shadow-2xl scale-105 z-50 bg-white dark:bg-slate-800"
      )}
      onClick={() => onEditTask(task)}
    >
      <div {...attributes} {...listeners} className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <PriorityBadge priority={task.priority} />
          {canDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <h4 className="font-bold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <MessageSquare size={12} />
            <span>{task.comments?.length || 0}</span>
          </div>
          {task.dueDate && (
            <div className={cn("flex items-center gap-1", task.overdue && "text-rose-500")}>
              <Clock size={12} />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-primary" title={task.assigneeName}>
            {task.assigneeName?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </div>
  );
}
