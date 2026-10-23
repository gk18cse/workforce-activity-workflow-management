import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  reportTaskIssue,
  resolveTaskIssue,
  processApproval,
} from '../controllers/taskController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);

// Issue Management Routes
router.post('/:id/issues', reportTaskIssue);
router.put('/:id/issues/:issueId/resolve', resolveTaskIssue);

// Manager / Admin Approval Route
router.put('/approvals/:approvalId', authorizeRoles(UserRole.ADMIN, UserRole.MANAGER), processApproval);

export default router;
