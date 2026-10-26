# ClockIt

ClockIt is a student-focused campus platform that brings multiple
student-to-student services into one application.

The platform currently includes:

-   **Stays** --- discover, post, manage, save, and review accommodation
    listings.
-   **Roomies** --- create and discover roommate listings.
-   **Marketplace** --- buy and sell products between students.
-   **Profile** --- manage personal information, university/college
    information, preferences, and college-email verification.
-   **Authentication** --- registration, login, OTP verification,
    protected routes, and Supabase-based sessions.

------------------------------------------------------------------------

## Live Deployment

  Service           Platform   URL
  ----------------- ---------- ----------------------------------
  Frontend          Vercel      https://clock-it-murex.vercel.app
  Backend API       Render     https://clockit-api.onrender.com
  Database & Auth   Supabase   Add your Supabase project URL

> The frontend and backend are deployed separately. The React
> application communicates with the Express API, while the backend
> communicates with Supabase.

------------------------------------------------------------------------

## Architecture

``` text
                    ┌──────────────────────┐
                    │       Browser        │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
            Authentication  Controllers    Services
                 │             │
                 └─────────────┼─────────────┘
                               ▼
                    ┌──────────────────────┐
                    │       Supabase       │
                    │ Auth + PostgreSQL    │
                    │ Storage              │
                    └──────────────────────┘

                    ┌──────────────────────┐
                    │       Resend         │
                    │ College OTP Email    │
                    └──────────────────────┘
```

### Authentication flow

``` text
React
  │
  │ Login / Register
  ▼
Express API
  │
  ▼
Supabase Auth
  │
  ▼
Access Token
  │
  ▼
React stores Supabase session
  │
  │ Authorization: Bearer <access_token>
  ▼
Protected Express API
  │
  ▼
Supabase
```

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   React 19
-   Vite 6
-   React Router
-   Tailwind CSS
-   Lucide React
-   Axios
-   GSAP
-   Supabase JavaScript client
-   canvas-confetti

## Backend

-   Node.js
-   Express 5
-   ES Modules
-   CORS
-   Multer
-   Nodemailer
-   Supabase JavaScript client

## Database & Authentication

-   Supabase Authentication
-   Supabase PostgreSQL
-   Supabase Storage where applicable

## Deployment

-   **Frontend:** Vercel
-   **Backend:** Render
-   **Database/Auth:** Supabase

------------------------------------------------------------------------

# Project Structure

``` text
ClockIt/
│
├── client/
│   ├── public/
│   │   ├── hero images
│   │   ├── marketplace images
│   │   └── roomies assets
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── home/
│   │   │   ├── roomies/
│   │   │   └── stays/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── lib/
│   │   │
│   │   ├── pages/
│   │   │   ├── About/
│   │   │   ├── Home/
│   │   │   ├── Marketplace/
│   │   │   ├── Registration/
│   │   │   ├── Roomies/
│   │   │   └── stays/
│   │   │
│   │   ├── services/
│   │   │   ├── authApi.js
│   │   │   ├── marketplaceApi.js
│   │   │   ├── profileApi.js
│   │   │   ├── roomieApi.js
│   │   │   └── staysApi.js
│   │   │
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── supabase.js
│   │
│   ├── controllers/
│   │   ├── areaController.js
│   │   ├── authController.js
│   │   ├── marketplaceController.js
│   │   ├── otpController.js
│   │   ├── profileController.js
│   │   ├── roomieController.js
│   │   └── stayController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── areaRoutes.js
│   │   ├── authRoutes.js
│   │   ├── marketplaceRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── roomieRoutes.js
│   │   ├── stayRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   └── otpService.js
│   │
│   ├── utils/
│   │   └── email.js
│   │
│   ├── server.js
│   └── package.json
│
├── docs/
│   ├── Design_System.md
│   └── stays_migration.sql
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

# Features

## 1. Authentication

ClockIt uses Supabase Authentication with an Express backend.

Available authentication endpoints:

``` text
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register
POST /api/auth/login
```

The frontend obtains the Supabase session and sends the access token to
protected backend endpoints.

Protected requests use:

``` http
Authorization: Bearer <access_token>
```

The backend authentication middleware validates the token and exposes
the authenticated user through:

``` javascript
req.user
```

The authenticated user's ID should be obtained with:

``` javascript
req.user.id
```

Do not trust a user ID supplied by the frontend for ownership-sensitive
operations.

------------------------------------------------------------------------

# 2. Profile

The profile module supports:

-   Profile information
-   Username
-   Bio
-   Phone number
-   University/college selection
-   College email
-   College email verification
-   Profile preferences

Profile endpoints:

``` text
GET    /api/profile
PUT    /api/profile

GET    /api/profile/colleges

POST   /api/profile/college/send-otp
POST   /api/profile/college/verify-otp

GET    /api/profile/preferences
PUT    /api/profile/preferences
```

All profile endpoints are authenticated.

### University relationship

The profile stores the selected college through:

``` text
profiles.university_id
        │
        ▼
     colleges.id
```

College email domains are stored separately in:

``` text
college_domains
```

Do not treat the university name as the foreign-key value.

------------------------------------------------------------------------

# 3. Stays

The Stays module provides accommodation discovery and management.

Users can:

-   Browse stays
-   View stay details
-   View featured stays
-   Post a stay
-   Edit a stay
-   Delete a stay
-   Manage their listings
-   Save/unsave stays
-   Record views
-   Send inquiries
-   Write reviews
-   Edit reviews
-   Delete reviews
-   Upload stay images

### Public endpoints

``` text
GET /api/stays
GET /api/stays/featured
GET /api/stays/:id
GET /api/stays/:id/reviews
GET /api/stays/seed
```

### Protected endpoints

``` text
GET    /api/stays/my/listings

POST   /api/stays
POST   /api/stays/upload/image

PUT    /api/stays/:id
PATCH  /api/stays/:id/status
DELETE /api/stays/:id

POST   /api/stays/:id/save
DELETE /api/stays/:id/save

POST   /api/stays/:id/view
POST   /api/stays/:id/inquiries

POST   /api/stays/:id/reviews
PUT    /api/stays/:id/reviews/:reviewId
DELETE /api/stays/:id/reviews/:reviewId
```

Stay image uploads are handled using Multer and are limited to image
files with a maximum size of 10 MB.

------------------------------------------------------------------------

# 4. Roomies

The Roomies module allows students to create and discover roommate
listings.

Users can:

-   Browse roommate listings
-   View a listing
-   Create a listing
-   View their own listings
-   Edit a listing
-   Delete a listing

Endpoints:

``` text
GET    /api/roomies
GET    /api/roomies/:id

GET    /api/roomies/user/me/listings

POST   /api/roomies
PUT    /api/roomies/:id
DELETE /api/roomies/:id
```

Creating, editing, deleting, and viewing personal listings require
authentication.

------------------------------------------------------------------------

# 5. Marketplace

The Marketplace allows users to list and manage products.

Users can:

-   Browse products
-   View product details
-   Create product listings
-   View their own products
-   Edit listings
-   Delete listings
-   Mark products as sold
-   Upload product images

Endpoints:

``` text
GET    /api/marketplace/products
GET    /api/marketplace/products/:id

GET    /api/marketplace/my-products

POST   /api/marketplace/products
PUT    /api/marketplace/products/:id
DELETE /api/marketplace/products/:id

PATCH  /api/marketplace/products/:id/sold

POST   /api/marketplace/products/:id/images
```

Product image uploads:

-   JPEG
-   PNG
-   WebP
-   Maximum size: 5 MB

------------------------------------------------------------------------

# 6. Areas

The Areas module provides location/area information and reviews.

Endpoints:

``` text
GET  /api/areas
GET  /api/areas/:id
GET  /api/areas/:id/reviews
POST /api/areas/:id/reviews
```

Creating an area review requires authentication.

------------------------------------------------------------------------

# 7. User-Specific Data

User-related stay information is available through:

``` text
GET /api/users/me/saved-stays
GET /api/users/me/recently-viewed
GET /api/users/me/inquiries
```

These endpoints require authentication.

------------------------------------------------------------------------

# Frontend Routes

The current React application contains routes including:

``` text
/
 /login
 /register
 /verify-email
 /email-confirmed
 /account-created
 /profile
 /about

 /roomies
 /roomies/create

 /marketplace
 /marketplace/add
 /marketplace/my-listing
 /marketplace/product/:id
 /marketplace/product/:id/edit

 /stays
 /stay
 /stays/post
 /stays/create
 /stays/my-listings
 /stays/saved
 /stays/inquiries
 /stays/:id
 /stays/:id/edit
```

Some routes are protected using the frontend `ProtectedRoute` component.

------------------------------------------------------------------------

# Environment Variables

## Frontend

Create:

``` text
client/.env.local
```

For local development:

``` env
VITE_API_URL=http://localhost:5800/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

For Vercel production, configure the same variables in the Vercel
project settings, but use the deployed API:

``` env
VITE_API_URL=https://clockit-api.onrender.com/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

> Vite variables prefixed with `VITE_` are exposed to the browser. Only
> use public/client-safe values there.

## Backend

Create:

``` text
server/.env
```

The backend requires Supabase configuration similar to:

``` env
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
RESEND_API_KEY=your_resend_api_key
```

Never expose `SUPABASE_SECRET_KEY` or other backend secrets to the
frontend.

Never commit `.env` files.

------------------------------------------------------------------------

# Local Development

## Prerequisites

Install:

-   Node.js
-   npm
-   Git
-   A Supabase project

------------------------------------------------------------------------

## 1. Clone the repository

``` bash
git clone <REPOSITORY_URL>
cd ClockIt
```

------------------------------------------------------------------------

## 2. Install frontend dependencies

``` bash
cd client
npm install
```

------------------------------------------------------------------------

## 3. Install backend dependencies

From the project root:

``` bash
cd server
npm install
```

------------------------------------------------------------------------

## 4. Configure environment variables

Create the required:

``` text
client/.env.local
server/.env
```

Use your local API URL for the frontend and your Supabase/Resend
credentials for the backend.

------------------------------------------------------------------------

## 5. Start the backend

From `server`:

``` bash
npm run dev
```

The backend uses:

``` text
http://localhost:5800
```

when configured with the project's local development port.

The production/start command is:

``` bash
npm start
```

------------------------------------------------------------------------

## 6. Start the frontend

From `client`:

``` bash
npm run dev
```

Vite will display the local development URL in the terminal.

------------------------------------------------------------------------

# Frontend Commands

From `client`:

``` bash
npm run dev
```

Start the Vite development server.

``` bash
npm run build
```

Create a production build.

``` bash
npm run preview
```

Preview the production build locally.

``` bash
npm run lint
```

Run ESLint.

------------------------------------------------------------------------

# Backend Commands

From `server`:

``` bash
npm run dev
```

Start the backend with nodemon.

``` bash
npm start
```

Start the backend using Node.

------------------------------------------------------------------------

# Production Deployment

## Frontend --- Vercel

The frontend is deployed from the `client` directory.

Recommended Vercel settings:

``` text
Root Directory: client
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Production frontend environment variables should include:

``` env
VITE_API_URL=https://clockit-api.onrender.com/api
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

------------------------------------------------------------------------

## Backend --- Render

The backend is deployed from the `server` directory.

Typical settings:

``` text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Backend environment variables should be configured in Render rather than
committed to Git.

The deployed API currently runs at:

``` text
https://clockit-api.onrender.com
```

API routes are available under:

``` text
https://clockit-api.onrender.com/api
```

------------------------------------------------------------------------

# Security Rules

### Never commit secrets

Never commit:

``` text
.env
.env.local
SUPABASE_SECRET_KEY
RESEND_API_KEY
```

### Keep admin credentials server-side

The Supabase admin client uses the secret key and must only run on the
backend.

### Use authenticated identity for ownership

Use:

``` javascript
req.user.id
```

for user-owned resources.

Do not trust:

``` javascript
req.body.userId
```

for authorization.

### Protected routes

Protected Express routes should use:

``` javascript
requireAuth
```

and public routes should only omit authentication when the operation is
intentionally public.

------------------------------------------------------------------------

# API Authentication Example

Authenticated frontend requests should include the Supabase access
token:

``` http
Authorization: Bearer <access_token>
```

Backend middleware validates the token and makes the user available
through:

``` javascript
req.user
```

Controllers can then safely use:

``` javascript
const userId = req.user.id;
```

------------------------------------------------------------------------

# Development Workflow

For new development:

``` text
1. Pull latest code
       ↓
2. Create a feature branch
       ↓
3. Make changes locally
       ↓
4. Run frontend + backend locally
       ↓
5. Test the feature
       ↓
6. Run npm run lint
       ↓
7. Run npm run build
       ↓
8. Commit changes
       ↓
9. Push branch
       ↓
10. Create/merge Pull Request
       ↓
11. Deploy
```

Example:

``` bash
git checkout main
git pull

git checkout -b feature/new-feature

# Make and test changes

cd client
npm run lint
npm run build

git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

------------------------------------------------------------------------

# Team Development Guidelines

### Keep feature logic separated

Prefer:

``` text
roomieController.js
marketplaceController.js
stayController.js
profileController.js
```

rather than placing unrelated functionality inside authentication code.

### Reuse the existing authentication system

Do not create a second authentication mechanism for individual modules.

### Keep frontend API calls in services

Examples:

``` text
authApi.js
profileApi.js
roomieApi.js
marketplaceApi.js
staysApi.js
```

### Validate ownership on the backend

A frontend button being hidden is not sufficient authorization.

The backend must verify that the authenticated user is allowed to modify
the requested resource.

------------------------------------------------------------------------

# Testing Checklist

Before deploying a new version, verify:

-   [ ] Frontend starts locally
-   [ ] Backend starts locally
-   [ ] Registration works
-   [ ] Login works
-   [ ] Logout works
-   [ ] Protected routes redirect unauthenticated users
-   [ ] Profile loads correctly
-   [ ] Profile updates correctly
-   [ ] College selection works
-   [ ] College OTP verification works
-   [ ] Marketplace listing creation works
-   [ ] Marketplace image upload works
-   [ ] Roomie listing creation works
-   [ ] Stays can be browsed
-   [ ] Stays can be created/edited/deleted
-   [ ] Stay save/unsave works
-   [ ] Stay inquiries work
-   [ ] Stay reviews work
-   [ ] Production API calls reach Render
-   [ ] Supabase authentication works in production
-   [ ] Page refreshes work on deployed routes
-   [ ] No secrets are exposed in the frontend build

------------------------------------------------------------------------

# Troubleshooting

## Frontend cannot reach the API

Check:

``` env
VITE_API_URL
```

Local:

``` text
http://localhost:5800/api
```

Production:

``` text
https://clockit-api.onrender.com/api
```

After changing a Vite environment variable, restart the frontend
development server or redeploy the frontend.

------------------------------------------------------------------------

## Authentication fails

Check:

1.  Supabase URL
2.  Frontend publishable key
3.  Backend Supabase variables
4.  Access token in the `Authorization` header
5.  Supabase Auth configuration
6.  Production redirect URLs

------------------------------------------------------------------------

## Profile returns an authentication error

Make sure the request contains:

``` http
Authorization: Bearer <access_token>
```

and that the backend `requireAuth` middleware can validate the token.

------------------------------------------------------------------------

## Production build fails but local development works

Check:

-   Import path capitalization
-   File names
-   Case-sensitive paths
-   Missing environment variables
-   Missing dependencies
-   `npm run build` locally

Linux-based deployment environments are case-sensitive, so:

``` javascript
import Login from "./pages/Registration/Login";
```

and:

``` javascript
import Login from "./pages/Registration/login";
```

are not necessarily equivalent.

------------------------------------------------------------------------

# Documentation

Additional project documentation is available in:

``` text
docs/
├── Design_System.md
└── stays_migration.sql
```

------------------------------------------------------------------------

# Project Status

ClockIt is an actively developed project.

Current major modules:

-   [x] Authentication
-   [x] User profile
-   [x] College selection
-   [x] College email OTP verification
-   [x] Marketplace
-   [x] Roomies
-   [x] Stays
-   [x] Stay saving
-   [x] Stay inquiries
-   [x] Stay reviews
-   [x] Area reviews
-   [x] Production backend deployment
-   [x] Production frontend deployment

Future functionality may change as the project continues to evolve.

------------------------------------------------------------------------

# License

No open-source license is currently specified for this project.

If this repository will be publicly distributed or reused, add an
appropriate license.
