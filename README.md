# HTML Forms Generator

A full-stack app for visually building JSON schemas and generating HTML forms. Built with React (frontend) and Express/TypeScript (backend).

## Project Structure
```
html-forms-generator/
├── frontend/   # React frontend (Material-UI, TypeScript)
├── server/     # Express backend (TypeScript)
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
