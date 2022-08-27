import express from "express";
const router = express.Router();
import {RegisterController} from '../../controllers';
// import admin from "../middlewares/admin";
// import auth from '../middlewares/auth';

router.post('/register',RegisterController.register);
export default router; 