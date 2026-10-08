# 📚 StudySync

**StudySync** is a full-stack academic management and productivity platform designed to help students manage assignments, subjects, notes, deadlines, and academic progress from one place.

It was developed as an **Advanced Web Development project** using React, TypeScript, Vite, Node.js, Express.js, JWT authentication, and Recharts.

---

## ✨ Features

### 🔐 Authentication
- Student registration and login
- JWT-based authentication
- Protected application routes
- Password hashing with bcrypt
- Demo account for quick testing

### 📊 Dashboard
- Overview of academic activities
- Assignment statistics
- Upcoming deadlines
- Subject progress
- Overall completion progress

### 📝 Assignment Management
- Create assignments
- Edit assignments
- Delete assignments
- Mark assignments as completed
- Search assignments
- Filter by subject, priority, and status
- Sort by due date and priority
- Track pending, in-progress, completed, and overdue assignments

### 📚 Subject Management
- Add and edit subjects
- Course code and instructor information
- Credit points
- Subject-wise assignment statistics
- Completion progress for each subject

### 📅 Academic Calendar
- Monthly calendar view
- Assignment deadline indicators
- Previous/next month navigation
- Today shortcut
- View assignment details from the calendar

### 🗒️ Study Notes
- Create personal notes
- Edit and delete notes
- Search notes
- Filter notes by subject
- Add tags
- Copy note content to clipboard

### 📈 Analytics
- Assignment completion statistics
- Weekly assignment activity
- Subject-wise progress
- Assignment status distribution
- Interactive charts using Recharts

### 👤 Profile & Settings
- View and update academic information
- College/university details
- Degree and academic year
- Light and dark mode
- Responsive interface

---

## 🛠️ Technology Stack

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Recharts**
- **Lucide React**
- **Fetch API**

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **JWT**
- **bcryptjs**
- **CORS**
- **dotenv**

### Data Storage

The current version uses **in-memory data** for development and demonstration.

The data layer is separated from the application logic so that a persistent database can be added in the future.

---

## 🏗️ Project Architecture

StudySync currently uses a unified development architecture.

```text
StudySync
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── data/
│       ├── middleware/
│       ├── routes/
│       ├── types/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
│
├── frontend/
│   └── ...
│
├── src/
│   └── ...
│
├── server.ts
├── package.json
├── vite.config.ts
├── index.html
├── tsconfig.json
├── .env.example
└── README.md
