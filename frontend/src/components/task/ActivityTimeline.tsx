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
  Clock,
  UserCheck
} from 'lucide-react';

interface ActivityTimelineProps {
  logs: TaskActivityLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        No activity logs recorded yet for this task.
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TASK_CREATED':
        return <GitCommit className="w-4 h-4 text-indigo-400" />;
      case 'STAGE_TRANSITION':
        return <ArrowRight className="w-4 h-4 text-blue-400" />;
      case 'STATUS_CHANGE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'ISSUE_REPORTED':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'ISSUE_RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'APPROVAL_REQUESTED':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'APPROVAL_ACTIONED':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActionBadgeVariant = (action: string): 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'sky' => {
    switch (action) {
      case 'TASK_CREATED':
        return 'indigo';
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
        return 'indigo';
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
    <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-800">
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
          <div key={log.id} className="relative pl-9 space-y-1">
            {/* Circle Node Icon */}
            <div className="absolute left-1.5 top-0.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center -translate-x-1/2 z-10">
              {getActionIcon(log.action)}
            </div>

            {/* Header: Actor & Action */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-200">
                  {log.actor?.firstName} {log.actor?.lastName}
                </span>
                <Badge variant={log.actor?.roleEnum === 'ADMIN' ? 'indigo' : log.actor?.roleEnum === 'MANAGER' ? 'amber' : 'emerald'} className="text-[10px] px-1.5 py-0">
                  {log.actor?.roleEnum}
                </Badge>
                <Badge variant={getActionBadgeVariant(log.action)} className="text-[10px]">
                  {log.action.replace('_', ' ')}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {formatTimestamp(log.createdAt)}
              </span>
            </div>

            {/* Remarks */}
            {log.remarks && (
              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                {log.remarks}
              </p>
            )}

            {/* State Diffs comparison if available */}
            {(prevObj || newObj) && (
              <div className="text-[11px] bg-slate-950/40 p-2 rounded border border-slate-800/50 space-y-1 text-slate-400">
                {prevObj && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 uppercase font-semibold text-[10px]">From:</span>
                    <span className="text-rose-400/90">{typeof prevObj === 'object' ? JSON.stringify(prevObj) : prevObj}</span>
                  </div>
                )}
                {newObj && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 uppercase font-semibold text-[10px]">To:</span>
                    <span className="text-emerald-400/90">{typeof newObj === 'object' ? JSON.stringify(newObj) : newObj}</span>
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
