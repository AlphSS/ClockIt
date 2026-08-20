# ClockIt — Project Setup & Developer README

ClockIt is a student-focused platform that brings multiple campus services into one application.

## 🚀 Platform Modules

- **UniMart** — students can buy and sell products.
- **Roomies** — students can find suitable roommates.
- **Stays** — students can discover/share flat listings and information.

The Home page is the base platform and will surface selected content from these modules. Major services will have separate pages/routes.

---

# 🏗️ Technology Stack

## Frontend
- React
- Vite
- Tailwind CSS
- `canvas-confetti`

## Backend
- Node.js
- Express.js
- ES Modules

## Database & Authentication
- Supabase
- Supabase Authentication
- Supabase/Postgres
- `@supabase/supabase-js`

## Development OTP

The current development OTP is:

```text
123456
```

Twilio/SMS integration has **not** been added yet.

---

# 📁 Project Structure

```text
ClockIt/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── authApi.js
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── otpController.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── services/
│   │   └── otpService.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup

## Clone

```bash
git clone <REPOSITORY_URL>
cd ClockIt
```

## Frontend

```bash
cd client
npm install
```

## Backend

```bash
cd ../server
npm install
```

---

# 🔐 Environment Variables

Backend `.env`:

```env
PORT=5800

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
```

Do **not** commit `.env`.

Recommended `.gitignore`:

```gitignore
.env
.env.*
node_modules/
```

If the existing project uses different variable names, keep the names expected by `server/config/supabase.js`.

---

# 🗄️ Supabase

The backend creates the Supabase client from environment variables.

Example:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
```

Never hard-code Supabase credentials.

Supabase Authentication manages the authentication identity in:

```text
auth.users
```

Application-specific user information is stored in the application's profile table.

Conceptually:

```text
Supabase
│
├── auth.users
│      └── authentication identity
│
└── profiles
       ├── username
       ├── full name
       ├── phone
       └── other application data
```

Follow the actual profile schema in the project.

---

# 🔑 Authentication Architecture

Current registration flow:

```text
Basic Details
     ↓
POST /send-otp
     ↓
Backend stores development OTP
     ↓
OTP Verification
     ↓
POST /verify-otp
     ↓
Backend verifies OTP
     ↓
Registration Token
     ↓
Set Password
     ↓
POST /register
     ↓
Verify Registration Token
     ↓
Supabase Auth User
     ↓
Profile
     ↓
Account Created 🎉
```

**Important:** OTP verification is performed by the Express backend. React should not independently decide whether an OTP is valid.

---

# 📲 Send OTP API

### Endpoint

```http
POST /api/auth/send-otp
```

Development URL:

```text
http://localhost:5800/api/auth/send-otp
```

### Request

```json
{
  "phone": "+919850854759"
}
```

### Success

```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

The development backend prints the OTP in its terminal:

```text
Development OTP for +919850854759: 123456
```

---

# 🔢 Verify OTP API

### Endpoint

```http
POST /api/auth/verify-otp
```

Development URL:

```text
http://localhost:5800/api/auth/verify-otp
```

### Request

```json
{
  "phone": "+919850854759",
  "otp": "123456"
}
```

### Success

```json
{
  "success": true,
  "message": "Phone number verified successfully.",
  "registrationToken": "..."
}
```

---

# 🔐 Registration Token

After successful OTP verification, the backend creates a short-lived registration token.

The token:

- proves that the phone completed OTP verification
- is associated with the verified phone number
- expires after the configured period
- is consumed after successful registration

Current development implementation stores tokens in an in-memory `Map`.

Therefore, restarting Node.js removes active registration tokens.

This is acceptable for development. For production or multiple backend instances, use a shared persistent store such as Redis or a database table.

---

# 👤 Register API

### Endpoint

```http
POST /api/auth/register
```

Development URL:

```text
http://localhost:5800/api/auth/register
```

### Request

```json
{
  "username": "student123",
  "fullName": "Test Student",
  "phone": "+919850854759",
  "password": "Password@123",
  "registrationToken": "..."
}
```

The backend should:

1. Validate required fields.
2. Verify the registration token.
3. Ensure the token belongs to the submitted phone.
4. Create the Supabase Auth user.
5. Create the application's profile record.
6. Consume the registration token.
7. Return success.

---

# 🌐 Current API Structure

All authentication APIs are mounted under:

```text
/api/auth
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/send-otp` | Start phone verification |
| POST | `/api/auth/verify-otp` | Verify development OTP |
| POST | `/api/auth/register` | Create account |

---

# 🧱 Backend Architecture

Keep responsibilities separated:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Supabase / Database
```

### Routes

Define API paths and connect them to controllers.

### Controllers

Handle:

- Request body
- Validation
- HTTP responses
- Calling services

### Services

Contain reusable business logic.

`otpService.js` currently handles:

- Development OTP
- OTP expiry
- OTP verification
- Registration token generation
- Registration token validation
- Token consumption

### Config

External service configuration belongs in `config/`.

---

# 🖥️ Frontend API Service

Keep frontend API calls centralized in:

```text
client/src/services/authApi.js
```

Current API base:

```javascript
const API_URL = "http://localhost:5800/api";
```

Authentication functions:

```javascript
sendOtp(phone)
verifyOtp(phone, otp)
registerUser(userData)
```

Avoid duplicating `fetch()` logic inside every component.

---

# ▶️ Running the Project

## Backend

```bash
cd server
npm run dev
```

Current development backend:

```text
http://localhost:5800
```

## Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Use the URL displayed by Vite.

---

# 🧪 API Testing

Before connecting a new frontend feature, test its API with Postman or Thunder Client.

Example:

```text
POST http://localhost:5800/api/auth/send-otp
```

Then:

```text
POST http://localhost:5800/api/auth/verify-otp
```

Then:

```text
POST http://localhost:5800/api/auth/register
```

This makes backend debugging much easier.

---

# 🎉 Account Created

After successful registration:

```text
POST /api/auth/register
        ↓
Success
        ↓
Account Created screen
        ↓
Confetti / blaster animation
        ↓
Go to Home
```

The frontend uses `canvas-confetti`.

Install:

```bash
npm install canvas-confetti
```

---

# 👥 Team Development

The project is feature-based. The common authentication foundation should be shared by all features.

Planned modules:

```text
ClockIt
│
├── Authentication
├── Home
│
├── UniMart
│   ├── Buy/Sell Products
│   ├── Categories
│   ├── Product Search
│   ├── Wishlist
│   ├── Chat
│   ├── Offers
│   ├── Ratings
│   └── Mark Sold
│
├── Roomies
│   ├── Listing
│   ├── Roommate Profile
│   ├── Bio
│   ├── Budget
│   ├── Gender Preference
│   ├── Smoking/Drinking Preference
│   ├── Food Preference
│   ├── Occupation
│   ├── College Year
│   ├── Location Preference
│   └── Contact
│
└── Stays
    ├── Flat Photos
    ├── Rent
    ├── Deposit
    ├── Area
    ├── Distance From College
    ├── Nearby Facilities
    ├── Furnished/Unfurnished
    ├── Availability Date
    └── Reviews
```

Each feature should have its own backend routes/controllers/services as needed instead of putting feature-specific logic into authentication files.

---

# 🌳 Git Workflow

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

Examples:

```bash
git checkout -b feature/unimart
git checkout -b feature/roomies
git checkout -b feature/stays
git checkout -b feature/home
```

Commit:

```bash
git add .
git commit -m "Add UniMart product listing"
```

Push:

```bash
git push origin feature/unimart
```

Use a Pull Request before merging into the shared branch.

---

# ⚠️ Team Rules

### 1. Never commit secrets

Never push:

```text
SUPABASE_URL
SUPABASE_KEY
```

or other credentials.

### 2. Don't create another authentication system

All modules should use the central authenticated user.

### 3. Don't duplicate user identities

Feature records should reference the authenticated user.

Example:

```text
User
 │
 ├── UniMart products
 ├── Roommate profile
 ├── Flat listings
 └── Messages
```

### 4. Keep feature code isolated

For example, UniMart logic should not be placed inside:

```text
authController.js
```

---

# 👤 User Ownership

Feature data should be associated with the authenticated user.

Example UniMart:

```text
Authenticated User
       ↓
Create Product
       ↓
product.user_id
```

Roomies:

```text
Authenticated User
       ↓
Create Roommate Profile
       ↓
roommate_profile.user_id
```

Stays:

```text
Authenticated User
       ↓
Create Flat Listing
       ↓
flat_listing.user_id
```

This will make ownership, editing and authorization easier to implement.

---

# 🏠 Home Page

The Home page is the base platform.

It should show selected information from the other services rather than implementing every feature directly.

Main navigation:

```text
Home
Deals
Roomies
Stays
```

Major modules should have separate pages/routes.

Possible structure:

```text
/
├── /unimart
├── /roomies
└── /stays
```

The exact route names can be changed as the frontend develops.

---

# 🏫 College Email Verification

The planned platform includes college/work-email verification.

The intended approach is to maintain a college-specific allowed email domain.

Example:

```text
student@college.edu
```

The exact allowed domains should be configured rather than scattered through frontend code.

College email verification is separate from the current development phone OTP flow.

---

# 🔒 Current Security Limitations

This is still a development implementation.

Current limitations:

- OTP is fixed to `123456`.
- OTP state is stored in server memory.
- Registration tokens are stored in server memory.
- Real SMS provider is not integrated.
- Production rate limiting is not implemented.
- OTP attempt limits are not implemented.
- Production session/auth handling still needs to be completed.
- Refreshing during registration can lose in-memory registration state.

These should be addressed before production deployment.

---

# 📌 Planned Common Authentication Work

- [ ] Real SMS OTP provider
- [ ] College/work-email verification
- [ ] Login
- [ ] Logout
- [ ] Persistent authentication session
- [ ] Protected React routes
- [ ] Password reset
- [ ] Resend OTP rate limiting
- [ ] OTP attempt limits
- [ ] Persistent OTP/token storage
- [ ] Production security configuration

---

# 🧭 New Teammate Checklist

1. Clone the repository.
2. Install frontend dependencies.
3. Install backend dependencies.
4. Configure the backend `.env`.
5. Start the backend.
6. Start the frontend.
7. Verify registration works.
8. Use development OTP:

```text
123456
```

9. Create a feature branch.
10. Build your feature without changing shared authentication unless necessary.
11. Test your API separately.
12. Commit and push your branch.
13. Create a Pull Request.

---

# ✅ Current Status

## Authentication

- [x] Registration UI
- [x] Basic details validation
- [x] Development OTP
- [x] Backend Send OTP API
- [x] Backend Verify OTP API
- [x] OTP expiry
- [x] OTP verification
- [x] Registration token
- [x] Registration token validation
- [x] Supabase Auth user creation
- [x] Profile creation
- [x] Token consumption
- [x] Account Created screen
- [x] Confetti/blaster animation

## Common Platform

- [ ] Login
- [ ] Logout
- [ ] Persistent session handling
- [ ] Protected routes
- [ ] Profile page
- [ ] Home page API/data integration
- [ ] College email verification

## Feature Modules

- [ ] UniMart
- [ ] Roomies
- [ ] Stays

---

# 📝 Quick Reference

```text
Backend:
http://localhost:5800

API Base:
http://localhost:5800/api

Authentication:
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register

Development OTP:
123456
```

## Important

Authentication is the shared foundation of ClockIt. Before changing authentication-related code, check the impact on every module because UniMart, Roomies, Stays, Chat, Profile and ownership/authorization will depend on the central authenticated user.
