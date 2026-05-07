import { Router } from 'express';
import { update, remove } from '../controllers/usersController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.put('/:id', verifyToken, update);
router.delete('/:id', verifyToken, remove);

export default router;
