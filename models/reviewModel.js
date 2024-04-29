//* fileName: reviewModel.js

const mongoose = require('mongoose');
const { request } = require('express');

const reviewSchema = new mongoose.Schema({
    businessID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        index: true  // Index for efficient lookup
    },
    reviewDescription: {
        type: String,
        required: [true, 'Review description is required.']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required.'],
        min: [1, 'Rating must be between 1 and 5.'],
        max: [5, 'Rating must be between 1 and 5.']
    },
    timestamp: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{2}\/\d{2}\/\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    reviewWorkDone: {
        type: String,
        enum: ['Landscaping', 'Concrete', 'Framing', 'Painting', 'Electrical', 'Plumbing', 'Roofing', 'Carpentry', 'Other'], // Add more as needed
        required: true
    }
});
reviewSchema.index({ businessID: 1, userID: 1 }); 

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;