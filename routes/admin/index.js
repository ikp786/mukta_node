import express from "express";
const router = express.Router();
import {RegisterController} from '../../controllers';
import loginController from "../../controllers/admin/auth/LoginController";
import CategoryController from "../../controllers/admin/CategoryController";
import ProductController from "../../controllers/admin/ProductController";
import SliderController from "../../controllers/admin/SliderController";
// import admin from "../middlewares/admin";
// import auth from '../middlewares/auth';
import auth from '../../middlewares/admin-auth';

router.post('/register',RegisterController.register);
router.get('/login',loginController.loginView);
router.get('/logout',auth, loginController.logout);
router.get('/dashboard', auth, loginController.dashboard);
router.post('/login',loginController.login);

// CATEGORY ROUTES
router.get('/categories/index',CategoryController.index);
router.get('/categories/create',CategoryController.create);
router.post('/categories/store',CategoryController.store);
router.get('/categories/edit/:id',CategoryController.edit);
router.post('/categories/update/:id',CategoryController.update);
router.get('/categories/destroy/:id',CategoryController.destroy);

// SLIDERS ROUTES
router.get('/sliders/index',SliderController.index);
router.get('/sliders/create',SliderController.create);
router.post('/sliders/store',SliderController.store);
router.get('/sliders/edit/:id',SliderController.edit);
router.post('/sliders/update/:id',SliderController.update);
router.get('/sliders/destroy/:id',SliderController.destroy);

// PRODUCTS ROUTES
router.get('/products/index',ProductController.index);
router.get('/products/create',ProductController.create);
router.post('/products/store',ProductController.store);
router.get('/products/edit/:id',ProductController.edit);
router.post('/products/update/:id',ProductController.update);
router.get('/products/destroy/:id',ProductController.destroy);

export default router; 