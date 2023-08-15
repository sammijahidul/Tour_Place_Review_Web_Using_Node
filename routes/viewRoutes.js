const express = require('express')
const viewsController = require('../controllers/viewsControllers');
const authController = require('../controllers/authControllers');
const bookingController = require('../controllers/bookingControllers');

const router = express.Router();

router.get('/', 
           bookingController.createBookingCheckout, 
           authController.isLoggedIn, 
           viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router; 