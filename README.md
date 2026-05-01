# 🏢 Visitor Management System (VMS)

A smart, real-time visitor tracking system with secure logging, role-based access control, and a modern responsive UI with light/dark theme support.

---

## 👨‍💻 Developer

| Name | Role |
|------|------|
| **Surjeet Karan** | Full Stack Developer |

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Logging | Winston + Morgan |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 🎯 Features

### 🔐 Authentication & Security
- JWT-based login with role-based access control (RBAC)
- Password hashing with bcryptjs
- Protected routes per role
- Visitor blacklist system — blocks check-in by phone number
- Winston logging for all critical events (login, check-in/out, errors)

### 👥 Roles
| Role | Capabilities |
|------|-------------|
| **Admin** | Full system control, user management, reports, security/blacklist |
| **Receptionist** | Register visitors, check-in/out, appointments |
| **Employee** | Approve/reject visitors and appointments assigned to them |

### 🖥️ Smart Reception Dashboard
- Live visitor board (airport-style, auto-refreshes every 30s)
- One-click check-in / check-out
- Quick visitor registration form
- Real-time stats bar (total, inside, waiting, completed)
- Smart search by name or phone
- Color-coded status badges

### 📅 Appointment System
- Pre-book visits with scheduled date/time
- Employee approval flow (approve/reject)
- Receptionist can create and manage appointments

### 📊 Reports & Analytics
- Daily visitor trend chart (7 / 14 / 30 days)
- Full activity audit log with pagination
- Dashboard stats for all roles

### 🎨 UI/UX
- **Light & Dark theme** — persisted in localStorage, toggle in sidebar
- **Fully responsive** — works on mobile, tablet, and desktop
- Mobile hamburger sidebar with overlay
- Custom confirm modals (no browser `alert`/`confirm`)
- Password show/hide toggle on all password fields
- Toast notifications for all actions

---

## 📁 Project Structure

```
VMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB Atlas connection
│   │   ├── controllers/               # Thin request handlers
│   │   │   ├── authController.js
│   │   │   ├── visitorController.js
│   │   │   ├── userController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── reportController.js
│   │   │   └── securityController.js
│   │   ├── middlewares/
│   │   │   ├── auth.js                # JWT protect + authorize(roles)
│   │   │   └── errorHandler.js        # Global error handler
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Visitor.js
│   │   │   ├── Log.js
│   │   │   └── Appointment.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── visitorRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   └── securityRoutes.js
│   │   ├── services/                  # Business logic layer
│   │   │   ├── authService.js
│   │   │   ├── visitorService.js
│   │   │   ├── userService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── reportService.js
│   │   │   └── securityService.js
│   │   ├── utils/
│   │   │   ├── logger.js              # Winston logger
│   │   │   └── apiResponse.js         # Standardized responses
│   │   ├── scripts/
│   │   │   └── seed.js                # Creates initial admin user
│   │   └── server.js                  # Entry point
│   ├── logs/                          # Winston log files (gitignored)
│   ├── .env                           # Environment variables
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.jsx       # Main layout with sidebar
        │   │   ├── Sidebar.jsx         # Responsive sidebar + theme toggle
        │   │   └── ProtectedRoute.jsx  # Auth + role guard
        │   └── ui/
        │       ├── StatCard.jsx
        │       ├── StatusBadge.jsx
        │       ├── Spinner.jsx
        │       ├── ConfirmModal.jsx    # Replaces window.confirm()
        │       └── ThemeToggle.jsx
        ├── context/
        │   ├── AuthContext.jsx         # JWT auth state
        │   └── ThemeContext.jsx        # Light/dark theme
        ├── pages/
        │   ├── auth/Login.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── UsersPage.jsx
        │   │   ├── VisitorsPage.jsx
        │   │   ├── ReportsPage.jsx
        │   │   └── SecurityPage.jsx
        │   ├── receptionist/
        │   │   ├── ReceptionDashboard.jsx
        │   │   ├── VisitorsPage.jsx
        │   │   └── AppointmentsPage.jsx
        │   └── employee/
        │       ├── EmployeeDashboard.jsx
        │       ├── VisitorsPage.jsx
        │       └── AppointmentsPage.jsx
        ├── services/                   # Axios API calls
        ├── utils/                      # Helpers (dates, status colors)
        └── App.jsx                     # Router
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vms?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Initial Admin

```bash
cd backend
node src/scripts/seed.js
```

This creates:
- **Email:** `admin@vms.com`
- **Password:** `Admin@123`
- ⚠️ Change the password after first login!

### 4. Run the Project

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Runs on: http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/register` | Admin | Create user |
| GET | `/api/auth/me` | All | Current user |
| GET | `/api/visitors` | All | List visitors |
| POST | `/api/visitors` | Receptionist | Register visitor |
| PATCH | `/api/visitors/:id/checkin` | Receptionist | Check in |
| PATCH | `/api/visitors/:id/checkout` | Receptionist | Check out |
| PATCH | `/api/visitors/:id/status` | Employee | Approve/reject |
| GET | `/api/users` | Admin | List users |
| GET | `/api/users/employees` | All | List employees |
| GET | `/api/appointments` | All | List appointments |
| POST | `/api/appointments` | All | Create appointment |
| PATCH | `/api/appointments/:id/status` | Employee | Approve/reject |
| GET | `/api/reports/stats` | All | Dashboard stats |
| GET | `/api/reports/daily` | Admin/Reception | Daily chart data |
| GET | `/api/reports/logs` | Admin/Reception | Activity logs |
| GET | `/api/security/blacklist` | Admin | Blacklist |
| PATCH | `/api/security/blacklist/:id` | Admin | Blacklist visitor |
| PATCH | `/api/security/unblacklist/:id` | Admin | Remove from blacklist |

---

## 🎨 Theme

The app supports **Light** and **Dark** themes:
- Toggle via the moon/sun icon in the sidebar header
- Preference is saved in `localStorage`
- Applies instantly across all pages

---

## 📝 Logging

All critical events are logged via **Winston** to:
- `backend/logs/app.log` — all logs
- `backend/logs/error.log` — errors only
- Console (development only, with colors)

Logged events: login attempts, visitor creation, check-in/out, blacklist actions, errors.

---

## 🔒 Security Notes

- Passwords are hashed with bcryptjs (salt rounds: 12)
- JWT tokens expire in 7 days
- Blacklisted visitors are blocked at check-in
- Role middleware prevents cross-role access
- Deactivated users cannot log in

---

*Built with ❤️ by **Surjeet Karan***
