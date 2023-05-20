const express = require('express');
const userController = require('./../controllers/userControllers');

// All controllers/handlers for User route
// All controllers for User resource
const router = express.Router();

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