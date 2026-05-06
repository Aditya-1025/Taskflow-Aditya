import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Folder, 
  Users, 
  ListTodo,
  ExternalLink,
  Trash2,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';
import { cn } from '../utils/cn';
import { Project } from '../types';
import ProjectModal from '../components/ProjectModal';
import { RoleBadge } from '../components/Badge';

export default function Projects() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll().then(res => res.data),
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const filteredProjects = projects?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-slate-500 mt-1">Manage and collaborate on your active projects.</p>
        </div>
        <button 
          onClick={() => { setSelectedProject(null); setIsModalOpen(true); }}
          className="btn btn-primary inline-flex items-center gap-2 self-start sm:self-auto px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
        >
          <Plus size={20} />
          Create Project
        </button>
      </div>

      {/* Search & Filters */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search projects..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project) => (
          <div key={project.id} className="glass-card p-6 rounded-2xl flex flex-col group relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Folder size={24} />
              </div>
              <div className="flex items-center gap-2">
                <RoleBadge role={project.currentUserRole} />
                <button className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-slate-400">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6 flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={16} />
                <span className="text-sm font-medium">{project.memberCount} members</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <ListTodo size={16} />
                <span className="text-sm font-medium">{project.taskCount} tasks</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Completion</span>
                <span className="text-primary">{project.taskCount > 0 ? Math.round((project.doneCount / project.taskCount) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${project.taskCount > 0 ? (project.doneCount / project.taskCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Actions overlay */}
            <Link 
              to={`/projects/${project.id}`}
              className="absolute inset-0 z-0"
              aria-label={`View project ${project.name}`}
            />
            
            <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.currentUserRole === 'OWNER' && (
                <>
                  <button 
                    onClick={(e) => { e.preventDefault(); setSelectedProject(project); setIsModalOpen(true); }}
                    className="p-2 bg-white/90 dark:bg-slate-900/90 shadow-lg rounded-lg text-slate-500 hover:bg-primary hover:text-white transition-all"
                  >
                    <Settings size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); if(confirm('Delete project?')) deleteProject.mutate(project.id)}}
                    className="p-2 bg-white/90 dark:bg-slate-900/90 shadow-lg rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <ProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          project={selectedProject} 
        />

        {/* Empty State */}
        {projects?.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Folder size={40} />
            </div>
            <h3 className="text-xl font-bold">No projects yet</h3>
            <p className="text-slate-500 mt-2">Get started by creating your first project.</p>
          </div>
        )}
      </div>
    </div>
  );
}
