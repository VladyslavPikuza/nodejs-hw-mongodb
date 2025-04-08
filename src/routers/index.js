import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import homeRouter from './home.js';

const router = Router();

router.use('/', homeRouter);
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
