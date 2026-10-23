import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/errorMiddleware';

export const getWorkflows = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orgId = req.user?.organizationId;

    const workflows = await prisma.workflow.findMany({
      where: { organizationId: orgId },
      include: {
        department: { select: { id: true, name: true, code: true } },
        stages: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ workflows });
  } catch (error) {
    next(error);
  }
};

export const getWorkflowById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true, code: true } },
        stages: {
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: {
              select: { tasks: true },
            },
          },
        },
        tasks: {
          take: 20,
          orderBy: { updatedAt: 'desc' },
          include: {
            assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
            currentStage: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });

    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    res.status(200).json({ workflow });
  } catch (error) {
    next(error);
  }
};

export const createWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orgId = req.user?.organizationId;
    const { name, description, departmentId, isTemplate, stages } = req.body;

    if (!name || !Array.isArray(stages) || stages.length === 0) {
      throw new AppError('Workflow name and at least one workflow stage are required', 400);
    }

    if (!orgId) {
      throw new AppError('Organization context missing', 400);
    }

    // Format and sort stages
    const formattedStages = stages.map((stage: any, index: number) => ({
      name: stage.name,
      description: stage.description || null,
      orderIndex: stage.orderIndex !== undefined ? stage.orderIndex : index + 1,
      color: stage.color || '#3B82F6',
      isInitial: stage.isInitial || index === 0,
      isFinal: stage.isFinal || index === stages.length - 1,
      requiresApproval: Boolean(stage.requiresApproval),
    }));

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description: description || null,
        organizationId: orgId,
        departmentId: departmentId || null,
        isTemplate: Boolean(isTemplate),
        stages: {
          create: formattedStages,
        },
      },
      include: {
        stages: {
          orderBy: { orderIndex: 'asc' },
        },
        department: true,
      },
    });

    res.status(201).json({
      message: 'Workflow created successfully',
      workflow,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, departmentId, isActive, isTemplate } = req.body;

    const existingWorkflow = await prisma.workflow.findUnique({ where: { id } });
    if (!existingWorkflow) {
      throw new AppError('Workflow not found', 404);
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingWorkflow.name,
        description: description !== undefined ? description : existingWorkflow.description,
        departmentId: departmentId !== undefined ? departmentId : existingWorkflow.departmentId,
        isActive: isActive !== undefined ? isActive : existingWorkflow.isActive,
        isTemplate: isTemplate !== undefined ? isTemplate : existingWorkflow.isTemplate,
      },
      include: {
        stages: { orderBy: { orderIndex: 'asc' } },
        department: true,
      },
    });

    res.status(200).json({
      message: 'Workflow updated successfully',
      workflow: updatedWorkflow,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const taskCount = await prisma.task.count({ where: { workflowId: id } });
    if (taskCount > 0) {
      // Soft deactivate instead of deleting to preserve process traceability
      await prisma.workflow.update({
        where: { id },
        data: { isActive: false },
      });
      res.status(200).json({
        message: 'Workflow deactivated (retained for task activity history)',
      });
      return;
    }

    await prisma.workflow.delete({ where: { id } });
    res.status(200).json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    next(error);
  }
};
