# 🎟️ EventX — Event Management System
**By Javith Kausar | Start Turing Academy**

---

## 🚀 Quick Start (Step-by-Step)

### Step 1 — Backend Setup

```bash
cd eventx/backend
npm install
```

Edit `.env` with your MongoDB URL:
```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpass@yourcluster.mongodb.net/eventx?retryWrites=true&w=majority
JWT_SECRET=eventx_super_secret_key_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Step 2 — Seed Demo Data (Run Once!)

```bash
npm run seed
```

This creates:
- 👑 Admin  →  `admin@eventx.com`  /  `admin123`
- 👤 User   →  `user@eventx.com`   /  `user123`
- 🎉 6 sample events

### Step 3 — Start Backend

```bash
npm run dev
# ✅ Server running on http://localhost:5000
# ✅ MongoDB Connected
```

### Step 4 — Frontend Setup (new terminal)

```bash
cd eventx/frontend
npm install
npm run dev
# ✅ http://localhost:5173
```

### Step 5 — Open Browser

Go to `http://localhost:5173` and log in with the demo credentials above.

---

## 👤 Roles & What They Can Do

| Feature                        | User | Admin |
|-------------------------------|------|-------|
| Browse all events              | ✅   | ✅    |
| View event detail page         | ✅   | ✅    |
| Book tickets (max 5/event)     | ✅   | ❌    |
| Cancel own booking             | ✅   | ✅    |
| View own booking history       | ✅   | ✅    |
| Create / Edit / Delete events  | ❌   | ✅    |
| View ALL bookings (dashboard)  | ❌   | ✅    |
| View dashboard stats           | ❌   | ✅    |

---

## 📁 Project Structure

```
eventx/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js      ← Register, Login, GetMe
│   │   ├── eventController.js     ← CRUD events
│   │   ├── bookingController.js   ← Book, Cancel, History
│   │   └── adminController.js     ← Dashboard stats
│   ├── middleware/
│   │   ├── authMiddleware.js      ← JWT protect + adminOnly
│   │   └── uploadMiddleware.js    ← Multer image upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Booking.js
│   ├── routes/
│   ├── utils/generateToken.js
│   ├── seed.js                    ← Demo data seeder ← NEW
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── LoginPage.jsx        ← With demo login buttons
        │   ├── RegisterPage.jsx
        │   ├── HomePage.jsx         ← Browse + book events
        │   ├── EventDetailPage.jsx  ← Single event + booking ← NEW
        │   ├── DashboardPage.jsx    ← Admin manage events
        │   ├── AdminBookingsPage.jsx← Admin view all bookings ← NEW
        │   └── BookingsPage.jsx     ← User ticket history
        ├── components/
        │   ├── common/ (Sidebar, TopBar, Modal, Toast, ...)
        │   ├── admin/StatCard.jsx
        │   ├── events/ (EventCard, EventForm, CategoryFilter)
        │   └── bookings/ (BookingCard, BookingModal)
        └── App.jsx                  ← All routes wired up
```

---

## 🌐 API Reference

| Method | Endpoint              | Auth   | Description         |
|--------|-----------------------|--------|---------------------|
| POST   | `/api/auth/register`  | Public | Register            |
| POST   | `/api/auth/login`     | Public | Login               |
| GET    | `/api/auth/me`        | User   | Get current user    |
| GET    | `/api/events`         | Public | List events         |
| GET    | `/api/events/:id`     | Public | Single event        |
| POST   | `/api/events`         | Admin  | Create event        |
| PUT    | `/api/events/:id`     | Admin  | Update event        |
| DELETE | `/api/events/:id`     | Admin  | Delete event        |
| POST   | `/api/bookings`       | User   | Book tickets        |
| GET    | `/api/bookings/my`    | User   | My bookings         |
| GET    | `/api/bookings/all`   | Admin  | All bookings        |
| DELETE | `/api/bookings/:id`   | User   | Cancel booking      |
| GET    | `/api/admin/stats`    | Admin  | Dashboard stats     |

---

## ✅ Features Checklist (PDF Requirements)

- [x] Admin creates / edits / deletes events
- [x] Users browse and filter events by category
- [x] Event detail page with full info
- [x] Book tickets with quantity picker (max 5 per user per event)
- [x] Seat limit logic — sold out detection
- [x] Ticket booking history with cancel
- [x] Admin dashboard with live stats (events, users, bookings, seats sold)
- [x] Admin can view ALL bookings across all users
- [x] JWT authentication + protected routes
- [x] Role-based access (user / admin)
- [x] Category filter
- [x] Search events
- [x] Seed script for easy demo setup

---

## 🤖 AI Usage (Required by Start Turing Academy)

| File | AI Used For | Reason |
|------|-------------|--------|
| `bookingController.js` | Seat limit edge cases | Handling cancel + rebook and concurrent booking edge cases |
| `authMiddleware.js` | JWT security patterns | Industry-standard token validation |
| `EventCard.jsx` | Hover animation CSS | Complex transition combinations are verbose |
| `AuthContext.jsx` | Token expiry flow | Interceptor + auto-logout pattern |
| `useEvents.js` | Custom hook structure | Scaffolding the loading/error/data pattern |
| `seed.js` | Sample data generation | AI generated realistic event data for demo |
