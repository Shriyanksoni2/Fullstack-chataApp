import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUserForSideBar, sendMessage, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', protectRoute, getUserForSideBar)
router.post('/send/:id', protectRoute, sendMessage)
router.get('/:id',protectRoute, getMessages)
export default router