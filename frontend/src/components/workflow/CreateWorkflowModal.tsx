import React, { useState } from 'react';
import { workflowApi } from '../../services/api';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, GitBranch, Plus, Trash2 } from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowCreated: () => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
  onWorkflowCreated,
}) => {
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [stages, setStages] = useState<Array<{ name: string; color: string; requiresApproval: boolean }>>([
    { name: 'Backlog / Initiated', color: '#64748B', requiresApproval: false },
    { name: 'In Execution', color: '#3B82F6', requiresApproval: false },
    { name: 'Manager Review', color: '#F59E0B', requiresApproval: true },
    { name: 'Completed', color: '#10B981', requiresApproval: false },
  ]);

  if (!isOpen) return null;

  const addStage = () => {
    setStages((prev) => [
      ...prev,
      { name: `New Stage ${prev.length + 1}`, color: '#3B82F6', requiresApproval: false },
    ]);
  };

  const removeStage = (index: number) => {
    if (stages.length <= 2) {
      showError('Workflows require at least 2 stages');
      return;
    }
    setStages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, key: string, value: any) => {
    setStages((prev) =>
      prev.map((stage, i) => (i === index ? { ...stage, [key]: value } : stage))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showError('Workflow name is required');
      return;
    }

    setLoading(true);
    try {
      await workflowApi.createWorkflow({
        name,
        description,
        stages: stages.map((s, idx) => ({
          name: s.name,
          orderIndex: idx + 1,
          color: s.color,
          requiresApproval: s.requiresApproval,
        })),
      });

      showSuccess('Workflow Created', `Workflow "${name}" created with ${stages.length} stages.`);
      setName('');
      setDescription('');
      onWorkflowCreated();
      onClose();
    } catch (err: any) {
      showError('Failed to create workflow', err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" /> Configure Dynamic Workflow Engine
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Workflow Name *</label>
            <input
              type="text"
              placeholder="e.g. Legal Compliance & Audit Pipeline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Description</label>
            <textarea
              rows={2}
              placeholder="Describe the operational process purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none"
            />
          </div>

          {/* Stages Configuration Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Workflow Progression Stages ({stages.length})
              </label>
              <button
                type="button"
                onClick={addStage}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stage
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {stages.map((stage, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 w-6 text-center">#{idx + 1}</span>
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => updateStage(idx, 'name', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100"
                    placeholder="Stage Name"
                    required
                  />
                  <input
                    type="color"
                    value={stage.color}
                    onChange={(e) => updateStage(idx, 'color', e.target.value)}
                    className="w-7 h-7 bg-transparent cursor-pointer rounded overflow-hidden"
                  />
                  <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stage.requiresApproval}
                      onChange={(e) => updateStage(idx, 'requiresApproval', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    Approval
                  </label>
                  <button
                    type="button"
                    onClick={() => removeStage(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Save Workflow'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
