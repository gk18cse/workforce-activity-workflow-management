import React from 'react';
import { TaskActivityLog } from '../../types';
import { Badge } from '../ui/Badge';
import { 
  CheckCircle2, 
  ArrowRight, 
  GitCommit, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquare,
  Clock
} from 'lucide-react';

interface ActivityTimelineProps {
  logs: TaskActivityLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground text-xs">
        No activity logs recorded yet for this task.
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TASK_CREATED':
        return <GitCommit className="w-3.5 h-3.5 text-muted-foreground" />;
      case 'STAGE_TRANSITION':
        return <ArrowRight className="w-3.5 h-3.5 text-foreground" />;
      case 'STATUS_CHANGE':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'ISSUE_REPORTED':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      case 'ISSUE_RESOLVED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'APPROVAL_REQUESTED':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'APPROVAL_ACTIONED':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getActionBadgeVariant = (action: string): 'brand' | 'emerald' | 'amber' | 'rose' | 'purple' | 'sky' => {
    switch (action) {
      case 'TASK_CREATED':
        return 'brand';
      case 'STAGE_TRANSITION':
        return 'sky';
      case 'STATUS_CHANGE':
        return 'emerald';
      case 'ISSUE_REPORTED':
        return 'rose';
      case 'ISSUE_RESOLVED':
        return 'emerald';
      case 'APPROVAL_REQUESTED':
        return 'amber';
      case 'APPROVAL_ACTIONED':
        return 'purple';
      default:
        return 'brand';
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-border">
      {logs.map((log) => {
        let prevObj: any = null;
        let newObj: any = null;

        try {
          if (log.previousState) prevObj = JSON.parse(log.previousState);
          if (log.newState) newObj = JSON.parse(log.newState);
        } catch (e) {
          // Plain strings
        }

        return (
          <div key={log.id} className="relative pl-8 space-y-1.5">
            {/* Minimal Node Dot */}
            <div className="absolute left-1.5 top-0.5 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center -translate-x-1/2 z-10">
              {getActionIcon(log.action)}
            </div>

            {/* Header: Actor, Role, Action & Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-foreground">
                  {log.actor?.firstName} {log.actor?.lastName}
                </span>
                <Badge variant={log.actor?.roleEnum === 'ADMIN' ? 'brand' : log.actor?.roleEnum === 'MANAGER' ? 'amber' : 'emerald'} className="text-[9px] px-1.5 py-0">
                  {log.actor?.roleEnum}
                </Badge>
                <Badge variant={getActionBadgeVariant(log.action)} className="text-[10px]">
                  {log.action.replace('_', ' ')}
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {formatTimestamp(log.createdAt)}
              </span>
            </div>

            {/* Remarks */}
            {log.remarks && (
              <p className="text-xs text-foreground bg-background p-2.5 rounded-lg border border-border font-mono">
                {log.remarks}
              </p>
            )}

            {/* Subtle State Diffs Box */}
            {(prevObj || newObj) && (
              <div className="text-[11px] bg-background/80 p-2.5 rounded-lg border border-border/60 space-y-1 text-muted-foreground font-mono">
                {prevObj && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground uppercase font-semibold text-[9px]">Previous:</span>
                    <span className="text-rose-500">{typeof prevObj === 'object' ? JSON.stringify(prevObj) : prevObj}</span>
                  </div>
                )}
                {newObj && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground uppercase font-semibold text-[9px]">Updated:</span>
                    <span className="text-emerald-500">{typeof newObj === 'object' ? JSON.stringify(newObj) : newObj}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
