export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'CANCELLED';

export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  roleEnum: UserRole;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  department?: {
    id: string;
    name: string;
    code?: string;
  } | null;
  isActive?: boolean;
}

export interface WorkflowStage {
  id: string;
  workflowId: string;
  name: string;
  description?: string | null;
  orderIndex: number;
  color: string;
  isInitial: boolean;
  isFinal: boolean;
  requiresApproval: boolean;
  _count?: {
    tasks: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
    code?: string;
  } | null;
  isActive: boolean;
  isTemplate: boolean;
  stages: WorkflowStage[];
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  workflowId: string;
  workflow?: Workflow;
  currentStageId: string;
  currentStage: WorkflowStage;
  assigneeId?: string | null;
  assignee?: User | null;
  creatorId: string;
  creator?: User;
  dueDate?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
  activityLogs?: TaskActivityLog[];
  issues?: Issue[];
  approvals?: Approval[];
  _count?: {
    activityLogs: number;
    issues: number;
    approvals: number;
  };
}

export interface TaskActivityLog {
  id: string;
  taskId: string;
  actorId: string;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleEnum: UserRole;
  };
  action: string;
  previousState?: string | null;
  newState?: string | null;
  remarks?: string | null;
  createdAt: string;
}

export interface Issue {
  id: string;
  taskId: string;
  reporterId: string;
  reporter?: User;
  resolverId?: string | null;
  resolver?: User | null;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  resolutionDetails?: string | null;
  reportedAt: string;
  resolvedAt?: string | null;
}

export interface Approval {
  id: string;
  taskId: string;
  task?: Task;
  stageId: string;
  stage?: WorkflowStage;
  requesterId: string;
  requester?: User;
  approverId?: string | null;
  approver?: User | null;
  status: ApprovalStatus;
  comments?: string | null;
  requestedAt: string;
  actionedAt?: string | null;
}
