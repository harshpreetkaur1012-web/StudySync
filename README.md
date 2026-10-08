# StudySync — "Stay organized. Study smarter."

> Advanced Web Development Project: A modern, production-grade academic management and productivity workspace for students.

---

## 1. Project Overview

**StudySync** is a full-stack student productivity and academic management platform. It streamlines university and college workflows by providing an intuitive, distraction-free environment to:
- Track assignments from creation through completion
- Monitor academic deadlines with dynamic countdowns and status indicators
- Organize course materials, instructors, and credit allocations by subject
- Record structured revision notes and algorithm breakdowns
- Visualize personal productivity, completion rates, and workload trends through interactive charts

StudySync follows the modern UI/UX principles of Linear, Notion, and Vercel—incorporating clean typography, zero-pill metadata discipline, subtle borders, responsive tables, and full light/dark theme support.

---

## 2. Features

- **Full-Stack REST Architecture**: Complete separation between React/Vite client and Node.js/Express API.
- **JWT Authentication & bcrypt Security**: Password hashing with salted rounds and Bearer token protected routes.
- **Instant Demo Account**: One-click authentication with pre-populated demo data for immediate viva examination.
- **Assignment Management (CRUD)**:
  - Create, read, edit, delete coursework
  - Search by title and description
  - Filter by Subject, Priority (Low, Medium, High), and Status (Pending, In Progress, Completed, Overdue)
  - Sort by Due Date (Earliest/Latest) or Priority
  - Quick inline toggle to mark assignments as Completed
- **Subject Organization (CRUD)**:
  - Course code, instructor name, and credit points
  - Real-time calculated statistics (assignments count, completed count, progress percentage)
  - Color-coded subject identifiers
- **Interactive Academic Calendar**:
  - Clean monthly calendar grid with previous/next month navigation and "Today" shortcut
  - Colored deadline indicators for Pending, In Progress, Completed, and Overdue tasks
  - Modal details on click with status toggle
- **Personal Study Notes (CRUD)**:
  - Full-text search and subject filtering
  - Tag support with one-click clipboard copy
- **Analytics & Productivity Dashboard**:
  - Recharts Weekly Assignment Completion bar chart
  - Subject Progress comparative bars
  - Coursework status distribution donut chart
  - Real-time calculated completion rates
- **Student Profile Management**:
  - College/University, Degree program, and Academic Year editing
- **Appearance & Settings**:
  - Persistent Light / Dark mode toggle

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Centralized Fetch API client with Bearer Token interceptor

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Hashing**: `bcryptjs`
- **CORS & Environment**: `cors`, `dotenv`

### Database / Storage
- Clean modular in-memory data store (`backend/src/data/`) with initial realistic academic records.
- Service and controller architecture decoupled from persistence layer, ready for drop-in PostgreSQL, MongoDB, or Cloud SQL integration.

---

## 4. Folder Structure

```
StudySync/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analyticsController.ts
│   │   │   ├── assignmentController.ts
│   │   │   ├── authController.ts
│   │   │   ├── noteController.ts
│   │   │   └── subjectController.ts
│   │   ├── data/
│   │   │   ├── assignments.ts
│   │   │   ├── notes.ts
│   │   │   ├── subjects.ts
│   │   │   └── users.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.ts
│   │   │   ├── assignmentRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── noteRoutes.ts
│   │   │   └── subjectRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── auth.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/ (and root src/)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── Toast.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── AssignmentsPage.tsx
│   │   │   ├── CalendarPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotesPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── SubjectsPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── server.ts               # Unified full-stack server (Dev & Prod)
├── package.json
├── index.html
└── README.md
```

---

## 5. Demo Credentials

You can use the built-in **"Try Demo Account"** button on `/login` or enter:

- **Email**: `student@studysync.com`
- **Password**: `student123`

---

## 6. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (`frontend/.env`)
```env
# Point to your running backend API URL. Leave empty if served under unified proxy
VITE_API_URL=http://localhost:5000
```

---

## 7. Running the Project Locally

### Option A: Unified Full-Stack Runner (Recommended)
This runs both the Express REST API backend and the Vite frontend on a single unified development server:

```bash
# 1. Install all dependencies
npm install

# 2. Run full-stack dev server
npm run dev

# App runs at: http://localhost:3000
# API endpoints at: http://localhost:3000/api/*
```

### Option B: Separate Frontend and Backend
If you prefer running the client and server on separate terminal ports:

#### 1. Start the Backend:
```bash
cd backend
npm install
npm run dev
# Backend runs at http://localhost:5000
```

#### 2. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173 (or Vite default)
```

Make sure `frontend/.env` contains `VITE_API_URL=http://localhost:5000`.

---

## 8. REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student account | No |
| `POST` | `/api/auth/login` | Login with credentials & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch active authenticated profile | Yes (Bearer) |
| `PUT` | `/api/auth/profile` | Update profile academic details | Yes (Bearer) |

### Assignments (`/api/assignments`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/assignments` | List assignments (supports filters) | Yes (Bearer) |
| `POST` | `/api/assignments` | Create new assignment | Yes (Bearer) |
| `GET` | `/api/assignments/:id` | Fetch assignment by ID | Yes (Bearer) |
| `PUT` | `/api/assignments/:id` | Update assignment details | Yes (Bearer) |
| `PATCH`| `/api/assignments/:id/status`| Quick update status (e.g. Completed)| Yes (Bearer) |
| `DELETE`| `/api/assignments/:id` | Delete assignment | Yes (Bearer) |

### Subjects (`/api/subjects`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/subjects` | List subjects with calculated stats | Yes (Bearer) |
| `POST` | `/api/subjects` | Create new subject | Yes (Bearer) |
| `GET` | `/api/subjects/:id` | Fetch subject details | Yes (Bearer) |
| `PUT` | `/api/subjects/:id` | Update subject | Yes (Bearer) |
| `DELETE`| `/api/subjects/:id` | Delete subject | Yes (Bearer) |

### Personal Notes (`/api/notes`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notes` | List notes (search & filter) | Yes (Bearer) |
| `POST` | `/api/notes` | Create study note | Yes (Bearer) |
| `GET` | `/api/notes/:id` | Fetch note details | Yes (Bearer) |
| `PUT` | `/api/notes/:id` | Update note | Yes (Bearer) |
| `DELETE`| `/api/notes/:id` | Delete note | Yes (Bearer) |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics` | Get completion rates, weekly metrics | Yes (Bearer) |

---

## 9. Frontend-Backend Communication

1. User logs in at `/login`.
2. Frontend `api.auth.login({ email, password })` sends a POST request to Express.
3. Backend validates email and compares the hashed password with `bcryptjs`.
4. Backend generates a signed JWT payload containing `{ userId, email, name }` and returns `{ token, user }`.
5. Frontend stores the token in `localStorage` under `studysync_token`.
6. Subsequent requests automatically attach `Authorization: Bearer <token>` through the centralized `request` helper in `src/services/api.ts`.
7. Backend `authenticate` middleware verifies the token and attaches `req.user`.

---

## 10. Deployment Instructions

### Vercel (Frontend)
1. Push your repository to GitHub.
2. In Vercel, import the project and set the Root Directory to `.` (or `frontend`).
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Configure Environment Variable:
   - `VITE_API_URL`: Your deployed Render/Railway backend URL (e.g., `https://studysync-api.onrender.com`).
6. React Router rewrites: Add a `vercel.json` if hosting purely static:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Render / Railway (Backend)
1. Create a Web Service pointing to your repository.
2. Root Directory: `backend` (or run unified root).
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables:
   - `PORT`: `5000` (or provided by platform)
   - `JWT_SECRET`: Secure random string

---

## 11. Future Database Integration

The backend is structured into clear layers:
- `routes/`: Routing and URL mapping
- `middleware/`: Authentication and validation
- `controllers/`: Request handling and status responses
- `data/`: In-memory data store

To migrate from in-memory arrays to a persistent database:
1. **PostgreSQL / MySQL with Prisma or Drizzle ORM**:
   - Replace in-memory array operations in `controllers/` with ORM queries (e.g., `await prisma.assignment.findMany(...)`).
2. **MongoDB with Mongoose**:
   - Define Mongoose schemas matching `types/index.ts` and replace array references.

---

## 12. Viva / Exam Talking Points

1. **Why JWT over server-side session cookies?**
   Stateless authentication allows horizontal scalability, decoupled frontend hosting (e.g. Vercel) and backend hosting (e.g. Render/Railway), with no server session storage overhead.
2. **How is security handled?**
   Passwords are never stored in plain text; `bcryptjs` salts and hashes passwords. The JWT secret remains on the backend and is never exposed to the client.
3. **How does Recharts stay performant?**
   Components are wrapped with `ResponsiveContainer` and fed computed state from the Express `/api/analytics` endpoint without blocking UI re-renders.
4. **How are delete confirmations handled?**
   Destructive actions trigger modal confirmation dialogs to prevent accidental data loss.

---

&copy; 2026 StudySync. All rights reserved.
