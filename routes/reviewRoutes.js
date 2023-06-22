const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const authController = require("../controllers/authControllers");

const router = express.Router({ mergeParams: true});

router.use(authController.protect);

router
     .route('/')
     .get(reviewController.getAllReviews)
     .post(authController.restrictTo('user'),
           reviewController.setTourUserIds, 
           reviewController.createAReview);
router
     .route('/:id')
     .get(reviewController.getAReview)
     .delete(authController.restrictTo('user', 'admin'),
             reviewController.deleteAReview)
     .patch(authController.restrictTo('user', 'admin'),
            reviewController.updateReview);    

module.exports = router;

