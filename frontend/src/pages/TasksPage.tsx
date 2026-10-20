import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { initialTasks, initialProjects, initialEmployees } from '../services/mockData';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  User as UserIcon, 
  ArrowUpDown, 
  Layers, 
  MessageSquare, 
  Paperclip, 
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'APPROVED' | 'COMPLETED' | 'BLOCKED';
  stage?: string;
  assigneeName: string;
  assigneeAvatar: string;
  department?: string;
  startDate?: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags?: string;
  comments?: Array<{
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
  }>;
}

export const TasksPage: React.FC = () => {
  const { showSuccess, showError } = useToast();

  // Local storage persisted task list
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('wf_tasks_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored tasks', e);
      }
    }
    return initialTasks.map((t) => ({
      ...t,
      comments: [
        {
          id: 'c-1',
          author: 'Alex Vance',
          avatar: 'AV',
          text: 'Design tokens have been verified against the warm beige palette.',
          time: '2 hours ago',
        },
      ],
    }));
  });

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('wf_tasks_store', JSON.stringify(tasks));
  }, [tasks]);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'effort'>('dueDate');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals state
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Comment input for detail modal
  const [newCommentText, setNewCommentText] = useState('');

  // Create Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    project: initialProjects[0]?.name || 'WorkFlow Pro 2.0 Modernization',
    assigneeName: initialEmployees[0]?.firstName + ' ' + initialEmployees[0]?.lastName,
    assigneeAvatar: initialEmployees[0]?.avatar || 'SC',
    priority: 'HIGH' as TaskItem['priority'],
    status: 'TODO' as TaskItem['status'],
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    estimatedHours: 16,
    actualHours: 0,
    tags: 'Frontend, UI/UX',
  });

  // Calculate Overdue status
  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'COMPLETED') return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  // KPI Calculations
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, overdue, completionRate };
  }, [tasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()) ||
          task.assigneeName.toLowerCase().includes(search.toLowerCase()) ||
          task.project.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
        const matchesProject = projectFilter === 'ALL' || task.project === projectFilter;
        const matchesOverdue = !showOverdueOnly || isOverdue(task.dueDate, task.status);

        return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesOverdue;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'priority') {
          const weights = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return weights[b.priority] - weights[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'effort') {
          return b.estimatedHours - a.estimatedHours;
        }
        return 0;
      });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, showOverdueOnly, sortBy]);

  // Handler: Mark Complete Toggle
  const handleToggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
          const nextActual = nextStatus === 'COMPLETED' && t.actualHours === 0 ? t.estimatedHours : t.actualHours;
          return { ...t, status: nextStatus, actualHours: nextActual };
        }
        return t;
      })
    );
    showSuccess('Task Status Updated', 'Task progress saved.');
  };

  // Handler: Open Details Modal
  const handleOpenDetails = (task: TaskItem) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  // Handler: Add Comment to Selected Task
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Sarah Connor',
      avatar: 'SC',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    const updatedTask = {
      ...selectedTask,
      comments: [...(selectedTask.comments || []), newComment],
    };

    setSelectedTask(updatedTask);
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setNewCommentText('');
    showSuccess('Comment Added', 'Your remark was logged to task history.');
  };

  // Handler: Create Task
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      showError('Validation Error', 'Task title is required.');
      return;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      project: createForm.project,
      assigneeName: createForm.assigneeName,
      assigneeAvatar: createForm.assigneeAvatar,
      priority: createForm.priority,
      status: createForm.status,
      startDate: createForm.startDate,
      dueDate: createForm.dueDate,
      estimatedHours: Number(createForm.estimatedHours) || 8,
      actualHours: Number(createForm.actualHours) || 0,
      tags: createForm.tags,
      comments: [],
    };

    setTasks((prev) => [newTask, ...prev]);
    showSuccess('Task Created', `"${newTask.title}" added to operational backlog.`);
    setIsCreateOpen(false);
    // Reset form
    setCreateForm({
      title: '',
      description: '',
      project: initialProjects[0]?.name || 'WorkFlow Pro 2.0 Modernization',
      assigneeName: initialEmployees[0]?.firstName + ' ' + initialEmployees[0]?.lastName,
      assigneeAvatar: initialEmployees[0]?.avatar || 'SC',
      priority: 'HIGH',
      status: 'TODO',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: 16,
      actualHours: 0,
      tags: 'Engineering, Operational',
    });
  };

  // Handler: Edit Task
  const handleOpenEdit = (task: TaskItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTaskToEdit({ ...task });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit || !taskToEdit.title.trim()) return;

    setTasks((prev) => prev.map((t) => (t.id === taskToEdit.id ? taskToEdit : t)));
    if (selectedTask?.id === taskToEdit.id) {
      setSelectedTask(taskToEdit);
    }
    setIsEditOpen(false);
    showSuccess('Task Updated', 'Changes persisted successfully.');
  };

  // Handler: Delete Task
  const handleDeleteTask = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteConfirmId));
    if (selectedTask?.id === deleteConfirmId) {
      setIsDetailOpen(false);
      setSelectedTask(null);
    }
    setDeleteConfirmId(null);
    showSuccess('Task Deleted', 'Task permanently removed from workspace.');
  };

  const getPriorityBadgeVariant = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'teal';
      default:
        return 'neutral';
    }
  };

  const getStatusBadgeVariant = (status: TaskItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'APPROVED':
        return 'success';
      case 'IN_PROGRESS':
        return 'brand';
      case 'IN_REVIEW':
        return 'warning';
      case 'BLOCKED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            Task Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, track, and assign operational tasks across active workflows and cross-functional teams.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" onClick={() => setIsCreateOpen(true)} className="shadow-neu-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Task
          </Button>
        </div>
      </div>

      {/* KPI Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-neu-sm hover:shadow-neu transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{metrics.total}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Across all active projects</div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-neu-sm hover:shadow-neu transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Completed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{metrics.completed}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">{metrics.completionRate}% completion rate</div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-neu-sm hover:shadow-neu transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">In Progress</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{metrics.inProgress}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Active in pipeline</div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-neu-sm hover:shadow-neu transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Overdue</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{metrics.overdue}</div>
          <div className="mt-1 text-[11px] text-rose-600 font-semibold">
            {metrics.overdue > 0 ? 'Requires attention' : 'All deadlines on track'}
          </div>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-neu-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks by title, description, assignee, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-neu-inset"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none shadow-neu-sm cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="BLOCKED">Blocked</option>
            </select>

            {/* Priority Select */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none shadow-neu-sm cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Project Select */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none shadow-neu-sm cursor-pointer max-w-[160px] truncate"
            >
              <option value="ALL">All Projects</option>
              {initialProjects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Overdue Toggle */}
            <button
              onClick={() => setShowOverdueOnly(!showOverdueOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                showOverdueOnly
                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                  : 'bg-background text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Overdue Only</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none shadow-neu-sm cursor-pointer"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
              <option value="effort">Sort by Effort</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-background border border-border rounded-xl p-0.5 shadow-neu-inset">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'list' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid View"
              >
                <FolderKanban className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || projectFilter !== 'ALL' || showOverdueOnly || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60 text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold">Active Filters:</span>
            {statusFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px] flex items-center gap-1 border border-border">
                Status: {statusFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter('ALL')} />
              </span>
            )}
            {priorityFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px] flex items-center gap-1 border border-border">
                Priority: {priorityFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPriorityFilter('ALL')} />
              </span>
            )}
            {projectFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px] flex items-center gap-1 border border-border">
                Project: {projectFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setProjectFilter('ALL')} />
              </span>
            )}
            {showOverdueOnly && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 text-[11px] flex items-center gap-1 border border-rose-500/20">
                Overdue
                <X className="w-3 h-3 cursor-pointer" onClick={() => setShowOverdueOnly(false)} />
              </span>
            )}
            {search && (
              <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px] flex items-center gap-1 border border-border">
                "{search}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
              </span>
            )}
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setProjectFilter('ALL');
                setShowOverdueOnly(false);
                setSearch('');
              }}
              className="text-[11px] text-primary hover:underline font-semibold ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Task List or Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center shadow-neu-sm">
          <CheckSquare className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="font-bold text-foreground text-sm">No tasks matched your criteria</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try resetting your filters, expanding your search term, or create a new operational task.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setProjectFilter('ALL');
                setShowOverdueOnly(false);
                setSearch('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            const effortPercent = Math.min(100, Math.round((task.actualHours / (task.estimatedHours || 1)) * 100));

            return (
              <div
                key={task.id}
                onClick={() => handleOpenDetails(task)}
                className={`bg-card border rounded-2xl p-4.5 transition-all duration-200 cursor-pointer shadow-neu-sm hover:shadow-neu group ${
                  overdue ? 'border-rose-500/40' : 'border-border/80 hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Checkbox, Badges, Title */}
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    {/* Complete Checkbox Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleComplete(task.id, e)}
                      title={task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete'}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-border bg-background hover:border-primary text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Badge Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={getPriorityBadgeVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          <FolderKanban className="w-3 h-3 text-primary" />
                          {task.project}
                        </span>
                        {overdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            <AlertCircle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3
                        className={`text-sm font-bold text-foreground group-hover:text-primary transition-colors ${
                          task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>

                      {/* Meta Information Bar */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <div className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-[10px] text-primary">
                            {task.assigneeAvatar}
                          </div>
                          {task.assigneeName}
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Due: <strong className={overdue ? 'text-rose-600' : 'text-foreground'}>{task.dueDate}</strong>
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Effort: {task.actualHours}h / {task.estimatedHours}h
                        </span>

                        {task.comments && task.comments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {task.comments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Progress bar & Action buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                    {/* Progress Indicator */}
                    <div className="w-24 text-right hidden sm:block">
                      <div className="text-[10px] font-bold text-muted-foreground mb-1">
                        {effortPercent}% logged
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden border border-border/40">
                        <div
                          className={`h-full rounded-full transition-all ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-600'
                              : effortPercent > 90
                              ? 'bg-amber-500'
                              : 'bg-primary'
                          }`}
                          style={{ width: `${effortPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => handleOpenEdit(task, e)}
                        title="Edit Task"
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        title="Delete Task"
                        className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Button variant="secondary" size="sm" onClick={() => handleOpenDetails(task)} className="ml-1">
                        View
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid / Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            const effortPercent = Math.min(100, Math.round((task.actualHours / (task.estimatedHours || 1)) * 100));

            return (
              <div
                key={task.id}
                onClick={() => handleOpenDetails(task)}
                className={`bg-card border rounded-2xl p-5 shadow-neu-sm hover:shadow-neu transition-all flex flex-col justify-between cursor-pointer group ${
                  overdue ? 'border-rose-500/40' : 'border-border/80 hover:border-primary/50'
                }`}
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={getPriorityBadgeVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {overdue && (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <AlertCircle className="w-3 h-3" /> Overdue
                      </span>
                    )}
                  </div>

                  {/* Title & Project */}
                  <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mb-1">
                    <FolderKanban className="w-3 h-3 text-primary" />
                    {task.project}
                  </span>
                  <h3
                    className={`font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 ${
                      task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {task.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/80 space-y-3">
                  {/* Effort Progress */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                      <span>Effort Progress</span>
                      <span className="font-semibold text-foreground">
                        {task.actualHours}h / {task.estimatedHours}h ({effortPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden border border-border/40">
                      <div
                        className={`h-full rounded-full transition-all ${
                          task.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-primary'
                        }`}
                        style={{ width: `${effortPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Assignee & Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-[10px] text-primary">
                        {task.assigneeAvatar}
                      </div>
                      <span className="text-foreground font-medium text-xs truncate max-w-[110px]">
                        {task.assigneeName}
                      </span>
                    </div>

                    <span className={`text-[11px] font-medium ${overdue ? 'text-rose-600 font-bold' : 'text-muted-foreground'}`}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: TASK DETAILS DRAWER / MODAL
          ========================================================================= */}
      {isDetailOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/80 pb-4">
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getPriorityBadgeVariant(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(selectedTask.status)}>
                    {selectedTask.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {selectedTask.project}
                  </span>
                  {isOverdue(selectedTask.dueDate, selectedTask.status) && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      Overdue
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  {selectedTask.title}
                </h2>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description & Objectives
              </h4>
              <p className="text-xs text-foreground bg-background p-3.5 rounded-xl border border-border leading-relaxed shadow-neu-inset">
                {selectedTask.description || 'No detailed description provided for this task.'}
              </p>
            </div>

            {/* Key Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-secondary/50 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Assignee</span>
                <div className="flex items-center space-x-1.5 mt-1 font-semibold text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                    {selectedTask.assigneeAvatar}
                  </div>
                  <span>{selectedTask.assigneeName}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Due Date</span>
                <span className="mt-1 font-semibold text-foreground block">
                  {selectedTask.dueDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Estimated</span>
                <span className="mt-1 font-semibold text-foreground block">
                  {selectedTask.estimatedHours} hours
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Actual Logged</span>
                <span className="mt-1 font-semibold text-foreground block">
                  {selectedTask.actualHours} hours
                </span>
              </div>
            </div>

            {/* Quick Status / Assignment Switcher */}
            <div className="bg-background border border-border p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quick Task State Update
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Change Status
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      const updated = { ...selectedTask, status: e.target.value as any };
                      setSelectedTask(updated);
                      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                      showSuccess('Status Updated', `Task moved to ${e.target.value}.`);
                    }}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Reassign Member
                  </label>
                  <select
                    value={selectedTask.assigneeName}
                    onChange={(e) => {
                      const emp = initialEmployees.find((m) => `${m.firstName} ${m.lastName}` === e.target.value);
                      const updated = {
                        ...selectedTask,
                        assigneeName: e.target.value,
                        assigneeAvatar: emp ? emp.avatar : 'SC',
                      };
                      setSelectedTask(updated);
                      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                      showSuccess('Task Reassigned', `Assignee set to ${e.target.value}.`);
                    }}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
                  >
                    {initialEmployees.map((emp) => (
                      <option key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>
                        {emp.firstName} {emp.lastName} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comments & Activity Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Comments & Audit Trail ({selectedTask.comments?.length || 0})
              </h4>

              {selectedTask.comments && selectedTask.comments.length > 0 ? (
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedTask.comments.map((c) => (
                    <div key={c.id} className="bg-secondary/40 border border-border/60 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-primary/20 text-primary font-bold text-[9px] flex items-center justify-center">
                            {c.avatar}
                          </div>
                          {c.author}
                        </span>
                        <span className="text-muted-foreground text-[10px]">{c.time}</span>
                      </div>
                      <p className="text-muted-foreground">{c.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No comments yet. Start the conversation below.</p>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a remark, blocker status, or execution note..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-neu-inset"
                />
                <Button type="submit" variant="primary" size="sm">
                  Send
                </Button>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/80">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEdit(selectedTask);
                }}
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit Task Details
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE TASK MODAL
          ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Create Operational Task
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Role-Based Access Control Matrices"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed requirements, acceptance criteria, or operational steps..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>

              {/* Project & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Project *
                  </label>
                  <select
                    value={createForm.project}
                    onChange={(e) => setCreateForm({ ...createForm, project: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  >
                    {initialProjects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Assigned Employee *
                  </label>
                  <select
                    value={createForm.assigneeName}
                    onChange={(e) => {
                      const emp = initialEmployees.find((m) => `${m.firstName} ${m.lastName}` === e.target.value);
                      setCreateForm({
                        ...createForm,
                        assigneeName: e.target.value,
                        assigneeAvatar: emp?.avatar || 'SC',
                      });
                    }}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  >
                    {initialEmployees.map((emp) => (
                      <option key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>
                        {emp.firstName} {emp.lastName} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Priority
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                  </select>
                </div>
              </div>

              {/* Dates & Effort */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={createForm.estimatedHours}
                    onChange={(e) => setCreateForm({ ...createForm, estimatedHours: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Tags & Categories
                </label>
                <input
                  type="text"
                  placeholder="Frontend, Security, Audit, Database"
                  value={createForm.tags}
                  onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border/80">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save & Publish Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT TASK MODAL
          ========================================================================= */}
      {isEditOpen && taskToEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Edit Task Details
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={taskToEdit.title}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskToEdit.description}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Status
                  </label>
                  <select
                    value={taskToEdit.status}
                    onChange={(e) => setTaskToEdit({ ...taskToEdit, status: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Priority
                  </label>
                  <select
                    value={taskToEdit.priority}
                    onChange={(e) => setTaskToEdit({ ...taskToEdit, priority: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskToEdit.dueDate}
                    onChange={(e) => setTaskToEdit({ ...taskToEdit, dueDate: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Actual Effort (Hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={taskToEdit.actualHours}
                    onChange={(e) => setTaskToEdit({ ...taskToEdit, actualHours: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border/80">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: DELETE CONFIRMATION DIALOG
          ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Delete Task</h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Are you sure you want to permanently delete this task? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-sm"
                onClick={confirmDelete}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
