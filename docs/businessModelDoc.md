# Documentation for `businessModel.js`

## Overview
The `businessModel.js` file defines a model for business entities using Mongoose, a popular MongoDB object modeling tool designed to work in an asynchronous environment. This model is structured to handle business data and includes methods for password encryption and verification. The module is vital for managing business-related data in applications that utilize MongoDB for data storage.

## Table of Contents
- [Model Schema](#model-schema)
- [Schema Fields](#schema-fields)
- [Methods](#methods)
  - [setEncryptedPassword](#setencryptedpassword)
  - [verifyEncryptedPassword](#verifyencryptedpassword)
- [Export](#export)

## Model Schema
The business model is built using a Mongoose schema which contains several fields, each with its own validation rules. Below is an outline of the schema used in the model:

```javascript
const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: [true, 'Business name is required.'] },
    primaryContactEmail: { type: String, required: [true, 'Primary contact email is required.'] },
    businessPrivacyAgreement: { type: Boolean, required: [true, 'Business privacy agreement is required.'] },
    businessMailingAddress: { type: String, required: [true, 'Business mailing address is required.'] },
    businessPhoneNumber: { type: String, required: [true, 'Business phone number is required.'] },
    businessZipCode: { type: String, required: [true, 'Business zip code is required.'] },
    businessState: { type: String, required: [true, 'Business state is required.'] },
    businessCity: { type: String, required: [true, 'Business city is required.'] },
    membershipType: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
    dateCreatedOn: { type: Date, default: Date.now }
});
```

### Schema Fields
| Field                   | Type    | Requirements                                           | Description                          |
|-------------------------|---------|--------------------------------------------------------|--------------------------------------|
| `businessName`          | String  | Required                                               | Name of the business.                |
| `primaryContactEmail`   | String  | Required                                               | Email address for primary contact.   |
| `businessPrivacyAgreement` | Boolean | Required                                           | Agreement status for privacy policy. |
| `businessMailingAddress`| String  | Required                                               | Postal address of the business.      |
| `businessPhoneNumber`   | String  | Required                                               | Contact phone number.                |
| `businessZipCode`       | String  | Required                                               | Postal code of the business area.    |
| `businessState`         | String  | Required                                               | State where the business is located. |
| `businessCity`          | String  | Required                                               | City where the business is located.  |
| `membershipType`        | String  | Enum ['Free', 'Paid'], Default 'Free'                   | Type of membership.                  |
| `dateCreatedOn`         | Date    | Default to the current date                            | Date when the business was registered.|

## Methods
### `setEncryptedPassword`
This method takes a plain text password and encrypts it using bcrypt. It then sets this encrypted password on the business model instance.

```javascript
businessSchema.methods.setEncryptedPassword = function(plainPassword) {
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
This method compares a given plain text password with the stored encrypted password to verify identity.

```javascript
businessSchema.methods.verifyEncryptedPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
            resolve(result);
        });
    });
    return promise;
};
```

## Export
The Business model is exported as a module, making it accessible for use in other parts of the application.

```javascript
const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
```

This model provides essential functionalities for handling business data securely, especially in regards to password management and data validation, making it a crucial part of any business-oriented application utilizing MongoDB.