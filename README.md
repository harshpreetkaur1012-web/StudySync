# 📚 StudySync

> Stay organized. Study smarter.

StudySync is a modern full-stack student productivity platform designed to help students manage their academic work in one place.

It provides a centralized workspace for managing assignments, subjects, notes, deadlines, calendars, and academic progress through a clean and responsive interface.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected application routes
- Persistent user sessions
- Demo account for testing

### 📊 Dashboard
- Overview of academic activities
- Upcoming assignments
- Assignment completion statistics
- Subject summary
- Recent notes
- Academic progress visualization

### 📝 Assignment Management
- Create assignments
- Edit assignments
- Delete assignments
- Mark assignments as completed
- Track deadlines
- Filter and sort assignments
- Search assignments
- Priority and status indicators

### 📚 Subject Management
- Add subjects
- Edit subject details
- Delete subjects
- Assign assignments to subjects
- View subject-wise progress

### 🗒️ Notes
- Create notes
- Edit notes
- Delete notes
- Organize academic information
- Search through notes

### 📅 Calendar
- View academic deadlines
- Track upcoming assignments
- Monthly calendar interface
- Quick overview of important dates

### 📈 Analytics
- Assignment completion statistics
- Subject-wise progress
- Academic activity overview
- Interactive charts using Recharts

### 👤 Profile & Settings
- View profile information
- Update account details
- Application preferences
- Light and dark mode

### 📱 Responsive Design
StudySync is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- REST APIs
- JWT Authentication

### Data

The current version uses in-memory/dummy data for development and demonstration purposes.

No external database is required.

---

## 🏗️ Project Structure

```text
StudySync/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── data/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   └── package.json
│
└── README.md
