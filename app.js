const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)

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
// Asdfg12345
app.use(globalErrorHandler);

module.exports = app;