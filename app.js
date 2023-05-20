const exp = require('constants');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const port = 4008

// Reading json data 
const tours = JSON.parse (
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// All controllers for Tour Resource
const getAllTourData = (req, res) => {
    res.status(200).json
    ({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }    
    }); 
};
const getOneTourData = (req, res) => {
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
const createATour = (req, res) => {
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
const updateATour = (req, res) => {    
    console.log('Not written the logic');
    res.status(202).json({
        status: 'success',
    })
};
const deleteATour = (req, res) => {
    console.log('Successfully deleted')
    res.status(300).json({
        status: 'success',
    })
}

// All controllers for User resource
const getAllUsers = (req, res) => {
    console.log("Showing all users");
    res.status(200).json({
        status: 'success',
    })
};
const createUser = (req, res) => {
    console.log("Creating a user");
    res.status(200).json({
        status: 'success',
    })
};
const getOneUser = (req, res) => {
    console.log("Get one users");
    res.status(200).json({
        status: 'success',
    })
};
const updateOneUser = (req, res) => {
    console.log("Updaing a user");
    res.status(201).json({
        status: 'success',
    })
};
const deleteUser = (req, res) => {
    console.log("Showing all users");
    res.status(300).json({
        status: 'success',
    })
};

// app.get('/api/v1/tours', getAllData);
// app.get('/api/v1/tours/:id', getOneData);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);

// All routes and methods handler
const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)

tourRouter
    .route('/')
    .get(getAllTourData)
    .post(createATour)   
tourRouter
   .route('/:id')
   .get(getOneTourData)
   .patch(updateATour)
   .delete(deleteATour);
userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);
userRouter
    .route('/:id')
    .get(getOneUser).
    patch(updateOneUser)
    .delete(deleteUser)

app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});
