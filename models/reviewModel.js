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
        type: Date,
        default: Date.now
    }
});
reviewSchema.index({ businessID: 1, userID: 1 }); 

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;