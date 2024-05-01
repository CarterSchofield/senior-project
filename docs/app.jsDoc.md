a# Documentation of `app.js`

`app.js` is a Vue.js application script that manages the state and interactions for a user interface allowing users to log in, register, write reviews, read reviews, and manage customers. This script is designed to function as part of a larger web application, handling user authentication, data management, and dynamic content updates.

## Index

- [Vue Application Setup](#vue-application-setup)
- [Data Properties](#data-properties)
- [Methods](#methods)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Event Handling](#event-handling)
- [External API Integration](#external-api-integration)

## Vue Application Setup

The script initializes a Vue application using `Vue.createApp`. The application is mounted to an HTML element with the id `app`.

```javascript
Vue.createApp({...}).mount("#app");
```

## Data Properties

The data function returns an object that holds all the reactive properties used within the app:

| Property          | Type    | Description                                              |
|-------------------|---------|----------------------------------------------------------|
| `type`            | String  | Determines the page type (`register` or `login`).        |
| `userNotSignedIn` | Boolean | Indicates whether the user is not signed in.             |
| `reviews`         | Array   | Stores reviews fetched from the server.                  |
| `filter`          | Object  | Contains filter settings for searching reviews.          |
| `customerSearch`  | String  | Holds the query for searching customers.                 |
| `customer`        | Object  | Stores the customer's data fetched from the server.      |
| `newReview`       | Object  | Holds the new review content to be submitted.            |
| `newCustomer`     | Object  | Holds the new customer data (name, email) to be created. |
| `readReviews`     | Boolean | Controls the visibility of the review reading section.   |
| `writeReviews`    | Boolean | Controls the visibility of the review writing section.   |

## Methods

The Vue instance defines several methods for handling actions like navigation, login, logout, and CRUD operations related to reviews and customers.

#### Navigation Methods:

- **`registerPageNavigate`**
  - Redirects to `login.html` with a query parameter `type=register`.
- **`loginPageNavigate`**
  - Redirects to `login.html` with a query parameter `type=login`.

#### Authentication Methods:

- **`login`**
  - Logs the user in, sets `userNotSignedIn` to `false`, updates local storage, and redirects to `index.html`.
- **`logout`**
  - Logs the user out, sets `userNotSignedIn` to `true`, updates local storage.

#### Review Management:

- **`writeReviewsPopup`**
  - Toggles visibility to enable writing reviews.
- **`readReviewsPopup`**
  - Toggles visibility to enable reading reviews and fetches reviews.
- **`submitReview`**
  - Submits a new review to the server and updates the local reviews list.
- **`getReviews`**
  - Fetches reviews from `/reviews` endpoint.
- **`getFilteredReviews`**
  - Fetches reviews based on filters applied.

#### Customer Management:

- **`searchCustomer`**
  - Searches for a customer by name using the `/customers/search` endpoint.
- **`createCustomer`**
  - Creates a new customer and then submits a review.

## Lifecycle Hooks

- **`mounted`**
  - Executes when the Vue app is fully mounted.
  - Parses URL parameters to determine if the page type is `register` or `login`.
  - Checks local storage to set the initial login state.

## Event Handling

Event handling is primarily managed through method calls triggered by user interactions in the DOM, such as button clicks for logging in, registering, searching, and submitting data.

## External API Integration

The script interacts with a server using `axios` for fetching and sending data:
- **Reviews** and **Customers** are managed through GET and POST requests to specific endpoints (`/reviews`, `/customers`, `/customers/search`).

```javascript
axios.get('/reviews?name=${this.filter.name}&date=${this.filter.date}')
axios.post('/customers', this.newCustomer)
```

This comprehensive setup allows the `app.js` file to serve as a central hub for managing user interactions and data flow within the application, ensuring a dynamic and responsive user experience.