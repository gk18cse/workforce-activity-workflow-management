"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
router.get('/', taskController_1.getTasks);
router.get('/:id', taskController_1.getTaskById);
router.post('/', taskController_1.createTask);
router.put('/:id', taskController_1.updateTask);
// Issue Management Routes
router.post('/:id/issues', taskController_1.reportTaskIssue);
router.put('/:id/issues/:issueId/resolve', taskController_1.resolveTaskIssue);
// Manager / Admin Approval Route
router.put('/approvals/:approvalId', (0, authMiddleware_1.authorizeRoles)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), taskController_1.processApproval);
exports.default = router;
