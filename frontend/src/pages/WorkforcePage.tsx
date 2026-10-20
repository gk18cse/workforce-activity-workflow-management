import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Briefcase, 
  Layers, 
  SlidersHorizontal,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  X,
  Eye,
  LayoutGrid,
  List
} from 'lucide-react';
import { initialEmployees, Employee } from '../services/mockData';

export const WorkforcePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: 'Engineering',
    team: 'Core Platform',
    phone: '',
    status: 'Active' as Employee['status'],
  });

  const departments = ['All', 'Engineering', 'Operations', 'Design', 'Product', 'Marketing'];
  const statuses = ['All', 'Active', 'Away', 'On Leave', 'Inactive'];

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Toggle active/inactive
  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' }
          : emp
      )
    );
  };

  // Add Employee Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role || 'Staff Specialist',
      roleEnum: 'EMPLOYEE',
      department: formData.department,
      team: formData.team,
      avatar: `${formData.firstName[0]}${formData.lastName[0] || ''}`.toUpperCase(),
      status: formData.status,
      workload: 45,
      assignedTasksCount: 3,
      completedTasksCount: 0,
      phone: formData.phone || '+1 (555) 000-0000',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setEmployees([newEmp, ...employees]);
    setIsAddModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      department: 'Engineering',
      team: 'Core Platform',
      phone: '',
      status: 'Active',
    });
  };

  // Edit Employee Handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmployee) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === activeEmployee.id
          ? {
              ...emp,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              role: formData.role,
              department: formData.department,
              team: formData.team,
              phone: formData.phone,
              status: formData.status,
            }
          : emp
      )
    );
    setIsEditModalOpen(false);
  };

  const openEditModal = (emp: Employee) => {
    setActiveEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      team: emp.team,
      phone: emp.phone,
      status: emp.status,
    });
    setIsEditModalOpen(true);
  };

  const openProfileModal = (emp: Employee) => {
    setActiveEmployee(emp);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
            Workforce Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage team assignments, workload allocations, performance metrics, and staff records.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-background border border-border rounded-xl p-1 shadow-neu-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-neu-inset"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Department Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-muted-foreground font-semibold">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-muted-foreground font-semibold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEmployees.map((emp) => (
            <Card key={emp.id} className="hover:-translate-y-0.5 hover:shadow-neu-raised transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center font-bold text-primary text-base shadow-neu-sm">
                    {emp.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{emp.firstName} {emp.lastName}</h3>
                    <p className="text-[11px] text-muted-foreground">{emp.role}</p>
                  </div>
                </div>
                <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'Away' ? 'warning' : 'slate'}>
                  {emp.status}
                </Badge>
              </div>

              {/* Department & Team Details */}
              <div className="mt-4 pt-3 border-t border-border/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Department:</span>
                  <span className="font-semibold text-foreground">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Team:</span>
                  <span className="font-semibold text-foreground">{emp.team}</span>
                </div>
                
                {/* Workload Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Workload:</span>
                    <span className={`font-bold ${emp.workload > 85 ? 'text-rose-600' : 'text-primary'}`}>
                      {emp.workload}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden shadow-neu-inset">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        emp.workload > 85 ? 'bg-[#C25B4E]' : 'bg-[#176B6B]'
                      }`}
                      style={{ width: `${emp.workload}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
                  <span>Assigned: <strong className="text-foreground">{emp.assignedTasksCount}</strong> tasks</span>
                  <span>Done: <strong className="text-foreground">{emp.completedTasksCount}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openProfileModal(emp)}
                  className="text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Profile
                </Button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(emp)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Edit Employee"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleEmployeeStatus(emp.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      emp.status === 'Active'
                        ? 'text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                        : 'text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                    }`}
                    title={emp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                  >
                    {emp.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border/80">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department & Team</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Workload</th>
                  <th className="p-4">Tasks</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-primary shrink-0 shadow-neu-sm">
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{emp.department}</p>
                      <p className="text-[11px] text-muted-foreground">{emp.team}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'Away' ? 'warning' : 'slate'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="w-32 space-y-1">
                        <span className="font-bold text-[11px] text-foreground">{emp.workload}%</span>
                        <div className="w-full h-1.5 bg-background border border-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${emp.workload > 85 ? 'bg-[#C25B4E]' : 'bg-[#176B6B]'}`}
                            style={{ width: `${emp.workload}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-foreground">{emp.assignedTasksCount} assigned</span>
                      <span className="text-muted-foreground block text-[11px]">{emp.completedTasksCount} completed</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openProfileModal(emp)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(emp)}>
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Add New Employee</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && activeEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Edit Employee</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Role Title</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Update Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Drawer / Modal */}
      {isProfileModalOpen && activeEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-neu-raised animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {activeEmployee.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{activeEmployee.firstName} {activeEmployee.lastName}</h3>
                  <p className="text-xs text-muted-foreground">{activeEmployee.role}</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-background p-4 rounded-2xl border border-border/60">
              <div>
                <span className="text-muted-foreground block">Email:</span>
                <span className="font-semibold text-foreground">{activeEmployee.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone:</span>
                <span className="font-semibold text-foreground">{activeEmployee.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Department:</span>
                <span className="font-semibold text-foreground">{activeEmployee.department}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Team:</span>
                <span className="font-semibold text-foreground">{activeEmployee.team}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Joined Date:</span>
                <span className="font-semibold text-foreground">{activeEmployee.joinedDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Status:</span>
                <Badge variant={activeEmployee.status === 'Active' ? 'success' : 'warning'}>{activeEmployee.status}</Badge>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-foreground">Operational Performance:</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-background rounded-xl border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Workload</span>
                  <span className="font-bold text-base text-primary">{activeEmployee.workload}%</span>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Assigned</span>
                  <span className="font-bold text-base text-foreground">{activeEmployee.assignedTasksCount}</span>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Completed</span>
                  <span className="font-bold text-base text-emerald-600">{activeEmployee.completedTasksCount}</span>
                </div>
              </div>
            </div>

            <Button variant="primary" onClick={() => setIsProfileModalOpen(false)} className="w-full">
              Close Profile
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
