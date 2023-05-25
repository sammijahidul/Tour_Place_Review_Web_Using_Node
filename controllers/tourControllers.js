const fs = require('fs');
const Tour = require('../models/tourModel');

// Reading json data 
// const tours = JSON.parse (
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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
exports.getOneTourData = (req, res) => {
    res.status(200).json
    ({
        status: 'success',       
    }); 
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
exports.updateATour = (req, res) => {   
    res.status(202).json({
        status: 'success',
    })
};
exports.deleteATour = (req, res) => {    
    res.status(204).json({
        status: 'success',
    })
}