//* fileName: likeModel.js
const mongoose = require('mongoose');
const { request } = require('express');

const likeSchema = new mongoose.Schema({
    reviewID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    businessID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
likeSchema.index({ reviewID: 1, businessID: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;