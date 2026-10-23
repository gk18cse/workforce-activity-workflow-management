import React, { useState, useEffect } from 'react';
import { workflowApi, userApi, taskApi } from '../../services/api';
import { Workflow, User, TaskPriority } from '../../types';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { X, CheckSquare } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const { showSuccess, showError } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [wfRes, userRes] = await Promise.all([
            workflowApi.getWorkflows(),
            userApi.getUsers(),
          ]);
          setWorkflows(wfRes.workflows || []);
          setUsers(userRes.users || []);
          if (wfRes.workflows?.length > 0) {
            setWorkflowId(wfRes.workflows[0].id);
          }
        } catch (err) {
          console.error('Failed to load initial form dropdowns:', err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !workflowId) {
      showError('Title and Workflow are required');
      return;
    }

    setLoading(true);
    try {
      await taskApi.createTask({
        title,
        description,
        workflowId,
        assigneeId: assigneeId || undefined,
        priority,
        dueDate: dueDate || undefined,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      });

      showSuccess('Task Created', `Task "${title}" created successfully.`);
      setTitle('');
      setDescription('');
      onTaskCreated();
      onClose();
    } catch (err: any) {
      showError('Failed to create task', err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-800 border border-brand-700 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="p-5 border-b border-brand-700 flex items-center justify-between bg-brand-900/40">
          <h3 className="text-base font-bold text-brand-100 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-brand-300" /> Create New Process Task
          </h3>
          <button onClick={onClose} className="text-brand-300 hover:text-brand-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-brand-300">Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Conduct Security Penetration Test"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3.5 py-2 text-xs text-brand-100 focus:outline-none focus:border-brand-600"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-brand-300">Workflow Pipeline *</label>
            <select
              value={workflowId}
              onChange={(e) => setWorkflowId(e.target.value)}
              className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3 py-2 text-xs text-brand-100 focus:outline-none focus:border-brand-600"
              required
            >
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name} ({wf.department?.name || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-brand-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3 py-2 text-xs text-brand-100 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-brand-300">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3 py-2 text-xs text-brand-100 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.roleEnum})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-brand-300">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3 py-2 text-xs text-brand-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-brand-300">Estimated Hours</label>
              <input
                type="number"
                placeholder="e.g. 8"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3 py-2 text-xs text-brand-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-brand-300">Task Instructions</label>
            <textarea
              rows={3}
              placeholder="Provide clear steps for execution..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-brand-900 border border-brand-700 rounded-lg px-3.5 py-2 text-xs text-brand-100 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
