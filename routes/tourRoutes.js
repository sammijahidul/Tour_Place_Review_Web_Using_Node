const express = require('express');
const tourController = require("../controllers/tourControllers");
const authController = require("../controllers/authControllers");
const reviewController = require('./../controllers/reviewControllers');

const router = express.Router();

// All routes related Tour Resource
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTourData);
router
    .route('/tour-stats')
    .get(tourController.getTourStats);   
router.
    route('/tour-monthly/:year')
    .get(tourController.getmonthlyplan);     
router
    .route('/')
    .get(authController.protect, tourController.getAllTourData)
    .post(tourController.createATour);   
router
   .route('/:id')
   .get(tourController.getOneTourData)
   .patch(tourController.updateATour)
   .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.deleteATour
        );
router
    .route('/:tourId/reviews')
    .post(authController.protect, 
          authController.restrictTo('user'), 
          reviewController.createAReview);            

module.exports = router;   