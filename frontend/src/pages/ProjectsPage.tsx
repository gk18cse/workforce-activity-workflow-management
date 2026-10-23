import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FolderGit2,
  DollarSign,
  X,
  ExternalLink
} from 'lucide-react';
import { initialProjects, Project } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: 'Alex Vance',
    department: 'Engineering',
    deadline: '2026-11-30',
    budget: '$50,000',
  });

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      manager: formData.manager,
      department: formData.department,
      status: 'Planning',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: formData.deadline,
      budget: formData.budget,
      teamMembers: [
        { name: formData.manager, avatar: 'AV', role: 'Lead' },
      ],
      tasksTotal: 10,
      tasksCompleted: 0,
    };

    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      description: '',
      manager: 'Alex Vance',
      department: 'Engineering',
      deadline: '2026-11-30',
      budget: '$50,000',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
            Enterprise Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track portfolio delivery, milestone deadlines, cross-functional teams, and resource budgets.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-neu-inset"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground font-semibold">Status:</span>
            {['All', 'On Track', 'At Risk', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-background text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => (
          <Card key={proj.id} className="hover:-translate-y-0.5 hover:shadow-neu-raised transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant={proj.status === 'On Track' ? 'success' : proj.status === 'At Risk' ? 'warning' : 'teal'}>
                    {proj.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-semibold">{proj.department}</span>
                </div>
                <h3 className="font-bold text-base text-foreground mt-2">{proj.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-bold text-foreground">{proj.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden shadow-neu-inset">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    proj.progress === 100 ? 'bg-[#2E7D5E]' : 'bg-[#176B6B]'
                  }`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            {/* Team and Timeline */}
            <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Lead Manager:</span>
                <span className="font-semibold text-foreground">{proj.manager}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Deadline:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {proj.deadline}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Tasks Status:</span>
                <span className="font-semibold text-foreground">
                  {proj.tasksCompleted} / {proj.tasksTotal} done
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Allocated Budget:</span>
                <span className="font-semibold text-primary">{proj.budget}</span>
              </div>
            </div>

            {/* Team Avatars & View Details */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <div className="flex -space-x-2 overflow-hidden">
                {proj.teamMembers.map((tm, idx) => (
                  <div
                    key={idx}
                    className="inline-block h-7 w-7 rounded-full bg-secondary border-2 border-card text-center text-[10px] font-bold text-primary leading-6 shadow-sm"
                    title={`${tm.name} (${tm.role})`}
                  >
                    {tm.avatar}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveProject(proj)}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Create New Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Infrastructure Modernization"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Objectives, deliverables, and scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Manager</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Launch Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-neu-raised animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="font-bold text-base text-foreground">{activeProject.name}</h3>
                <span className="text-xs text-muted-foreground">{activeProject.department} • {activeProject.status}</span>
              </div>
              <button onClick={() => setActiveProject(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{activeProject.description}</p>
            <div className="grid grid-cols-2 gap-3 bg-background p-3 rounded-2xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block">Manager:</span>
                <span className="font-semibold text-foreground">{activeProject.manager}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Deadline:</span>
                <span className="font-semibold text-foreground">{activeProject.deadline}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Budget:</span>
                <span className="font-semibold text-primary">{activeProject.budget}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Completion:</span>
                <span className="font-semibold text-emerald-600">{activeProject.progress}%</span>
              </div>
            </div>
            <Button variant="primary" onClick={() => setActiveProject(null)} className="w-full">
              Close Overview
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
