# KareShield Server Documentation

## Overview

`server.js` is the main server file for the KareShield project. It initializes and configures an Express server, sets up middleware for security and session management, connects to a MongoDB database, defines API endpoints for managing users, businesses, customers, and reviews, and starts the server.

## Table of Contents

- [Dependencies](#dependencies)
- [Database Connection](#database-connection)
- [Middleware Configuration](#middleware-configuration)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Businesses](#businesses)
  - [Customers](#customers)
  - [Reviews](#reviews)
  - [Sessions](#sessions)
- [Server Initialization](#server-initialization)

## Dependencies

The project uses several Node.js modules to function properly:

| Module        | Description                                                          |
|---------------|----------------------------------------------------------------------|
| `cors`        | Enables Cross-Origin Resource Sharing                                |
| `express`     | Framework for handling and routing HTTP requests                     |
| `express-session` | Session middleware to manage user sessions                           |
| `helmet`      | Helps secure the app by setting various HTTP headers                 |
| `mongoose`    | MongoDB object modeling tool                                         |
| `node-email-validation` | Validates email addresses                                        |
| `bcrypt`      | Encrypts passwords                                                   |

## Database Connection

The database connection is set up using Mongoose. The connection settings are imported from `./db`, and the connection is established using `db.connect()`.

## Middleware Configuration

The server uses the following middleware:

- **Helmet**: Helps secure Express apps by setting various HTTP headers.
- **Static Files**: Serves static files from the `public` directory.
- **Sessions**: Configures session handling using `express-session`.
- **Body Parsing**: Uses `express.urlencoded` and `express.json` for parsing request bodies.
- **CORS**: Configured to allow credentials and handle origins dynamically.

## API Endpoints

### Users

- **GET `/users`**: Fetches all users.
- **GET `/users/:userID`**: Fetches a single user by ID.
- **POST `/users`**: Creates a new user.
- **DELETE `/users/:userID`**: Deletes a user by ID.

### Businesses

- **GET `/businesses`**: Fetches all businesses.
- **GET `/businesses/:businessID`**: Fetches a single business by ID.
- **POST `/businesses`**: Creates a new business.
- **DELETE `/businesses/:businessID`**: Deletes a business by ID.

### Customers

- **GET `/customers`**: Fetches all customers.
- **GET `/customers/search`**: Searches for customers based on various parameters.
- **POST `/customers`**: Creates a new customer.
- **DELETE `/customers/:customerID`**: Deletes a customer by ID.

### Reviews

- **GET `/reviews`**: Fetches all reviews.
- **GET `/reviews/:reviewID`**: Fetches a single review by ID.
- **POST `/reviews`**: Creates a new review.
- **DELETE `/reviews/:reviewID`**: Deletes a review by ID.

### Sessions

- **GET `/session`**: Retrieves the current session if authenticated.
- **POST `/session`**: Creates a session (logs in a user).
- **DELETE `/session`**: Logs out the user by ending the session.

## Server Initialization

The server listens on a port specified by the environment variable `PORT` or defaults to 8080. It outputs a message indicating that the server is running and the port number.

```javascript
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('> Server is running on port ' + port);
});
```

## Conclusion

The `server.js` file is crucial for the KareShield project, handling important backend tasks such as API endpoint creation, database connection, and session management. This setup ensures that the application can efficiently manage data and handle requests related to users, businesses, customers, and reviews.