# ClockIt — Developer README

## 1. Project Overview

**ClockIt** is a student-focused campus platform. The main idea is to bring useful student-to-student services into one application.

Current/planned modules include:

- **UniMart / Marketplace** — students can buy and sell products.
- **Roomies** — students can find suitable roommates.
- **Stays** — students can discover/share accommodation and flat listings.
- **Home** — central page that surfaces information from the other modules.
- **Profile** — user information, university selection, and college verification.

The project is being developed as a team, so feature code should remain separated and each feature should use the central authenticated user.

---

# 2. Current Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Lucide React icons
- `canvas-confetti` where used by the existing UI

## Backend

- Node.js
- Express.js
- ES Modules
- REST APIs

## Database / Authentication

- Supabase
- Supabase Authentication
- Supabase PostgreSQL
- `@supabase/supabase-js`

## Email

- Resend is currently used for college verification emails.
- The sender/domain configuration must remain in environment variables/configuration.
- Do not commit API keys.

---

# 3. Project Structure

The project is divided into frontend and backend:

```text
ClockIt/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
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
│   │   ├── profileController.js
│   │   └── ...
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   └── ...
│   ├── services/
│   ├── utils/
│   │   └── email.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

Feature-specific logic should stay inside its own controllers/routes/services instead of being added to authentication files.

---

# 4. Supabase Authentication

Supabase Auth is responsible for the actual authenticated user identity.

The authenticated user is available through:

```text
auth.users
```

Application-specific information is stored in:

```text
profiles
```

The relationship is:

```text
Supabase Auth User
       │
       │ id
       ▼
   profiles
       │
       │ university_id
       ▼
   colleges
```

The backend protects authenticated endpoints using the user's Supabase access token.

---

# 5. Authentication Middleware

Protected backend routes use:

```text
requireAuth
```

The middleware:

1. Reads the `Authorization` header.
2. Expects:

```http
Authorization: Bearer <access_token>
```

3. Extracts the token.
4. Uses Supabase Auth to validate the token.
5. Gets the authenticated user.
6. Stores it on:

```javascript
req.user;
```

Example:

```javascript
const userId = req.user.id;
```

Therefore feature controllers should use:

```javascript
req.user.id;
```

instead of trusting a user ID sent by the frontend.

---

# 6. Profile Feature — COMPLETED

The profile page is currently implemented.

It supports displaying:

- Profile picture
- Full name
- Username
- Bio
- Phone number
- University
- College email
- College verification status

The profile can be edited **in place**.

When the user clicks:

```text
Edit Profile
```

the existing fields change into editable inputs/dropdowns.

The user can:

```text
Edit
  ↓
Change fields
  ↓
Save Changes / Cancel
```

---

# 7. University Selection

University is **not stored as plain text** in the profile.

The profile stores:

```text
university_id
```

which references:

```text
colleges.id
```

This prevents spelling inconsistencies.

For example, the UI displays:

```text
MIT WPU
```

but the selected value is actually the college UUID.

The flow is:

```text
Dropdown
   ↓
User selects MIT WPU
   ↓
Frontend stores college.id
   ↓
PUT /api/profile
   ↓
profiles.university_id
   ↓
colleges.id
```

When displaying the profile, the university name comes from the related college record.

---

# 8. College Database Tables

The current college schema is:

```sql
create table public.colleges (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
```

College email domains are stored separately:

```sql
create table public.college_domains (
    id uuid primary key default gen_random_uuid(),
    college_id uuid not null
        references public.colleges(id)
        on delete cascade,
    domain text not null unique,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
```

Important:

`email_domain` is **not a column in `colleges`**.

Do not write queries such as:

```javascript
colleges.email_domain;
```

Use the `college_domains` table when domain information is required.

---

# 9. Profile API

The profile feature uses protected API endpoints.

Conceptually:

```text
GET /api/profile
```

returns the authenticated user's profile.

The backend gets the user ID from:

```javascript
req.user.id;
```

and queries the `profiles` table.

Profile update uses:

```text
PUT /api/profile
```

The frontend sends:

```json
{
  "fullName": "...",
  "username": "...",
  "universityId": "...",
  "bio": "..."
}
```

The backend maps these to:

```text
full_name
username
university_id
bio
```

The university value must be the UUID from `colleges.id`, not the university name.

---

# 10. College Email Verification — CURRENTLY IMPLEMENTED

College email verification has been added to the profile flow.

The user provides a college email address.

The backend:

1. Receives the college email.
2. Validates the relevant college/domain information.
3. Generates the verification OTP.
4. Sends the OTP through the configured email service.
5. The user enters the OTP.
6. The backend verifies it.
7. The profile is marked as college verified.

The frontend displays:

```text
College Email
Verification Code
Verify
Resend Code
```

After successful verification:

```text
✓ Verified
```

The verification state is associated with the user's profile.

---

# 11. Resend Configuration

Resend is currently used to send college verification emails.

The API key must be stored in the backend environment.

Example:

```env
RESEND_API_KEY=your_resend_api_key
```

Never commit the real key to GitHub.

If Resend is in testing mode, it may restrict recipients until a sending domain is verified.

---

# 12. Important Frontend API Rule

Frontend code should not directly use:

```text
supabaseAdmin
```

The admin Supabase client belongs on the backend.

Frontend services should call the Express API.

For authenticated requests, the frontend gets the current Supabase session/access token and sends:

```http
Authorization: Bearer <access_token>
```

Example architecture:

```text
React
  ↓
profileApi.js
  ↓
Express API
  ↓
requireAuth
  ↓
profileController
  ↓
supabaseAdmin
  ↓
PostgreSQL
```
# 13. Home Page

The Home page is the base platform.

It should **not** contain all feature-specific business logic.

Instead, it should surface selected information from the major modules.

Conceptual navigation:

```text
Home
Marketplace
Roomies
Stays
Profile
```

Possible routes:

```text
/
├── /unimart
├── /roomies
├── /stays
└── /profile
```

Exact route names can change as development continues.

---

# 14. User Ownership Rule

Every feature record that belongs to a user should reference the authenticated user.

Examples:

```text
products.user_id
roommate_profile.user_id
flat_listing.user_id
messages.sender_id
```

Do not accept an arbitrary user ID from the frontend for ownership.

Use:

```javascript
req.user.id;
```

on the backend.

This makes authorization and editing safer.

---

# 15. Git Workflow

Always create a feature branch.

```bash
git checkout -b feature/<feature-name>
```

Examples:

```bash
git checkout -b feature/unimart
git checkout -b feature/roomies
git checkout -b feature/stays
```

After implementation:

```bash
git add .
git commit -m "message"
git push origin feature/<feature-name>
```

Create a Pull Request before merging into the shared branch.

---

# 16. Team Rules

### Never commit secrets

Do not push:

```text
.env
SUPABASE_URL
SUPABASE_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
```

or any other credentials.

### Don't create another authentication system

Use the existing Supabase authentication system.

### Don't duplicate user identities

Feature records should reference the authenticated Supabase user.

### Keep feature code isolated

For example:

```text
UniMart
  → unimart routes
  → unimart controller
  → unimart services

Roomies
  → roomies routes
  → roomies controller
  → roomies services

Stays
  → stays routes
  → stays controller
  → stays services
```

Do not put these inside:

```text
authController.js
profileController.js
```

unless the logic genuinely belongs there.

---

# 17. New Teammate Setup

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

## Environment

Create:

```text
server/.env
```

Use the environment variable names expected by the existing Supabase and email configuration.

Never copy real credentials into the README.

---

# 18. Running the Project

Backend development script currently uses Node's environment-file support:

```bash
npm run dev
```

Production/start script:

```bash
npm start
```

The backend server is configured through:

```text
server/server.js
```

The frontend is run from the `client` directory using its package scripts.

---

# 19. Before Starting a Feature

A new teammate should:

1. Pull the latest shared branch.
2. Install dependencies.
3. Configure `.env`.
4. Start frontend and backend.
5. Test login/authentication.
6. Open the profile page and confirm the authenticated user works.
7. Create a feature branch.
8. Read the existing routes/controllers before adding new ones.
9. Build the feature using `req.user.id` for ownership.
10. Test both successful and failed API requests.
11. Commit to the feature branch.
12. Open a Pull Request.

---

# 20. Current Progress

## Authentication / Common Platform

- [x] Supabase authentication integration
- [x] Backend authentication middleware
- [x] Bearer-token authentication for protected API routes
- [x] User profile integration
- [x] College database structure
- [x] College dropdown
- [x] University stored through `university_id`
- [x] In-place profile editing
- [x] Profile update API
- [x] College email OTP flow
- [x] College verification status
- [x] Resend email integration

---

# 21. Important Development Notes

### University

Use:

```text
college.id
```

as the dropdown value.

Do not store:

```text
"MIT WPU"
```

as the foreign-key value.

### Authentication

Protected APIs should use:

```http
Authorization: Bearer <access_token>
```

and backend controllers should use:

```javascript
req.user.id;
```

### Supabase Admin

`supabaseAdmin` is a backend-only client.

Never expose the service-role/admin key to React.

### College Domains

The schema uses:

```text
colleges
college_domains
```

not:

```text
colleges.email_domain
```

### Feature Isolation

Build new modules independently so that Marketplace, Roomies, and Stays do not break authentication/profile functionality.
---