import { Router } from 'express';
import { loginUser, registerUser, getCurrentUser, getAllUsers } from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../services/authService';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', requireAuth, getCurrentUser);
router.get('/users', requireAuth, requireAdmin, getAllUsers);

export default router;
