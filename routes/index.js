import express from 'express';

import { auth } from '../middleware/auth';

import { register } from './register';
import { login } from './login';
import { users, userById, userOnline, userOffline } from './users';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, users);
router.get('/user/:id', userById);
router.get('/useronline/:id', userOnline);
router.get('/useroffline/:id', userOffline);

export default router;
