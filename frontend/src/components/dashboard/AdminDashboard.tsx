import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Users, 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  // Mock Data for Admin Analytics & Visualization
  const workflowVelocityData = [
    { stage: 'Initiated', avgHours: 4.2, tasksCount: 38 },
    { stage: 'In Execution', avgHours: 14.5, tasksCount: 52 },
    { stage: 'Manager Review', avgHours: 8.1, tasksCount: 24 },
    { stage: 'Quality Check', avgHours: 3.5, tasksCount: 18 },
    { stage: 'Completed', avgHours: 0, tasksCount: 110 },
  ];

  const taskStatusDistribution = [
    { name: 'Completed', value: 110, color: '#10B981' },
    { name: 'In Progress', value: 52, color: '#3B82F6' },
    { name: 'In Review', value: 24, color: '#F59E0B' },
    { name: 'Blocked', value: 8, color: '#EF4444' },
  ];

  const activeWorkflows = [
    { id: 'wf-1', name: 'Software Release & QA Pipeline', department: 'Engineering', activeTasks: 34, health: 'Optimal' },
    { id: 'wf-2', name: 'Vendor Onboarding & Compliance', department: 'Operations', activeTasks: 21, health: 'Needs Review' },
    { id: 'wf-3', name: 'Customer Support Escalations', department: 'Operations', activeTasks: 45, health: 'Optimal' },
    { id: 'wf-4', name: 'Financial Audit & Reporting', department: 'Finance', activeTasks: 18, health: 'Optimal' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            System Executive Overview
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Global visibility into organizational workflows, activity throughput, and system health.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="indigo" className="text-xs px-3 py-1">
            <Activity className="w-3.5 h-3.5 mr-1 animate-pulse" /> Live Telemetry
          </Badge>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Users</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">48</h3>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-purple-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Configured Workflows</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">12</h3>
              <p className="text-xs text-slate-400 mt-1">Across 4 Departments</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <GitBranch className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks Tracked</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">194</h3>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 110 Completed
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Process Efficiency</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">94.2%</h3>
              <p className="text-xs text-amber-400 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" /> Avg cycle: 2.4 days
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Data Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Workflow Velocity & Bottlenecks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Stage Velocity & Cycle Times</CardTitle>
            <CardDescription>Average dwell hours spent per workflow stage across all organization activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflowVelocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="stage" stroke="#94a3b8" tickLine={false} fontSize={12} />
                  <YAxis stroke="#94a3b8" tickLine={false} fontSize={12} label={{ value: 'Avg Hours', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  />
                  <Bar dataKey="avgHours" name="Avg Hours in Stage" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Breakdown</CardTitle>
            <CardDescription>Overall operational task status distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Organization Workflows</CardTitle>
          <CardDescription>Configured dynamic process engines running in the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Workflow Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Active Tasks</th>
                  <th className="px-4 py-3">Health Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeWorkflows.map((wf) => (
                  <tr key={wf.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-indigo-400" />
                      {wf.name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{wf.department}</td>
                    <td className="px-4 py-3 font-bold text-slate-200">{wf.activeTasks}</td>
                    <td className="px-4 py-3">
                      <Badge variant={wf.health === 'Optimal' ? 'emerald' : 'amber'}>
                        {wf.health}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                        Configure →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
