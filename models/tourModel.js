const mongoose = require('mongoose');
const slugify = require('slugify');
// const Review = require('./reviewModel');
// const validator = require('validator');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true,'A tour Name must required'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain character']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true,'A tour duration must required']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'You must choose: difficulty, easy or medium'
        } 
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: String,
        validate: {
            validator: function(val) {
                return val < this.price;
            }
        },
        message: `Discount price ({VALUE}) should be below regular price`
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    startLocation: {
        // GeoJson
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        { 
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
    ]
},  
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
}
);
// Virtual properties
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});
// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})
// Document Middleware
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});
tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
});
// tourSchema.pre('save', async function(next)  {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;