import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { initialEmployees, initialProjects, initialTasks } from '../services/mockData';

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'year'>('30d');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // Palette
  const tealColor = '#176B6B';
  const mutedTeal = '#438A87';
  const amberColor = '#C88A2E';
  const greenColor = '#2E7D5E';
  const terracottaColor = '#C25B4E';

  // Trends Data
  const monthlyCompletionTrends = [
    { month: 'May', completed: 240, overdue: 18, avgDays: 4.8 },
    { month: 'Jun', completed: 285, overdue: 14, avgDays: 4.2 },
    { month: 'Jul', completed: 310, overdue: 12, avgDays: 3.9 },
    { month: 'Aug', completed: 345, overdue: 9, avgDays: 3.7 },
    { month: 'Sep', completed: 370, overdue: 6, avgDays: 3.4 },
    { month: 'Oct', completed: 384, overdue: 3, avgDays: 3.1 },
  ];

  const departmentWorkloadData = [
    { department: 'Engineering', count: 42, activeTasks: 18, avgHours: 36.4 },
    { department: 'Operations', count: 35, activeTasks: 14, avgHours: 32.1 },
    { department: 'Product', count: 28, activeTasks: 11, avgHours: 34.8 },
    { department: 'Design', count: 22, activeTasks: 8, avgHours: 29.5 },
    { department: 'Marketing', count: 21, activeTasks: 7, avgHours: 26.2 },
  ];

  const workflowCycleTimeData = [
    { stage: 'Backlog', days: 2.1 },
    { stage: 'To Do', days: 1.8 },
    { stage: 'In Progress', days: 4.2 },
    { stage: 'In Review', days: 1.5 },
    { stage: 'Approved', days: 0.8 },
    { stage: 'Completed', days: 0.0 },
  ];

  // CSV Export Handler
  const handleExportCSV = () => {
    const csvRows = [
      ['ID', 'Task Title', 'Project', 'Assignee', 'Department', 'Priority', 'Status', 'Due Date', 'Est Hours'],
      ...initialTasks.map((t) => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.project}"`,
        t.assigneeName,
        t.department,
        t.priority,
        t.status,
        t.dueDate,
        t.estimatedHours || 0,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workflow_pro_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
              Reports & Productivity Analytics
            </h1>
            <Badge variant="teal">Sample Live Data</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Data intelligence on task throughput, team workload distribution, workflow cycle latency, and compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-background border border-border rounded-xl p-1 shadow-neu-sm text-xs font-semibold">
            {(['30d', '90d', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all ${
                  dateRange === r
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last Quarter' : 'Past Year'}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={handleExportCSV} className="flex items-center gap-1.5 shadow-neu-sm">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </Button>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Completion Velocity</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">384 Tasks</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +14.2% MoM growth
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mean Cycle Time</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">3.1 Days</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1" /> -1.7 days latency reduction
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Staff Utilization</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">78.4%</h3>
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                Optimal balanced bandwidth
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">SLA Breach Rate</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">0.8%</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> 99.2% on-time target
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1: Task Completion Trends & Cycle Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Task Completion & Overdue Defect Trend</CardTitle>
            <CardDescription>Historical throughput and overdue task rate over past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyCompletionTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={tealColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={tealColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#77736B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#77736B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="completed" stroke={tealColor} strokeWidth={2.5} fillOpacity={1} fill="url(#compGrad)" name="Tasks Completed" />
                  <Line type="monotone" dataKey="overdue" stroke={terracottaColor} strokeWidth={2} name="Overdue Tasks" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Stage Latency & Bottleneck Analysis</CardTitle>
            <CardDescription>Average days spent in each stage before state advancement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflowCycleTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="stage" stroke="#77736B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#77736B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="days" fill={tealColor} radius={[8, 8, 0, 0]} name="Average Days" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Department Workload Table & Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Departmental Resource Load & Active Commitments</CardTitle>
          <CardDescription>Cross-functional breakdown of headcount, active tasks, and mean weekly hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border/80">
                <tr>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Staff Count</th>
                  <th className="p-3.5">Active Commitments</th>
                  <th className="p-3.5">Avg Weekly Effort</th>
                  <th className="p-3.5">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {departmentWorkloadData.map((d) => (
                  <tr key={d.department} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">{d.department}</td>
                    <td className="p-3.5 text-foreground">{d.count} members</td>
                    <td className="p-3.5 text-foreground">{d.activeTasks} tasks</td>
                    <td className="p-3.5 text-foreground">{d.avgHours} hrs / person</td>
                    <td className="p-3.5">
                      <Badge variant="success">Optimal</Badge>
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
