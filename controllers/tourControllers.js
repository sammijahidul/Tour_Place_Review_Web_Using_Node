const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// All controllers/handlers related Tour

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}
exports.getAllTourData = async (req, res) => {
   try {
    const features = new APIFeatures(Tour.find(), req.query)
                        .filter()
                        .sort()
                        .fieldslimit()
                        .paginate();
    const allTours = await features.query;
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
// Aggregation Pipeline
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$ratingAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'},
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })           
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Invalid data inserted'
        })   
   
    }
}