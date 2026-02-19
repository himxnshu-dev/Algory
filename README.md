# Algory

A full-stack web application for tracking DSA (Data Structures and Algorithms) problem-solving progress. Built with React, Redux, Express, and MongoDB.

Algory helps you log problems, track your solving streaks with a GitHub-style activity heatmap, visualize topic and difficulty distributions, and get AI-powered code reviews using Google Gemini.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Frontend Architecture](#frontend-architecture)
- [Scripts](#scripts)

---

## Features

- **Authentication** - Register, login, and JWT-based session management
- **Problem Tracking** - Add, edit, delete, and filter DSA problems by topic, difficulty, and status
- **Dashboard Analytics** - Stats cards, topic distribution bar chart, difficulty breakdown pie chart
- **Activity Heatmap** - GitHub-style contribution grid showing daily solving activity over the past year
- **Streak Tracking** - Current streak and longest streak calculations
- **AI Code Review** - Submit solution code for automated review powered by Google Gemini
- **Responsive Design** - Sidebar navigation on desktop, collapsible mobile menu
- **Dark Theme** - Minimal dark UI inspired by Linear and Vercel

---

## Tech Stack

### Backend

| Layer        | Technology                |
| ------------ | ------------------------- |
| Runtime      | Node.js                   |
| Framework    | Express.js                |
| Database     | MongoDB (Mongoose ODM)    |
| Auth         | JWT (jsonwebtoken)        |
| Password     | bcryptjs                  |
| AI           | Google Generative AI SDK  |
| Dev Server   | nodemon                   |

### Frontend

| Layer        | Technology                |
| ------------ | ------------------------- |
| Framework    | React 18                  |
| State        | Redux Toolkit             |
| Routing      | React Router v7           |
| HTTP Client  | Axios                     |
| Charts       | Recharts                  |
| Styling      | Tailwind CSS 3            |
| Markdown     | react-markdown            |
| Icons        | react-icons               |
| Build Tool   | Vite                      |

---

## Project Structure

```
algory/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile logic
│   │   ├── problemController.js   # CRUD + stats logic
│   │   └── aiController.js        # Gemini code review logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── errorMiddleware.js     # 404 and global error handlers
│   ├── models/
│   │   ├── User.js                # User schema with password hashing
│   │   └── Problem.js             # Problem schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── problemRoutes.js       # /api/problems/*
│   │   └── aiRoutes.js            # /api/ai/*
│   ├── utils/
│   │   ├── generateToken.js       # JWT token generator
│   │   └── openai.js              # Gemini client (lazy init)
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env                       # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js           # Redux store configuration
│   │   ├── components/
│   │   │   ├── ActivityHeatmap.jsx # GitHub-style heatmap grid
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   ├── Sidebar.jsx        # Desktop sidebar navigation
│   │   │   ├── PrivateRoute.jsx   # Auth-guarded route wrapper
│   │   │   ├── Spinner.jsx        # Loading indicator
│   │   │   └── StatsCard.jsx      # Dashboard stat card
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── authService.js # Auth API calls
│   │   │   │   └── authSlice.js   # Auth Redux slice
│   │   │   ├── problems/
│   │   │   │   ├── problemService.js # Problem API calls
│   │   │   │   └── problemSlice.js   # Problem Redux slice
│   │   │   └── ai/
│   │   │       ├── aiService.js   # AI review API calls
│   │   │       └── aiSlice.js     # AI Redux slice
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx     # Sidebar + Navbar + content layout
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx  # Stats, heatmap, charts
│   │   │   ├── ProblemsPage.jsx   # Filterable problem list
│   │   │   ├── AddProblemPage.jsx # New problem form
│   │   │   ├── EditProblemPage.jsx# Edit problem form
│   │   │   ├── ProblemDetailPage.jsx # Problem details + AI review
│   │   │   ├── LoginPage.jsx      # Login form
│   │   │   └── RegisterPage.jsx   # Registration form
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles + Tailwind directives
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite config with API proxy
│   ├── tailwind.config.js         # Tailwind theme (surface color palette)
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## API Endpoints

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Health Check

| Method | Endpoint       | Auth | Description          |
| ------ | -------------- | ---- | -------------------- |
| GET    | `/api/health`  | No   | Returns server status |

### Authentication (`/api/auth`)

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| POST   | `/api/auth/register`  | No   | Register a new user      |
| POST   | `/api/auth/login`     | No   | Login and receive token  |
| GET    | `/api/auth/profile`   | Yes  | Get current user profile |

**POST /api/auth/register**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response: `201 Created`

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

**POST /api/auth/login**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: `200 OK` with same shape as register.

### Problems (`/api/problems`)

All problem routes are protected.

| Method | Endpoint                | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| GET    | `/api/problems`         | Get all problems (with filters)    |
| POST   | `/api/problems`         | Create a new problem               |
| PUT    | `/api/problems/:id`     | Update a problem                   |
| DELETE | `/api/problems/:id`     | Delete a problem                   |
| GET    | `/api/problems/stats`   | Get dashboard statistics           |

**Query Parameters for GET /api/problems**

| Param      | Values                          |
| ---------- | ------------------------------- |
| `topic`    | Arrays, Strings, Trees, etc.    |
| `difficulty`| Easy, Medium, Hard             |
| `status`   | Solved, Unsolved, Revision      |

**POST /api/problems**

```json
{
  "title": "Two Sum",
  "platform": "LeetCode",
  "topic": "Arrays",
  "difficulty": "Easy",
  "status": "Solved",
  "solutionCode": "function twoSum(nums, target) { ... }"
}
```

**GET /api/problems/stats**

Response:

```json
{
  "total": 42,
  "solved": 30,
  "unsolved": 5,
  "revision": 7,
  "topicDistribution": [{ "name": "Arrays", "count": 10 }, ...],
  "difficultyDistribution": [{ "name": "Easy", "count": 15 }, ...],
  "dailyActivity": [{ "date": "2025-01-15", "count": 3 }, ...],
  "currentStreak": 5,
  "longestStreak": 12
}
```

### AI Review (`/api/ai`)

Protected route.

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/api/ai/review`  | Get AI review of solution code |

**POST /api/ai/review**

```json
{
  "problemId": "problem_object_id",
  "code": "function solution() { ... }"
}
```

Response:

```json
{
  "feedback": "Markdown formatted review from Gemini..."
}
```

The feedback is also saved to the problem's `aiFeedback` field.

---

### Routes

| Path                  | Page               | Auth     |
| --------------------- | ------------------ | -------- |
| `/login`              | LoginPage          | Public   |
| `/register`           | RegisterPage       | Public   |
| `/`                   | DashboardPage      | Private  |
| `/problems`           | ProblemsPage       | Private  |
| `/problems/new`       | AddProblemPage     | Private  |
| `/problems/:id`       | ProblemDetailPage  | Private  |
| `/problems/:id/edit`  | EditProblemPage    | Private  |

---

## Scripts

### Backend

```bash
npm run dev     # Start with nodemon (hot reload)
npm start       # Start without nodemon
```

### Frontend

```bash
npm run dev     # Start Vite dev server
npm run build   # Production build
npm run preview # Preview production build
```
