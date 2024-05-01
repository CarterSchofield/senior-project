# Documentation for `userModel.js`

## Overview

The `userModel.js` file defines a Mongoose model for user data in a MongoDB database. It lays out the schema for user data, handles the encryption and verification of user passwords, and sets up methods for interacting with user data securely. This model is used in any application components that interact with user information, making it a foundational piece of the application's data layer.

## Table of Contents

1. **Dependencies**
2. **Schema Definition**
3. **Password Handling Methods**
4. **Exporting the User Model**

## 1. Dependencies

The `userModel.js` file requires several Node.js modules to function:

- `mongoose`: The ODM (Object Data Modeling) library for MongoDB and Node.js.
- `bcrypt`: A library to help hash passwords.
- `express`: Although not directly used in this file, it's included likely for request handling in related parts of the application.
- `crypto`: Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions).

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { request } = require('express');
const crypto = require('crypto');
```

## 2. Schema Definition

`userSchema` is defined with several fields, ensuring data integrity and necessary validations:

| Field             | Type     | Required | Unique | Default Value | Description                                                                 |
|-------------------|----------|----------|--------|---------------|-----------------------------------------------------------------------------|
| `businessID`      | ObjectId | Yes      | No     | N/A           | Reference to a Business model, establishing a relationship between the two. |
| `firstName`       | String   | Yes      | No     | N/A           | User's first name.                                                          |
| `lastName`        | String   | Yes      | No     | N/A           | User's last name.                                                           |
| `email`           | String   | Yes      | Yes    | N/A           | User's email address, must be unique.                                       |
| `encryptedPassword`| String  | Yes      | No     | N/A           | Hashed password for security.                                               |
| `role`            | String   | Yes      | No     | 'User'        | Role of the user, can be 'User' or 'Admin'.                                 |
| `dateCreatedOn`   | Date     | No       | No     | `Date.now`    | Timestamp of the creation of the user record.                               |

```javascript
const userSchema = new mongoose.Schema({
    businessID: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    firstName: { type: String, required: [true, 'First name is required.'] },
    lastName: { type: String, required: [true, 'Last name is required.'] },
    email: { type: String, required: [true, 'Email is required.'], unique: true },
    encryptedPassword: { type: String, required: [true, 'Password is required.'] },
    role: { type: String, enum: ['User', 'Admin'], required: true, default: 'User' },
    dateCreatedOn: { type: Date, default: Date.now }
});
```

## 3. Password Handling Methods

### `setEncryptedPassword`

This method takes a plain text password and hashes it using `bcrypt`, then sets `encryptedPassword` on the user model instance.

```javascript
userSchema.methods.setEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, 12).then(hash => {
            this.encryptedPassword = hash;
            resolve();
        });
    });
    return promise;
};
```

### `verifyEncryptedPassword`

Compares a plain text password with the stored hashed password to authenticate a user.

```javascript
userSchema.methods.verifyEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
            resolve(result);
        });
    });
    return promise;
};
```

## 4. Exporting the User Model

The model is then compiled from the schema and exported, making it available for use elsewhere in the application.

```javascript
const User = mongoose.model('User', userSchema);
module.exports = User;
```

This document provides an overview of the roles, responsibilities, and capabilities of the `userModel.js` file within the application, ensuring proper usage and integration into the wider system architecture.