# Backend

The backend provides the REST API and server-side functionality for the Clothing Swap Marketplace.

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Socket.io
* dotenv
* CORS

## Main Responsibilities

* User registration and login
* JWT authentication
* Authorization and ownership checks
* Listing CRUD operations
* Clothing image uploads
* Search, filtering and pagination
* Favorites
* Swap requests
* Messaging
* Reports and admin functionality

## Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── .env
├── package.json
└── server.js
```

## Running the Backend

Install dependencies:

```bash
npm install
```

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

The API runs on:

http://localhost:5000


Environment variables are stored in `.env` and are not committed to GitHub.
