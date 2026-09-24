# ⛪ Friends Garden AG Church (FGAG) — Full-Stack Web Platform & Admin CMS

A production-ready, full-stack website and content management system for **Friends Garden Assemblies of God Church, Kollidam**. Built with a modern decoupled SaaS architecture, featuring a premium **React 18 + Vite** frontend with smooth Framer Motion animations and responsive Bootstrap 5 styling, and a secure **Node.js + Express + Prisma + PostgreSQL** backend.

---

## 🌟 Architecture & Tech Stack

```text
FGAG-Church/
├── client/                     # React 18 + Vite + Bootstrap 5 Frontend (Cloudflare Pages)
│   ├── public/                 # Static branding assets, images & _redirects routing
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, LoadingSpinner, LightboxModal, SEO,
│   │   │   │                   # ScrollToTop, SkeletonLoader, AnimatedCounter, PageTransition
│   │   │   └── admin/          # ImageUploadDropzone, ConfirmDeleteModal
│   │   ├── context/            # AuthContext (JWT session), ToastContext (notifications)
│   │   ├── layouts/            # PublicLayout & AdminLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Events, Ministries, Gallery, Get Involved, Contact, Donate
│   │   │   └── admin/          # Dashboard, Hero/About CMS, Events CRUD, Ministries CRUD, Gallery CMS,
│   │   │                       # Prayer Requests, Volunteers, Settings, Profile
│   │   ├── services/           # Modular Axios API services (configured via VITE_API_URL)
│   │   ├── styles/             # Preserved Lora & Playfair typography, navy palette (#0A3D62)
│   │   ├── routes/             # AppRoutes (lazy-loaded with Suspense) & ProtectedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── server/                     # Node.js + Express.js REST API Backend (Render)
│   ├── prisma/
│   │   ├── schema.prisma       # Relational models (PostgreSQL / Neon)
│   │   └── seed.js             # Initial database seeder (reads ADMIN_EMAIL & ADMIN_PASSWORD from .env)
│   ├── src/
│   │   ├── config/             # Database connection & environment configuration
│   │   ├── controllers/        # Auth, Settings, Events, Ministries, Leadership, Gallery, Prayer, Volunteer, Analytics
│   │   ├── middleware/         # JWT Auth, Memory Multer (Base64), Centralized Error Handling
│   │   ├── routes/             # Express API endpoints (/api/*)
│   │   ├── utils/              # Bcrypt hashing, JWT tokens
│   │   ├── app.js              # Express app configuration, CORS, 10MB limit & health check
│   │   └── server.js           # HTTP server entry point
│   ├── .env.example
│   └── package.json
│
├── images/                     # Static high-res church photography served by server
├── Gallery_images/             # Categorized gallery photos
└── README.md
```

### Technology Matrix

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Bootstrap 5.3, Bootstrap Icons, Framer Motion, Axios, React Router 6 |
| **Backend** | Node.js, Express.js, Prisma ORM, JWT Authentication, Multer (Memory Storage) |
| **Database** | PostgreSQL (Neon Serverless / Local PostgreSQL) |
| **Image Storage** | Database-persisted Base64 Data URIs & Static Asset URLs |
| **Styling** | Google Fonts (*Lora* & *Playfair Display*), Custom CSS (#0A3D62, #38A1DB, #E9F1F7) |
| **Firebase** | **0% Remaining** (Completely removed and replaced) |

---

## 🔐 Environment Variables

### Backend (`server/.env`)
Copy `server/.env.example` to `server/.env` and configure:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your_strong_random_jwt_secret_key"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:3000,http://localhost:5173"
ADMIN_EMAIL="admin@fgag.test"
ADMIN_PASSWORD="Admin@12345"
```

### Frontend (`client/.env`)
Copy `client/.env.example` to `client/.env` and configure:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 Admin Panel Access & Testing

The church platform contains a Content Management System (CMS) designed for church administrators and pastors to manage all website content.

### Admin Login URL
- **Local Dev URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login) *(or `http://localhost:5173/admin/login` depending on Vite port)*
- **Dashboard URL (Once logged in):** [http://localhost:3000/admin](http://localhost:3000/admin)

### Local Development Test Credentials
> **DEVELOPMENT-ONLY CREDENTIALS:**
> - **Email:** `admin@fgag.test`
> - **Password:** `Admin@12345`

> [!CAUTION]
> **These credentials are for local development only. On production, set your own strong ADMIN_EMAIL and ADMIN_PASSWORD in the Render environment variables, run the seed once, and change the password from Admin → Profile.**

---

### Step-by-Step Setup & Seeding Commands

Run these exact commands in order:

#### 1. Install Dependencies
```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

#### 2. Generate Prisma Client & Sync Database
```bash
# In server directory:
cd ../server
npm run prisma:generate
npm run prisma:push
```

#### 3. Seed Database with Admin User & Initial Content
```bash
# Safe to run multiple times (idempotent upsert):
npm run seed
```
*Output will confirm: `✅ Admin user created/verified: admin@fgag.test` along with site settings, ministries, leadership, and gallery photos.*

#### 4. Start the Backend API Server
```bash
npm run dev
# Server runs on: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

#### 5. Start the Frontend Client
```bash
# In client directory:
cd ../client
npm run dev
# Client runs on: http://localhost:3000 (or http://localhost:5173)
```

---

### 📋 Admin Module Testing Checklist

Use this checklist to test each module in the admin portal:

1. **Authentication & Session:**
   - [ ] Navigate to `/admin/login`
   - [ ] Enter `admin@fgag.test` and `Admin@12345`
   - [ ] Confirm login redirects to `/admin` dashboard
   - [ ] Confirm protected routes redirect unauthenticated users to `/admin/login`
2. **Dashboard Analytics (`/admin`):**
   - [ ] View real-time metric counters (Events, Ministries, Gallery Photos, Pending Requests)
   - [ ] Verify recent prayer requests and volunteer signups cards
3. **Hero & About CMS (`/admin/hero-about`):**
   - [ ] Edit the Home Hero title, subtitle, or Promise verse
   - [ ] Click "Save Changes" and observe the success toast
   - [ ] Verify the change appears immediately on the public Home page (`/`)
4. **Events CRUD (`/admin/events`):**
   - [ ] Search events by title or location
   - [ ] Create a new event with a poster image using the drag-and-drop uploader
   - [ ] Edit an existing event, toggle "Featured", and save
   - [ ] Click delete on an event and confirm the custom confirmation modal appears before deletion
5. **Ministries CRUD (`/admin/ministries`):**
   - [ ] Search ministries list
   - [ ] Edit ministry description or reorder display order
   - [ ] Toggle active/inactive status and test delete confirmation modal
6. **Gallery CMS (`/admin/gallery`):**
   - [ ] Filter photos by category tabs
   - [ ] Upload a photo via drag-and-drop (under 10MB) with caption and category
   - [ ] Delete a photo and confirm instant removal
7. **Prayer Requests (`/admin/prayers`):**
   - [ ] Filter by All, Pending, and Prayed For
   - [ ] Search requests by name, email, or keywords
   - [ ] Click "Mark Prayed" and verify badge changes to green `PRAYED`
8. **Volunteer Submissions (`/admin/volunteers`):**
   - [ ] Filter submissions by All, Pending, Reviewed
   - [ ] Search by town, profession, or ministry area
   - [ ] Mark submission as `REVIEWED`
9. **Website Settings (`/admin/settings`):**
   - [ ] Update church phone helpline, email, or Google Maps embed
   - [ ] Update bank account details (account number, IFSC code)
   - [ ] Verify updated bank details reflect on the public Donate page (`/donate`)
10. **Sermons & Media CMS (`/admin/sermons`):**
    - [ ] Navigate to `/admin/sermons`
    - [ ] Create a new sermon with YouTube URL (e.g. `https://www.youtube.com/watch?v=...`)
    - [ ] Verify live YouTube player preview appears instantly
    - [ ] Save sermon and verify automatic thumbnail generation from YouTube
    - [ ] Check public `/sermons` and `/sermons/:id` pages for video playback, sharing, and related sermons
11. **Profile & Security (`/admin/profile`):**
    - [ ] Update admin display name or email
    - [ ] Test password change form with validation and visibility toggle

---

## 🎨 UI/UX Redesign & Modern Features

The public site has been enhanced with modern styling and micro-interactions while preserving 100% of the church's brand identity:

- **Logo Visibility & Sizing**:
  - Restored high visibility for the church logo across the entire site.
  - Navbar: responsive 56–64px desktop / 44–48px mobile / 48px scrolled with a glass badge and Playfair Display title.
  - Footer: prominent 96px logo in a dedicated brand column.
  - Admin Portal: 96px centered badge on login screen and 40px in the sidebar.
  - Hero Section: regal logo emblem badge with frosted glass backdrop.
- **Color Palette**: Deep Navy (`#0A3D62`), Accent Blue (`#38A1DB`), Deep Heading (`#3C6382`), Ice Blue (`#E9F1F7`), and Soft Light (`#F8F9FA`).
- **Typography**: Google Fonts `Playfair Display` for headings and `Lora` for body copy.
- **Sermons & Media Module**:
  - Public sermon library (`/sermons`) with category filter pills, keyword search, and pagination.
  - Dynamic sermon detail page (`/sermons/:id`) with 16:9 responsive player (`youtube-nocookie.com`), metadata, WhatsApp/Facebook/Twitter sharing, and related sermons.
  - Homepage "Latest Sermons" section displaying top 3 published messages.
  - Admin CMS (`/admin/sermons`) with full CRUD, automatic YouTube thumbnail derivation (`img.youtube.com/vi/<id>/hqdefault.jpg`), live video preview, and custom upload dropzone.
- **Hero Section**: Full-height hero with soft dual-gradient overlay on the sanctuary background, animated headline (fade + slide up with Framer Motion), and enhanced call-to-action buttons.
- **Navigation**:
  - Sticky navbar that transitions from transparent to solid navy with backdrop blur upon scroll.
  - Active route indicator with smooth accent bar.
  - Off-canvas mobile slide drawer with spring animation and backdrop blur.
- **Micro-Interactions**:
  - Hover-lift cards with subtle elevation shadows.
  - Image zoom effect on card hover.
  - Button hover and active tap micro-animations.
  - Modern focus rings on all inputs (WCAG AA accessible).
- **Gallery**:
  - Category filter pills with active state indicators.
  - Responsive photo cards with gradient overlays and caption badges.
  - Full-featured lightbox modal with keyboard navigation (Esc, Arrow Left, Arrow Right) and touch swipe gestures.
- **Route Transitions & Performance**:
  - `React.lazy` code splitting for every route.
  - `Suspense` with skeleton loaders (cards, tables, galleries) instead of generic spinners.
  - `AnimatePresence` route transitions.
  - Full support for `prefers-reduced-motion`.
- **Interactive Forms**:
  - Multi-select ministry chips on Get Involved page.
  - Toast notifications system with smooth enter/exit animations for form submissions.
  - One-click copy buttons for bank account details (Donate) and contact details (Contact).

---

## 📡 API Endpoints Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Server health status and uptime |
| `/api/auth/login` | POST | Public | Authenticate admin & issue JWT |
| `/api/auth/me` | GET | Protected | Get current admin profile |
| `/api/auth/profile` | PUT | Protected | Update admin name/email |
| `/api/auth/change-password` | PUT | Protected | Update admin password |
| `/api/settings/public` | GET | Public | Fetch public site settings |
| `/api/settings` | POST | Protected | Update site settings |
| `/api/events` | GET / POST | Public / Protected | List or create events |
| `/api/events/:id` | PUT / DELETE | Protected | Update or delete an event |
| `/api/ministries` | GET / POST | Public / Protected | List or create ministries |
| `/api/sermons` | GET / POST | Public / Protected | List published sermons or create new |
| `/api/sermons/:id` | GET / PUT / DELETE | Public / Protected | Get sermon details, update or delete |
| `/api/gallery` | GET / POST | Public / Protected | List or upload gallery photos |
| `/api/gallery/:id` | DELETE | Protected | Delete gallery photo |
| `/api/prayer` | POST / GET | Public / Protected | Submit prayer or view requests |
| `/api/prayer/:id/status` | PUT | Protected | Update prayer status (PRAYED) |
| `/api/volunteer` | POST / GET | Public / Protected | Submit volunteer signup or view list |
| `/api/analytics/dashboard` | GET | Protected | Overview metrics for dashboard |

---

## 🛡️ Git & Security Policy

- Environment files (`.env`, `client/.env`, `server/.env`) are strictly ignored by `.gitignore` and never committed to version control.
- Only `.env.example` templates with documentation are committed.