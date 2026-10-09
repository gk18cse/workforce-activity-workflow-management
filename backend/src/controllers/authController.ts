import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/errorMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'workflow_management_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, organizationSlug, departmentId } = req.body;

    if (!email || !password || !firstName || !lastName) {
      throw new AppError('Email, password, firstName, and lastName are required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Role assignment
    const targetRoleEnum: UserRole = Object.values(UserRole).includes(role) ? role : UserRole.EMPLOYEE;
    const dbRole = await prisma.role.findUnique({ where: { name: targetRoleEnum } });
    if (!dbRole) {
      throw new AppError('Specified role not found in system', 400);
    }

    // Organization lookup or fallback to default org
    let organization;
    if (organizationSlug) {
      organization = await prisma.organization.findUnique({ where: { slug: organizationSlug } });
    }
    if (!organization) {
      organization = await prisma.organization.findFirst();
      if (!organization) {
        organization = await prisma.organization.create({
          data: { name: 'Acme Enterprises', slug: 'acme-corp' },
        });
      }
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId: dbRole.id,
        roleEnum: dbRole.name,
        organizationId: organization.id,
        departmentId: departmentId || null,
      },
      include: {
        role: true,
        organization: true,
        department: true,
      },
    });

    // Create Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleEnum,
        roleId: user.roleId,
        organizationId: user.organizationId,
        departmentId: user.departmentId,
      },
      JWT_SECRET as jwt.Secret,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleEnum,
        organization: user.organization,
        department: user.department,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        organization: true,
        department: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleEnum,
        roleId: user.roleId,
        organizationId: user.organizationId,
        departmentId: user.departmentId,
      },
      JWT_SECRET as jwt.Secret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleEnum,
        organization: user.organization,
        department: user.department,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: true,
        organization: true,
        department: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleEnum,
        organization: user.organization,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
