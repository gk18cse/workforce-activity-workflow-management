import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  CheckCheck, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Task Approved', desc: 'Design System Tokens review was approved by Alex Vance with remarks: "Outstanding WCAG compliance."', time: '10 minutes ago', unread: true, type: 'success', link: '/tasks' },
    { id: '2', title: 'New Issue Reported', desc: 'API rate limiter blocking bulk sync reported by David Miller on the Modernization pipeline.', time: '45 minutes ago', unread: true, type: 'warning', link: '/issues' },
    { id: '3', title: 'Workflow Stage Advanced', desc: 'Q4 Product Launch moved from "In Progress" to "In Review" stage by Maya Lin.', time: '2 hours ago', unread: true, type: 'info', link: '/workflows' },
    { id: '4', title: 'Approaching Deadline', desc: 'Quarterly compliance audit due tomorrow at 5:00 PM for the Operations department.', time: '5 hours ago', unread: true, type: 'urgent', link: '/calendar' },
    { id: '5', title: 'Team Assignment', desc: 'You were assigned as reviewer on Automated CI/CD Test Pipeline by Marcus Chen.', time: '1 day ago', unread: false, type: 'info', link: '/tasks' },
    { id: '6', title: 'Security Key Rotation Complete', desc: 'SHA-256 HMAC cryptographic signing keys successfully rotated across production.', time: '2 days ago', unread: false, type: 'success', link: '/activity' },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'urgent') return n.type === 'urgent' || n.type === 'warning';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Stay informed on operational triggers, stage approvals, task assignments, and system alerts.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 text-xs">
          {[
            { id: 'all', label: 'All Notifications' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'urgent', label: 'Urgent & Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-semibold">No notifications match this filter.</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  n.unread
                    ? 'bg-primary/5 border-primary/30 shadow-neu-sm'
                    : 'bg-background border-border/70 hover:border-border'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-primary shrink-0 shadow-neu-sm mt-0.5">
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {n.type === 'urgent' && <Clock className="w-4 h-4 text-rose-600" />}
                    {n.type === 'info' && <Bell className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{n.title}</h4>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                      <span className="text-[10px] text-muted-foreground font-medium">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.desc}</p>
                    {n.link && (
                      <button
                        onClick={() => navigate(n.link)}
                        className="text-[11px] font-bold text-primary hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        Inspect Resource <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

    </div>
  );
};
