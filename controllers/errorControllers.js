const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
    // console.log(value);
    const message = `Duplicate field values: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}
const sendErrorProd = (err, res) => {
    // operation error send this message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({ 
            status: err.status,
            message: err.message,
        });
    // Programming or other errors perhaps 
    } else {
        // logged the error to see the error details
        console.error('ERROR', err)
        // Send this message to client 
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }    
}
module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);       
    } else if (process.env.NODE_ENV === 'production') {
        // let error = { ...err };
        if(err.name === 'CastError') err = handleCastErrorDB(err); 
        if(err.code === 11000) err = handleDuplicateErrorDB(err);
        if(err.name === 'ValidationError') err = handleValidationErrorDB(err);
        sendErrorProd(err, res);           
    }    
}