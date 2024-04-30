//* fileName: userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { request } = require('express');
const validator = require('validator');

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
        unique: true,
        required: [true, 'Email is required!'],
        trim: true,
        validate: {
            validator(email) {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email!',
        },
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
//            // delete ret.email;
//             delete ret.encryptedPassword;
//     }
// }
});

userSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
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

const User = mongoose.model('User', userSchema);
module.exports = User;