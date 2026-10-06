# ReWear Backend

Node.js + Express backend for the **Clothing Exchange & Swap Marketplace**.

The backend provides REST APIs, authentication, authorization, swap workflows, messaging, reviews, favorites, moderation, admin analytics, location matching, and MongoDB GridFS image storage.

## ✨ Responsibilities

- User registration and authentication
- JWT token generation and validation
- User profile APIs
- Clothing listing CRUD
- Swap-value calculation
- Admin-manageable swap-value rules
- Multi-image upload processing
- MongoDB GridFS image storage
- Swap request management
- Real-time chat with Socket.IO
- Favorites
- Reviews and ratings
- Location-based matching
- Moderation reports
- Admin management APIs
- Admin analytics/report data

## 🧱 Backend Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── listingController.js
│   ├── messageController.js
│   ├── reviewController.js
│   ├── swapRequestController.js
│   └── ...
│
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   └── uploadMiddleware.js
│
├── models/
│   ├── user.js
│   ├── listing.js
│   ├── swapRequest.js
│   ├── message.js
│   ├── review.js
│   └── ...
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── listingRoutes.js
│   ├── swapRequestRoutes.js
│   ├── messageRoutes.js
│   ├── favoriteRoutes.js
│   ├── reviewRoutes.js
│   ├── reportRoutes.js
│   ├── swapValueSettingRoutes.js
│   ├── adminRoutes.js
│   └── ...
│
├── utils/
│   └── swapValueCalculator.js
│
├── uploads/                  # legacy/local filename fallback
├── package.json
└── server.js
```

## 🛠️ Technology Stack

- Node.js
- Express.js
- MongoDB / MongoDB Atlas
- Mongoose
- Socket.IO
- JSON Web Tokens (JWT)
- Multer
- CORS

## ⚙️ Setup

From the repository root:

```bash
cd backend
npm install
npm start
```

The server normally listens on:

```text
http://localhost:5000
```

Render supplies the production `PORT` automatically.

## 🔐 Environment Variables

Configure the backend environment with values similar to:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

For production:

```env
CLIENT_URL=https://clohing-swap-marketplace.vercel.app
```

Use the exact database variable expected by `config/db.js` in the current source if it differs from `MONGO_URI`.

> Never commit credentials, database passwords, JWT secrets or private keys.

## 🗄️ Database

MongoDB stores application data including:

- Users
- Listings
- Swap requests
- Messages
- Favorites
- Reviews
- Moderation reports
- Swap-value settings

Listings contain image references, while image binaries are stored in MongoDB GridFS.

## 👗 Listing Images & GridFS

The upload middleware uses in-memory processing and the listing controller stores each uploaded image in a GridFS bucket named:

```text
listingImages
```

The listing stores references such as:

```text
gridfs:<file-id>
```

### Image upload flow

```text
Multipart request
       ↓
Multer memoryStorage
       ↓
GridFS upload stream
       ↓
MongoDB GridFS
       ↓
Save GridFS file ID in Listing
```

### Image retrieval

The backend exposes an image endpoint:

```text
GET /listings/image/:id
```

The route streams the GridFS file back to the browser with its stored content type.

## 📚 Main API Areas

### Authentication

```text
/auth
```

Handles login and authentication-related operations.

### Users

```text
/users
```

Handles user profile data and user-related operations.

### Listings

```text
/listings
```

Includes:

- create
- list
- single listing
- update
- delete
- personal listings
- location matches
- GridFS image retrieval

### Swap Requests

```text
/swaprequests
```

Supports:

- outgoing requests
- incoming requests
- status updates
- swap lifecycle management

### Messages

```text
/messages
```

Provides persisted chat history and message creation.

### Favorites

```text
/favorites
```

Handles saved listings.

### Reviews

```text
/reviews
```

Handles user reviews and ratings.

### Moderation Reports

```text
/reports
```

Handles user-submitted platform moderation reports.

### Swap Value Settings

```text
/swapvalues
```

Provides administrator-managed rules used by the swap-value calculation.

### Admin

```text
/admin
```

Provides administrator-only management and analytics endpoints.

## 🧮 Swap Value Calculation

The listing creation process calculates the estimated swap value from listing attributes.

Conceptually:

```text
Category base value
        ×
Brand multiplier
        ×
Condition multiplier
        =
Estimated swap value
```

The calculation is backed by configurable settings so administrators can modify business rules through the admin module.

## 💬 Real-Time Chat Architecture

Socket.IO is attached to the same HTTP server as Express.

The real-time workflow is:

```text
Client connects
      ↓
joinSwapRoom
      ↓
Server validates swap participation
      ↓
Client joins swap_<requestId>
      ↓
POST /messages persists message
      ↓
sendMessage Socket.IO event
      ↓
Server broadcasts receiveMessage
      ↓
Other participant sees message instantly
```

Only the requester and listing owner are allowed to join the swap room.

## 🌐 CORS

The backend must allow both development and production frontend origins.

Typical configuration:

```text
http://localhost:5173
https://clohing-swap-marketplace.vercel.app
```

For production deployment, verify `CLIENT_URL` points to the Vercel application.

## 🔒 Authorization Model

The backend uses middleware to distinguish:

```text
Unauthenticated
       ↓
Authenticated user
       ↓
Administrator
```

Regular users cannot grant themselves administrator privileges. Admin role assignment should be controlled by an administrator or the database/administrative process.

Sensitive authorization checks are enforced server-side, including listing ownership and admin-only endpoints.

## 🧪 Local API Testing

The project can be exercised through the frontend directly. A REST client such as Postman is not required for normal project usage.

Useful endpoints for manual verification include:

```text
GET  /listings
GET  /listings/:id
POST /listings
GET  /messages/:swapRequestId
POST /messages
GET  /swaprequests/my
GET  /swaprequests/incoming
```

Admin verification can include:

```text
GET /admin/overview
GET /admin/users
GET /admin/listings
GET /admin/swaps
GET /admin/reviews
GET /admin/reports
```

## 🚀 Production Deployment

Production backend:

```text
https://clohing-swap-marketplace.onrender.com
```

Production frontend:

```text
https://clohing-swap-marketplace.vercel.app
```

### Render checklist

- [ ] Build/start command is correct
- [ ] `PORT` uses Render's supplied value
- [ ] MongoDB Atlas URI is configured
- [ ] JWT secret is configured
- [ ] `CLIENT_URL` points to Vercel
- [ ] Socket.IO CORS matches frontend origin
- [ ] No secrets are committed to Git
- [ ] GridFS image endpoint returns uploaded images

## 🖼️ Legacy Image Compatibility

Older listings may contain a filename rather than a GridFS reference.

The frontend image helper can still resolve those records through:

```text
/uploads/<filename>
```

New uploads use GridFS and are stored as:

```text
gridfs:<file-id>
```

This allows existing demo records and new persistent image records to coexist.

## 🧩 Error Handling

Controllers return appropriate HTTP responses for common failures such as:

- missing records
- invalid IDs
- unauthorized actions
- forbidden ownership/admin operations
- invalid uploads
- server/database errors

The backend logs operational errors for debugging while the frontend displays user-friendly messages.

## 📌 Development Guidelines

- Keep database access in controllers/services rather than directly in routes.
- Keep authentication and admin authorization in middleware.
- Validate ownership before modifying user-owned listings.
- Keep image upload processing in the upload middleware/controller flow.
- Keep Socket.IO events isolated to the relevant swap request room.
- Avoid hardcoding frontend production URLs in backend route logic; use environment configuration.
- Never expose secrets in API responses or source control.

## 🌱 Future Enhancements

Potential backend extensions include:

- Courier/shipping provider integration
- Notification service
- Email notifications
- Advanced analytics aggregation
- Image moderation
- AI-assisted matching
- Audit logging

---

**ReWear Backend — API, business logic, real-time communication and persistent marketplace data.**
