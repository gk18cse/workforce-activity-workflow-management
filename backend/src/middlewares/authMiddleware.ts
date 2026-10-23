import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AuthUser } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'workflow_management_super_secret_jwt_key_2026';

export interface JwtPayloadData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roleId: string;
  organizationId: string;
  departmentId?: string | null;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadData;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      roleId: decoded.roleId,
      organizationId: decoded.organizationId,
      departmentId: decoded.departmentId,
    };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
    return;
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` 
      });
      return;
    }

    next();
  };
};
