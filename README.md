# HTML Forms Generator

A full-stack application for visually building, sharing, and collecting form responses. Built with React, Material-UI, TypeScript (frontend) and Express/TypeScript/Prisma (backend).

## Live Demo
- **Frontend:** [html-forms-generator-zeta.vercel.app](https://html-forms-generator-zeta.vercel.app)
- **Backend API:** [html-forms-generator.onrender.com](https://html-forms-generator.onrender.com)

## Features
- **Visual Schema Builder:**
  - Drag-and-drop field organization
  - Support for text, email, date, select, textarea, and nested schemas
  - Field ordering with position tracking
  - Field hints and descriptions
- **Form Management:**
  - Save forms with unique public URLs
  - Share forms publicly
  - Collect and view form responses
  - Clean separation of API logic into hooks
- **Modern UI/UX:**
  - Material-UI components
  - Response viewing with proper date formatting
  - Improved form styling and field spacing
  - Validation hints
- **Security & Authentication:**
  - Supabase authentication
  - Protected form management routes
  - Public/private form separation

## Project Structure
```
html-forms-generator/
├── frontend/   # React frontend (Material-UI, TypeScript)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks (auth, forms, etc.)
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Helper functions
├── server/     # Express backend (TypeScript, Prisma)
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── utils/       # Form generation, validation
│   └── prisma/          # Database schema and migrations
└── README.md   # This file
```

## Quick Start

### 1. Start the backend
```sh
cd server
npm install
npm run dev
```
Backend runs on [http://localhost:3001](http://localhost:3001)

### 2. Start the frontend
```sh
cd frontend
npm install
npm start
```
Frontend runs on [http://localhost:3000](http://localhost:3000)

### 3. Configure backend URL (optional)
In `frontend/.env`:
```
REACT_APP_BACKEND_URL=http://localhost:3001
```

## Docker
- **Backend only:**
  ```sh
  cd server
  docker build -t html-form-backend .
  docker run -p 3001:3001 html-form-backend
  ```
- **Frontend:** Build with `npm run build` and serve with any static file server.
- For a full-stack Docker setup, see the frontend and server README files for guidance.

## Features
- Visual drag-and-drop schema builder
- Supports text, email, date, select, textarea, and nested schemas
- Real-time HTML form preview
- Copy generated HTML to clipboard
- Modern Material-UI design

## More Info
- [Frontend README](frontend/README.md)
- [Backend README](server/README.md)
