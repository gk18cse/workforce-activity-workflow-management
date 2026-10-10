import React, { useState, useEffect } from 'react';
import { workflowApi } from '../services/api';
import { Workflow } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CreateWorkflowModal } from '../components/workflow/CreateWorkflowModal';
import { GitBranch, Plus, Shield } from 'lucide-react';

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
          <h2 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
            Dynamic Workflow Engine
          </h2>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Configure organizational process stages and approval gatekeeping rules.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Workflow
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground flex items-center justify-center space-x-2 font-sratome text-xs">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Fetching dynamic workflow engines...</span>
        </div>
      ) : workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-sratome font-bold uppercase tracking-wider text-foreground text-sm">No Workflows Configured</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4 font-sans">
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
            <Card key={wf.id} className="hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={wf.isActive ? 'emerald' : 'slate'}>
                    {wf.isActive ? 'ACTIVE ENGINE' : 'INACTIVE'}
                  </Badge>
                  <span className="font-sratome text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{wf.department?.name || 'Organization Wide'}</span>
                </div>
                <CardTitle className="text-sm flex items-center gap-2 mt-2">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  {wf.name}
                </CardTitle>
                <CardDescription className="font-sans">{wf.description || 'Configured dynamic process workflow.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="font-sratome text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Sequential Progression Stages ({wf.stages?.length || 0})
                  </span>
                  <div className="space-y-1.5">
                    {wf.stages?.map((stage) => (
                      <div
                        key={stage.id}
                        className="bg-background p-2.5 rounded-md border border-border flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-xs bg-primary" />
                          <span className="font-sratome font-semibold uppercase tracking-wider text-[11px] text-foreground">
                            #{stage.orderIndex} {stage.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {stage.requiresApproval && (
                            <Badge variant="amber" className="text-[9px]">
                              <Shield className="w-3 h-3 mr-0.5" /> Approval Gate
                            </Badge>
                          )}
                          {stage.isInitial && <Badge variant="brand" className="text-[9px]">Initial</Badge>}
                          {stage.isFinal && <Badge variant="emerald" className="text-[9px]">Final</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-sans">Tasks Tracked: <strong className="font-sratome text-foreground">{wf._count?.tasks || 0}</strong></span>
                  <span className="font-sratome text-[10px] uppercase tracking-wider text-foreground font-semibold">Configured Engine ✓</span>
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
