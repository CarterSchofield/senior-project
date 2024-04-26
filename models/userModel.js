//* fileName: userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { request } = require('express');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    businessID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    encryptedPassword: {
        type: String,
        required: [true, 'Password is required.']
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        required: true,
        default: 'User'
    },
    dateCreatedOn: {
        type: Date,
        default: Date.now
    }
// }, {
//     toJSON: {
//         versionKey: false,
//         transform: function(doc, ret) {
//            // delete ret.email;
//             delete ret.encryptedPassword;
//     }
// }
});

userSchema.methods.setEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, 12).then(hash => {
            // Set the encryptedPassword value on the model instance
            this.encryptedPassword = hash;
            resolve();
        });
    });

    return promise;
};

// verify an attempted password against the stored encrypted password
userSchema.methods.verifyEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
            resolve(result);
        });
    });
    return promise
}

// Method to verify password
userSchema.methods.verifyPassword = function(password, callback) {
    crypto.pbkdf2(password, 12, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return callback(err);
        if (!crypto.timingSafeEqual(Buffer.from(this.hashedPassword, 'hex'), hashedPassword)) {
        return callback(null, false, { message: 'Incorrect email or password.' });
        }
        return callback(null, this);
    });
};

const User = mongoose.model('User', userSchema);
module.exports = User;