import express from "express";
const router = express.Router();
import {RegisterController} from '../../controllers';
import loginController from "../../controllers/admin/auth/LoginController";
// import admin from "../middlewares/admin";
// import auth from '../middlewares/auth';
import auth from '../../middlewares/admin-auth';

router.post('/register',RegisterController.register);
router.get('/login',loginController.loginView);
router.get('/logout',auth, loginController.logout);
router.get('/dashboard', auth, loginController.dashboard);
router.post('/login',loginController.login);
export default router; 