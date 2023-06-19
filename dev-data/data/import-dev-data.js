const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
// process.on('uncaughtException', err => {
//     console.log(err.name, err.message);
//     process.exit(1);
// });
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE;
mongoose.connect(DB)
    .then(() => {
    console.log("Db is connected");
    })
    // .catch(error => 
    //     console.log('error')
    //     );
// Reading a file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();    
  } catch (error) {
    console.log(error);
  } 
}
// Deleted all data from collection
const deleteData = async () => {
   try {
    await Tour.deleteMany();
    console.log('Data succesfully Deleted');
    process.exit();   
   } catch (error) {
    console.log(error);
   }
};
if(process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
// const fs = require('fs');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const Tour = require('./../../models/tourModel');
// const Review = require('./../../models/reviewModel');
// const User = require('./../../models/userModel');

// dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!'));

// // READ JSON FILE
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// // IMPORT DATA INTO DB
// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     await User.create(users, { validateBeforeSave: false });
//     await Review.create(reviews);
//     console.log('Data successfully loaded!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// // DELETE ALL DATA FROM DB
// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     await User.deleteMany();
//     await Review.deleteMany();
//     console.log('Data successfully deleted!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// if (process.argv[2] === '--import') {
//   importData();
// } else if (process.argv[2] === '--delete') {
//   deleteData();
// }
