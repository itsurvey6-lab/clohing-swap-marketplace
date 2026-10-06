# ReWear Frontend

React + Vite frontend for the **Clothing Exchange & Swap Marketplace**.

The frontend provides the user-facing marketplace, authentication screens, listing management, swap workflows, real-time chat, favorites, reviews, location discovery, and administrator control center.

## ✨ Features

- Responsive React UI
- Login / registration
- Protected routes
- Clothing discovery and search
- Category, size and condition filters
- Location-based recommendations
- Listing creation and editing
- Multiple clothing-image upload support
- Persistent GridFS image rendering
- Item detail gallery
- Favorites
- Swap requests
- Real-time Socket.IO chat
- Dashboard and swap statistics
- Reviews and ratings
- Admin dashboard
- Admin listing/user/swap/review/report management
- Analytics report generation
- Print / Save as PDF reporting
- Framer Motion interactions and transitions

## 🧱 Frontend Architecture

```text
src/
│
├── components/
│   ├── listings/
│   │   ├── ListingCard.jsx
│   │   ├── ListingsGrid.jsx
│   │   ├── ListingsHero.jsx
│   │   ├── ListingFilters.jsx
│   │   └── SearchBar.jsx
│   └── ...
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Listings.jsx
│   ├── CreateListing.jsx
│   ├── EditListing.jsx
│   ├── ListingDetails.jsx
│   ├── SwapRequests.jsx
│   ├── Chat.jsx
│   ├── Dashboard.jsx
│   ├── Favorites.jsx
│   ├── AdminDashboard.jsx
│   └── ...
│
├── services/
│   └── api.js
│
├── utils/
│   └── imageUrl.js
│
├── App.jsx
└── main.jsx
```

## 🛠️ Main Technologies

- React
- Vite
- React Router
- Axios
- Framer Motion
- Socket.IO Client
- Tailwind CSS utility classes

## ⚙️ Setup

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The local development server normally runs at:

```text
http://localhost:5173
```

## 🔐 Environment Configuration

Create:

```text
frontend/.env
```

For local development:

```env
VITE_API_URL=http://localhost:5000
```

For Vercel:

```env
VITE_API_URL=https://clohing-swap-marketplace.onrender.com
```

Do not put backend private secrets in frontend environment variables.

## 🔌 API Client

Frontend API requests should use the shared Axios instance:

```text
src/services/api.js
```

This keeps the API base URL environment-dependent:

```text
Local development → localhost:5000
Production        → Render backend
```

Avoid hardcoding `http://localhost:5000` inside pages or components.

## 🖼️ Image Handling

Listing cards and detail pages use the shared helper:

```text
src/utils/imageUrl.js
```

The helper understands three image formats:

### GridFS

```text
gridfs:<file-id>
```

Converted to:

```text
/listings/image/<file-id>
```

### Existing hosted URL

```text
https://...
```

Returned unchanged.

### Legacy filename

```text
some-file.jpg
```

Resolved through the backend `/uploads/` fallback.

This compatibility layer allows old and new listings to coexist.

## 👗 Multiple Image Listings

New listings support up to six image files.

The frontend sends multiple files using the same field name:

```text
image
```

The first image is retained as the primary listing image, while the complete `images[]` collection is displayed on the details page.

## 🧭 Main Routes

Typical application routes include:

| Route | Purpose |
|---|---|
| `/` | Home / discovery |
| `/login` | Login |
| `/register` | Registration |
| `/listings` | Marketplace |
| `/create-listing` | Create listing |
| `/listings/:id` | Listing details |
| `/edit-listing/:id` | Edit listing |
| `/swap-requests` | Incoming / outgoing swaps |
| `/chat/:swapRequestId` | Swap negotiation chat |
| `/favorites` | Saved listings |
| `/dashboard` | User dashboard |
| `/admin` | Administrator control center |

Exact route parameters should follow `App.jsx` in the current source.

## 🔄 Category Navigation

The Home page uses category cards such as:

- Dresses
- Shirts
- Jackets
- Pants

These navigate to the listings page using category query parameters, for example:

```text
/listings?category=Dress
```

The Listings page reads the query parameter and applies the category filter.

## 💬 Real-Time Chat

The Chat page uses `socket.io-client`.

The workflow is:

```text
Open swap chat
      ↓
Connect Socket.IO
      ↓
Join swap room
      ↓
Load message history through REST
      ↓
Send message through REST
      ↓
Broadcast saved message through Socket.IO
      ↓
Receiver sees message immediately
```

The REST response is still the source of persistence; Socket.IO is used for real-time delivery.

## 🛡️ Protected UI

Protected routes are handled by the application's authentication guard.

The frontend checks for the stored JWT before opening authenticated pages such as:

- Dashboard
- Create Listing
- Favorites
- Swap Requests
- Chat
- Admin

Backend authorization remains the final security boundary.

## 🧑‍💼 Admin Experience

The Admin Control Center includes:

- Overview KPI cards
- Users table and user detail modal
- Listings table with image thumbnails
- Listing detail modal with image gallery
- Swap request monitoring
- Review monitoring
- Moderation reports
- Custom report generation
- Date-range filtering
- Print / Save as PDF

The admin UI is designed to avoid relying on browser alerts for normal record inspection.

## 📊 Reporting

The frontend report center can generate:

- Platform summary reports
- User reports
- Listing reports
- Swap reports
- Review reports
- Moderation reports

Time ranges include:

- Today
- Last 7 days
- Last 30 days
- All time
- Custom From / To dates

Generated reports can be printed or saved through the browser's print dialog.

## 🧪 Build & Production Check

Run a production build locally before pushing:

```bash
npm run build
```

Preview the production build if needed:

```bash
npm run preview
```

Before production deployment, verify:

```text
API URL → Render backend
No localhost URLs in production API calls
GridFS image URLs render correctly
Socket.IO connects to Render
Admin API calls use production API URL
```

## 🚀 Deployment

The frontend is deployed on Vercel.

Production URL:

```text
https://clohing-swap-marketplace.vercel.app
```

Backend URL:

```text
https://clohing-swap-marketplace.onrender.com
```

## 🧩 Development Guidelines

- Keep API calls in the shared `api.js` client where practical.
- Do not hardcode production URLs in components.
- Reuse `getImageUrl()` for listing images.
- Keep authenticated pages protected.
- Keep Socket.IO effects at component level, never inside another function or event handler.
- Prefer reusable UI components for tables, cards and modals.
- Test locally before deploying to Vercel.

## 📌 Related Documentation

For the complete application architecture, setup, deployment and backend information, see the root and backend README files.

---

**ReWear Frontend — React experience for a sustainable clothing exchange platform.**
