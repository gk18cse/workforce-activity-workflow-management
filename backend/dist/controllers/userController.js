"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleDepartment = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const getUsers = async (req, res, next) => {
    try {
        const orgId = req.user?.organizationId;
        const { departmentId, role } = req.query;
        const whereClause = {
            organizationId: orgId,
        };
        if (departmentId) {
            whereClause.departmentId = String(departmentId);
        }
        if (role && Object.values(client_1.UserRole).includes(role)) {
            whereClause.roleEnum = role;
        }
        const users = await prisma_1.prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                roleEnum: true,
                isActive: true,
                createdAt: true,
                department: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                _count: {
                    select: {
                        assignedTasks: true,
                        createdTasks: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ users });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                organization: true,
                department: true,
                assignedTasks: {
                    take: 10,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        workflow: { select: { name: true } },
                        currentStage: { select: { name: true, color: true } },
                    },
                },
            },
        });
        if (!user) {
            throw new errorMiddleware_1.AppError('User not found', 404);
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const updateUserRoleDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { roleEnum, departmentId, isActive } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new errorMiddleware_1.AppError('User not found', 404);
        }
        const updateData = {};
        if (roleEnum && Object.values(client_1.UserRole).includes(roleEnum)) {
            const dbRole = await prisma_1.prisma.role.findUnique({ where: { name: roleEnum } });
            if (dbRole) {
                updateData.roleId = dbRole.id;
                updateData.roleEnum = dbRole.name;
            }
        }
        if (departmentId !== undefined) {
            updateData.departmentId = departmentId || null;
        }
        if (typeof isActive === 'boolean') {
            updateData.isActive = isActive;
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                roleEnum: true,
                isActive: true,
                department: true,
            },
        });
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRoleDepartment = updateUserRoleDepartment;
