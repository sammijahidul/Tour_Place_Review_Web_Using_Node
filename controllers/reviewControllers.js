const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync (async (Req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    })
});
exports.createAReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
})