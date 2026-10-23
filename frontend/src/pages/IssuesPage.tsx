import React, { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import { Task, Issue } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

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
        <h2 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
          Issue & Blocker Resolution Center
        </h2>
        <p className="text-xs text-muted-foreground font-sans mt-0.5">
          Process traceability center for unblocking active task issues.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-5 h-5" /> Active Task Blockers ({blockedTasks.length})
          </CardTitle>
          <CardDescription className="font-sans">
            Tasks currently flagged as BLOCKED requiring manager or technical resolution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground flex items-center justify-center space-x-2 font-sratome text-xs">
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading reported task blockers...</span>
            </div>
          ) : blockedTasks.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-sratome font-bold uppercase tracking-wider text-foreground text-sm">No Active Task Blockers!</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">All organizational workflows are operating smoothly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-background border border-border p-4 rounded-md space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div>
                      <span className="font-sratome text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{task.workflow?.name}</span>
                      <h4 className="font-sratome font-bold uppercase tracking-wider text-foreground text-xs sm:text-sm mt-0.5">{task.title}</h4>
                    </div>
                    <Badge variant="rose">TASK BLOCKED</Badge>
                  </div>

                  {/* Issues */}
                  <div className="space-y-2">
                    {task.issues?.map((iss: Issue) => (
                      <div key={iss.id} className="bg-card border border-rose-500/20 p-3 rounded-md space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sratome font-bold uppercase tracking-wider text-foreground text-[11px] flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> {iss.title}
                          </span>
                          <Badge variant={iss.priority === 'CRITICAL' ? 'rose' : 'amber'}>{iss.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-sans">{iss.description}</p>

                        {resolvingIssue?.issueId === iss.id ? (
                          <div className="space-y-2 bg-background p-3 rounded-md border border-border pt-3">
                            <input
                              type="text"
                              placeholder="Enter resolution notes..."
                              value={resolutionText}
                              onChange={(e) => setResolutionText(e.target.value)}
                              className="w-full bg-card border border-border rounded px-3 py-1.5 font-sratome text-xs text-foreground"
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
