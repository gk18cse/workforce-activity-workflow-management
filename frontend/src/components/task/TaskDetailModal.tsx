import React, { useState, useEffect } from 'react';
import { Task, WorkflowStage, TaskStatus, TaskPriority, IssuePriority } from '../../types';
import { taskApi } from '../../services/api';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ActivityTimeline } from './ActivityTimeline';
import { 
  X, 
  Clock, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Upload, 
  History, 
  User, 
  Check, 
  GitBranch,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          {loading ? (
            <div className="h-6 w-48 bg-slate-800 animate-pulse rounded" />
          ) : (
            <div className="space-y-1 pr-6">
              <div className="flex items-center space-x-2">
                <Badge variant={task?.priority === 'URGENT' || task?.priority === 'HIGH' ? 'amber' : 'indigo'}>
                  {task?.priority} PRIORITY
                </Badge>
                <span className="text-xs text-indigo-400 font-semibold">{task?.workflow?.name}</span>
                <span className="text-slate-600">•</span>
                <Badge variant={task?.status === 'BLOCKED' ? 'rose' : task?.status === 'COMPLETED' ? 'emerald' : 'indigo'}>
                  {task?.status}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">{task?.title}</h3>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Operational Execution
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" /> Audit History ({task?.activityLogs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('report_issue')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'report_issue'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Report Blocker ({task?.issues?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'attachments'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Paperclip className="w-4 h-4" /> Documents ({attachedFiles.length})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Fetching operational activity telemetry...</span>
            </div>
          ) : activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Task Instructions & Description</h4>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
                  {task?.description || 'No detailed instructions provided for this task.'}
                </div>
              </div>

              {/* Dynamic Workflow Stage Stepper */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Workflow Progression Pipeline</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {task?.workflow?.stages?.map((stage: WorkflowStage) => {
                    const isCurrent = task.currentStageId === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleStageTransition(stage.id)}
                        disabled={isCurrent}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isCurrent
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Stage #{stage.orderIndex}</span>
                          {stage.requiresApproval && (
                            <Badge variant="amber" className="text-[9px] px-1">Approval Req.</Badge>
                          )}
                        </div>
                        <p className="font-bold text-xs truncate">{stage.name}</p>
                        {isCurrent && (
                          <span className="text-[10px] text-indigo-400 font-semibold block mt-1">● Current Stage</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metadata Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Assignee</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {task?.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Creator</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {task?.creator ? `${task.creator.firstName} ${task.creator.lastName}` : 'System'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Due Date</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                  </span>
                </div>
              </div>

              {/* Active Issues section if blocked */}
              {task?.issues && task.issues.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Reported Blockers ({task.issues.length})
                  </h4>
                  <div className="space-y-3">
                    {task.issues.map((iss) => (
                      <div key={iss.id} className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-100 text-sm">{iss.title}</h5>
                          <Badge variant={iss.status === 'RESOLVED' ? 'emerald' : 'rose'}>{iss.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-300">{iss.description}</p>

                        {iss.status === 'OPEN' && (
                          <div className="pt-2">
                            {resolvingIssueId === iss.id ? (
                              <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                <input
                                  type="text"
                                  placeholder="Enter resolution details..."
                                  value={resolutionDetails}
                                  onChange={(e) => setResolutionDetails(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100"
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
            <form onSubmit={handleReportIssueSubmit} className="space-y-4 max-w-lg mx-auto py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Blocker Title</label>
                <input
                  type="text"
                  placeholder="e.g. Missing API credentials or database server timeout"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Issue Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the exact error or bottleneck blocking execution..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Urgency Level</label>
                <select
                  value={issuePriority}
                  onChange={(e) => setIssuePriority(e.target.value as IssuePriority)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <Button type="submit" variant="danger" className="w-full">
                <AlertTriangle className="w-4 h-4 mr-1" /> Flag Task as BLOCKED & Log Issue
              </Button>
            </form>
          ) : (
            <div className="space-y-4 max-w-lg mx-auto py-4">
              <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-slate-950/40">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-200 text-sm">Upload Deliverable / Attachments</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Attach specifications, reports, or proof of execution.</p>
                <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors">
                  {uploading ? 'Uploading File...' : 'Select Local File'}
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-400">Attached Documents</h5>
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                    <span className="font-mono text-slate-200 flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-400" /> {file}
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
