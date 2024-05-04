//* fileName: server.js 
//* Project: KareShield 
//* Author: Carter Schofield 
//* Date Created: 02-23-2024 
//* Date Last Modified: 05-01-2024 
//* Description: This file is the main server file for the KareShield project. This file is responsible for setting up the server, connecting to the database, and setting up the routes for the API.

//* 
//! 
//?
// question
// TODO: 
// setting
// NOTE:
// info
// success
// highlight
// DONE
// error
// IMPORTANT: 
// added 
// fixme: This needs to be fixed asap 
// refactor 
// reference 
// fixed 
// - 
// removed 
// reference 
// edited: 
// WARNING: This needs to be fixed asap.



//* Importing all the required modules 
const cors = require('cors') 
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoose = require('mongoose');
const validator = require("node-email-validation");
const passport = require('./passport/setup');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

// var LocalStrategy = require('passport-local');

//* Getting all the models 
const userModel = require('./models/userModel');
const businessModel = require('./models/businessModel');
const customerModel = require('./models/customerModel');
const reviewModel = require('./models/reviewModel');
const likeModel = require('./models/likeModel');

//* Set up mongoose/mongoDB connection 
const db = require('./public/src/javascript/db');
db.connect();

const app = express();
app.use(helmet.contentSecurityPolicy({
    directives: {
        "script-src": ["'self'", "https://unpkg.com"],
        "script-src": ["'self'", "'unsafe-eval'", "https://unpkg.com"]
    }
}));

app.use(express.static("public"));
app.use(session({
    name: 'KareShieldSession',
    secret: 'bQH4bfy4g7HION2uNBEIU840nv9uquOFHQW84jmc8i32hufNVOUW8402',
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: false, // Important for HTTP, must be false to transmit over non-HTTPS
        httpOnly: true,
        sameSite: 'Lax', // Can be 'Lax' for localhost development
        // secure: true, // fixes chrome, breaks postman.
        // sameSite: 'None',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080'
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//* Set up passport?
function authorizeRequest(request, response, next) {
    console.log("Checking session userId:", request.session.userId); // Start with this log
    if (request.session && request.session.userId) {
        userModel.findOne({ _id: request.session.userId }).then(function(user) {
            if (user) {
                request.user = user;
                console.log("User authenticated:", user.email); // Confirm user is authenticated
                next();
            } else {
                console.log("User not found."); // If user not found
                response.status(401).json({error: "Not authenticated", reason: "Session ID missing or invalid"});
                response.redirect('/login.html');
            }
        });
    } else {
        console.log("No session or userId found."); // If no session
        response.status(401).json({error: "Not authenticated", reason: "Session ID missing or invalid"});
        
        response.redirect('/login.html');
    }
}


//* GET all users 
app.get("/users", function(request, response) {
// app.get("/users", authorizeRequest, function(request, response) {
    userModel.find().then((users) => {
        console.log("Users from database:", users);
        response.json(users);
    }).catch((error) => {
        console.error("> Failed to retrieve users:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single user 
app.get("/users/:userID", authorizeRequest, function(request, response) {
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

// //* POST/CREATE a new user 
// app.post("/users", authorizeRequest, async function(request, response) {
//     console.log("Request body:", request.body);
//     const { businessID, firstName, lastName, email, plainPassword } = request.body;

//     if (!validator.is_email_valid(email)) {
//         response.status(422).send("Invalid email address.");
//         return;
//     }
//     else if (!businessID) {
//         return response.status(400).send("Business ID is required.");
//     }
//     try {
//         //! Check if the business exists
//         const businessExists = await businessModel.findById(businessID);
//         if (!businessExists) {
//             return response.status(404).send("> Business not found.");
//         }
//         const newUser = new userModel({
//             businessID,
//             firstName,
//             lastName,
//             email
//         });
//         const hashedPassword = await bcrypt.hash(plainPassword, 10);
//         newUser.encryptedPassword = hashedPassword;
//         await newUser.save();
//         response.status(201).send("Created. New user added.");
//     } catch (error) {
//         console.error("> Error creating user:", error);
//         if (error.code === 11000) {
//             response.status(409).send("Username or email already exists.");
//         } else {
//             response.status(500).send("> Failed to create new user");
//         }
//     }
// });

//* DELETE a user 
app.delete("/users/:userID", authorizeRequest, function(request, response) {
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
app.get("/businesses", authorizeRequest, function(request, response) {
    businessModel.find().then((businesses) => {
        console.log("Businesses from database:", businesses);
        response.json(businesses);
    }).catch((error) => {
        console.error("> Failed to retrieve businesses:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single business 
app.get("/businesses/:businessID", authorizeRequest, function(request, response) {
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
    const {
        businessName,
        primaryContactEmail,
        businessPrivacyAgreement,
        businessMailingAddress,
        businessPhoneNumber,
        businessZipCode,
        businessState,
        businessCity,
        plainPassword,
        adminUsersFirstName,
        adminUsersLastName,
    } = request.body;

    // Validate all input fields first
    if (!businessName || !primaryContactEmail || !businessPrivacyAgreement || !businessMailingAddress ||
        !businessPhoneNumber || !businessZipCode || !businessState || !businessCity || !plainPassword || 
        !adminUsersFirstName || !adminUsersLastName) {
        return response.status(422).send("All fields are required.");
    }

    if (!validator.is_email_valid(primaryContactEmail)) {
        return response.status(422).send("Invalid email address.");
    }

    if (businessPhoneNumber.length !== 10) {
        return response.status(422).send("Business phone number must be 10 digits.");
    }

    if (businessZipCode.length !== 5) {
        return response.status(422).send("Business zip code must be 5 digits.");
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // Check if the email is already in use by any Business or User
        const emailExists = await Promise.all([
            businessModel.findOne({ primaryContactEmail }).session(session),
            userModel.findOne({ email: primaryContactEmail }).session(session)
        ]);

        if (emailExists[0] || emailExists[1]) {
            await session.abortTransaction();
            response.status(409).send("Email already in use.");
            return;
        }

        // Create the business
        const newBusiness = new businessModel({
            businessName, primaryContactEmail, businessPrivacyAgreement, businessMailingAddress,
            businessPhoneNumber, businessZipCode, businessState, businessCity
        });

        const savedBusiness = await newBusiness.save({ session });
        // Create the Admin user

        const newUser = new userModel({
            businessID: savedBusiness._id,
            firstName: adminUsersFirstName,
            lastName: adminUsersLastName,
            email: primaryContactEmail,
            role: 'Admin'
        });

        await newUser.setEncryptedPassword(plainPassword);
        
        await newUser.save({ session });

        await session.commitTransaction();
        response.status(201).send({ message: "Created. New business and primary contact user added.", business: savedBusiness, user: newUser });
    } catch (error) {
        await session.abortTransaction();
        console.error("> Error creating business or user:", error);
        response.status(500).send("> Failed to create business or user: " + error.message);
    } finally {
        session.endSession();
    }
});

//* DELETE a business 
app.delete("/businesses/:businessID", authorizeRequest, async function(request, response) {
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
app.post("/customers", authorizeRequest, async function(request, response) {
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
app.get("/customers", authorizeRequest, function(request, response) {
    customerModel.find().then((customers) => {
        console.log("Customers from database:", customers);
        response.json(customers);
    }).catch((error) => {
        console.error("> Failed to retrieve customers:", error);
        response.sendStatus(500);
    });
});

//* GET/Retrieve a single customer
app.get("/customers/search", authorizeRequest, async function(request, response) {
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
    let matchConditions = {};
    if (firstName) matchConditions["customerFirstName"] = new RegExp(firstName, 'i');
    if (lastName) matchConditions["customerLastName"] = new RegExp(lastName, 'i');
    if (phoneNumber) matchConditions["customerPhoneNumber"] = new RegExp(phoneNumber, 'i');
    if (email) matchConditions["customerEmail"] = new RegExp(email, 'i');
    if (address) matchConditions["customerAddress"] = new RegExp(address, 'i');
    if (zipCode) matchConditions["customerZipCode"] = new RegExp(zipCode, 'i');
    if (city) matchConditions["customerCity"] = new RegExp(city, 'i');

    try {
        const customers = await customerModel.aggregate([
            {
                $match: matchConditions
            },
            {
                $project: {
                    _id: 1,
                    customerFirstName: 1,
                    customerLastName: 1,
                    customerPhoneNumber: 1,
                    customerEmail: 1,
                    customerAddress: 1,
                    customerZipCode: 1,
                    customerCity: 1
                }
            }
        ]);

        if (customers.length) {
            response.json(customers);
        } else {
            //! Provide feedback that no customers were found and suggest creating one
            response.status(404).send("No customers found. Consider creating one.");
        }
    } catch (error) {
        console.error("> Error searching for customers with aggregation:", error);
        response.status(500).send("> Failed to search customers");
    }
});

//* DELETE a customer
app.delete("/customers/:customerID", authorizeRequest, function(request, response) {
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
app.post("/reviews", authorizeRequest, async function(request, response) {
    console.log("Request body:", request.body);
    const { businessID, userID, customerID, reviewRating, reviewDescription, reviewWorkDone } = request.body;
    const validWorkTypes = ['landscaping', 'concrete', 'framing', 'painting', 'electrical', 'plumbing', 'roofing', 'carpentry'];
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
    else if (!reviewWorkDone || !validWorkTypes.includes(reviewWorkDone)) {
        return response.status(400).send("Review work done is required. Only one of the following values is allowed: 'landscaping', 'concrete', 'framing', 'painting', 'electrical', 'plumbing', 'roofing', 'carpentry'.");
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
            reviewWorkDone,
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
app.get("/reviews", authorizeRequest, function(request, response) {
    let query = {};

    // Add filters to the query object only if the parameters are provided
    if (request.query.customerFirstName) {
        query['$or'] = [
            { 'customerID.customerFirstName': new RegExp(request.query.customerName, 'i') },
            { 'customerID.customerLastName': new RegExp(request.query.customerName, 'i') }
        ];
    }
    if (request.query.customerPhoneNumber) {
        query['customerID.customerPhoneNumber'] = new RegExp(request.query.customerPhoneNumber, 'i');
    }
    if (request.query.customerAddress) {
        query['customerID.customerAddress'] = new RegExp(request.query.customerAddress, 'i');
    }
    if (request.query.workingType) {
        query['reviewWorkDone'] = request.query.workingType;
    }
    // Execute the query to find reviews with the given conditions
    reviewModel.find(query)
    .populate('customerID', 'customerFirstName customerLastName customerPhoneNumber customerAddress')
    .populate('businessID', 'businessName businessPhoneNumber businessMailingAddress businessCity businessState')
    .then(reviews => {
        response.json(reviews);
    })
    .catch(error => {
        console.error("Failed to retrieve reviews:", error);
        response.sendStatus(500);
    });
});

//* GET all reviews with search parameters
app.get("/reviews/search", authorizeRequest, async (req, res) => {
    const { customerFirstName, customerLastName, customerPhoneNumber, customerCity, reviewWorkDone } = req.query;

    let matchConditions = {};
    if (customerFirstName) {
        matchConditions["customer.customerFirstName"] = new RegExp(customerFirstName, 'i');
    }
    if (customerLastName) {
        matchConditions["customer.customerLastName"] = new RegExp(customerLastName, 'i');
    }
    if (customerPhoneNumber) {
        matchConditions["customer.customerPhoneNumber"] = new RegExp(customerPhoneNumber, 'i');
    }
    if (customerCity) {
        matchConditions["customer.customerCity"] = new RegExp(customerCity, 'i');
    }
    if (reviewWorkDone) {
        matchConditions["reviewWorkDone"] = reviewWorkDone;
    }

    reviewModel.aggregate([
        {
            $lookup: {
                from: "customers",
                localField: "customerID",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $lookup: {
                from: "businesses", // Make sure 'businesses' is the correct collection name
                localField: "businessID",
                foreignField: "_id",
                as: "business"
            }
        },
        {
            $unwind: "$business"
        },
        {
            $match: matchConditions
        },
        {
            $project: {
                _id: 1,
                reviewDescription: 1,
                rating: 1,
                timestamp: 1,
                reviewWorkDone: 1,
                "customer.customerFirstName": 1,
                "customer.customerLastName": 1,
                "customer.customerPhoneNumber": 1,
                "customer.customerCity": 1,
                "business.businessName": 1,
                "business.businessPhoneNumber": 1,
                "business.businessMailingAddress": 1,
                "business.businessCity": 1,
                "business.businessState": 1
            }
        }
    ])
    .then(reviews => res.json(reviews))
    .catch(error => {
        console.error("Failed to retrieve reviews:", error);
        res.status(500).send("Error retrieving reviews");
    });
});

//* GET/Retrieve a single review
app.get("/reviews/:reviewID", authorizeRequest, function(request, response) {
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
app.delete("/reviews/:reviewID", authorizeRequest, function(request, response) {
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

//* SESSION stuff
app.get('/session', function(request, response) {
    if (request.session && request.session.userId) {
        userModel.findById(request.session.userId)
            .populate('businessID')  // This populates the business details referenced by businessID
            .then(user => {
                if (!user) {
                    console.log('No user found for the session');
                    response.status(204).send(); // No Content
                return;
                }
                response.json({
                    firstName: user.firstName,
                    businessName: user.businessID.businessName,
                    businessDetails: {
                        email: user.businessID.primaryContactEmail,
                        address: user.businessID.businessMailingAddress,
                        phone: user.businessID.businessPhoneNumber
                    },
                    status: 'Session active'
                });
            })
            .catch(err => {
                console.error('Error fetching user:', err);
                response.status(500).send('Server error');
            });
    } else {
        response.status(204).send();
    }
});

//* authentication: logout
app.get('/logout', function(request, response) {
    request.session.destroy(function(err) {
        if (err) {
            console.error("Failed to destroy the session during logout.", err);
            return response.status(500).send("Could not log out.");
        }
        response.clearCookie('connect.sid', { path: '/' });
        response.status(200).send("Logged out");
    });
});

//* authentication: create session/login
app.post('/session', function(request, response) {
    emailLowerCase = request.body.email.toLowerCase();
    userModel.findOne({ email: emailLowerCase }).then(function(user) {
        if (user){
            user.verifyEncryptedPassword(request.body.plainPassword).then(function(match) {
                if (match) {
                    request.session.userId = user._id;
                    response.status(201).send("Authenticated");
                } else {
                    response.status(401).send("Password incorrect");
                }
            })
            .catch(function(error) {
                console.error("Error verifying password:", error);
                response.status(500).send("Internal server error");
            });
        } else{
            response.status(401).send("Invalid email or password");
        }
    }).catch(function(error) {
        console.error("Error finding user:", error);
        response.status(500).send("Internal server error");
    });
});

//* authentication: register
app.post('/register', async function(request, response) {
    const { firstName, lastName, email, plainPassword, businessID } = request.body;
    
    // Validate required fields
    if (!firstName) {
        return response.status(400).send("First name is required.");
    }
    if (!lastName) {
        return response.status(400).send("Last name is required.");
    }
    if (!businessID) {
        return response.status(400).send("Business ID is required.");
    }
    if (!plainPassword) {
        return response.status(400).send("Password is required.");
    }
    if (!email) {
        return response.status(400).send("Email is required.");
    }
    // Validate email
    if (!validator.is_email_valid(email)) {
        return response.status(400).send("Invalid email address.");
    }
    try {
        //! Check if the businessID is valid
        const business = await businessModel.findById(businessID);
        if (!business) {
            return response.status(404).send("Business not found.");
        }
    
        //! Check if the email is already used
        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return response.status(409).send("Email already exists.");
        }
    
        // Create a new user
        const newUser = new userModel({
            firstName,
            lastName,
            email: email.toLowerCase(),
            businessID
        });
        //! Use setEncryptedPassword to hash and set the password
        await newUser.setEncryptedPassword(plainPassword);
    
        //! Save the new user
        await newUser.save();
        request.logIn(newUser, function(err) {
            if (err) {
                return response.status(500).json({ message: "Error logging in new user." });
            }
            response.status(201).json({ message: "User registered and logged in.", user: newUser });
        });
    } catch (error) {
        console.error("> Error registering user:", error);
        response.status(500).send("Failed to register user.");
    }
});
    
    

//* Start the server 
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('> Server is running on port ' + port);
    
});