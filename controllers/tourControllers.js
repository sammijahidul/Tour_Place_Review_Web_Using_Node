const fs = require('fs');
const Tour = require('../models/tourModel');

// All controllers/handlers related Tour
exports.getAllTourData = async (req, res) => {
   try {
    const allTours = await Tour.find();
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
exports.deleteATour = (req, res) => {    
    res.status(204).json({
        status: 'success',
    })
}