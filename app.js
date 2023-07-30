const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoseSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
//Set security HTTP headers
app.use(helmet());

// Development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};
// Limit request from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against nosql query injection
app.use(mongoseSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 
                'ratingsAverage', 'maxGroupSize', 
                'difficulty', 'price']
}));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    // res.status(400).json({
    //     status: 'fail',
    //     message: `coudn't find this ${req.originalUrl} on this server`
    // })
    // const err = new Error(`coudn't find this ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode= 404;
    next(new AppError(`coudn't find this ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;