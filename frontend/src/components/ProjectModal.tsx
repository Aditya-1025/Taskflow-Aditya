import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { projectService } from '../services/api';
import { Project } from '../types';
import Modal from './Modal';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [project, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => 
      project ? projectService.update(project.id, data) : projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, description });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={project ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-1">Project Name</label>
          <input 
            type="text" 
            required
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="e.g., Marketing Campaign"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-1">Description</label>
          <textarea 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all min-h-[100px]"
            placeholder="What is this project about?"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : (project ? 'Update Project' : 'Create Project')}
        </button>
      </form>
    </Modal>
  );
}
