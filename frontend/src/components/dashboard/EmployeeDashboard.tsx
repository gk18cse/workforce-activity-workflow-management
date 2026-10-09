import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  // Mock Data for Employee Personal Workplace
  const myAssignedTasks = [
    {
      id: 'task-301',
      title: 'Implement OAuth2 Refresh Token Strategy',
      workflow: 'Software Release',
      stage: 'In Execution',
      stageColor: '#3B82F6',
      priority: 'HIGH',
      dueDate: 'Today, 5:00 PM',
      estimatedHours: 6,
      status: 'IN_PROGRESS',
    },
    {
      id: 'task-302',
      title: 'Optimize Database Query Indexes on Audit Table',
      workflow: 'Software Release',
      stage: 'In Execution',
      stageColor: '#3B82F6',
      priority: 'MEDIUM',
      dueDate: 'Tomorrow',
      estimatedHours: 4,
      status: 'IN_PROGRESS',
    },
    {
      id: 'task-303',
      title: 'Draft System Architecture Documentation',
      workflow: 'Technical Docs',
      stage: 'Manager Review',
      stageColor: '#F59E0B',
      priority: 'LOW',
      dueDate: 'Oct 12, 2026',
      estimatedHours: 8,
      status: 'IN_REVIEW',
    },
  ];

  const recentActivity = [
    {
      id: 'act-1',
      task: 'Configured Redis Caching Middleware',
      action: 'Moved to Manager Review',
      timeAgo: '2 hours ago',
    },
    {
      id: 'act-2',
      task: 'Fixed CORS Security Header Bug',
      action: 'Completed Task',
      timeAgo: 'Yesterday',
    },
    {
      id: 'act-3',
      task: 'Setup ESLint Rule Ruleset',
      action: 'Completed Task',
      timeAgo: '2 days ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/30 via-slate-900 to-indigo-900/30 border border-emerald-500/20 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            My Operational Workstation
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track your active assignments, update stage status, and report blockers.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="emerald" className="px-3 py-1 text-xs">
            <CheckSquare className="w-3.5 h-3.5 mr-1" /> {myAssignedTasks.length} Active Assigned Tasks
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tasks</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">{myAssignedTasks.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Assigned to you</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CheckSquare className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Today / Urgent</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">1</h3>
              <p className="text-xs text-amber-400 mt-1">Requires focus</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed This Week</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">12</h3>
              <p className="text-xs text-emerald-400 mt-1">100% on-time rate</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: My Active Tasks + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks List */}
        <Card className="lg:col-span-2 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Current Tasks</CardTitle>
              <CardDescription>Tasks currently assigned to your active queue.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Tasks →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAssignedTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={t.priority === 'HIGH' ? 'amber' : 'indigo'}>
                        {t.priority}
                      </Badge>
                      <span className="text-xs text-slate-400">{t.workflow}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> Due: {t.dueDate}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-base">{t.title}</h4>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">Stage:</span>
                      <span
                        className="px-2 py-0.5 rounded text-white font-semibold text-[11px]"
                        style={{ backgroundColor: t.stageColor }}
                      >
                        {t.stage}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="primary" size="sm">
                      <Play className="w-3.5 h-3.5 mr-1" /> Update Status
                    </Button>
                    <Button variant="outline" size="sm" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Blocker
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Work History Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Work History</CardTitle>
            <CardDescription>Audit trace of your recent task contributions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 pb-3 border-b border-slate-800/60 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{act.task}</h5>
                    <p className="text-[11px] text-indigo-400 font-medium mt-0.5">{act.action}</p>
                    <span className="text-[10px] text-slate-500">{act.timeAgo}</span>
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
