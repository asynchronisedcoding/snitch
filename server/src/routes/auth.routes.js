import { Router } from 'express';
import { registorValidator, loginValidator } from '../validator/auth.validator.js';
import { register, login } from '../controller/auth.controller.js';

const router = Router();

router.post('/register', registorValidator, register);

router.post('/login', loginValidator, login);

export default router;