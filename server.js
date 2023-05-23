const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE;

mongoose.connect(DB)
    .then(() => {
    console.log("Db is connected");
    })
    .catch(error => console.log(error));
 
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: true
    }
})
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Forest Hicker',
    rating: 4.6,
    price: 120
})
testTour
    .save()
    .then(doc => { console.log(doc) })
    .catch(err => { console.log('Error', err)});

const port = process.env.PORT || 4008;
app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});
