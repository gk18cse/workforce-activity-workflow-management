import React, { useState, useEffect } from 'react';
import { Task, WorkflowStage, IssuePriority } from '../../types';
import { taskApi } from '../../services/api';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ActivityTimeline } from './ActivityTimeline';
import { 
  X, 
  FileText, 
  Upload, 
  History, 
  AlertTriangle, 
  Paperclip
} from 'lucide-react';

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  isOpen,
  onClose,
  onTaskUpdated,
}) => {
  const { showSuccess, showError } = useToast();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'report_issue' | 'attachments'>('details');

  // Issue Form State
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [issuePriority, setIssuePriority] = useState<IssuePriority>('HIGH');

  // Issue Resolution State
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  const [resolutionDetails, setResolutionDetails] = useState('');

  // Stage Transition Remarks
  const [stageRemarks, setStageRemarks] = useState('');

  // Attachment upload state
  const [attachedFiles, setAttachedFiles] = useState<string[]>(['architecture_spec_v1.pdf']);
  const [uploading, setUploading] = useState(false);

  const fetchTaskDetails = async (id: string) => {
    setLoading(true);
    try {
      const data = await taskApi.getTaskById(id);
      setTask(data.task);
    } catch (err: any) {
      showError('Failed to load task details', err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId && isOpen) {
      fetchTaskDetails(taskId);
      setActiveTab('details');
    }
  }, [taskId, isOpen]);

  if (!isOpen || !taskId) return null;

  const handleStageTransition = async (stageId: string) => {
    if (!task) return;
    try {
      const res = await taskApi.updateTask(task.id, {
        currentStageId: stageId,
        remarks: stageRemarks || undefined,
      });

      if (res.requiresApproval) {
        showSuccess('Approval Request Submitted', res.message);
      } else {
        showSuccess('Stage Updated', 'Task stage successfully updated.');
      }

      setStageRemarks('');
      fetchTaskDetails(task.id);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err: any) {
      showError('Stage Update Failed', err?.response?.data?.message || 'Could not update stage');
    }
  };

  const handleReportIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !issueTitle || !issueDescription) return;

    try {
      await taskApi.reportIssue(task.id, {
        title: issueTitle,
        description: issueDescription,
        priority: issuePriority,
      });

      showSuccess('Issue Reported', 'Task marked as BLOCKED and issue logged.');
      setIssueTitle('');
      setIssueDescription('');
      setActiveTab('details');
      fetchTaskDetails(task.id);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err: any) {
      showError('Failed to report issue', err?.response?.data?.message);
    }
  };

  const handleResolveIssueSubmit = async (issueId: string) => {
    if (!task || !resolutionDetails) return;

    try {
      await taskApi.resolveIssue(task.id, issueId, {
        resolutionDetails,
      });

      showSuccess('Issue Resolved', 'Task unblocked and status restored.');
      setResolvingIssueId(null);
      setResolutionDetails('');
      fetchTaskDetails(task.id);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err: any) {
      showError('Failed to resolve issue', err?.response?.data?.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      setTimeout(() => {
        setAttachedFiles((prev) => [...prev, files[0].name]);
        setUploading(false);
        showSuccess('File Uploaded', `${files[0].name} attached to task.`);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-border flex items-start justify-between bg-background/40">
          {loading ? (
            <div className="h-6 w-48 bg-secondary animate-pulse rounded" />
          ) : (
            <div className="space-y-1 pr-6">
              <div className="flex items-center space-x-2">
                <Badge variant={task?.priority === 'URGENT' || task?.priority === 'HIGH' ? 'amber' : 'brand'}>
                  {task?.priority} PRIORITY
                </Badge>
                <span className="text-xs text-muted-foreground font-semibold">{task?.workflow?.name}</span>
                <span className="text-muted-foreground">•</span>
                <Badge variant={task?.status === 'BLOCKED' ? 'rose' : task?.status === 'COMPLETED' ? 'emerald' : 'brand'}>
                  {task?.status}
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">{task?.title}</h3>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-border bg-background/60 px-6 text-xs font-semibold text-muted-foreground">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-primary text-foreground font-bold'
                : 'border-transparent hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" /> Operational Execution
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-primary text-foreground font-bold'
                : 'border-transparent hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4" /> Audit History ({task?.activityLogs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('report_issue')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'report_issue'
                ? 'border-rose-500 text-rose-500 font-bold'
                : 'border-transparent hover:text-foreground'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Report Blocker ({task?.issues?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'attachments'
                ? 'border-primary text-foreground font-bold'
                : 'border-transparent hover:text-foreground'
            }`}
          >
            <Paperclip className="w-4 h-4" /> Documents ({attachedFiles.length})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground flex items-center justify-center space-x-2 text-xs">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Fetching operational activity telemetry...</span>
            </div>
          ) : activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Task Instructions & Description</h4>
                <div className="bg-background p-4 rounded-lg border border-border text-xs text-foreground leading-relaxed">
                  {task?.description || 'No detailed instructions provided for this task.'}
                </div>
              </div>

              {/* Dynamic Workflow Stage Stepper */}
              <div className="space-y-3">
                <h4 className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Workflow Progression Pipeline</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {task?.workflow?.stages?.map((stage: WorkflowStage) => {
                    const isCurrent = task.currentStageId === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleStageTransition(stage.id)}
                        disabled={isCurrent}
                        className={`p-3 rounded-lg border text-left transition-all relative ${
                          isCurrent
                            ? 'bg-secondary border-primary text-foreground ring-1 ring-primary'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Stage #{stage.orderIndex}</span>
                          {stage.requiresApproval && (
                            <Badge variant="amber" className="text-[9px] px-1 py-0">Approval Req.</Badge>
                          )}
                        </div>
                        <p className="font-bold text-xs truncate">{stage.name}</p>
                        {isCurrent && (
                          <span className="text-[10px] text-foreground font-semibold block mt-1">● Current Stage</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metadata Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Assignee</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {task?.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Creator</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {task?.creator ? `${task.creator.firstName} ${task.creator.lastName}` : 'System'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Due Date</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                  </span>
                </div>
              </div>

              {/* Active Issues section if blocked */}
              {task?.issues && task.issues.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-[11px] uppercase font-bold text-rose-500 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Reported Blockers ({task.issues.length})
                  </h4>
                  <div className="space-y-3">
                    {task.issues.map((iss) => (
                      <div key={iss.id} className="bg-background border border-rose-500/30 p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-foreground text-xs">{iss.title}</h5>
                          <Badge variant={iss.status === 'RESOLVED' ? 'emerald' : 'rose'}>{iss.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{iss.description}</p>

                        {iss.status === 'OPEN' && (
                          <div className="pt-2">
                            {resolvingIssueId === iss.id ? (
                              <div className="space-y-2 bg-card p-3 rounded border border-border">
                                <input
                                  type="text"
                                  placeholder="Enter resolution details..."
                                  value={resolutionDetails}
                                  onChange={(e) => setResolutionDetails(e.target.value)}
                                  className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                                />
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="success" onClick={() => handleResolveIssueSubmit(iss.id)}>
                                    Submit Resolution
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setResolvingIssueId(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => setResolvingIssueId(iss.id)}>
                                Resolve Blocker →
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'timeline' ? (
            <ActivityTimeline logs={task?.activityLogs || []} />
          ) : activeTab === 'report_issue' ? (
            <form onSubmit={handleReportIssueSubmit} className="space-y-4 max-w-lg mx-auto py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Blocker Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Missing API credentials or database server timeout"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Issue Description *</label>
                <textarea
                  rows={4}
                  placeholder="Describe the exact error or bottleneck blocking execution..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Urgency Level</label>
                <select
                  value={issuePriority}
                  onChange={(e) => setIssuePriority(e.target.value as IssuePriority)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <Button type="submit" variant="danger" className="w-full mt-2">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Flag Task as BLOCKED & Log Issue
              </Button>
            </form>
          ) : (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="p-6 border border-dashed border-border rounded-xl text-center bg-background">
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-bold text-foreground text-xs">Upload Deliverable / Attachments</h4>
                <p className="text-[11px] text-muted-foreground mt-1 mb-4">Attach specifications, reports, or proof of execution.</p>
                <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-primary hover:opacity-90 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border">
                  {uploading ? 'Uploading File...' : 'Select Local File'}
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="space-y-2">
                <h5 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Attached Documents</h5>
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg text-xs">
                    <span className="font-mono text-foreground flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-muted-foreground" /> {file}
                    </span>
                    <Badge variant="emerald">Uploaded</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
