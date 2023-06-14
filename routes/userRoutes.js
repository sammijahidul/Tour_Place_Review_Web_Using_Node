const express = require('express');
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authControllers")

// All controllers/handlers for User route
// All controllers for User resource
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getOneUser).
    patch(userController.updateOneUser)
    .delete(userController.deleteUser)

module.exports = router;    