import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeProvider';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Check, 
  X
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

export const ManagerDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#999999' : '#666666';
  const axisColor = isDark ? '#424242' : '#D9D9D9';
  const tooltipBg = isDark ? '#2B2B2B' : '#FFFFFF';
  const tooltipBorder = isDark ? '#424242' : '#D9D9D9';
  const tooltipText = isDark ? '#F5F5F5' : '#2B2B2B';

  const teamWorkloadData = [
    { name: 'David Miller', active: 6, completed: 18, blocked: 1 },
    { name: 'Elena Rostova', active: 8, completed: 22, blocked: 0 },
    { name: 'Marcus Chen', active: 4, completed: 15, blocked: 2 },
    { name: 'Sophia Patel', active: 7, completed: 19, blocked: 0 },
  ];

  const issueSeverityData = [
    { name: 'Critical Blockers', value: 3, color: '#E11D48' },
    { name: 'High Priority', value: 5, color: isDark ? '#808080' : '#424242' },
    { name: 'Medium Priority', value: 8, color: isDark ? '#424242' : '#D9D9D9' },
  ];

  const pendingApprovals = [
    {
      id: 'app-101',
      taskTitle: 'Database Migration to Production Cluster',
      workflow: 'Software Release & QA Pipeline',
      requestedStage: 'Production Deployment',
      requester: 'David Miller',
      timeAgo: '45 mins ago',
    },
    {
      id: 'app-102',
      taskTitle: 'Vendor Contract Compliance Verification',
      workflow: 'Vendor Onboarding',
      requestedStage: 'Legal Signoff',
      requester: 'Marcus Chen',
      timeAgo: '2 hours ago',
    },
  ];

  const openIssues = [
    {
      id: 'iss-201',
      taskTitle: 'API Gateway Timeout on Load Test',
      reportedBy: 'Elena Rostova',
      priority: 'CRITICAL',
      reportedAt: '3 hours ago',
      description: 'Upstream microservices returning 504 gateway timeout under 10k RPS test.',
    },
    {
      id: 'iss-202',
      taskTitle: 'Missing SSL Cert for Staging Domain',
      reportedBy: 'Marcus Chen',
      priority: 'HIGH',
      reportedAt: '1 day ago',
      description: 'Staging environment deployment blocked due to expired wildcard SSL certificate.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-lg">
        <div>
          <h2 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
            Manager Control Center & Gatekeeping
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-sans">
            Monitor team workload, authorize stage transitions, and unblock active operational issues.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="amber" className="px-3 py-1 text-xs">
            <Clock className="w-3.5 h-3.5 mr-1" /> {pendingApprovals.length} Approvals Pending
          </Badge>
          <Badge variant="rose" className="px-3 py-1 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {openIssues.length} Active Blockers
          </Badge>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Pending Approvals</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">{pendingApprovals.length}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Action required</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Open Blockers</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-rose-500 mt-1">{openIssues.length}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">1 Critical severity</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Managed Direct Reports</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">4</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Operations & Tech</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sratome text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Tasks Approved This Week</p>
              <h3 className="font-sratome text-3xl font-bold tracking-tight text-foreground mt-1">28</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">+15% throughput</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals Gatekeeping Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Workflow Stage Approvals Queue
            </CardTitle>
            <CardDescription>
              Tasks requesting transition to approval-gated workflow stages.
            </CardDescription>
          </div>
          <Badge variant="amber">{pendingApprovals.length} Waiting</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingApprovals.map((app) => (
              <div
                key={app.id}
                className="bg-background border border-border p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-sratome text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{app.workflow}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-[11px] text-muted-foreground">{app.timeAgo}</span>
                  </div>
                  <h4 className="font-sratome font-bold uppercase tracking-wider text-foreground text-xs sm:text-sm">{app.taskTitle}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-sans">
                    Requested by <span className="text-foreground font-semibold">{app.requester}</span> to move to stage:
                    <Badge variant="amber" className="text-[10px] px-2 py-0">
                      {app.requestedStage}
                    </Badge>
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Button variant="success" size="sm">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                  <Button variant="danger" size="sm">
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Workload & Capacity Distribution</CardTitle>
            <CardDescription>Active, completed, and blocked tasks per team member.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamWorkloadData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke={textColor} tickLine={false} axisLine={{ stroke: axisColor }} fontSize={10} fontFamily="Orbitron, SRATOME, sans-serif" />
                  <YAxis stroke={textColor} tickLine={false} axisLine={false} fontSize={10} fontFamily="Orbitron, SRATOME, sans-serif" />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '0.25rem', color: tooltipText, fontFamily: 'Orbitron, SRATOME, sans-serif' }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ color: textColor, fontSize: '10px', fontFamily: 'Orbitron, SRATOME, sans-serif' }} />
                  <Bar dataKey="active" name="Active Tasks" fill={isDark ? '#808080' : '#424242'} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill={isDark ? '#D9D9D9' : '#808080'} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="blocked" name="Blocked" fill={isDark ? '#424242' : '#D9D9D9'} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocker Severity</CardTitle>
            <CardDescription>Open issues breakdown by urgency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueSeverityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {issueSeverityData.map((entry, index) => (
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

      {/* Open Issues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Active Task Blockers & Reported Issues
          </CardTitle>
          <CardDescription>
            Traceability log of issues preventing workflow stage completion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openIssues.map((iss) => (
              <div key={iss.id} className="bg-background border border-border p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={iss.priority === 'CRITICAL' ? 'rose' : 'amber'}>
                      {iss.priority}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-sans">Reported by {iss.reportedBy} ({iss.reportedAt})</span>
                  </div>
                  <h4 className="font-sratome font-bold uppercase tracking-wider text-foreground text-xs sm:text-sm">{iss.taskTitle}</h4>
                  <p className="text-xs text-muted-foreground font-sans">{iss.description}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Resolve Issue →
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
