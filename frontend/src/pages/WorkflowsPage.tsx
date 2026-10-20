import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  GitBranch, 
  Plus, 
  Kanban, 
  List, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  X
} from 'lucide-react';
import { initialTasks } from '../services/mockData';

interface WorkflowTask {
  id: string;
  title: string;
  stage: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Approved' | 'Completed';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeName: string;
  assigneeAvatar: string;
  dueDate: string;
  project: string;
}

export const WorkflowsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [tasks, setTasks] = useState<WorkflowTask[]>(() => {
    return initialTasks.map((t) => ({
      id: t.id,
      title: t.title,
      stage: t.stage as any,
      priority: t.priority,
      assigneeName: t.assigneeName,
      assigneeAvatar: t.assigneeAvatar,
      dueDate: t.dueDate,
      project: t.project,
    }));
  });

  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [isCreateWorkflowModalOpen, setIsCreateWorkflowModalOpen] = useState(false);
  const [isMoveTaskModalOpen, setIsMoveTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<WorkflowTask | null>(null);

  const stages = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Approved', 'Completed'] as const;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.project.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  // Fast Move Task function
  const moveTaskStage = (taskId: string, newStage: WorkflowTask['stage']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, stage: newStage } : t))
    );
    setIsMoveTaskModalOpen(false);
  };

  const getPriorityBadge = (priority: WorkflowTask['priority']) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">Urgent</Badge>;
      case 'HIGH':
        return <Badge variant="warning">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="brand">Medium</Badge>;
      default:
        return <Badge variant="slate">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
              Workflow Management Board
            </h1>
            <Badge variant="teal">Dynamic Engine</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Visual operational pipeline: move tasks across Backlog, To Do, In Progress, Review, Approval, and Completion.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-background border border-border rounded-xl p-1 shadow-neu-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="primary" onClick={() => setIsCreateWorkflowModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Create Workflow</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workflow tasks by title or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-neu-inset"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground font-semibold">Priority:</span>
            {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedPriority === p
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-background text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {stages.map((stage) => {
            const stageTasks = filteredTasks.filter((t) => t.stage === stage);
            return (
              <div
                key={stage}
                className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-neu-sm space-y-3 min-h-[460px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {stage}
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary text-foreground">
                    {stageTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageTasks.length === 0 ? (
                    <div className="h-28 border-2 border-dashed border-border/60 rounded-xl flex items-center justify-center text-center p-3 text-muted-foreground text-[11px]">
                      Drop or move task here
                    </div>
                  ) : (
                    stageTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 bg-background border border-border/70 rounded-xl shadow-neu-sm hover:shadow-neu hover:border-primary/50 transition-all space-y-2 cursor-pointer"
                        onClick={() => {
                          setActiveTask(t);
                          setIsMoveTaskModalOpen(true);
                        }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          {getPriorityBadge(t.priority)}
                          <span className="text-[10px] text-muted-foreground">{t.dueDate}</span>
                        </div>
                        <h5 className="font-bold text-xs text-foreground leading-snug line-clamp-2">
                          {t.title}
                        </h5>
                        <p className="text-[10px] text-muted-foreground truncate">{t.project}</p>
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-5 h-5 rounded-md bg-secondary flex items-center justify-center font-bold text-[9px] text-primary">
                              {t.assigneeAvatar}
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate">{t.assigneeName}</span>
                          </div>
                          <button
                            title="Move Stage"
                            className="text-[10px] text-primary font-bold hover:underline"
                          >
                            Move →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border/80">
                <tr>
                  <th className="p-4">Task Details</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-bold text-foreground max-w-xs">{t.title}</td>
                    <td className="p-4 text-muted-foreground">{t.project}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-[11px]">
                        {t.stage}
                      </span>
                    </td>
                    <td className="p-4">{getPriorityBadge(t.priority)}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center font-bold text-[10px] text-primary">
                          {t.assigneeAvatar}
                        </div>
                        <span>{t.assigneeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{t.dueDate}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveTask(t);
                          setIsMoveTaskModalOpen(true);
                        }}
                      >
                        Change Stage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Move Task Stage Modal */}
      {isMoveTaskModalOpen && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-neu-raised animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Advance Workflow Stage</h3>
              <button onClick={() => setIsMoveTaskModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{activeTask.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Current Stage: <span className="font-bold text-primary">{activeTask.stage}</span></p>
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-muted-foreground block mb-1">Select Next Target Stage:</span>
              {stages.map((st) => (
                <button
                  key={st}
                  onClick={() => moveTaskStage(activeTask.id, st)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl transition-all font-semibold flex items-center justify-between ${
                    activeTask.stage === st
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-background hover:bg-secondary text-foreground border border-border'
                  }`}
                >
                  <span>{st}</span>
                  {activeTask.stage === st && <span className="text-[10px] font-bold">Current</span>}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setIsMoveTaskModalOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {isCreateWorkflowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Create Process Workflow</h3>
              <button onClick={() => setIsCreateWorkflowModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCreateWorkflowModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Workflow Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOC2 Compliance Certification Pipeline"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Owner / Manager</label>
                <input
                  type="text"
                  defaultValue="Alex Vance"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Department</label>
                  <select className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground">
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Approval Gate</label>
                  <select className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground">
                    <option value="manager">Manager Approval</option>
                    <option value="admin">Admin Signoff</option>
                    <option value="none">Auto-Advance</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateWorkflowModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Deploy Engine
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
