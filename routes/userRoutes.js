const express = require('express');
const  multer = require('multer');
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authControllers");


// All routes related User Resource
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login); 
router.get('/logout', authController.logout); 
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes below this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, 
           userController.getOneUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// This middleware will protect belows routes from other users except admin
router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;    