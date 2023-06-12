const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE;
mongoose.connect(DB)
    .then(() => {
    console.log("Db is connected");
    })
    // .catch(error => 
    //     console.log('error')
    //     );
 
const port = process.env.PORT || 4008;
const server = app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});
