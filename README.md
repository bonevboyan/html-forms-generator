# HTML Forms Generator

This project is a full-stack application for generating HTML forms from a JSON schema. It consists of a React frontend and an Express/TypeScript backend.

## Project Structure

```
html-forms-generator/
│
├── frontend/         # React frontend (TypeScript, Material-UI)
│   └── ...
│
├── server/           # Express backend (TypeScript)
│   ├── src/          # Backend source code
│   ├── package.json  # Backend dependencies
│   ├── tsconfig.json # Backend TypeScript config
│   └── ...
│
├── README.md         # Project documentation (this file)
└── ...
```

## Getting Started

### Backend (Server)

1. Install dependencies:
   ```sh
   cd server
   npm install
   ```
2. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend will run on [http://localhost:3000](http://localhost:3000) or the port specified in your environment.

### Frontend (React App)

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend app:
   ```sh
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000) by default, or the port specified in your `.env` file.

## Features
- Build complex, nested form schemas visually
- Real-time HTML form preview
- Supports text, email, date, select, textarea, and nested schemas
- Copy generated HTML to clipboard
- Modern Material-UI design

## License
MIT 