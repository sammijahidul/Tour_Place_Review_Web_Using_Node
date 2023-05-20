const fs = require('fs');

// Reading json data 
const tours = JSON.parse (
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
// All controllers/handlers related Tour
exports.getAllTourData = (req, res) => {
    res.status(200).json
    ({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }    
    }); 
};
exports.getOneTourData = (req, res) => {
    const id = Number(req.params.id);
    // Checking invalid id
    if(id > tours.length) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        });
    }
    const tour = tours.find(el => el.id === id);
    res.status(200).json
    ({
        status: 'success',       
        data: {
            tour
        }    
    }); 
}
exports.createATour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours),
     err => 
     {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
};
exports.updateATour = (req, res) => {    
    console.log('Not written the logic');
    res.status(202).json({
        status: 'success',
    })
};
exports.deleteATour = (req, res) => {
    console.log('Successfully deleted')
    res.status(300).json({
        status: 'success',
    })
}