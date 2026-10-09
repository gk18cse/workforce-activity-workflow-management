import { Router } from 'express';
import {
  getWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from '../controllers/workflowController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getWorkflows);
router.get('/:id', getWorkflowById);
router.post('/', authorizeRoles(UserRole.ADMIN, UserRole.MANAGER), createWorkflow);
router.put('/:id', authorizeRoles(UserRole.ADMIN, UserRole.MANAGER), updateWorkflow);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteWorkflow);

export default router;
