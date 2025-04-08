import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { homeController } from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(homeController));

export default router;
