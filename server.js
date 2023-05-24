const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE;

mongoose.connect(DB)
    .then(() => {
    console.log("Db is connected");
    })
    .catch(error => 
        console.log(error)
        );
 
const port = process.env.PORT || 4008;
app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});
