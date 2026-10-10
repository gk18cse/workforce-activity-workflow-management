import React, { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import { Task, TaskStatus } from '../types';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TaskDetailModal } from '../components/task/TaskDetailModal';
import { CreateTaskModal } from '../components/task/CreateTaskModal';
import { CheckSquare, Plus, Search, Filter } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getTasks({
        status: statusFilter !== 'ALL' ? (statusFilter as TaskStatus) : undefined,
        search: search || undefined,
      });
      setTasks(res.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };

  const openTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
            Task Operations Center
          </h2>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            View, assign, and execute process tasks across organizational workflows.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardHeader className="pb-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-2 font-sratome text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-sratome text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 font-semibold">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 font-sratome text-xs uppercase tracking-wider text-foreground focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </form>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground flex items-center justify-center space-x-2 font-sratome text-xs">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading operational tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-sratome font-bold uppercase tracking-wider text-foreground text-sm">No tasks match your query</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Try resetting filters or creating a new task.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => openTaskModal(task.id)}
                  className="bg-background border border-border p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 transition-all group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.priority === 'URGENT' || task.priority === 'HIGH' ? 'amber' : 'brand'}>
                        {task.priority}
                      </Badge>
                      <span className="font-sratome text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{task.workflow?.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <Badge
                        variant={
                          task.status === 'BLOCKED'
                            ? 'rose'
                            : task.status === 'COMPLETED'
                            ? 'emerald'
                            : 'brand'
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <h4 className="font-sratome font-bold uppercase tracking-wider text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="font-sratome text-[10px] uppercase">Stage: <strong className="text-foreground">{task.currentStage?.name}</strong></span>
                      <span className="font-sans">Assignee: <strong className="text-foreground">{task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}</strong></span>
                      {task.dueDate && <span className="font-sans">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="outline" size="sm">
                      Execute & Trace →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Execution Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onTaskUpdated={fetchTasks}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
};
