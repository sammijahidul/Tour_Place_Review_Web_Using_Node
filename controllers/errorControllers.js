const AppError = require("../utils/appError");

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
    const message = `Invalid input data. ${errors.join(', ')}`;
    return new AppError(message, 400);
};

const handlejwtError = () => new AppError('Invalid token. Please log in again', 401);

const handleTokenExpiredError = () => new AppError('Your token has expired', 401);

// Development Error Handler
const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
      });
    }
    // RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  };
  
  // Production Error Handler
  const sendErrorProd = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
      // Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  
    // RENDERED WEBSITE
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.'
    });
  };
       
module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);       
    } else if (process.env.NODE_ENV === 'production') {
        // let error = { ...err };
        if(err.name === 'CastError') err = handleCastErrorDB(err); 
        if(err.code === 11000) err = handleDuplicateErrorDB(err);
        if(err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if(err.name === 'JsonWebTokenError') err = handlejwtError();
        if(err.name === 'TokenExpiredErro') err = handleTokenExpiredError();
        sendErrorProd(err, req, res);           
    }    
}