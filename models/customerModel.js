//* fileName: customerModel.js

const mongoose = require('mongoose');
const { request } = require('express');

const customerSchema = new mongoose.Schema({
    customerFirstName: {
        type: String,
        required: [true, 'Customer first name is required.']
    },
    customerLastName: {
        type: String
    },
    customerPhoneNumber: {
        type: String,
        required: [true, 'Customer phone number is required.']
    },
    customerZipCode: {
        type: String
    },
    customerState: {
        type: String
    },
    customerAddress: {
        type: String
    },
    customerCity: {
        type: String
    },
    customerEmail: {
        type: String
    },
    customerCreatedOn: {
        type: Date,
        default: Date.now
    }
    }, {
    toJSON: {
        versionKey: false,
        transform: function(doc, ret) {
            delete ret.customerEmail;
            // delete ret.customerAddress;
    }
}
});

customerSchema.virtual('fullName').get(function() {
    return this.customerFirstName + ' ' + this.customerLastName;
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
