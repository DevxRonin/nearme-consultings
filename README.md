# NearMe Consulting
### AI-Powered Nearby Business Discovery and Booking Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Express.js-green?logo=node.js)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen?logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Project Overview

**NearMe Consulting** is a full-stack, enterprise-grade web application engineered to bridge businesses and individuals with verified local consulting experts. By combining genuine MongoDB GeoJSON geospatial indexing, real-time consultation calendar slot locking, and an intelligent natural language AI recommendation engine, NearMe eliminates directory noise, fake reviews, and scheduling conflicts.

The application adheres to a clean, decoupled full-stack architecture with independent frontend and backend deployments (Vercel & Render).

---

## 2. Key Features

- **Genuine Nearby Geospatial Discovery**: Uses MongoDB `2dsphere` indexes and spherical Haversine calculations to compute real-world travel distances from GPS or manual coordinates.
- **Intelligent Grounded AI Assistant**: Natural language processing extracts domain intent, maximum budget, minimum rating, and radius preferences, strictly querying verified database records without hallucinating data.
- **10 Complete Frontend Pages**:
  1. `Home (/)`: Hero search, GPS detector, sectors carousel, top consultants, how it works, social proof.
  2. `Explore (/explore)`: Real-time search, category selector, rating filter, price filter, radius slider, pagination.
  3. `Business Details (/businesses/[id])`: Full practice profile, hours, services, verified client reviews, review submission form.
  4. `AI Assistant (/ai-assistant)`: Natural language chat interface with grounded database card recommendations and one-click actions.
  5. `Book Consultation (/book & /book/[id])`: Dynamic conflict check, slot reservation, instant unique reference generation.
  6. `My Bookings (/my-bookings)`: Track reservations, view practice details, cancel appointments.
  7. `Login (/login)`: Secure JWT authentication with demo credentials quick-fill.
  8. `Register (/register)`: Account creation for clients and practice managers.
  9. `About Us (/about)`: Company vision, architectural principles, verified statistics.
  10. `Contact Us (/contact)`: Direct headquarters info, helpline, support ticket form.
  11. `404 Not Found (not-found.jsx)`: Friendly redirection.
- **Conflict-Free Scheduling Engine**: Backend validates slot availability prior to confirmation, ensuring no duplicate bookings for the same consultant, date, and time slot.
- **Production Dual-Mode Database Layer**: Seamlessly connects to MongoDB Atlas in production, while including an in-memory/demo mode with 13 pre-seeded practices across 7 consulting categories.
- **Security & Best Practices**: Helmet HTTP headers, CORS whitelisting, Express Rate Limiter, bcrypt password hashing, and JWT tokens.

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18, JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: MongoDB Atlas with Mongoose ORM
- **Security**: Helmet, Express Rate Limit, Express Validator, CORS, bcryptjs, jsonwebtoken
- **AI Engine**: Contextual Intent Parser & Grounded Rule-Based Fallback + Optional OpenAI API integration

---

## 4. Architecture & System Flow

```
                      +-----------------------------+
                      |   Next.js 14 Web Frontend   |
                      |  (Vercel / React / Tailwind)|
                      +--------------+--------------+
                                     |
                                     | REST API (Axios + JWT)
                                     v
                      +-----------------------------+
                      |   Node.js / Express Backend |
                      |    (Render / REST Services) |
                      +--------------+--------------+
                                     |
            +------------------------+------------------------+
            |                        |                        |
            v                        v                        v
+-----------------------+ +---------------------+ +-----------------------+
|  Geospatial & Search  | |  Booking Conflict   | |  AI Recommendation    |
|  (2dsphere GeoJSON)   | |  Prevention Engine  | |  (Intent & Ranking)   |
+-----------+-----------+ +----------+----------+ +-----------+-----------+
            |                        |                        |
            +------------------------+------------------------+
                                     |
                                     v
                      +-----------------------------+
                      |     MongoDB Atlas Cluster   |
                      |  (Users, Businesses,        |
                      |   Bookings, Reviews)        |
                      +-----------------------------+
```

---

## 5. Folder Structure

```
nearme-consulting/
├── README.md
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB Atlas connection & fallback
│   │   └── memoryStore.js        # High-performance in-memory demo store
│   ├── controllers/
│   │   ├── adminController.js    # Admin booking oversight & statuses
│   │   ├── aiController.js       # AI Chat query and recommendation
│   │   ├── authController.js     # User registration, login, session
│   │   ├── bookingController.js  # Booking creation, conflict check, cancel
│   │   ├── businessController.js # Search, geospatial nearby, details
│   │   └── reviewController.js   # Client reviews & rating recalculation
│   ├── data/
│   │   └── seedData.js           # 13 verified demo consulting practices
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & admin guard
│   │   └── errorMiddleware.js    # Centralized HTTP error handler
│   ├── models/
│   │   ├── Booking.js            # Booking schema with compound indexes
│   │   ├── Business.js           # GeoJSON coordinates, 2dsphere index
│   │   ├── Review.js             # Client ratings (1-5) and feedback
│   │   └── User.js               # User accounts & bcrypt password hash
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── businessRoutes.js
│   │   └── reviewRoutes.js
│   ├── services/
│   │   ├── bookingService.js     # Slot conflict logic & reference generator
│   │   └── recommendationService.js # Haversine & NLP Intent extractor
│   ├── test/
│   │   └── api.test.js           # 15-test automated backend test suite
│   ├── utils/
│   │   └── validators.js         # express-validator rules
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml               # Render deploy config
│   ├── seed.js                   # Seed execution script
│   └── server.js                 # Express application root
│
└── frontend/
    ├── app/
    │   ├── about/page.jsx        # About Us page
    │   ├── ai-assistant/page.jsx # Grounded AI Assistant chat interface
    │   ├── book/
    │   │   ├── [id]/page.jsx     # Direct business booking
    │   │   └── page.jsx          # General booking form
    │   ├── businesses/
    │   │   └── [id]/page.jsx     # Business details, services & reviews
    │   ├── contact/page.jsx      # Contact & support page
    │   ├── explore/page.jsx      # Explore, search, filters & pagination
    │   ├── login/page.jsx        # Login page with demo credentials
    │   ├── my-bookings/page.jsx  # Client booking management & cancel
    │   ├── register/page.jsx     # Registration page
    │   ├── globals.css           # Tailwind directives & theme styling
    │   ├── layout.jsx            # Global layout with Navbar, Footer, Toast
    │   ├── not-found.jsx         # Custom 404 page
    │   └── page.jsx              # Landing page
    ├── components/
    │   ├── BookingForm.jsx       # Reusable booking & conflict check form
    │   ├── BusinessCard.jsx      # Responsive consultant profile card
    │   ├── Footer.jsx            # Global footer
    │   └── Navbar.jsx            # Global responsive navigation
    ├── context/
    │   └── AuthContext.jsx       # Authentication state & token management
    ├── services/
    │   └── api.js                # Axios client with JWT interceptor
    ├── .env.example
    ├── next.config.js
    ├── package.json
    ├── tailwind.config.js
    └── vercel.json               # Vercel deploy config
```

---

## 6. Database Schema Design

### 1. Users Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `name` | String | Full client/admin name |
| `email` | String | Unique lowercase email |
| `passwordHash` | String | bcrypt hashed password |
| `phone` | String | Contact phone |
| `role` | String | `customer` or `admin` |
| `createdAt` | Date | Timestamp |

### 2. Businesses Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `name` | String | Consulting Practice Name |
| `slug` | String | URL-safe unique slug |
| `description`| String | Detailed summary |
| `category` | String | Consulting domain |
| `address` | String | Physical office address |
| `city` | String | City (e.g. Pune, PCMC) |
| `location` | GeoJSON Point | `{ type: 'Point', coordinates: [lon, lat] }` (2dsphere index) |
| `rating` | Number | Computed average rating (1.0 to 5.0) |
| `price` | Number | Consultation starting fee (₹) |
| `services` | [String] | List of consulting specializations |
| `phone` | String | Contact phone |
| `email` | String | Official contact email |
| `images` | [String] | Practice photos |
| `workingHours`| String | Office operational hours |
| `isVerified`| Boolean | Practice verification flag |
| `isDemo` | Boolean | Demo record marker |

### 3. Bookings Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `businessId` | ObjectId (ref: Business) | Selected consulting firm |
| `userId` | ObjectId (ref: User) | Associated account (optional) |
| `customerName`| String | Client name |
| `email` | String | Client email |
| `phone` | String | Contact number |
| `service` | String | Selected advisory service |
| `bookingDate`| String | Date (YYYY-MM-DD) |
| `bookingTime`| String | Slot (e.g. 10:00 AM) |
| `location` | String | Online or In-Person |
| `status` | String | `pending`, `confirmed`, `cancelled`, `completed` |
| `bookingReference` | String | Unique reference (e.g. `NMC-20261128-DEMO1`) |

---

## 7. REST API Documentation

### Health
- `GET /api/health` — Service health check.

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `phone`, `role`).
- `POST /api/auth/login` — Authenticate and receive JWT (`email`, `password`).
- `GET /api/auth/me` — Retrieve current authenticated user profile (`Bearer <token>`).

### Businesses
- `GET /api/businesses` — Search & filter businesses (`search`, `category`, `city`, `minRating`, `maxPrice`, `sort`, `page`, `limit`).
- `GET /api/businesses/nearby` — Geospatial nearby query (`latitude`, `longitude`, `radius`, `category`, `maxPrice`).
- `GET /api/businesses/:id` — Get single business by ID or slug with reviews & related practices.
- `GET /api/businesses/categories` — Get distinct consulting categories with counts.
- `GET /api/businesses/:id/reviews` — Get all client reviews for a business.

### Bookings
- `POST /api/bookings` — Create a consultation booking (validates slot availability first).
- `GET /api/bookings/check-availability` — Verify if a specific date & time slot is free.
- `GET /api/bookings/my` — Get user bookings by JWT token or query email.
- `GET /api/bookings/:id` — Fetch booking details by reference or ID.
- `PATCH /api/bookings/:id/cancel` — Cancel an active booking.

### AI Assistant
- `POST /api/ai/chat` — Process natural language queries with intent extraction and grounded database matching.
- `POST /api/ai/recommend` — Receive structured recommendations based on category and budget.

### Reviews
- `POST /api/reviews` — Submit a client review and recalculate practice average rating.

### Admin
- `GET /api/admin/bookings` — Admin view of all platform bookings.
- `PATCH /api/admin/bookings/:id/status` — Update booking status.

---

## 8. Local Installation & Development

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### 1. Clone & Setup
```bash
git clone <repository-url>
cd nearme-consulting
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
npm install
```
*(Optional: Provide `MONGO_URI` in `.env` to connect to your MongoDB Atlas cluster. If omitted, the backend automatically runs in high-performance in-memory demo mode with all 13 seed practices!)*

### 3. Run Backend Seed & Tests
```bash
# Seed database (when connecting to MongoDB Atlas)
npm run seed

# Run automated 15-point API test suite
npm test

# Start backend server (runs on port 5000)
npm run dev
```

### 4. Configure & Start Frontend
In a new terminal window:
```bash
cd frontend
cp .env.example .env.local
npm install

# Start Next.js development server (runs on port 3000)
npm run dev

# Or test the optimized production build
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Demo Credentials

The platform includes pre-configured demo credentials for technical demonstrations:

- **Client Account**:
  - Email: `customer@nearme.com`
  - Password: `customer123`
- **Admin Account**:
  - Email: `admin@nearme.com`
  - Password: `admin123`

---

## 10. Production Deployment Guide

### A. Database (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free M0 cluster (e.g. in AWS Mumbai `ap-south-1`).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) to permit Render connections.
5. Copy your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/nearme?retryWrites=true&w=majority`.

### B. Backend (Render)
1. Sign in to [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your repository and configure:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Secure Random String>`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
5. Deploy Web Service and note your public Render URL (e.g. `https://nearme-backend.onrender.com`).

### C. Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project** and import your repository.
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://nearme-backend.onrender.com` (Your Render Backend URL)
5. Click **Deploy**. Vercel will run `npm run build` and publish your live production site.

---

## 11. Verification & Quality Assurance Checklist

- [x] Backend connects to database with automatic in-memory fallback.
- [x] All 15 automated backend integration tests pass (`npm test`).
- [x] Next.js 14 frontend compiles and statically exports all 12 routes with zero errors (`npm run build`).
- [x] Real-time slot availability check prevents double-booking.
- [x] Grounded AI Assistant extracts intent and references real database records.
- [x] Geolocation calculations use Haversine and GeoJSON spherical distance.
- [x] Responsive layout tested on desktop, tablet, and mobile viewports.
