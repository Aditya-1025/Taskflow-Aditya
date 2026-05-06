import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Briefcase, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import { dashboardService } from '../services/api';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const COLORS = ['#7c3aed', '#34d399', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats().then(res => res.data),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const priorityData = [
    { name: 'Low', value: stats?.lowPriorityCount || 0 },
    { name: 'Medium', value: stats?.mediumPriorityCount || 0 },
    { name: 'High', value: stats?.highPriorityCount || 0 },
    { name: 'Critical', value: stats?.criticalPriorityCount || 0 },
  ];

  const statusData = [
    { name: 'Todo', value: stats?.todoCount || 0 },
    { name: 'In Progress', value: stats?.inProgressCount || 0 },
    { name: 'Done', value: stats?.doneCount || 0 },
  ];

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects, icon: Briefcase, color: 'text-primary' },
    { label: 'Pending Tasks', value: (stats?.todoCount || 0) + (stats?.inProgressCount || 0), icon: Clock, color: 'text-amber-500' },
    { label: 'Completed', value: stats?.doneCount, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Overdue', value: stats?.overdueCount, icon: AlertCircle, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-slate-500 mt-1">Track your team's productivity and project health.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <Calendar size={18} className="text-primary" />
          <span className="text-sm font-medium">{format(new Date(), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6 rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
              </div>
              <div className={cn("p-3 rounded-xl bg-slate-100 dark:bg-slate-800", card.color)}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Priority Distribution */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary" />
            <h3 className="font-bold">Task Priority Distribution</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold mb-6">Status Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-500 dark:text-slate-400">{s.name}</span>
                </div>
                <span className="font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks List */}
      <div className="glass-card p-6 rounded-2xl overflow-hidden">
        <h3 className="font-bold mb-6">My Recent Active Tasks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-medium text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="pb-4">Task Name</th>
                <th className="pb-4">Project</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4 text-right">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {stats?.myTasks?.map((task) => (
                <tr key={task.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 font-medium">{task.title}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{task.projectName}</td>
                  <td className="py-4">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider",
                      task.priority === 'CRITICAL' ? "bg-rose-500/10 text-rose-500" :
                      task.priority === 'HIGH' ? "bg-amber-500/10 text-amber-500" :
                      "bg-primary/10 text-primary"
                    )}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-500 dark:text-slate-400">
                    {task.dueDate || 'No Date'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
