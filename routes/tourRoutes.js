const express = require('express');
const tourController = require("../controllers/tourControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// All posible router and methods
// router.param('id', tourController.checkId)

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
   .delete(tourController.deleteATour);

module.exports = router;   