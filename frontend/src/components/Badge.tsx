import React from 'react';
import { Status, Priority, Role } from '../types';
import { cn } from '../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'glass';
}

function Badge({ children, className, variant = 'glass' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    outline: 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400',
    glass: 'bg-white/10 backdrop-blur-md border border-white/10 text-slate-600 dark:text-slate-400',
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const configs = {
    TODO: { label: 'To Do', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    DONE: { label: 'Done', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  };

  const config = configs[status] || configs.TODO;

  return (
    <Badge className={cn("border", config.color)}>
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const configs = {
    LOW: { label: 'Low', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
    MEDIUM: { label: 'Medium', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    HIGH: { label: 'High', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    CRITICAL: { label: 'Critical', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  };

  const config = configs[priority] || configs.MEDIUM;

  return (
    <Badge className={cn("border", config.color)}>
      {config.label}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: Role | 'OWNER' }) {
  const configs = {
    OWNER: { label: 'Owner', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    ADMIN: { label: 'Admin', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    MEMBER: { label: 'Member', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  };

  const config = configs[role as keyof typeof configs] || configs.MEMBER;

  return (
    <Badge className={cn("border", config.color)}>
      {config.label}
    </Badge>
  );
}
