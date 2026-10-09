import { Router } from 'express';
import { getUsers, getUserById, updateUserRoleDepartment } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorizeRoles(UserRole.ADMIN, UserRole.MANAGER), updateUserRoleDepartment);

export default router;
