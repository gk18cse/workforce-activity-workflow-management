import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  GitBranch, 
  Clock, 
  AlertTriangle,
  User,
  MessageSquare,
  Plus,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { initialActivities, ActivityEvent } from '../services/mockData';

export const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [newLog, setNewLog] = useState({
    action: 'updated task progress',
    target: 'WorkFlow Pro 2.0 Modernization',
    type: 'task_started' as const,
    details: 'Completed code review and deployed to staging.',
  });

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || act.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ActivityEvent = {
      id: `act-${Date.now()}`,
      actor: { name: 'Sarah Connor', avatar: 'SC', role: 'ADMIN' },
      action: newLog.action,
      target: newLog.target,
      type: newLog.type,
      timestamp: 'Just now',
      details: newLog.details,
    };
    setActivities([created, ...activities]);
    setIsLogModalOpen(false);
  };

  const getActionBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'workflow_approved':
        return <Badge variant="success">Approved</Badge>;
      case 'workflow_rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'task_completed':
        return <Badge variant="emerald">Completed</Badge>;
      case 'task_started':
        return <Badge variant="teal">In Progress</Badge>;
      case 'task_assigned':
        return <Badge variant="brand">Assigned</Badge>;
      case 'comment_added':
        return <Badge variant="indigo">Comment</Badge>;
      default:
        return <Badge variant="slate">Updated</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
              Activity Tracking & Audit Trail
            </h1>
            <Badge variant="teal" className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Immutable Log
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Chronological log of operational activities, task assignments, stage approvals, and state modifications.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsLogModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Log Activity Event</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by actor, target task, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-neu-inset"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'workflow_approved', label: 'Approvals' },
              { id: 'task_started', label: 'In Progress' },
              { id: 'task_completed', label: 'Completed' },
              { id: 'task_assigned', label: 'Assignments' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedType === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-background text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Chronological Timeline */}
      <Card className="p-6">
        <div className="relative border-l-2 border-border/80 ml-4 pl-6 space-y-6">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-card border-2 border-primary shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              {/* Event Card */}
              <div className="p-4 bg-background border border-border/80 rounded-2xl shadow-neu-sm hover:shadow-neu hover:border-primary/50 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-primary text-xs shadow-neu-sm">
                      {act.actor.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-foreground">
                        {act.actor.name}{' '}
                        <span className="font-normal text-muted-foreground">{act.action}</span>{' '}
                        <span className="font-bold text-primary">{act.target}</span>
                      </p>
                      <span className="text-[10px] text-muted-foreground">{act.timestamp}</span>
                    </div>
                  </div>
                  {getActionBadge(act.type)}
                </div>

                {act.details && (
                  <p className="text-xs text-muted-foreground bg-card/60 p-2.5 rounded-xl border border-border/50">
                    {act.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Log Activity Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Record Activity Log Event</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleLogSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Target Task / Project</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WorkFlow Pro 2.0 Modernization"
                  value={newLog.target}
                  onChange={(e) => setNewLog({ ...newLog, target: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Action</label>
                  <input
                    type="text"
                    value={newLog.action}
                    onChange={(e) => setNewLog({ ...newLog, action: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Activity Type</label>
                  <select
                    value={newLog.type}
                    onChange={(e) => setNewLog({ ...newLog, type: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  >
                    <option value="task_started">Task Started</option>
                    <option value="task_completed">Task Completed</option>
                    <option value="workflow_approved">Workflow Approved</option>
                    <option value="workflow_rejected">Workflow Rejected</option>
                    <option value="comment_added">Comment Added</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Details & Remarks</label>
                <textarea
                  rows={3}
                  value={newLog.details}
                  onChange={(e) => setNewLog({ ...newLog, details: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsLogModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Commit to Audit Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
