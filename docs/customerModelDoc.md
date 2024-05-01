# Customer Model Documentation 📄

The `customerModel.js` file is a crucial component of a backend application that utilizes MongoDB as its database through Mongoose, which is a MongoDB object modeling tool designed to work in an asynchronous environment. This model defines the structure and behavior of the data related to customers.

## Table of Contents

1. [Dependencies](#dependencies)
2. [Schema Definition](#schema-definition)
3. [Virtuals](#virtuals)
4. [Model Export](#model-export)
5. [Transformations in toJSON](#transformations-in-tojson)

---

### Dependencies

The `customerModel.js` file uses the following dependencies:

- **mongoose**: This package provides a straight-forward, schema-based solution to model application data. It includes built-in type casting, validation, query building, business logic hooks, and more, out of the box.

```javascript
const mongoose = require('mongoose');
```

- **express**: Although `express` is required in the file, it is not used directly in any operations within this model.

```javascript
const { request } = require('express');
```

---

### Schema Definition

The `customerSchema` is defined with various fields that represent the attributes of a customer. Here is a breakdown of each field:

| Field Name            | Type     | Required | Default Value | Description                          |
|-----------------------|----------|----------|---------------|--------------------------------------|
| `customerFirstName`   | String   | Yes      | N/A           | The first name of the customer.      |
| `customerLastName`    | String   | No       | N/A           | The last name of the customer.       |
| `customerPhoneNumber` | String   | Yes      | N/A           | The phone number of the customer.    |
| `customerZipCode`     | String   | No       | N/A           | The ZIP code of the customer.        |
| `customerState`       | String   | No       | N/A           | The state of the customer.           |
| `customerAddress`     | String   | No       | N/A           | The address of the customer.         |
| `customerCity`        | String   | No       | N/A           | The city of the customer.            |
| `customerEmail`       | String   | No       | N/A           | The email address of the customer.   |
| `customerCreatedOn`   | Date     | No       | `Date.now`    | The date and time the record was created. |

#### Example Schema Initialization

```javascript
const customerSchema = new mongoose.Schema({
  customerFirstName: { type: String, required: [true, 'Customer first name is required.'] },
  customerLastName: { type: String },
  // other fields...
}, {
  toJSON: {
    versionKey: false,
    transform: function (doc, ret) {
      delete ret.customerEmail;
      delete ret.customerAddress;
      delete ret.customerCity;
    }
  }
});
```

### Virtuals

A virtual named `fullName` is defined on the `customerSchema`. This virtual concatenates the `customerFirstName` and `customerLastName` to form a full name, which is not persisted in the database but is available as part of the model.

#### Virtual Definition

```javascript
customerSchema.virtual('fullName').get(function () {
  return this.customerFirstName + ' ' + this.customerLastName;
});
```

### Transformations in toJSON

The schema opts to modify its JSON output through the `toJSON` method options:

- **versionKey**: Set to `false` to prevent the `__v` (version key) from being included in the output.
- **transform**: A function to remove sensitive or unwanted information from the output (e.g., `customerEmail`, `customerAddress`, `customerCity`).

### Model Export

Finally, the schema is compiled into a model which is then exported so that it can be used elsewhere in the application.

```javascript
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
```

This model can then be used to create, read, update, and delete customer records in the database with the defined structure and behavior.