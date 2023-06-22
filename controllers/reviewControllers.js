const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    // Allowing nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getAReview = factory.getOne(Review);
exports.createAReview = factory.createOne(Review);
exports.deleteAReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);