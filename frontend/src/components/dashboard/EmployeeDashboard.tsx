import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Play, 
  AlertTriangle
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const myAssignedTasks = [
    {
      id: 'task-301',
      title: 'Implement OAuth2 Refresh Token Strategy',
      workflow: 'Software Release',
      stage: 'In Execution',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-lg">
        <div>
          <h2 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
            My Operational Workstation
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-sans">
            Track your active assignments, update stage status, and report blockers.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="brand" className="px-3 py-1 text-xs">
            <CheckSquare className="w-3.5 h-3.5 mr-1" /> {myAssignedTasks.length} Active Assigned Tasks
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Active Tasks</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">{myAssignedTasks.length}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Assigned to you</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Due Today / Urgent</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-amber-500 mt-1">1</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Requires focus</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Completed This Week</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-emerald-500 mt-1">12</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">100% on-time rate</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks List */}
        <Card className="lg:col-span-2">
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
            <div className="space-y-3">
              {myAssignedTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-background border border-border p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Badge variant={t.priority === 'HIGH' ? 'amber' : 'brand'}>
                        {t.priority}
                      </Badge>
                      <span className="font-sratome text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{t.workflow}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-sans">
                        <Clock className="w-3 h-3 text-muted-foreground" /> Due: {t.dueDate}
                      </span>
                    </div>
                    <h4 className="font-sratome font-bold uppercase tracking-wider text-foreground text-xs sm:text-sm">{t.title}</h4>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-sratome text-[10px] uppercase text-muted-foreground">Stage:</span>
                      <span className="px-2 py-0.5 rounded text-foreground font-sratome font-bold text-[10px] uppercase tracking-wider bg-secondary border border-border">
                        {t.stage}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="primary" size="sm">
                      <Play className="w-3 h-3 mr-1" /> Update Status
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="w-3 h-3 mr-1 text-rose-500" /> Blocker
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Work History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Work History</CardTitle>
            <CardDescription>Audit trace of your recent task contributions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 pb-3 border-b border-border/60 last:border-0">
                  <div className="w-7 h-7 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-sratome text-xs font-bold uppercase tracking-wider text-foreground">{act.task}</h5>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5 font-sans">{act.action}</p>
                    <span className="text-[10px] text-muted-foreground font-sans">{act.timeAgo}</span>
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
