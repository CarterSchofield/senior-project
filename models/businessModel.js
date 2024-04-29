//* fileName: businessModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { request } = require('express');

const businessSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: [true, 'Business name is required.']
    },
    primaryContactEmail: {
        type: String,
        required: [true, 'Primary contact email is required.']
    },
    businessPrivacyAgreement: {
        type: Boolean,
        required: [true, 'Business privacy agreement is required.']
    },
    businessMailingAddress: {
        type: String,
        required: [true, 'Business mailing address is required.']
    },
    businessPhoneNumber: {
        type: String,
        required: [true, 'Business phone number is required.']
    },
    businessZipCode: {
        type: String,
        required: [true, 'Business zip code is required.']
    },
    businessState: {
        type: String,
        required: [true, 'Business state is required.']
    },
    businessCity: {
        type: String,
        required: [true, 'Business city is required.']
    },
    membershipType: {
        type: String,
        enum: ['Free', 'Paid'],
        default: 'Free'
    },
    dateCreatedOn: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{2}\/\d{2}\/\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid date!`
        }
    }
    
// }, {
//     toJSON: {
//         versionKey: false,
//         transform: function(doc, ret) {
//             // remove the encryptedPassword property when serializing doc to JSON
//             delete ret.encryptedPassword;
//             delete ret.primaryContactEmail;
//     }
// }
});

businessSchema.methods.setEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, 12).then(hash => {
            // Set the encryptedPassword value on the model instance
            this.encryptedPassword = hash;
            resolve();
        });
    });

    return promise;
}

// verify an attempted password against the stored encrypted password
businessSchema.methods.verifyEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
            resolve(result);
        });
    });
    return promise
}

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;