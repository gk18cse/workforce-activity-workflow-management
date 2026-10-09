import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Check, 
  X,
  Layers,
  ArrowRight
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
  CartesianGrid
} from 'recharts';

export const ManagerDashboard: React.FC = () => {
  // Mock Data for Manager Team Overview & Approvals
  const teamWorkloadData = [
    { name: 'David Miller', active: 6, completed: 18, blocked: 1 },
    { name: 'Elena Rostova', active: 8, completed: 22, blocked: 0 },
    { name: 'Marcus Chen', active: 4, completed: 15, blocked: 2 },
    { name: 'Sophia Patel', active: 7, completed: 19, blocked: 0 },
  ];

  const issueSeverityData = [
    { name: 'Critical Blockers', value: 3, color: '#EF4444' },
    { name: 'High Priority', value: 5, color: '#F59E0B' },
    { name: 'Medium Priority', value: 8, color: '#3B82F6' },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/30 via-slate-900 to-indigo-900/30 border border-amber-500/20 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            Manager Control Center & Gatekeeping
          </h2>
          <p className="text-slate-400 text-sm mt-1">
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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingApprovals.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Action required</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-rose-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Blockers</p>
              <h3 className="text-3xl font-extrabold text-rose-400 mt-1">{openIssues.length}</h3>
              <p className="text-xs text-rose-400 mt-1">1 Critical severity</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Managed Direct Reports</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">4</h3>
              <p className="text-xs text-slate-400 mt-1">Operations & Tech</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks Approved This Week</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">28</h3>
              <p className="text-xs text-emerald-400 mt-1">+15% throughput</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals Gatekeeping Panel */}
      <Card className="border-amber-500/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Workflow Stage Approvals Queue
            </CardTitle>
            <CardDescription>
              Tasks requesting transition to approval-gated workflow stages.
            </CardDescription>
          </div>
          <Badge variant="amber">{pendingApprovals.length} Waiting</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((app) => (
              <div
                key={app.id}
                className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-indigo-400 font-semibold">{app.workflow}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{app.timeAgo}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">{app.taskTitle}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    Requested by <span className="text-slate-200 font-medium">{app.requester}</span> to move to stage:
                    <Badge variant="amber" className="text-[11px] px-2">
                      {app.requestedStage}
                    </Badge>
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Button variant="success" size="sm">
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                  <Button variant="danger" size="sm">
                    <X className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Workload Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Workload & Capacity Distribution</CardTitle>
            <CardDescription>Active, completed, and blocked tasks per team member.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamWorkloadData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} fontSize={12} />
                  <YAxis stroke="#94a3b8" tickLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                  <Bar dataKey="active" name="Active Tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="blocked" name="Blocked" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Issue Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Blocker Severity</CardTitle>
            <CardDescription>Open issues breakdown by urgency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueSeverityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {issueSeverityData.map((entry, index) => (
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

      {/* Open Issues & Blockers Table */}
      <Card className="border-rose-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" /> Active Task Blockers & Reported Issues
          </CardTitle>
          <CardDescription>
            Traceability log of issues preventing workflow stage completion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {openIssues.map((iss) => (
              <div key={iss.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={iss.priority === 'CRITICAL' ? 'rose' : 'amber'}>
                      {iss.priority}
                    </Badge>
                    <span className="text-xs text-slate-400">Reported by {iss.reportedBy} ({iss.reportedAt})</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">{iss.taskTitle}</h4>
                  <p className="text-xs text-slate-400">{iss.description}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 border-rose-500/40 text-rose-300 hover:bg-rose-500/10">
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
