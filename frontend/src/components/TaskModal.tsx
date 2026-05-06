import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { taskService } from '../services/api';
import { Task, Status, Priority } from '../types';
import Modal from './Modal';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  task?: Task | null; // If present, we are editing
  canEdit?: boolean;
}

export default function TaskModal({ isOpen, onClose, projectId, task, canEdit = true }: TaskModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState<Status>('TODO');
  const [priority, setPriority] = React.useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = React.useState('');
  const [assigneeId, setAssigneeId] = React.useState<number | ''>('');
  const [commentContent, setCommentContent] = React.useState('');
  const canEditDetails = !task || canEdit;

  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setAssigneeId(task.assigneeId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
      setAssigneeId('');
    }
  }, [task, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => 
      task ? taskService.update(task.id, data) : taskService.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      if (!task) onClose(); // Only close if creating. If editing, keep open to see updates.
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => taskService.addComment(task!.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setCommentContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditDetails) return;
    mutation.mutate({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      assigneeId: assigneeId || null
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? (canEditDetails ? 'Edit Task' : 'View Task') : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-1">Task Title</label>
          <input 
            type="text" 
            required
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="What needs to be done?"
            value={title}
            disabled={!canEditDetails}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-1">Description</label>
          <textarea 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all min-h-[100px]"
            placeholder="Add some details..."
            value={description}
            disabled={!canEditDetails}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">Priority</label>
            <select 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none"
              value={priority}
              disabled={!canEditDetails}
              onChange={e => setPriority(e.target.value as any)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">Status</label>
            <select 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none"
              value={status}
              disabled={!canEditDetails}
              onChange={e => setStatus(e.target.value as any)}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-1">Due Date</label>
          <input 
            type="date" 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
            value={dueDate}
            disabled={!canEditDetails}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        {canEditDetails && (
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : (task ? 'Update Task' : 'Create Task')}
          </button>
        )}
      </form>

      {task && (
        <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} className="text-primary" />
            <h3 className="font-bold">Discussion</h3>
          </div>

          <div className="space-y-6 mb-8">
            {task.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{comment.userName}</span>
                    <span className="text-[10px] text-slate-400">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
            {task.comments?.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-4">No comments yet. Start the conversation!</p>
            )}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); if(commentContent.trim()) commentMutation.mutate(commentContent); }}
            className="relative"
          >
            <input 
              type="text" 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-4 pr-12 text-sm outline-none"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
            />
            <button 
              disabled={commentMutation.isPending || !commentContent.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-xl disabled:opacity-50 transition-all"
            >
              {commentMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
}
