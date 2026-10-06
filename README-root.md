# ReWear — Clothing Exchange & Swap Marketplace

> A community-driven MERN marketplace for exchanging pre-loved clothing through direct swaps, value-based matching, location discovery, real-time negotiation, reviews, and administration.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=111827)](#frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](#backend)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](#architecture)
[![Realtime](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io&logoColor=white)](#real-time-chat)

## 🌿 Project Overview

ReWear is a clothing exchange and swap platform designed around **reuse rather than buying and selling**. Users can list clothing they no longer need, discover items from the community, compare swap value, send swap requests, negotiate through real-time chat, and complete exchanges.

The project was built as a full-stack MERN application and deployed with a production-style architecture:

```text
                    ┌──────────────────────────┐
                    │        User Browser      │
                    └────────────┬─────────────┘
                                 │
                         React / Vite UI
                                 │
                    ┌────────────▼─────────────┐
                    │          Vercel          │
                    │      Frontend Hosting    │
                    └────────────┬─────────────┘
                                 │ HTTPS API
                    ┌────────────▼─────────────┐
                    │          Render          │
                    │ Node.js + Express +      │
                    │ Socket.IO Backend        │
                    └───────┬─────────┬────────┘
                            │         │
                    ┌───────▼───┐ ┌──▼──────────────┐
                    │ MongoDB   │ │ MongoDB GridFS  │
                    │ Atlas     │ │ Listing Images  │
                    └───────────┘ └─────────────────┘
```

## ✨ Key Features

### 👤 User & Authentication

- User registration and login
- JWT-based authentication
- Protected application routes
- User profile and location
- Role-based access for standard users and administrators

### 👗 Clothing Listings

- Create, edit, view and delete listings
- Clothing category, brand, size and condition
- Automatically calculated swap value
- Availability status
- Location information
- Multiple image uploads (up to 6 images per listing)
- MongoDB GridFS image storage for persistent production uploads

### 🔎 Discovery & Search

- Community marketplace listing grid
- Search by title, brand and category
- Category filters
- Size and condition filters
- Swap-value sorting
- Home-page category navigation
- Location-based recommendations

### 🔄 Swap Requests

- Offer one personal listing in exchange for another user's listing
- Incoming and outgoing request views
- Accept / reject workflow
- Swap status tracking
- Swap detail information

### 💬 Real-Time Chat

- One-to-one negotiation tied to a swap request
- Socket.IO real-time delivery
- REST API persistence for messages
- Automatic message refresh in the active conversation
- Conversation history stored in MongoDB

### ⭐ Favorites & Reviews

- Add listings to favorites
- Favorites management page
- Post-swap reviews and ratings
- Admin review monitoring

### 🛡️ Admin Control Center

- Dashboard overview with platform KPIs
- User management and role changes
- Listing management with image preview
- Swap request monitoring
- Review monitoring
- Moderation report management
- Detail modals instead of browser alerts for inspection
- Listing image galleries in admin views
- Search, status, role, rating and sorting controls

### 📊 Reports & Analytics

The Reports Center supports administrator-generated reports for:

- Platform summary
- Users
- Listings
- Swaps
- Reviews
- Moderation reports
- Custom date ranges
- Today / last 7 days / last 30 days / all-time views
- Browser print / Save as PDF

## 🧮 Swap Value Calculator

Swap value is calculated from configurable business rules based on listing attributes such as:

```text
Category base value
        ×
Brand multiplier
        ×
Condition multiplier
        =
Estimated swap value
```

The project also includes an administrative settings area for managing swap-value rules instead of requiring all pricing logic to remain permanently hard-coded.

## 🧭 Main User Flow

```text
Register / Login
       ↓
Create Listing
       ↓
Upload Clothing Images
       ↓
Browse Community
       ↓
View Item
       ↓
Select Own Item to Offer
       ↓
Send Swap Request
       ↓
Other User Accepts / Rejects
       ↓
Real-Time Chat
       ↓
Complete Exchange
       ↓
Review / Rating
```

## 🧑‍💼 Admin Flow

```text
Admin Login
    ↓
Admin Control Center
    ├── Overview
    ├── Users
    ├── Listings
    ├── Swaps
    ├── Reviews
    ├── Moderation Reports
    └── Analytics Reports
```

## 🏗️ Repository Structure

```text
clohing-swap-marketplace/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/              # legacy/local upload fallback
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.*
│
└── README.md
```

## 🧰 Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Framer Motion
- Tailwind CSS utility classes
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- Socket.IO
- JWT authentication
- Multer
- CORS

### Deployment

- Vercel — frontend
- Render — backend
- MongoDB Atlas — database
- MongoDB GridFS — persistent listing image storage

## ⚙️ Local Development

### Prerequisites

- Node.js and npm
- MongoDB local installation **or** a MongoDB Atlas connection
- Git

### Clone the repository

```bash
git clone https://github.com/itsurvey6-lab/clohing-swap-marketplace.git
cd clohing-swap-marketplace
```

### Backend

```bash
cd backend
npm install
npm start
```

The backend normally runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

## 🔐 Environment Variables

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

For Vercel, set:

```env
VITE_API_URL=https://clohing-swap-marketplace.onrender.com
```

### Backend

Configure your backend environment with the values required by the project, typically including:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

For Render, `CLIENT_URL` should point to the deployed Vercel frontend.

> Never commit secrets, JWT keys, database passwords, or private connection strings to GitHub.

## 🖼️ Image Storage

New listing images are stored in **MongoDB GridFS** instead of relying on the Render service's temporary local filesystem.

The application stores an identifier in the listing document, for example:

```text
gridfs:<file-id>
```

The frontend converts that value into the backend image endpoint and displays the image without depending on a local computer path.

This design also keeps older filename-based image records compatible through the shared image URL helper.

## 💬 Real-Time Chat

Chat combines two mechanisms:

1. **REST API** — saves messages to MongoDB.
2. **Socket.IO** — broadcasts newly saved messages to the swap room in real time.

Each swap conversation is isolated to a Socket.IO room associated with the swap request.

## 🛡️ Security & Access Control

The application uses:

- JWT authentication
- Protected frontend routes
- Backend authentication middleware
- Admin-only backend routes
- Role validation for administrative actions
- CORS configuration for local and production frontends
- File-type and upload-size validation
- Server-side ownership checks for listing actions

## 🧪 Suggested Final QA Checklist

Before submission, verify the production flow from end to end:

- [ ] Register and login
- [ ] User profile loads
- [ ] Create listing
- [ ] Upload multiple images
- [ ] Images load on Listings
- [ ] Images load on Details
- [ ] Images load on Dashboard
- [ ] Images load in Favorites
- [ ] Search works
- [ ] Filters work
- [ ] Home category navigation works
- [ ] Send swap request
- [ ] Accept / reject swap
- [ ] Real-time chat works without refresh
- [ ] Favorites add/remove works
- [ ] Reviews work
- [ ] Location recommendations work
- [ ] Admin Overview works
- [ ] Admin Users works
- [ ] Admin Listings + image preview works
- [ ] Admin Swaps works
- [ ] Admin Reviews works
- [ ] Moderation Reports work
- [ ] Analytics reports work
- [ ] Date filters work
- [ ] Print / Save as PDF works
- [ ] Vercel deployment is Ready
- [ ] Render service is healthy
- [ ] MongoDB Atlas connection is healthy

## 🚫 Phase 1 Scope

The following items are intentionally outside the first phase:

- Online payment processing
- AI-powered fashion recommendations
- AR clothing try-on
- Native mobile application

These remain suitable future enhancements rather than submission blockers.

## 🚀 Deployment

### Frontend — Vercel

Production frontend:

```text
https://clohing-swap-marketplace.vercel.app
```

### Backend — Render

Production backend:

```text
https://clohing-swap-marketplace.onrender.com
```

### Source Repository

```text
https://github.com/itsurvey6-lab/clohing-swap-marketplace
```

## 📌 Project Context

This project was developed to demonstrate a complete sustainable-fashion exchange platform covering:

- full-stack web development
- REST API design
- JWT authentication
- MongoDB data modeling
- real-time communication
- file/media handling
- role-based administration
- analytics and reporting
- cloud deployment

## 🌱 Future Enhancements

Potential next-phase features include:

- Courier/shipping integration for remote swaps
- AI-assisted swap recommendations
- Clothing condition verification
- Sustainability impact tracking
- Community groups
- Mobile application

## 👨‍💻 Repository

**GitHub:** https://github.com/itsurvey6-lab/clohing-swap-marketplace

**Live Demo:** https://clohing-swap-marketplace.vercel.app

---

### ReWear

**Swap more. Waste less. Keep fashion moving.**
