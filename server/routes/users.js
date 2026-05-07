import { Router } from 'express';
import { remove } from '../controllers/usersController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.delete('/:id', verifyToken, remove);

export default router;
