# HTML Forms Generator – Frontend

This is the React frontend for the HTML Forms Generator project. It lets you visually build a form schema and preview the generated HTML form in real time.

## Features
- Visual schema builder (drag-and-drop, nested fields)
- Supports text, email, date, select, textarea, and nested schemas
- Copy generated HTML to clipboard
- Modern Material-UI design
- Connects to a backend API for HTML generation

## Getting Started

### 1. Install dependencies
```sh
cd frontend
npm install
```

### 2. Set backend URL (optional)
Create a `.env` file in the `frontend/` directory to specify your backend API:
```
REACT_APP_BACKEND_URL=http://localhost:3001
```
If not set, defaults to `http://localhost:3001`.

### 3. Start the development server
```sh
npm start
```
The app will run on [http://localhost:3000](http://localhost:3000).

### 4. Build for production
```sh
npm run build
```
The static site will be output to the `build/` directory.

## Usage
- Use the Schema Builder to add and configure fields.
- Click the play button to generate the HTML form.
- Copy the generated HTML with the copy button.

## Project Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── ...
├── public/              # Static assets
└── ...
```
