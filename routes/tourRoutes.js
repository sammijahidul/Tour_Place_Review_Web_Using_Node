const express = require('express');
const tourController = require('./../controllers/tourControllers');

// Tour routes and methods
const router = express.Router();

router
    .route('/')
    .get(tourController.getAllTourData)
    .post(tourController.createATour)   
router
   .route('/:id')
   .get(tourController.getOneTourData)
   .patch(tourController.updateATour)
   .delete(tourController.deleteATour);

module.exports = router;   