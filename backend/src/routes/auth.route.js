import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }); // or diskStorage()


router.post('/signup',signup )

router.post('/login', login); 

router.post('/logout', logout);

router.post('/updateProfile', protectRoute,upload.single('profilePic'), updateProfile)

router.get('/check',protectRoute, checkAuth)

export default router;