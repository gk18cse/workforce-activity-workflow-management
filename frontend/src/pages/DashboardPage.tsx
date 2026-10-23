import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Users, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  GitBranch, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Filter,
  Activity,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { initialEmployees, initialProjects, initialTasks, initialActivities } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Chart Theme Colors
  const tealColor = '#176B6B';
  const mutedTeal = '#438A87';
  const amberColor = '#C88A2E';
  const greenColor = '#2E7D5E';
  const terracottaColor = '#C25B4E';

  // Productivity Analytics Data
  const weeklyProductivityData = [
    { day: 'Mon', completed: 28, assigned: 34, throughput: 82 },
    { day: 'Tue', completed: 42, assigned: 38, throughput: 90 },
    { day: 'Wed', completed: 55, assigned: 48, throughput: 94 },
    { day: 'Thu', completed: 48, assigned: 45, throughput: 91 },
    { day: 'Fri', completed: 62, assigned: 52, throughput: 96 },
    { day: 'Sat', completed: 24, assigned: 20, throughput: 88 },
    { day: 'Sun', completed: 18, assigned: 15, throughput: 85 },
  ];

  const departmentWorkloadData = [
    { department: 'Engineering', count: 42, workload: 84 },
    { department: 'Operations', count: 35, workload: 68 },
    { department: 'Product', count: 28, workload: 76 },
    { department: 'Design', count: 22, workload: 72 },
    { department: 'Marketing', count: 21, workload: 62 },
  ];

  const taskStatusDistribution = [
    { name: 'Completed', value: 384, color: greenColor },
    { name: 'In Progress', value: 74, color: tealColor },
    { name: 'Pending Review', value: 42, color: amberColor },
    { name: 'Overdue / Blocked', value: 12, color: terracottaColor },
  ];

  // 8 KPIs requested by the user
  const kpiMetrics = [
    {
      id: 'kpi-1',
      label: 'Total Employees',
      value: '148',
      comparison: '+8% vs last month',
      trend: 'up',
      icon: Users,
      color: 'teal',
      miniChart: [40, 55, 62, 70, 85, 95, 100],
    },
    {
      id: 'kpi-2',
      label: 'Active Employees',
      value: '142',
      comparison: '96% team availability',
      trend: 'up',
      icon: UserCheck,
      color: 'emerald',
      miniChart: [90, 92, 94, 95, 94, 96, 96],
    },
    {
      id: 'kpi-3',
      label: 'Tasks Completed',
      value: '384',
      comparison: '+14% vs last week',
      trend: 'up',
      icon: CheckCircle2,
      color: 'emerald',
      miniChart: [210, 240, 290, 310, 340, 360, 384],
    },
    {
      id: 'kpi-4',
      label: 'Pending Tasks',
      value: '42',
      comparison: '-5% backlog velocity',
      trend: 'down',
      icon: Clock,
      color: 'amber',
      miniChart: [65, 58, 52, 49, 45, 43, 42],
    },
    {
      id: 'kpi-5',
      label: 'Overdue Tasks',
      value: '3',
      comparison: '-40% vs prior cycle',
      trend: 'down',
      icon: AlertCircle,
      color: 'rose',
      miniChart: [9, 8, 7, 5, 4, 3, 3],
    },
    {
      id: 'kpi-6',
      label: 'Active Workflows',
      value: '18',
      comparison: 'Across 5 departments',
      trend: 'up',
      icon: GitBranch,
      color: 'teal',
      miniChart: [12, 14, 15, 16, 17, 18, 18],
    },
    {
      id: 'kpi-7',
      label: 'Avg Task Completion Rate',
      value: '92.4%',
      comparison: '+3.1% efficiency gains',
      trend: 'up',
      icon: Zap,
      color: 'emerald',
      miniChart: [85, 87, 88, 90, 91, 92, 92.4],
    },
    {
      id: 'kpi-8',
      label: 'Team Productivity',
      value: '88%',
      comparison: '+6% quarterly benchmark',
      trend: 'up',
      icon: TrendingUp,
      color: 'teal',
      miniChart: [75, 78, 80, 83, 85, 87, 88],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* =========================================================================
          EXECUTIVE BANNER & CONTROLS
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
              Workforce Operations Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
              Sample Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-sans">
            Welcome back, <span className="font-semibold text-foreground">{user?.firstName} {user?.lastName}</span>. Real-time overview of workforce availability, tasks velocity, and active workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-background border border-border rounded-xl p-1 shadow-neu-sm text-xs font-semibold">
            {(['week', 'month', 'quarter'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all ${
                  timeRange === r
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1.5 shadow-neu-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      {/* =========================================================================
          8 KPI METRIC CARDS (With Trend Indicators & Mini Sparklines)
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Performance Indicators
          </h3>
          <span className="text-[11px] text-muted-foreground">Updated: 2 minutes ago</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {kpiMetrics.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.id}
                className="hover:-translate-y-0.5 hover:shadow-neu-raised transition-all duration-200 cursor-default group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      {kpi.label}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
                      {kpi.value}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-neu-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Trend & Comparison */}
                <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                    kpi.trend === 'up' && kpi.id !== 'kpi-5' ? 'text-[#2E7D5E]' : kpi.trend === 'down' && kpi.id === 'kpi-5' ? 'text-[#2E7D5E]' : 'text-muted-foreground'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {kpi.comparison}
                  </span>
                  
                  {/* Subtle Mini Sparkline Simulation */}
                  <div className="flex items-end gap-0.5 h-4 w-12">
                    {kpi.miniChart.map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-primary/30 rounded-t-xs"
                        style={{ height: `${(val / 100) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION E: PRODUCTIVITY ANALYTICS (Interactive Recharts Area & Bar Charts)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Throughput & Productivity Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Task Velocity & Throughput</CardTitle>
              <CardDescription>Daily completed vs assigned tasks with efficiency throughput %</CardDescription>
            </div>
            <Badge variant="teal">Real-time Recharts</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProductivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={tealColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={tealColor} stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="assignedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={amberColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={amberColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#77736B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#77736B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="completed" stroke={tealColor} strokeWidth={2.5} fillOpacity={1} fill="url(#completedGrad)" name="Tasks Completed" />
                  <Area type="monotone" dataKey="assigned" stroke={amberColor} strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#assignedGrad)" name="Tasks Assigned" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section B: Task Overview Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>384 active records categorised by stage</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-1.5 mt-2">
              {taskStatusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================================
          SECTION A: WORKFORCE OVERVIEW & WORKLOAD
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Workforce Capacity & Department Workload</CardTitle>
              <CardDescription>Current utilization percentage across operational units</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/workforce')}>
              View Directory <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentWorkloadData.map((dept) => (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{dept.department}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{dept.count} Members</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                      dept.workload > 80 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                    }`}>
                      {dept.workload}% Load
                    </span>
                  </div>
                </div>
                {/* Neumorphic Meter */}
                <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden shadow-neu-inset">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.workload > 80 ? 'bg-[#C25B4E]' : 'bg-[#176B6B]'
                    }`}
                    style={{ width: `${dept.workload}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section C: Workflow Progress Grouped by Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Enterprise Workflows</CardTitle>
              <CardDescription>Cross-functional process pipelines and delivery progress</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/workflows')}>
              Boards <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {initialProjects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="p-3.5 bg-background border border-border/70 rounded-xl shadow-neu-sm space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-foreground">{proj.name}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{proj.department} • Manager: {proj.manager}</p>
                  </div>
                  <Badge variant={proj.status === 'On Track' ? 'success' : proj.status === 'At Risk' ? 'warning' : 'teal'}>
                    {proj.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Progress Completion</span>
                    <span className="font-bold text-foreground">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* =========================================================================
          SECTION D & F: TEAM ACTIVITY TIMELINE & UPCOMING DEADLINES
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section D: Team Activity Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Activity Timeline</CardTitle>
              <CardDescription>Live operational audit trail and state changes</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/activity')}>
              Full Log <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialActivities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-primary shrink-0 shadow-neu-sm">
                    {act.actor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">
                      <span className="font-bold">{act.actor.name}</span>{' '}
                      <span className="text-muted-foreground">{act.action}</span>{' '}
                      <span className="font-semibold text-primary">{act.target}</span>
                    </p>
                    {act.details && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{act.details}</p>
                    )}
                    <span className="text-[10px] text-muted-foreground font-medium">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section F: Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Deadlines & Milestones</CardTitle>
              <CardDescription>Tasks scheduled for delivery in the next 7 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
              Calendar <Calendar className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {initialTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-3 bg-background border border-border/70 rounded-xl shadow-neu-sm flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.priority === 'URGENT' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'brand'}>
                        {task.priority}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground truncate">{task.project}</span>
                    </div>
                    <h5 className="font-bold text-xs text-foreground mt-1 truncate">{task.title}</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Assignee: {task.assigneeName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-foreground block">{task.dueDate}</span>
                    <span className="text-[10px] text-primary font-semibold">Due Soon</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
