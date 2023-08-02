const express = require('express')
const viewsController = require('../controllers/viewsControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/login', viewsController.getLoginForm)


module.exports = router; 