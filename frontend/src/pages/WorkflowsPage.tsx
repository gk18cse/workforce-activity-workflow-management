import React, { useState, useEffect } from 'react';
import { workflowApi } from '../services/api';
import { Workflow } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CreateWorkflowModal } from '../components/workflow/CreateWorkflowModal';
import { GitBranch, Plus, Layers, Shield, CheckCircle2 } from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await workflowApi.getWorkflows();
      setWorkflows(res.workflows || []);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Dynamic Workflow Engine</h2>
          <p className="text-sm text-slate-400">Configure organizational process stages and approval gatekeeping rules.</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create New Workflow
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Fetching dynamic workflow engines...</span>
        </div>
      ) : workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            <GitBranch className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-200 text-lg">No Workflows Configured</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Create your organization's first dynamic process workflow to start tracking operations.
            </p>
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflows.map((wf) => (
            <Card key={wf.id} className="hover:border-indigo-500/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={wf.isActive ? 'emerald' : 'slate'}>
                    {wf.isActive ? 'ACTIVE ENGINE' : 'INACTIVE'}
                  </Badge>
                  <span className="text-xs text-slate-500 font-semibold">{wf.department?.name || 'Organization Wide'}</span>
                </div>
                <CardTitle className="text-lg flex items-center gap-2 mt-2">
                  <GitBranch className="w-5 h-5 text-indigo-400" />
                  {wf.name}
                </CardTitle>
                <CardDescription>{wf.description || 'Configured dynamic process workflow.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Sequential Progression Stages ({wf.stages?.length || 0})
                  </span>
                  <div className="space-y-1.5">
                    {wf.stages?.map((stage) => (
                      <div
                        key={stage.id}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          <span className="font-bold text-slate-200">
                            #{stage.orderIndex} {stage.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {stage.requiresApproval && (
                            <Badge variant="amber" className="text-[10px]">
                              <Shield className="w-3 h-3 mr-0.5" /> Approval Gate
                            </Badge>
                          )}
                          {stage.isInitial && <Badge variant="sky" className="text-[10px]">Initial</Badge>}
                          {stage.isFinal && <Badge variant="emerald" className="text-[10px]">Final</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Tasks Tracked: <strong className="text-slate-200">{wf._count?.tasks || 0}</strong></span>
                  <span className="text-indigo-400 font-semibold">Configured Engine ✓</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onWorkflowCreated={fetchWorkflows}
      />
    </div>
  );
};
