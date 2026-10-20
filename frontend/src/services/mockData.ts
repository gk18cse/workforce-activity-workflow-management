import { User, Workflow, Task, TaskActivityLog, UserRole, TaskPriority, TaskStatus } from '../types';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleEnum: UserRole;
  department: string;
  team: string;
  avatar: string;
  status: 'Active' | 'Away' | 'On Leave' | 'Inactive';
  workload: number; // percentage e.g. 78%
  assignedTasksCount: number;
  completedTasksCount: number;
  phone: string;
  joinedDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  department: string;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Planning';
  progress: number;
  startDate: string;
  deadline: string;
  budget: string;
  teamMembers: Array<{ name: string; avatar: string; role: string }>;
  tasksTotal: number;
  tasksCompleted: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'deadline' | 'milestone' | 'activity' | 'approval';
  project: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ActivityEvent {
  id: string;
  actor: {
    name: string;
    avatar: string;
    role: string;
  };
  action: string;
  target: string;
  type: 'task_created' | 'task_assigned' | 'task_started' | 'task_completed' | 'workflow_approved' | 'workflow_rejected' | 'comment_added' | 'deadline_changed';
  timestamp: string;
  details?: string;
}

// Initial Employees
export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'admin@acme.com',
    role: 'Principal Operations Director',
    roleEnum: 'ADMIN',
    department: 'Operations',
    team: 'Executive Leadership',
    avatar: 'SC',
    status: 'Active',
    workload: 65,
    assignedTasksCount: 8,
    completedTasksCount: 42,
    phone: '+1 (555) 019-2831',
    joinedDate: '2023-01-15',
  },
  {
    id: 'emp-2',
    firstName: 'Alex',
    lastName: 'Vance',
    email: 'manager@acme.com',
    role: 'Engineering Lead & Scrum Master',
    roleEnum: 'MANAGER',
    department: 'Engineering',
    team: 'Core Platform',
    avatar: 'AV',
    status: 'Active',
    workload: 85,
    assignedTasksCount: 14,
    completedTasksCount: 68,
    phone: '+1 (555) 014-9921',
    joinedDate: '2023-04-10',
  },
  {
    id: 'emp-3',
    firstName: 'David',
    lastName: 'Miller',
    email: 'employee@acme.com',
    role: 'Senior Fullstack Engineer',
    roleEnum: 'EMPLOYEE',
    department: 'Engineering',
    team: 'Frontend Architecture',
    avatar: 'DM',
    status: 'Active',
    workload: 92,
    assignedTasksCount: 9,
    completedTasksCount: 51,
    phone: '+1 (555) 018-4412',
    joinedDate: '2023-08-01',
  },
  {
    id: 'emp-4',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@acme.com',
    role: 'Lead Product Designer',
    roleEnum: 'MANAGER',
    department: 'Design',
    team: 'Design Systems',
    avatar: 'ER',
    status: 'Active',
    workload: 74,
    assignedTasksCount: 6,
    completedTasksCount: 39,
    phone: '+1 (555) 017-3829',
    joinedDate: '2023-11-20',
  },
  {
    id: 'emp-5',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen@acme.com',
    role: 'DevOps & Reliability Specialist',
    roleEnum: 'EMPLOYEE',
    department: 'Engineering',
    team: 'Cloud Infrastructure',
    avatar: 'MC',
    status: 'Active',
    workload: 80,
    assignedTasksCount: 7,
    completedTasksCount: 44,
    phone: '+1 (555) 012-7719',
    joinedDate: '2024-02-14',
  },
  {
    id: 'emp-6',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.m@acme.com',
    role: 'QA & Compliance Manager',
    roleEnum: 'MANAGER',
    department: 'Operations',
    team: 'Quality Assurance',
    avatar: 'SM',
    status: 'Away',
    workload: 58,
    assignedTasksCount: 5,
    completedTasksCount: 33,
    phone: '+1 (555) 015-6623',
    joinedDate: '2024-03-05',
  },
  {
    id: 'emp-7',
    firstName: 'Liam',
    lastName: 'O’Connor',
    email: 'liam.oc@acme.com',
    role: 'Security & Auth Engineer',
    roleEnum: 'EMPLOYEE',
    department: 'Engineering',
    team: 'Security',
    avatar: 'LO',
    status: 'Active',
    workload: 68,
    assignedTasksCount: 6,
    completedTasksCount: 29,
    phone: '+1 (555) 019-3382',
    joinedDate: '2024-05-12',
  },
  {
    id: 'emp-8',
    firstName: 'Maya',
    lastName: 'Lin',
    email: 'maya.lin@acme.com',
    role: 'Technical Product Manager',
    roleEnum: 'MANAGER',
    department: 'Product',
    team: 'Growth & Workflows',
    avatar: 'ML',
    status: 'Active',
    workload: 82,
    assignedTasksCount: 11,
    completedTasksCount: 47,
    phone: '+1 (555) 016-4421',
    joinedDate: '2024-06-01',
  },
];

// Initial Projects
export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'WorkFlow Pro 2.0 Modernization',
    description: 'Complete Neumorphism design system overhaul, sub-second latency state management, and real-time activity telemetry.',
    manager: 'Alex Vance',
    department: 'Engineering',
    status: 'On Track',
    progress: 84,
    startDate: '2026-09-01',
    deadline: '2026-10-31',
    budget: '$120,000',
    teamMembers: [
      { name: 'Alex Vance', avatar: 'AV', role: 'Lead' },
      { name: 'David Miller', avatar: 'DM', role: 'Dev' },
      { name: 'Elena Rostova', avatar: 'ER', role: 'UI/UX' },
    ],
    tasksTotal: 48,
    tasksCompleted: 40,
  },
  {
    id: 'proj-2',
    name: 'SOC2 & HIPAA Enterprise Compliance',
    description: 'Full traceability audit logs, automated approval gates, and encryption key rotation protocols.',
    manager: 'Sophia Martinez',
    department: 'Operations',
    status: 'On Track',
    progress: 92,
    startDate: '2026-08-15',
    deadline: '2026-10-25',
    budget: '$85,000',
    teamMembers: [
      { name: 'Sophia Martinez', avatar: 'SM', role: 'Lead' },
      { name: 'Liam O’Connor', avatar: 'LO', role: 'SecOps' },
    ],
    tasksTotal: 32,
    tasksCompleted: 29,
  },
  {
    id: 'proj-3',
    name: 'Mobile Workforce Offline Sync',
    description: 'PWA service workers, client-side SQLite queueing, and conflict resolution heuristics.',
    manager: 'Maya Lin',
    department: 'Product',
    status: 'At Risk',
    progress: 54,
    startDate: '2026-09-15',
    deadline: '2026-11-15',
    budget: '$95,000',
    teamMembers: [
      { name: 'Maya Lin', avatar: 'ML', role: 'PM' },
      { name: 'Marcus Chen', avatar: 'MC', role: 'Infra' },
      { name: 'David Miller', avatar: 'DM', role: 'Dev' },
    ],
    tasksTotal: 28,
    tasksCompleted: 15,
  },
  {
    id: 'proj-4',
    name: 'Automated CI/CD Test Pipeline',
    description: 'Parallelized test runners, end-to-end Cypress containers, and instant preview environments.',
    manager: 'Marcus Chen',
    department: 'Engineering',
    status: 'Completed',
    progress: 100,
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    budget: '$45,000',
    teamMembers: [
      { name: 'Marcus Chen', avatar: 'MC', role: 'DevOps' },
      { name: 'Alex Vance', avatar: 'AV', role: 'Lead' },
    ],
    tasksTotal: 22,
    tasksCompleted: 22,
  },
];

// Initial Tasks
export const initialTasks: any[] = [
  {
    id: 'task-101',
    title: 'Finalize Neumorphic Design Tokens & Accessibility',
    description: 'Verify 4.5:1 WCAG contrast ratios across warm beige #F4EFE5 and soft ivory #F8F5EE with deep teal #176B6B buttons.',
    project: 'WorkFlow Pro 2.0 Modernization',
    priority: 'HIGH',
    status: 'IN_REVIEW',
    stage: 'In Review',
    assigneeName: 'Elena Rostova',
    assigneeAvatar: 'ER',
    department: 'Design',
    startDate: '2026-10-14',
    dueDate: '2026-10-21',
    estimatedHours: 16,
    actualHours: 14,
    tags: 'UI/UX, Styling, WCAG',
  },
  {
    id: 'task-102',
    title: 'Implement Immutable Task Activity Traceability Feed',
    description: 'Store every state change with actor, timestamp, previous state, and remarks into the central audit ledger.',
    project: 'SOC2 & HIPAA Enterprise Compliance',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    stage: 'In Progress',
    assigneeName: 'David Miller',
    assigneeAvatar: 'DM',
    department: 'Engineering',
    startDate: '2026-10-16',
    dueDate: '2026-10-22',
    estimatedHours: 20,
    actualHours: 12,
    tags: 'Backend, Audit, Compliance',
  },
  {
    id: 'task-103',
    title: 'Configure Role-Based Access Control Matrices',
    description: 'Enforce Admin, Manager, and Employee permissions on routes, task actions, and approval gates.',
    project: 'SOC2 & HIPAA Enterprise Compliance',
    priority: 'HIGH',
    status: 'COMPLETED',
    stage: 'Completed',
    assigneeName: 'Liam O’Connor',
    assigneeAvatar: 'LO',
    department: 'Engineering',
    startDate: '2026-10-10',
    dueDate: '2026-10-18',
    estimatedHours: 24,
    actualHours: 22,
    tags: 'Security, RBAC, JWT',
  },
  {
    id: 'task-104',
    title: 'Build Team Workload Distribution Charts',
    description: 'Calculate real-time employee workload percentages and display bar charts in the analytics dashboard.',
    project: 'WorkFlow Pro 2.0 Modernization',
    priority: 'MEDIUM',
    status: 'TODO',
    stage: 'To Do',
    assigneeName: 'Alex Vance',
    assigneeAvatar: 'AV',
    department: 'Engineering',
    startDate: '2026-10-18',
    dueDate: '2026-10-24',
    estimatedHours: 12,
    actualHours: 0,
    tags: 'Analytics, Recharts',
  },
  {
    id: 'task-105',
    title: 'Validate Mobile Responsive Navigation & Touch Targets',
    description: 'Ensure sidebar drawer, forms, and Kanban touch interactions work smoothly without horizontal overflow.',
    project: 'WorkFlow Pro 2.0 Modernization',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    stage: 'In Progress',
    assigneeName: 'David Miller',
    assigneeAvatar: 'DM',
    department: 'Engineering',
    startDate: '2026-10-17',
    dueDate: '2026-10-23',
    estimatedHours: 14,
    actualHours: 8,
    tags: 'Mobile, Responsive, CSS',
  },
  {
    id: 'task-106',
    title: 'Review Quarterly Security Key Rotation Policy',
    description: 'Rotate JWT signing secrets and review access tokens validity across environments.',
    project: 'SOC2 & HIPAA Enterprise Compliance',
    priority: 'URGENT',
    status: 'APPROVED',
    stage: 'Approved',
    assigneeName: 'Sarah Connor',
    assigneeAvatar: 'SC',
    department: 'Operations',
    startDate: '2026-10-12',
    dueDate: '2026-10-20',
    estimatedHours: 8,
    actualHours: 7,
    tags: 'Security, Policy',
  },
  {
    id: 'task-107',
    title: 'Optimize Bulk Task Export to CSV and PDF',
    description: 'Provide fast streaming export of all filtered tasks, employees, and analytics data.',
    project: 'WorkFlow Pro 2.0 Modernization',
    priority: 'LOW',
    status: 'TODO',
    stage: 'Backlog',
    assigneeName: 'Marcus Chen',
    assigneeAvatar: 'MC',
    department: 'Engineering',
    startDate: '2026-10-20',
    dueDate: '2026-10-28',
    estimatedHours: 10,
    actualHours: 0,
    tags: 'Export, Reporting',
  },
];

// Initial Activities
export const initialActivities: ActivityEvent[] = [
  {
    id: 'act-1',
    actor: { name: 'Sarah Connor', avatar: 'SC', role: 'ADMIN' },
    action: 'approved workflow stage',
    target: 'Security Key Rotation Policy',
    type: 'workflow_approved',
    timestamp: '12 minutes ago',
    details: 'Signed off with cryptographic audit token #7419A.',
  },
  {
    id: 'act-2',
    actor: { name: 'David Miller', avatar: 'DM', role: 'EMPLOYEE' },
    action: 'updated task progress',
    target: 'Immutable Task Activity Traceability Feed',
    type: 'task_started',
    timestamp: '42 minutes ago',
    details: 'Advanced progress to 60%, verified database indexes.',
  },
  {
    id: 'act-3',
    actor: { name: 'Alex Vance', avatar: 'AV', role: 'MANAGER' },
    action: 'assigned task to team member',
    target: 'Build Team Workload Distribution Charts',
    type: 'task_assigned',
    timestamp: '2 hours ago',
    details: 'Assigned to Alex Vance with deadline Oct 24, 2026.',
  },
  {
    id: 'act-4',
    actor: { name: 'Elena Rostova', avatar: 'ER', role: 'MANAGER' },
    action: 'submitted task for approval',
    target: 'Finalize Neumorphic Design Tokens & Accessibility',
    type: 'task_completed',
    timestamp: '3 hours ago',
    details: 'Requested design review from Sarah Connor.',
  },
  {
    id: 'act-5',
    actor: { name: 'Liam O’Connor', avatar: 'LO', role: 'EMPLOYEE' },
    action: 'marked task as completed',
    target: 'Configure Role-Based Access Control Matrices',
    type: 'task_completed',
    timestamp: '5 hours ago',
    details: 'All tests passed with 100% route verification.',
  },
  {
    id: 'act-6',
    actor: { name: 'Marcus Chen', avatar: 'MC', role: 'EMPLOYEE' },
    action: 'created new project task',
    target: 'Optimize Bulk Task Export to CSV and PDF',
    type: 'task_created',
    timestamp: '1 day ago',
    details: 'Added to Backlog stage under Modernization.',
  },
];

// Initial Calendar Events
export const initialCalendarEvents: CalendarEvent[] = [
  { id: 'cal-1', title: 'SOC2 Audit Milestone Review', date: '2026-10-20', time: '10:00 AM', type: 'milestone', project: 'SOC2 & HIPAA Enterprise Compliance', assignee: 'Sarah Connor', priority: 'urgent' },
  { id: 'cal-2', title: 'Neumorphic Token Signoff Due', date: '2026-10-21', time: '02:00 PM', type: 'deadline', project: 'WorkFlow Pro 2.0 Modernization', assignee: 'Elena Rostova', priority: 'high' },
  { id: 'cal-3', title: 'Traceability Audit Feed Launch', date: '2026-10-22', time: '04:30 PM', type: 'deadline', project: 'SOC2 & HIPAA Enterprise Compliance', assignee: 'David Miller', priority: 'high' },
  { id: 'cal-4', title: 'Sprint Review & Demo', date: '2026-10-23', time: '11:00 AM', type: 'activity', project: 'WorkFlow Pro 2.0 Modernization', assignee: 'Alex Vance', priority: 'medium' },
  { id: 'cal-5', title: 'Workload Charts Delivery', date: '2026-10-24', time: '05:00 PM', type: 'deadline', project: 'WorkFlow Pro 2.0 Modernization', assignee: 'Alex Vance', priority: 'medium' },
  { id: 'cal-6', title: 'Compliance Final Gate', date: '2026-10-25', time: '03:00 PM', type: 'approval', project: 'SOC2 & HIPAA Enterprise Compliance', assignee: 'Sophia Martinez', priority: 'urgent' },
];
