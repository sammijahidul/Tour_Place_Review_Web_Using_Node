const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const authController = require("../controllers/authControllers");

const router = express.Router();

router.route('/')
        .get(reviewController.getAllReviews)
        .post(authController.protect, 
              authController.restrictTo('user'), 
              reviewController.createAReview
              );

module.exports = router;

