"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkflow = exports.updateWorkflow = exports.createWorkflow = exports.getWorkflowById = exports.getWorkflows = void 0;
const prisma_1 = require("../config/prisma");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const getWorkflows = async (req, res, next) => {
    try {
        const orgId = req.user?.organizationId;
        const workflows = await prisma_1.prisma.workflow.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getWorkflows = getWorkflows;
const getWorkflowById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const workflow = await prisma_1.prisma.workflow.findUnique({
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
            throw new errorMiddleware_1.AppError('Workflow not found', 404);
        }
        res.status(200).json({ workflow });
    }
    catch (error) {
        next(error);
    }
};
exports.getWorkflowById = getWorkflowById;
const createWorkflow = async (req, res, next) => {
    try {
        const orgId = req.user?.organizationId;
        const { name, description, departmentId, isTemplate, stages } = req.body;
        if (!name || !Array.isArray(stages) || stages.length === 0) {
            throw new errorMiddleware_1.AppError('Workflow name and at least one workflow stage are required', 400);
        }
        if (!orgId) {
            throw new errorMiddleware_1.AppError('Organization context missing', 400);
        }
        // Format and sort stages
        const formattedStages = stages.map((stage, index) => ({
            name: stage.name,
            description: stage.description || null,
            orderIndex: stage.orderIndex !== undefined ? stage.orderIndex : index + 1,
            color: stage.color || '#3B82F6',
            isInitial: stage.isInitial || index === 0,
            isFinal: stage.isFinal || index === stages.length - 1,
            requiresApproval: Boolean(stage.requiresApproval),
        }));
        const workflow = await prisma_1.prisma.workflow.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createWorkflow = createWorkflow;
const updateWorkflow = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, departmentId, isActive, isTemplate } = req.body;
        const existingWorkflow = await prisma_1.prisma.workflow.findUnique({ where: { id } });
        if (!existingWorkflow) {
            throw new errorMiddleware_1.AppError('Workflow not found', 404);
        }
        const updatedWorkflow = await prisma_1.prisma.workflow.update({
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateWorkflow = updateWorkflow;
const deleteWorkflow = async (req, res, next) => {
    try {
        const { id } = req.params;
        const taskCount = await prisma_1.prisma.task.count({ where: { workflowId: id } });
        if (taskCount > 0) {
            // Soft deactivate instead of deleting to preserve process traceability
            await prisma_1.prisma.workflow.update({
                where: { id },
                data: { isActive: false },
            });
            res.status(200).json({
                message: 'Workflow deactivated (retained for task activity history)',
            });
            return;
        }
        await prisma_1.prisma.workflow.delete({ where: { id } });
        res.status(200).json({ message: 'Workflow deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteWorkflow = deleteWorkflow;
