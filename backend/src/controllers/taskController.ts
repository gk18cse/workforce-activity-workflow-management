import { Request, Response, NextFunction } from 'express';
import { TaskStatus, TaskPriority, LogAction, IssuePriority, IssueStatus, ApprovalStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/errorMiddleware';
import { logTaskActivity } from '../services/activityLogService';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orgId = req.user?.organizationId;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const { status, priority, workflowId, stageId, assigneeId, myTasks, search } = req.query;

    const whereClause: any = {
      organizationId: orgId,
    };

    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      whereClause.status = status as TaskStatus;
    }

    if (priority && Object.values(TaskPriority).includes(priority as TaskPriority)) {
      whereClause.priority = priority as TaskPriority;
    }

    if (workflowId) {
      whereClause.workflowId = String(workflowId);
    }

    if (stageId) {
      whereClause.currentStageId = String(stageId);
    }

    if (assigneeId) {
      whereClause.assigneeId = String(assigneeId);
    }

    if (myTasks === 'true' || userRole === 'EMPLOYEE') {
      whereClause.OR = [
        { assigneeId: userId },
        { creatorId: userId },
      ];
    }

    if (search) {
      const searchStr = String(search);
      whereClause.OR = [
        { title: { contains: searchStr } },
        { description: { contains: searchStr } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        workflow: { select: { id: true, name: true } },
        currentStage: { select: { id: true, name: true, color: true, isInitial: true, isFinal: true, requiresApproval: true } },
        assignee: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        creator: { select: { id: true, firstName: true, lastName: true } },
        _count: {
          select: {
            activityLogs: true,
            issues: true,
            approvals: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        workflow: {
          include: {
            stages: { orderBy: { orderIndex: 'asc' } },
          },
        },
        currentStage: true,
        assignee: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true, roleEnum: true } },
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          include: {
            actor: { select: { id: true, firstName: true, lastName: true, email: true, roleEnum: true } },
          },
        },
        issues: {
          orderBy: { createdAt: 'desc' },
          include: {
            reporter: { select: { id: true, firstName: true, lastName: true } },
            resolver: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        approvals: {
          orderBy: { createdAt: 'desc' },
          include: {
            stage: { select: { id: true, name: true } },
            requester: { select: { id: true, firstName: true, lastName: true } },
            approver: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const actorId = req.user?.id;
    const orgId = req.user?.organizationId;

    if (!actorId || !orgId) {
      throw new AppError('Authentication context missing', 401);
    }

    const { title, description, priority, workflowId, currentStageId, assigneeId, dueDate, estimatedHours, tags } = req.body;

    if (!title || !workflowId) {
      throw new AppError('Task title and workflowId are required', 400);
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    let targetStageId = currentStageId;
    if (!targetStageId) {
      const initialStage = workflow.stages.find((s) => s.isInitial) || workflow.stages[0];
      if (!initialStage) {
        throw new AppError('Workflow has no configured stages', 400);
      }
      targetStageId = initialStage.id;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        organizationId: orgId,
        workflowId,
        currentStageId: targetStageId,
        assigneeId: assigneeId || null,
        creatorId: actorId,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        tags: tags || null,
      },
      include: {
        workflow: { select: { name: true } },
        currentStage: { select: { name: true, color: true } },
        assignee: { select: { firstName: true, lastName: true } },
        creator: { select: { firstName: true, lastName: true } },
      },
    });

    // Mandatory Activity Log Record
    await logTaskActivity({
      taskId: task.id,
      actorId,
      action: LogAction.TASK_CREATED,
      newState: {
        title: task.title,
        status: task.status,
        stage: task.currentStage.name,
        assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned',
      },
      remarks: `Task created in initial stage "${task.currentStage.name}"`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const actorId = req.user?.id;
    const actorRole = req.user?.role;
    const { id } = req.params;

    if (!actorId) {
      throw new AppError('Not authenticated', 401);
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        currentStage: true,
        assignee: true,
        workflow: { include: { stages: true } },
      },
    });

    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    const {
      title,
      description,
      priority,
      status,
      currentStageId,
      assigneeId,
      dueDate,
      estimatedHours,
      actualHours,
      tags,
      remarks,
    } = req.body;

    const previousState: Record<string, any> = {
      title: existingTask.title,
      status: existingTask.status,
      priority: existingTask.priority,
      currentStageId: existingTask.currentStageId,
      stageName: existingTask.currentStage.name,
      assigneeId: existingTask.assigneeId,
    };

    const updateData: any = {};
    const logActions: { action: LogAction; remarks?: string }[] = [];

    if (title !== undefined && title !== existingTask.title) {
      updateData.title = title;
      logActions.push({ action: LogAction.DETAILS_UPDATED, remarks: `Title changed to "${title}"` });
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (priority !== undefined && priority !== existingTask.priority) {
      updateData.priority = priority;
      logActions.push({ action: LogAction.PRIORITY_CHANGED, remarks: `Priority changed from ${existingTask.priority} to ${priority}` });
    }

    if (assigneeId !== undefined && assigneeId !== existingTask.assigneeId) {
      updateData.assigneeId = assigneeId || null;
      logActions.push({ action: LogAction.ASSIGNEE_CHANGED, remarks: assigneeId ? `Assigned to user ID ${assigneeId}` : 'Task unassigned' });
    }

    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : null;
    if (actualHours !== undefined) updateData.actualHours = actualHours ? parseFloat(actualHours) : null;
    if (tags !== undefined) updateData.tags = tags;

    // Handle Stage Transition
    if (currentStageId && currentStageId !== existingTask.currentStageId) {
      const targetStage = existingTask.workflow.stages.find((s) => s.id === currentStageId);
      if (!targetStage) {
        throw new AppError('Target workflow stage not found', 400);
      }

      // Gatekeeping: Check if target stage requires manager approval
      if (targetStage.requiresApproval && actorRole === 'EMPLOYEE') {
        // Create an Approval request record instead of immediate transition
        await prisma.approval.create({
          data: {
            taskId: id,
            stageId: targetStage.id,
            requesterId: actorId,
            status: ApprovalStatus.PENDING,
            comments: remarks || `Requested transition to approval-gated stage "${targetStage.name}"`,
          },
        });

        await logTaskActivity({
          taskId: id,
          actorId,
          action: LogAction.APPROVAL_REQUESTED,
          previousState: { stage: existingTask.currentStage.name },
          newState: { requestedStage: targetStage.name },
          remarks: `Submitted approval request to move to stage "${targetStage.name}"`,
          ipAddress: req.ip,
        });

        res.status(202).json({
          message: `Stage transition to "${targetStage.name}" requires Manager Approval. Request submitted.`,
          requiresApproval: true,
        });
        return;
      }

      updateData.currentStageId = targetStage.id;
      if (targetStage.isFinal) {
        updateData.status = TaskStatus.COMPLETED;
      } else if (existingTask.status === TaskStatus.TODO) {
        updateData.status = TaskStatus.IN_PROGRESS;
      }

      logActions.push({
        action: LogAction.STAGE_TRANSITION,
        remarks: `Transitioned from "${existingTask.currentStage.name}" to "${targetStage.name}"`,
      });
    }

    // Handle Direct Status Update
    if (status !== undefined && status !== existingTask.status) {
      updateData.status = status;
      logActions.push({
        action: LogAction.STATUS_CHANGE,
        remarks: `Status changed from ${existingTask.status} to ${status}`,
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        currentStage: true,
        assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
        workflow: { select: { name: true } },
      },
    });

    const newState: Record<string, any> = {
      title: updatedTask.title,
      status: updatedTask.status,
      priority: updatedTask.priority,
      currentStageId: updatedTask.currentStageId,
      stageName: updatedTask.currentStage.name,
      assigneeId: updatedTask.assigneeId,
    };

    // Log Activity Records for all triggered actions
    if (logActions.length === 0) {
      logActions.push({ action: LogAction.DETAILS_UPDATED, remarks: remarks || 'Task details updated' });
    }

    for (const actionItem of logActions) {
      await logTaskActivity({
        taskId: id,
        actorId,
        action: actionItem.action,
        previousState,
        newState,
        remarks: actionItem.remarks || remarks || null,
        ipAddress: req.ip,
      });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// Report Blocker / Issue on Task
export const reportTaskIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const actorId = req.user?.id;
    const { id } = req.params;
    const { title, description, priority } = req.body;

    if (!actorId) {
      throw new AppError('Not authenticated', 401);
    }

    if (!title || !description) {
      throw new AppError('Issue title and description are required', 400);
    }

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // 1. Create Issue record
    const issue = await prisma.issue.create({
      data: {
        taskId: id,
        reporterId: actorId,
        title,
        description,
        priority: priority || IssuePriority.HIGH,
        status: IssueStatus.OPEN,
      },
    });

    // 2. Set Task status to BLOCKED
    const previousStatus = task.status;
    await prisma.task.update({
      where: { id },
      data: { status: TaskStatus.BLOCKED },
    });

    // 3. Mandatory Audit Trail Log
    await logTaskActivity({
      taskId: id,
      actorId,
      action: LogAction.ISSUE_REPORTED,
      previousState: { status: previousStatus },
      newState: { status: TaskStatus.BLOCKED, issueId: issue.id, issueTitle: title },
      remarks: `Issue Reported: "${title}" - Task set to BLOCKED`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Issue reported and task marked as BLOCKED',
      issue,
    });
  } catch (error) {
    next(error);
  }
};

// Resolve Issue on Task
export const resolveTaskIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const actorId = req.user?.id;
    const { id, issueId } = req.params;
    const { resolutionDetails } = req.body;

    if (!actorId) {
      throw new AppError('Not authenticated', 401);
    }

    const issue = await prisma.issue.findUnique({ where: { id: issueId } });
    if (!issue || issue.taskId !== id) {
      throw new AppError('Issue not found for this task', 404);
    }

    // 1. Update Issue status
    const resolvedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: IssueStatus.RESOLVED,
        resolverId: actorId,
        resolutionDetails: resolutionDetails || 'Resolved',
        resolvedAt: new Date(),
      },
    });

    // 2. Check if remaining open issues exist on task; if none, unblock task
    const remainingOpenIssues = await prisma.issue.count({
      where: { taskId: id, status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] } },
    });

    let newStatus: TaskStatus = TaskStatus.BLOCKED;
    if (remainingOpenIssues === 0) {
      newStatus = TaskStatus.IN_PROGRESS;
      await prisma.task.update({
        where: { id },
        data: { status: newStatus },
      });
    }

    // 3. Mandatory Audit Trail Log
    await logTaskActivity({
      taskId: id,
      actorId,
      action: LogAction.ISSUE_RESOLVED,
      previousState: { issueStatus: issue.status, taskStatus: TaskStatus.BLOCKED },
      newState: { issueStatus: IssueStatus.RESOLVED, taskStatus: newStatus },
      remarks: `Issue Resolved: "${issue.title}". Resolution: ${resolutionDetails || 'Resolved'}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: 'Issue resolved successfully',
      issue: resolvedIssue,
      taskStatus: newStatus,
    });
  } catch (error) {
    next(error);
  }
};

// Process Approval Request (Manager / Admin)
export const processApproval = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const actorId = req.user?.id;
    const { approvalId } = req.params;
    const { status, comments } = req.body; // APPROVED or REJECTED

    if (!actorId) {
      throw new AppError('Not authenticated', 401);
    }

    if (![ApprovalStatus.APPROVED, ApprovalStatus.REJECTED].includes(status)) {
      throw new AppError('Status must be APPROVED or REJECTED', 400);
    }

    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: { task: true, stage: true },
    });

    if (!approval) {
      throw new AppError('Approval record not found', 404);
    }

    // 1. Update Approval Record
    const updatedApproval = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status,
        approverId: actorId,
        comments: comments || null,
        actionedAt: new Date(),
      },
    });

    // 2. If approved, advance task to target stage
    if (status === ApprovalStatus.APPROVED) {
      await prisma.task.update({
        where: { id: approval.taskId },
        data: {
          currentStageId: approval.stageId,
          status: approval.stage.isFinal ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS,
        },
      });
    }

    // 3. Mandatory Audit Trail Log
    await logTaskActivity({
      taskId: approval.taskId,
      actorId,
      action: LogAction.APPROVAL_ACTIONED,
      previousState: { approvalStatus: approval.status },
      newState: { approvalStatus: status, stage: approval.stage.name },
      remarks: `Manager Approval ${status} for transition to stage "${approval.stage.name}". Comments: ${comments || 'None'}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: `Approval request ${status}`,
      approval: updatedApproval,
    });
  } catch (error) {
    next(error);
  }
};
