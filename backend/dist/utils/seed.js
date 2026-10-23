"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedInitialData = async () => {
    try {
        // 1. Ensure Roles exist
        const roles = [
            { name: client_1.UserRole.ADMIN, description: 'Administrator with full system access' },
            { name: client_1.UserRole.MANAGER, description: 'Manager with workflow approval and department access' },
            { name: client_1.UserRole.EMPLOYEE, description: 'Employee with task execution access' },
        ];
        for (const r of roles) {
            await prisma_1.prisma.role.upsert({
                where: { name: r.name },
                update: {},
                create: r,
            });
        }
        // 2. Ensure default Organization exists
        const defaultOrg = await prisma_1.prisma.organization.upsert({
            where: { slug: 'acme-corp' },
            update: {},
            create: {
                name: 'Acme Enterprises',
                slug: 'acme-corp',
            },
        });
        // 3. Ensure default Departments exist
        const engDept = await prisma_1.prisma.department.upsert({
            where: { id: 'dept-eng-default' },
            update: {},
            create: {
                id: 'dept-eng-default',
                name: 'Engineering & Product',
                code: 'ENG',
                organizationId: defaultOrg.id,
            },
        });
        const opsDept = await prisma_1.prisma.department.upsert({
            where: { id: 'dept-ops-default' },
            update: {},
            create: {
                id: 'dept-ops-default',
                name: 'Operations & Logistics',
                code: 'OPS',
                organizationId: defaultOrg.id,
            },
        });
        // 4. Ensure Seed Users exist for instant testing
        const adminRole = await prisma_1.prisma.role.findUnique({ where: { name: client_1.UserRole.ADMIN } });
        const managerRole = await prisma_1.prisma.role.findUnique({ where: { name: client_1.UserRole.MANAGER } });
        const employeeRole = await prisma_1.prisma.role.findUnique({ where: { name: client_1.UserRole.EMPLOYEE } });
        if (adminRole && managerRole && employeeRole) {
            const defaultPassword = await bcryptjs_1.default.hash('password123', 10);
            // Admin user
            await prisma_1.prisma.user.upsert({
                where: { email: 'admin@acme.com' },
                update: {},
                create: {
                    email: 'admin@acme.com',
                    password: defaultPassword,
                    firstName: 'Sarah',
                    lastName: 'Connor (Admin)',
                    roleId: adminRole.id,
                    roleEnum: client_1.UserRole.ADMIN,
                    organizationId: defaultOrg.id,
                    departmentId: engDept.id,
                },
            });
            // Manager user
            const managerUser = await prisma_1.prisma.user.upsert({
                where: { email: 'manager@acme.com' },
                update: {},
                create: {
                    email: 'manager@acme.com',
                    password: defaultPassword,
                    firstName: 'Alex',
                    lastName: 'Vance (Manager)',
                    roleId: managerRole.id,
                    roleEnum: client_1.UserRole.MANAGER,
                    organizationId: defaultOrg.id,
                    departmentId: opsDept.id,
                },
            });
            // Set department manager
            await prisma_1.prisma.department.update({
                where: { id: opsDept.id },
                data: { managerId: managerUser.id },
            });
            // Employee user
            await prisma_1.prisma.user.upsert({
                where: { email: 'employee@acme.com' },
                update: {},
                create: {
                    email: 'employee@acme.com',
                    password: defaultPassword,
                    firstName: 'David',
                    lastName: 'Miller (Employee)',
                    roleId: employeeRole.id,
                    roleEnum: client_1.UserRole.EMPLOYEE,
                    organizationId: defaultOrg.id,
                    departmentId: opsDept.id,
                },
            });
        }
        // 5. Create Default Sample Workflow if none exists
        const existingWorkflow = await prisma_1.prisma.workflow.findFirst({
            where: { organizationId: defaultOrg.id },
        });
        if (!existingWorkflow) {
            await prisma_1.prisma.workflow.create({
                data: {
                    name: 'Standard Operational Activity Flow',
                    description: 'Standard 4-stage operational activity workflow with manager approval requirement.',
                    organizationId: defaultOrg.id,
                    departmentId: opsDept.id,
                    isTemplate: true,
                    stages: {
                        create: [
                            { name: 'Backlog / Initiated', orderIndex: 1, color: '#64748B', isInitial: true, requiresApproval: false },
                            { name: 'In Execution', orderIndex: 2, color: '#3B82F6', requiresApproval: false },
                            { name: 'Manager Review & Approval', orderIndex: 3, color: '#F59E0B', requiresApproval: true },
                            { name: 'Completed & Closed', orderIndex: 4, color: '#10B981', isFinal: true, requiresApproval: false },
                        ],
                    },
                },
            });
        }
        console.log('✅ Initial database seed & roles completed successfully.');
    }
    catch (err) {
        console.error('⚠️ Database seed initialization error:', err);
    }
};
exports.seedInitialData = seedInitialData;
