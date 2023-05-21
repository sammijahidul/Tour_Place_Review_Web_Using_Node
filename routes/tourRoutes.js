const express = require('express');
const tourController = require('./../controllers/tourControllers');

const router = express.Router();

// All posible router and methods
router.param('id', tourController.checkId)

router
    .route('/')
    .get(tourController.getAllTourData)
    .post(tourController.checkBody, tourController.createATour)   
router
   .route('/:id')
   .get(tourController.getOneTourData)
   .patch(tourController.updateATour)
   .delete(tourController.deleteATour);

module.exports = router;   