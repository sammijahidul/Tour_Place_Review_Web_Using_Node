const exp = require('constants');
const express = require('express')
const fs = require('fs');

const app = express();
const port = 4008

const tours = JSON.parse (
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Middleware
app.use(express.json());

// Tours routes for reading all data
const getAllData = (req, res) => {
    res.status(200).json
    ({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }    
    }); 
}
app.get('/api/v1/tours', getAllData);

// Tours routes for reading one single data
const getOneData = (req, res) => {
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
app.get('/api/v1/tours/:id', getOneData);

// Tours routes for Creating data
const createData = (req, res) => {
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
}
app.post('/api/v1/tours', createData)

// Routes for updating the data
app.patch('/api/v1/tours/:id', (req, res) => {
    

});


app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});
