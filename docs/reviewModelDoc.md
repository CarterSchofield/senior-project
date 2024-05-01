# Documentation for `reviewModel.js`

## Overview
The `reviewModel.js` file defines the schema and model for storing review data in a MongoDB database using Mongoose, a Node.js object data modeling (ODM) library for MongoDB. This model is essential for managing reviews in applications where users can rate and leave feedback on businesses.

## Schema Definition
Below is a detailed explanation of the `reviewSchema` defined within `reviewModel.js`.

### Schema Fields

| Field Name         | Data Type                           | Required | Description                                                                                     | Constraints                           |
|--------------------|-------------------------------------|----------|-------------------------------------------------------------------------------------------------|---------------------------------------|
| `businessID`       | ObjectId (Reference to `Business`)  | Yes      | A reference to the business being reviewed.                                                     | Must reference an existing `Business` |
| `userID`           | ObjectId (Reference to `User`)      | Yes      | The user who wrote the review.                                                                  | Must reference an existing `User`     |
| `customerID`       | ObjectId (Reference to `Customer`)  | Yes      | The customer associated with the review.                                                        | Must reference an existing `Customer`, Indexed for efficient lookup |
| `reviewDescription`| String                              | Yes      | The content of the review.                                                                      | "Review description is required."     |
| `rating`           | Number                              | Yes      | The rating given by the user, ranging from 1 to 5.                                              | "Rating must be between 1 and 5."     |
| `timestamp`        | Date                                | No       | The date and time when the review was posted. Defaults to the current date and time.            | -                                     |

### Indexes

- **Compound Index on `businessID` and `userID`**: This index helps in efficient querying of reviews by business and user, especially useful for fetching all reviews written by a specific user for a specific business.

### Relationships
The `reviewSchema` includes references to other collections:
- **`businessID`**: Links to the `Business` model.
- **`userID`**: Links to the `User` model.
- **`customerID`**: Links to the `Customer` model.

These relationships are crucial for maintaining data integrity and for executing join-like operations in Mongoose through population.

## Mongoose Model
The `Review` model is created using the defined `reviewSchema`. This model is then exported to be used in other parts of the application for interacting with the `reviews` collection in the database.

```javascript
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
```

## Usage
The `Review` model can be used in various parts of the application to:
- Create new reviews.
- Query reviews based on different criteria (e.g., by `businessID`, `userID`).
- Update or delete existing reviews.

## Conclusion
The `reviewModel.js` file is pivotal for handling all data concerning reviews within an application. By defining a clear schema with appropriate relationships and indexes, it ensures efficient data storage and retrieval operations, further aiding in maintaining the performance and scalability of the application.