import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/errorMiddleware';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orgId = req.user?.organizationId;
    const { departmentId, role } = req.query;

    const whereClause: any = {
      organizationId: orgId,
    };

    if (departmentId) {
      whereClause.departmentId = String(departmentId);
    }
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      whereClause.roleEnum = role as UserRole;
    }

    const users = await prisma.user.findMany({
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
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
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
      throw new AppError('User not found', 404);
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { roleEnum, departmentId, isActive } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updateData: any = {};

    if (roleEnum && Object.values(UserRole).includes(roleEnum)) {
      const dbRole = await prisma.role.findUnique({ where: { name: roleEnum } });
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

    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    next(error);
  }
};
