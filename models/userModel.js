const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please proved you name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,           
    password: {
        type: String,
        required: [true, 'You must have to provide the password'],
        minLength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: `Password didn't match`
        }
    }
});

userSchema.pre('save', async function(next) {
    // if password is modified then this line will run
    if(!this.isModified('password')) return next();
    // if password is created first time then this line will run
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})
const User = mongoose.model('User', userSchema);
module.exports = User;