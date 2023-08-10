const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    try {
        // Get the currently booked tour
        const tour = await Tour.findById(req.params.tourId);

        // Verify data validity and setup

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment', // Set the mode to 'payment'
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: tour.price * 100, // Convert to cents
                        product_data: {
                            name: `${tour.name} Tour`,
                            description: tour.summary,
                            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                        },
                    },
                    quantity: 1,
                },
            ],
        });

        // Send response
        res.status(200).json({
            status: 'success',
            session,
        });
    } catch (error) {
        // Handle errors
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the checkout session.',
        });
    }
});

// exports.getCheckoutSession = catchAsync (async (req, res, next) => {
//     // Get the currently booked tour
//     const tour = await Tour.findById(req.params.tourId);
//     console.log(tour);


//     // Crete checkout session
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         success_url: `${req.protocol}://${req.get('host')}/`,
//         cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//         customer_email: req.user.email,
//         client_reference_id: req.params.tourId,
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     unit_amount: tour.price * 100, // Convert to cents
//                     product_data: {
//                         name: `${tour.name} Tour`,
//                         description: tour.summary,
//                         images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
//                     },
//                 },
//                 quantity: 1,
//             },
//         ],

//     });
//     // Create session as response
//     res.status(200).json({
//         status: 'success',
//         session
//     });

// });