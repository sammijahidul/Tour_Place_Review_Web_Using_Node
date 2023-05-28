const Tour = require('../models/tourModel');

// All controllers/handlers related Tour
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '2';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

exports.getAllTourData = async (req, res) => {
   try {
    // 1st way -> Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 2nd way -> Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
   
    // Sorting
    let query = Tour.find(JSON.parse(queryStr));
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');    
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Field limiting
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if(req.query.page) {
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page is not exist');
    }
    const allTours = await query;
    // const allTours = await Tour.find();
    res.status(200).json({
        status: 'success',
        result: allTours.length,
        data: {
            allTours
        }
    })    
   } catch (error) {
    res.status(400).json({
        status: 'failed',
        message: 'Something went wrong'
    })    
   }
};
exports.getOneTourData = async (req, res) => {
    try {
        const getOneTour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                getOneTour
            }
        })        
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "Invalid Id"
        })       
    }
}
exports.createATour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'successful',
            data: {
                tour: newTour
            }
        })  
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Invalid data inserted'
        })        
    }   
};
exports.updateATour = async (req, res) => {  
    try {
        const modifyATour = await Tour.findByIdAndUpdate(req.params.id, req.body, 
            {
                new: true,
                runValidators: true
            });
        res.status(200).json({
            status: 'success',
            data: {
                modifyATour
            }
        })    
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Invalid data inserted'
        })           
    }   
};
exports.deleteATour = async (req, res) => {    
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })        
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Invalid data inserted'
        })   
    }    
}