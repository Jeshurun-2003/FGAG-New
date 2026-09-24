# ⛪ Friends Garden AG Church (FGAG) — Full-Stack Web Platform & Admin CMS

A production-ready, full-stack website and content management system for **Friends Garden Assemblies of God Church, Kollidam**. Built with a modern decoupled SaaS architecture, completely replacing legacy static scripts and Firebase with a secure, scalable **React + Vite** frontend and a **Node.js + Express + Prisma + PostgreSQL** backend.

---

## 🌟 Architecture & Tech Stack

```text
FGAG-Church/
├── client/                     # React 18 + Vite + Bootstrap 5 Frontend (Cloudflare Pages)
│   ├── public/                 # Static branding assets & _redirects routing
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, LoadingSpinner, LightboxModal
│   │   │   └── admin/          # Admin navigation, stats cards, data modals
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── layouts/            # PublicLayout & AdminLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Events, Ministries, Gallery, Get Involved, Contact, Donate
│   │   │   └── admin/          # Dashboard, Hero/About CMS, Events CRUD, Ministries CRUD, Gallery CMS,
│   │   │                       # Prayer Requests, Volunteers, Settings, Profile
│   │   ├── services/           # Modular Axios API services (configured via VITE_API_URL)
│   │   ├── styles/             # Preserved Lora & Playfair typography, navy palette (#0A3D62)
│   │   ├── routes/             # AppRoutes & ProtectedRoute definition
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
└── README.md
```

### Technology Matrix

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Bootstrap 5.3, Bootstrap Icons, Axios, React Router 6 |
| **Backend** | Node.js, Express.js, Prisma ORM, JWT Authentication, Multer (Memory Storage) |
| **Database** | PostgreSQL (Neon Serverless) |
| **Image Storage** | Database-persisted Base64 Data URIs & Static Asset URLs |
| **Styling** | Google Fonts (*Lora* & *Playfair Display*), Custom CSS (#0A3D62, #38A1DB, #E9F1F7) |
| **Firebase** | **0% Remaining** (Completely removed and replaced) |

---

## 🔐 Environment Variables

### Backend (`server/.env`)
Copy `server/.env.example` to `server/.env` and configure:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/fgag_church?sslmode=require"
JWT_SECRET="your_strong_random_jwt_secret_key"
JWT_EXPIRES_IN="7d"
CLIENT_URL="https://your-app.pages.dev,http://localhost:3000"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="YourSecurePasswordHere123!"
```

### Frontend (`client/.env`)
Copy `client/.env.example` to `client/.env` and configure:
```env
VITE_API_URL=https://your-api.onrender.com/api
```

---

## 🎛️ Admin CMS Features

Every section of the website can be managed directly through the admin panel:

1. **Dashboard Analytics**: Real-time counters for events, ministries, gallery photos, pending prayer requests, and volunteer signups.
2. **Hero & Content CMS**: Live editor for the Home Hero title, subtitle, YouTube link, background banner, annual Promise verse, Pastor's welcome message, Uvamaigal app showcase, and About Us story.
3. **Events CRUD**: Create, update, feature, and delete upcoming church gatherings with image uploads.
4. **Ministries CRUD**: Manage church ministries (Youth, Children, Outreach, Men's, Women's, Volunteers) with photo uploads and detailed descriptions.
5. **Gallery Upload & CMS**: Categorized photo uploads (Sunday Service, Kids, Youth, Outreach, Christmas, Special Events) with database Base64 storage and image deletions.
6. **Prayer Requests**: Manage incoming prayer petitions, mark requests as prayed for, and view contact details.
7. **Volunteer Submissions**: Review applications from believers indicating their preferred areas of service (Choir, Music, Hospitality, Media, etc.).
8. **Website Settings**: Update church address, email, phone helpline, office hours, Google Maps embed, social media links, and bank transfer account details.
9. **Profile & Security**: Update admin name, email, and securely change passwords with bcrypt hashing.

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
| `/api/gallery` | GET / POST | Public / Protected | List or upload gallery photos |
| `/api/gallery/:id` | DELETE | Protected | Delete gallery photo |
| `/api/prayer` | POST / GET | Public / Protected | Submit prayer or view requests |
| `/api/prayer/:id/status` | PUT | Protected | Update prayer status (PRAYED) |
| `/api/volunteer` | POST / GET | Public / Protected | Submit volunteer signup or view list |
| `/api/analytics/dashboard` | GET | Protected | Overview metrics for dashboard |

---

## 🎨 Visual Identity Preservation

- **Color Scheme**:
  - Primary Navy: `#0A3D62`
  - Accent / Primary Blue: `#38A1DB`
  - Deep Heading: `#3C6382`
  - Section Ice Blue: `#E9F1F7`
  - Background Light: `#F8F9FA`
- **Typography**:
  - Body Text: Google Fonts `Lora` (serif)
  - Headings: Google Fonts `Playfair Display` (serif)
- **Responsive Layout**: Designed and tested for mobile phones (320px+), tablets, laptops, and desktop screens.