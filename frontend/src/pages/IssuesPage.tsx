import React, { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import { Task, Issue } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';

export const IssuesPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [blockedTasks, setBlockedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [resolvingIssue, setResolvingIssue] = useState<{ taskId: string; issueId: string } | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const fetchBlockedTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getTasks({ status: 'BLOCKED' });
      setBlockedTasks(res.tasks || []);
    } catch (err) {
      console.error('Failed to fetch blocked tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedTasks();
  }, []);

  const handleResolveSubmit = async (taskId: string, issueId: string) => {
    if (!resolutionText) {
      showError('Please provide resolution details');
      return;
    }

    try {
      await taskApi.resolveIssue(taskId, issueId, {
        resolutionDetails: resolutionText,
      });

      showSuccess('Issue Resolved', 'Blocker cleared and task status unblocked.');
      setResolvingIssue(null);
      setResolutionText('');
      fetchBlockedTasks();
    } catch (err: any) {
      showError('Failed to resolve issue', err?.response?.data?.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Issue & Blocker Resolution Center</h2>
        <p className="text-sm text-slate-400">Process traceability center for unblocking active task issues.</p>
      </div>

      <Card className="border-rose-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" /> Active Task Blockers ({blockedTasks.length})
          </CardTitle>
          <CardDescription>
            Tasks currently flagged as BLOCKED requiring manager or technical resolution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-400 flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading reported task blockers...</span>
            </div>
          ) : blockedTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-200 text-lg">No Active Task Blockers!</h3>
              <p className="text-xs text-slate-500 mt-1">All organizational workflows are operating smoothly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                    <div>
                      <span className="text-xs text-indigo-400 font-semibold">{task.workflow?.name}</span>
                      <h4 className="text-base font-bold text-slate-100 mt-0.5">{task.title}</h4>
                    </div>
                    <Badge variant="rose">TASK BLOCKED</Badge>
                  </div>

                  {/* Issues */}
                  <div className="space-y-2">
                    {task.issues?.map((iss: Issue) => (
                      <div key={iss.id} className="bg-rose-950/20 border border-rose-500/20 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> {iss.title}
                          </span>
                          <Badge variant={iss.priority === 'CRITICAL' ? 'rose' : 'amber'}>{iss.priority}</Badge>
                        </div>
                        <p className="text-xs text-slate-300">{iss.description}</p>

                        {resolvingIssue?.issueId === iss.id ? (
                          <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-800 pt-3">
                            <input
                              type="text"
                              placeholder="Enter resolution notes..."
                              value={resolutionText}
                              onChange={(e) => setResolutionText(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100"
                            />
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="success" onClick={() => handleResolveSubmit(task.id, iss.id)}>
                                Confirm Resolution
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setResolvingIssue(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                            onClick={() => setResolvingIssue({ taskId: task.id, issueId: iss.id })}
                          >
                            Resolve Blocker →
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
