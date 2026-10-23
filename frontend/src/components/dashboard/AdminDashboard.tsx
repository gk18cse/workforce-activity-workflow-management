import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeProvider';
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
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#999999' : '#666666';
  const axisColor = isDark ? '#424242' : '#D9D9D9';
  const tooltipBg = isDark ? '#2B2B2B' : '#FFFFFF';
  const tooltipBorder = isDark ? '#424242' : '#D9D9D9';
  const tooltipText = isDark ? '#F5F5F5' : '#2B2B2B';

  const workflowVelocityData = [
    { stage: 'Initiated', avgHours: 4.2, tasksCount: 38 },
    { stage: 'Execution', avgHours: 14.5, tasksCount: 52 },
    { stage: 'Review', avgHours: 8.1, tasksCount: 24 },
    { stage: 'QA Check', avgHours: 3.5, tasksCount: 18 },
    { stage: 'Completed', avgHours: 0, tasksCount: 110 },
  ];

  const taskStatusDistribution = [
    { name: 'Completed', value: 110, color: isDark ? '#808080' : '#424242' },
    { name: 'In Progress', value: 52, color: isDark ? '#D9D9D9' : '#808080' },
    { name: 'In Review', value: 24, color: isDark ? '#424242' : '#D9D9D9' },
    { name: 'Blocked', value: '#E11D48' },
  ];

  const activeWorkflows = [
    { id: 'wf-1', name: 'Software Release & QA Pipeline', department: 'Engineering', activeTasks: 34, health: 'Optimal' },
    { id: 'wf-2', name: 'Vendor Onboarding & Compliance', department: 'Operations', activeTasks: 21, health: 'Needs Review' },
    { id: 'wf-3', name: 'Customer Support Escalations', department: 'Operations', activeTasks: 45, health: 'Optimal' },
    { id: 'wf-4', name: 'Financial Audit & Reporting', department: 'Finance', activeTasks: 18, health: 'Optimal' },
  ];

  return (
    <div className="space-y-8">
      {/* Executive Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-lg">
        <div>
          <h2 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
            System Executive Overview
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-sans">
            Global visibility into organizational workflows, activity throughput, and system health.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="brand" className="text-xs px-3 py-1">
            <Activity className="w-3.5 h-3.5 mr-1 text-muted-foreground" /> Live Telemetry
          </Badge>
        </div>
      </div>

      {/* KPI Stats Cards - SRATOME Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Active Users</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">48</h3>
              <p className="text-xs text-muted-foreground flex items-center mt-1 font-sans">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" /> +12% this month
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Configured Workflows</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">12</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Across 4 Departments</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Tasks Tracked</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">194</h3>
              <p className="text-xs text-muted-foreground flex items-center mt-1 font-sans">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> 110 Completed
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Process Efficiency</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">94.2%</h3>
              <p className="text-xs text-muted-foreground flex items-center mt-1 font-sans">
                <Clock className="w-3 h-3 mr-1 text-muted-foreground" /> Avg cycle: 2.4 days
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Dynamic Theme Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Stage Velocity & Cycle Times</CardTitle>
            <CardDescription>Average dwell hours spent per workflow stage across all organization activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflowVelocityData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <XAxis dataKey="stage" stroke={textColor} tickLine={false} axisLine={{ stroke: axisColor }} fontSize={10} fontFamily="Orbitron, SRATOME, sans-serif" />
                  <YAxis stroke={textColor} tickLine={false} axisLine={false} fontSize={10} fontFamily="Orbitron, SRATOME, sans-serif" />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '0.25rem', color: tooltipText, fontFamily: 'Orbitron, SRATOME, sans-serif' }}
                    cursor={{ fill: axisColor, opacity: 0.2 }}
                  />
                  <Bar dataKey="avgHours" name="Avg Hours in Stage" fill={isDark ? '#808080' : '#424242'} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Breakdown</CardTitle>
            <CardDescription>Overall operational task status distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '0.25rem', color: tooltipText, fontFamily: 'Orbitron, SRATOME, sans-serif' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: textColor, fontSize: '10px', fontFamily: 'Orbitron, SRATOME, sans-serif' }} />
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
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-background/60 font-sratome text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-bold">Workflow Name</th>
                  <th className="px-4 py-3 font-bold">Department</th>
                  <th className="px-4 py-3 font-bold">Active Tasks</th>
                  <th className="px-4 py-3 font-bold">Health Status</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {activeWorkflows.map((wf) => (
                  <tr key={wf.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3 font-sratome font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                      {wf.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-sans">{wf.department}</td>
                    <td className="px-4 py-3 font-sratome font-bold text-foreground">{wf.activeTasks}</td>
                    <td className="px-4 py-3">
                      <Badge variant={wf.health === 'Optimal' ? 'emerald' : 'amber'}>
                        {wf.health}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => navigate('/workflows')} className="font-sratome uppercase text-[11px] text-muted-foreground hover:text-foreground font-semibold tracking-wider transition-colors">
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
