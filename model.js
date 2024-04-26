const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { request } = require('express');
mongoose.connect('mongodb+srv://SE4200:cCVQfncmhq9Z7cMX@cluster0.4dntofl.mongodb.net/Kareshield?retryWrites=true&w=majority')

// ReviewSchema
// clientID -> clientSchema
// reviewID
// reviewDate
// reviewTime
// reviewTitle
// reviewBody
// reviewRating
// reviewPublic

// ClientSchema
// clientFirstName
// clientLastName
// clientEmail
// clientPhone
// clientAddress
// clientCity
// clientState
// clientZip
// clientCountry

// 
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    // You might want to store hashed identifiers to respect privacy
  });


const reviewSchema = new mongoose.Schema({
    businessUser: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessUser' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    reviewContent: String,
    rating: Number,
    reviewDate: { type: Date, default: Date.now },
    criteria: {
        paymentTimeliness: Number,
        communication: Number,
        adherenceToContract: Number
        // Add other custom criteria
    },
    moderated: { type: Boolean, default: false },
    flags: [{ type: String }]
    // Could include responses from clients, moderation history, etc.
});


const businessUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required.']
    },
    businessType: {
        type: String,
        required: [true, 'Business type is required.']
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profileDetails: {
        address: String,
        phone: String,
        website: String
        // Additional business-related information
    },
    // Consider including fields for password reset tokens, etc.
});

