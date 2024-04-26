//* fileName: server.js 
//* Project: KareShield 
//* Author: Carter Schofield 
//* Date Created: 02-23-2024 
//* Date Last Modified: 04-19-2024 
//* Description: This file is the main server file for the KareShield project. This file is responsible for setting up the server, connecting to the database, and setting up the routes for the API.

//* 
//! 
//?
// TODO: 
// setting
// note
// added
// fixme: This needs to be fixed asap 
// refactor
// reference
// fixed
// -
// removed

//* Importing all the required modules 
const cors = require('cors') 
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoose = require('mongoose');
const validator = require("node-email-validation");
const bcrypt = require('bcrypt');
// var passport = require('passport');
// var LocalStrategy = require('passport-local');
// var crypto = require('crypto');

//* Getting all the models 
const userModel = require('./models/userModel');
const businessModel = require('./models/businessModel');
const customerModel = require('./models/customerModel');
const reviewModel = require('./models/reviewModel');
const likeModel = require('./models/likeModel');

//* Set up mongoose/mongoDB connection 
const db = require('./db');
db.connect();

const app = express();
app.use(helmet());
app.use(express.static("public"));
app.use(session({
    name: 'KareShieldSession',
    secret: 'bQH4bfy4g7HION2uNBEIU840nv9uquOFHQW84jmc8i32hufNVOUW8402',
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: true, // fixes chrome, breaks postman.
        sameSite: 'None'
    }
}))
app.use(express.urlencoded({ extended: false }))
// app.use(passport.initialize());
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        callback(null, origin); //avoid using the wildcare origin
    }
}))
app.use(express.json());

// function authorizeRequest(request, response, next) {
//     console.log("Checking session userId:", request.session.userId); // Start with this log
//     if (request.session && request.session.userId) {
//         userModel.User.findOne({ _id: request.session.userId }).then(function(user) {
//             if (user) {
//                 request.user = user;
//                 console.log("User authenticated:", user.email); // Confirm user is authenticated
//                 next();
//             } else {
//                 console.log("User not found."); // If user not found
//                 // response.status(401).send("Not authenticated");
//                 response.status(401).json({error: "Not authenticated", reason: "Session ID missing or invalid"});

//             }
//         });
//     } else {
//         console.log("No session or userId found."); // If no session
//         // response.status(401).send("Not authenticated");
//         response.status(401).json({error: "Not authenticated", reason: "Session ID missing or invalid"});

//     }
// };

function authorizeRequest(request, response, next) {
    if (request.session && request.session.userID) {
        model.User.findOne({ _id: request.session.userID }).then(function (user) {
            if (user) {
                request.user = user;
                next();
            } else {
                response.status(401).send("Not authenticated");
            }
        });
    } else {
        response.status(401).send("Not authenticated");
    }
}

//* GET all users 
app.get("/users", function(request, response) {
    userModel.find().then((users) => {
        console.log("Users from database:", users);
        response.json(users);
    }).catch((error) => {
        console.error("> Failed to retrieve users:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single user 
app.get("/users/:userID", function(request, response) {
    console.log("Request for user with ID:", request.params.userID);
    userModel.findOne({ _id: request.params.userID }).then((user) => {
        if (user) {
            response.json(user);
        } else {
            response.status(404).send("> User not found.");
        }
    }).catch((error) => {
        console.error("> Failed to query user with ID:" + request.params.userID, error);
        response.sendStatus(404);
    });
});

//* POST/CREATE a new user 
app.post("/users", async function(request, response) {
    console.log("Request body:", request.body);
    const { businessID, firstName, lastName, email, plainPassword } = request.body;

    if (!validator.is_email_valid(email)) {
        response.status(422).send("Invalid email address.");
        return;
    }
    else if (!businessID) {
        return response.status(400).send("Business ID is required.");
    }
    try {
        //! Check if the business exists
        const businessExists = await businessModel.findById(businessID);
        if (!businessExists) {
            return response.status(404).send("> Business not found.");
        }
        const newUser = new userModel({
            businessID,
            firstName,
            lastName,
            email
        });
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        newUser.encryptedPassword = hashedPassword;
        await newUser.save();
        response.status(201).send("Created. New user added.");
    } catch (error) {
        console.error("> Error creating user:", error);
        if (error.code === 11000) {
            response.status(409).send("Username or email already exists.");
        } else {
            response.status(500).send("> Failed to create new user");
        }
    }
});


//* DELETE a user 
app.delete("/users/:userID", function(request, response) {
    console.log("Request to delete user with ID:", request.params.userID);
    userModel.deleteOne({ _id: request.params.userID }).then((result) => {
        if (result.deletedCount > 0) {
            response.status(204).send("Deleted.");
        } else {
            response.status(404).send("User not found.");
        }
    }).catch((error) => {
        console.error("> Failed to delete user with ID:" + request.params.userID, error);
        response.sendStatus(404);
    });
});

//* GET all businesses 
app.get("/businesses", function(request, response) {
    businessModel.find().then((businesses) => {
        console.log("Businesses from database:", businesses);
        response.json(businesses);
    }).catch((error) => {
        console.error("> Failed to retrieve businesses:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single business 
app.get("/businesses/:businessID", function(request, response) {
    console.log("Request for business with ID:", request.params.businessID);
    businessModel.findOne({ _id: request.params.businessID }).then((business) => {
        if (business) {
            response.json(business);
        } else {
            response.status(404).send("Business not found.");
        }
    }).catch((error) => {
        console.error("> Failed to query business with ID:" + request.params.businessID, error);
        response.sendStatus(404);
    });
});

//* POST/CREATE a new business 
app.post("/businesses", async function(request, response) {
    console.log("Request body:", request.body);
    const { businessName, primaryContactEmail, businessPrivacyAgreement, businessMailingAddress, businessPhoneNumber, businessZipCode, businessState, businessCity, plainPassword } = request.body;

    if (!validator.is_email_valid(primaryContactEmail)) {
        response.status(422).send("Invalid email address.");
        return;
    }
    else if (!businessPrivacyAgreement) {
        response.status(422).send("Business privacy agreement is required.");
        return;
    }
    else if (businessPhoneNumber.length != 10) {
        response.status(422).send("Business phone number must be 10 digits.");
        return;
    }
    else if (businessZipCode.length != 5) {
        response.status(422).send("Business zip code must be 5 digits.");
        return;
    }
    else if (businessName.length < 1) {
        response.status(422).send("Business name is required.");
        return;
    }
    else if (businessMailingAddress.length < 1) {
        response.status(422).send("Business mailing address is required.");
        return;
    }
    else if (businessCity.length < 1) {
        response.status(422).send("Business city is required.");
        return;
    }
    else if (businessState.length < 1) {
        response.status(422).send("Business state is required.");
        return;
    }
    else if (plainPassword.length < 1) {
        response.status(422).send("Password is required.");
        return;
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        //! Check if the email is already in use by any Business or User
        const emailExists = await Promise.all([
            businessModel.findOne({ primaryContactEmail }).session(session),
            userModel.findOne({ email: primaryContactEmail }).session(session)
        ]);

        if (emailExists[0] || emailExists[1]) {
            await session.abortTransaction();
            response.status(409).send("Email already in use.");
            return;
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        //! Create the business
        const newBusiness = new businessModel({
            businessName, primaryContactEmail, businessPrivacyAgreement, businessMailingAddress,
            businessPhoneNumber, businessZipCode, businessState, businessCity, encryptedPassword: hashedPassword
        });

        const savedBusiness = await newBusiness.save({ session });
        //! Create the Admin user
        const newUser = new userModel({
            businessID: savedBusiness._id,
            firstName: 'Primary', // Should be supplied or inferred
            lastName: 'Contact',  // Should be supplied or inferred
            email: primaryContactEmail,
            encryptedPassword: hashedPassword,
            role: 'Admin'
        });

        await newUser.save({ session });

        await session.commitTransaction();
        response.status(201).send({ message: "Created. New business and primary contact user added.", business: savedBusiness, user: newUser });
    } catch (error) {
        await session.abortTransaction();
        console.error("> Error creating business or user:", error);
        response.status(500).send("> Failed to create business or user");
    } finally {
        session.endSession();
    }
});

//* DELETE a business 
app.delete("/businesses/:businessID", async function(request, response) {
    const businessID = request.params.businessID;
    console.log("Request to delete business with ID:", businessID);

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const businessResult = await businessModel.deleteOne({ _id: businessID }).session(session);
        if (businessResult.deletedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            response.status(404).send("Business not found.");
            return;
        }
        //! Delete all users associated with this business
        const userResult = await userModel.deleteMany({ businessID: businessID }).session(session);

        await session.commitTransaction();
        session.endSession();
        console.log(`Deleted business and ${userResult.deletedCount} user(s).`);
        response.status(204).send("Deleted.");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("> Failed to delete business with ID:" + businessID, error);
        response.status(500).send("> Failed to delete business and associated users.");
    }
});

//* POST/CREATE a new customer
app.post("/customers", async function(request, response) {
    console.log("Request body:", request.body);
    const { businessID, customerFirstName, customerLastName, customerPhoneNumber, customerAddress, customerZipCode, customerState, customerCity, customerEmail } = request.body;

    if (!businessID) {
        return response.status(400).send("Business ID is required.");
    }
    else if (customerPhoneNumber.length != 10) {
        response.status(422).send("Customer phone number must be 10 digits.");
        return;
    }
    else if (customerFirstName.length < 1) {
        response.status(422).send("Customer first name is required.");
        return;
    }

    try {
        //! Check if the business exists
        const businessExists = await businessModel.findById(businessID);
        if (!businessExists) {
            return response.status(404).send("> Business not found.");
        }
        const newCustomer = new customerModel({
            customerFirstName: customerFirstName,
            customerLastName: customerLastName,
            customerPhoneNumber: customerPhoneNumber,
            customerAddress: customerAddress,
            customerZipCode: customerZipCode,
            customerState: customerState,
            customerCity: customerCity,
            customerEmail: customerEmail

        });
        await newCustomer.save();
        response.status(201).send("Created. New customer added.");
    } catch (error) {
        console.error("> Error creating customer:", error);
        response.status(500).send("> Failed to create new customer");
    }
});

//* GET all customers
app.get("/customers", function(request, response) {
    customerModel.find().then((customers) => {
        console.log("Customers from database:", customers);
        response.json(customers);
    }).catch((error) => {
        console.error("> Failed to retrieve customers:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single customer

app.get("/customers/search", async function(request, response) {
    const { firstName, lastName, phoneNumber, email, address, zipCode, city } = request.query;

    //! Define a list of allowed search parameters
    const allowedParams = ['firstName', 'lastName', 'phoneNumber', 'email', 'address', 'zipCode', 'city'];
    const receivedParams = Object.keys(request.query);

    //! Check for unsupported parameters
    const unsupportedParams = receivedParams.filter(param => !allowedParams.includes(param));
    if (unsupportedParams.length > 0) {
        return response.status(400).send(`Unsupported search parameters provided: ${unsupportedParams.join(', ')}. Please use only supported parameters.`);
    }

    //! Build the search query dynamically based on provided parameters
    let queryConditions = [];
    if (firstName) {
        queryConditions.push({ customerFirstName: new RegExp(firstName, 'i') });
    }
    if (lastName) {
        queryConditions.push({ customerLastName: new RegExp(lastName, 'i') });
    }
    if (phoneNumber) {
        queryConditions.push({ customerPhoneNumber: new RegExp(phoneNumber, 'i') });
    }
    if (email) {
        queryConditions.push({ customerEmail: new RegExp(email, 'i') });
    }
    if (address) {
        queryConditions.push({ customerAddress: new RegExp(address, 'i') });
    }
    if (zipCode) {
        queryConditions.push({ customerZipCode: new RegExp(zipCode, 'i') });
    }
    if (city) {
        queryConditions.push({ customerCity: new RegExp(city, 'i') });
    }

    try {
        const query = queryConditions.length > 0 ? { $or: queryConditions } : {};
        const customers = await customerModel.find(query);
        
        if (customers.length) {
            response.json(customers);
        } else {
            //! Provide feedback that no customers were found and suggest creating one
            response.status(404).send("No customers found. Consider creating one.");
        }
    } catch (error) {
        console.error("> Error searching for customers:", error);
        response.status(500).send("> Failed to search customers");
    }
});




//* DELETE a customer
app.delete("/customers/:customerID", function(request, response) {
    console.log("Request to delete customer with ID:", request.params.customerID);
    customerModel.deleteOne({ _id: request.params.customerID }).then((result) => {
        if (result.deletedCount > 0) {
            response.status(204).send("Deleted.");
        } else {
            response.status(404).send("Customer not found.");
        }
    }).catch((error) => {
        console.error("> Failed to delete customer with ID:" + request.params.customerID, error);
        response.sendStatus(404);
    });
});


//* POST/CREATE a new review
app.post("/reviews", async function(request, response) {
    console.log("Request body:", request.body);
    const { businessID, userID, customerID, reviewRating, reviewDescription } = request.body;

    if (!businessID) {
        return response.status(400).send("Business ID is required.");
    }
    else if (!userID) {
        return response.status(400).send("User ID is required.");
    }
    else if (!customerID) {
        return response.status(400).send("Customer ID is required.");
    }
    else if (reviewRating < 1 || reviewRating > 5) {
        return response.status(400).send("Review rating must be between 1 and 5.");
    }
    else if (reviewDescription.length < 1) {
        return response.status(400).send("Review description is required.");
    }

    try {
        //! Check if the business, user, and customer exist
        const [businessExists, userExists, customerExists] = await Promise.all([
            businessModel.findById(businessID),
            userModel.findById(userID),
            customerModel.findById(customerID)
        ]);

        if (!businessExists) {
            return response.status(404).send("> Business not found.");
        }
        if (!userExists) {
            return response.status(404).send("> User not found.");
        }
        if (!customerExists) {
            return response.status(404).send("> Customer not found.");
        }

        //! Check if the business has posted a review in the last three days
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const recentReview = await reviewModel.findOne({
            businessID: businessID,
            timestamp: { $gte: threeDaysAgo }
        });

        if (recentReview) {
            return response.status(403).send("A review has already been posted by this business in the last three days. Please wait before posting another review.");
        }

        //! Create the review
        const newReview = new reviewModel({
            businessID,
            userID,
            customerID,
            reviewDescription,
            rating: reviewRating,
            timestamp: new Date() // Ensuring the timestamp is set to the current time
        });
        await newReview.save();
        response.status(201).send("Created. New review added.");
    } catch (error) {
        console.error("> Error creating review:", error);
        response.status(500).send("> Failed to create new review");
    }
});

//* GET all reviews
app.get("/reviews", function(request, response) {
    reviewModel.find().then((reviews) => {
        console.log("Reviews from database:", reviews);
        response.json(reviews);
    }).catch((error) => {
        console.error("> Failed to retrieve reviews:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single review
app.get("/reviews/:reviewID", function(request, response) {
    console.log("Request for review with ID:", request.params.reviewID);
    reviewModel.findOne({ _id: request.params.reviewID }).then((review) => {
        if (review) {
            response.json(review);
        } else {
            response.status(404).send("Review not found.");
        }
    }).catch((error) => {
        console.error("> Failed to query review with ID:" + request.params.reviewID, error);
        response.sendStatus(404);
    });
});

//* DELETE a review
app.delete("/reviews/:reviewID", function(request, response) {
    console.log("Request to delete review with ID:", request.params.reviewID);
    reviewModel.deleteOne({ _id: request.params.reviewID }).then((result) => {
        if (result.deletedCount > 0) {
            response.status(204).send("Deleted.");
        } else {
            response.status(404).send("Review not found.");
        }
    }).catch((error) => {
        console.error("> Failed to delete review with ID:" + request.params.reviewID, error);
        response.sendStatus(404);
    });
});

// retrieve session
// also commonly GET /me
app.get('/session', authorizeRequest, function(request, response) {
    response.status(200).send("Authenticated");
    // Logged in!
    response.json(request.user);
});

app.delete('/session', authorizeRequest, function(request, response) {
    request.session.userID = null;
    response.status(200).send("Logged Out");
});

// authentication: create session
app.post('/session', function(request, response) {
    model.User.findOne({ email: request.body.email }).then(function (user) {
        if (user) {
            user.verifyEncryptedPassword(request.body.plainPassword).then(function(match) {
                if (match) {
                    request.session.userID = user._id;
                    response.status(201).send("Authenticated");
                } else {
                    response.status(401).send("Not authenticated");
                }
            });
            } else {
                response.status(401).send("Not authenticated");
            }
        });
    });




//* Start the server 
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('> Server is running on port ' + port);
});