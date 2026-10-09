"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const JWT_SECRET = process.env.JWT_SECRET || 'workflow_management_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, role, organizationSlug, departmentId } = req.body;
        if (!email || !password || !firstName || !lastName) {
            throw new errorMiddleware_1.AppError('Email, password, firstName, and lastName are required', 400);
        }
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new errorMiddleware_1.AppError('User with this email already exists', 400);
        }
        // Role assignment
        const targetRoleEnum = Object.values(client_1.UserRole).includes(role) ? role : client_1.UserRole.EMPLOYEE;
        const dbRole = await prisma_1.prisma.role.findUnique({ where: { name: targetRoleEnum } });
        if (!dbRole) {
            throw new errorMiddleware_1.AppError('Specified role not found in system', 400);
        }
        // Organization lookup or fallback to default org
        let organization;
        if (organizationSlug) {
            organization = await prisma_1.prisma.organization.findUnique({ where: { slug: organizationSlug } });
        }
        if (!organization) {
            organization = await prisma_1.prisma.organization.findFirst();
            if (!organization) {
                organization = await prisma_1.prisma.organization.create({
                    data: { name: 'Acme Enterprises', slug: 'acme-corp' },
                });
            }
        }
        // Hash Password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create User
        const user = await prisma_1.prisma.user.create({
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
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleEnum,
            roleId: user.roleId,
            organizationId: user.organizationId,
            departmentId: user.departmentId,
        }, JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errorMiddleware_1.AppError('Email and password are required', 400);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                organization: true,
                department: true,
            },
        });
        if (!user || !user.isActive) {
            throw new errorMiddleware_1.AppError('Invalid email or password', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new errorMiddleware_1.AppError('Invalid email or password', 401);
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleEnum,
            roleId: user.roleId,
            organizationId: user.organizationId,
            departmentId: user.departmentId,
        }, JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorMiddleware_1.AppError('Not authenticated', 401);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                role: true,
                organization: true,
                department: true,
            },
        });
        if (!user) {
            throw new errorMiddleware_1.AppError('User not found', 404);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
