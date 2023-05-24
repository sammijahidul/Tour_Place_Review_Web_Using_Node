const fs = require('fs');
const Tour = require('../models/tourModel');

// Reading json data 
// const tours = JSON.parse (
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// All controllers/handlers related Tour

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'failed',
            message: 'Name or Price is missing'
        })

    }
    next();
      
}
exports.getAllTourData = (req, res) => {
    res.status(200).json
    ({
        status: 'success',
    }); 
};
exports.getOneTourData = (req, res) => {
    res.status(200).json
    ({
        status: 'success',       
    }); 
}
exports.createATour = (req, res) => {   
    res.status(201).json({
        status: 'success',
      })    
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