import { Router } from 'express';
import { loginUser, registerUser, getCurrentUser, getAllUsers } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', getCurrentUser);
router.get('/users', getAllUsers);

export default router;
