# HTML Forms Generator – Backend (Server)

This is the backend for the HTML Forms Generator project. It is built with Express and TypeScript, and generates HTML forms from JSON schemas.

## Directory Structure
```
server/
├── src/            # Backend source code
│   ├── index.ts    # Express server entry point
│   ├── formGenerator.ts # Form generation logic
│   └── types.ts    # Type definitions
├── package.json    # Backend dependencies
├── tsconfig.json   # TypeScript configuration
├── Dockerfile      # Docker build for backend
└── README.md       # This file
```

## Setup & Development

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
   The backend will run on [http://localhost:3001](http://localhost:3001) by default.

## Production & Docker

- **Build and run with Docker:**
  ```sh
  docker build -t html-form-backend .
  docker run -p 3001:3001 html-form-backend
  ```
- The server will listen on port 3001.

## API

### `POST /generate-form`
- **Request body:** JSON schema describing the form
- **Response:** Generated HTML form as a string

#### Example Request
```json
{
  "name": { "type": "text", "label": "Name" },
  "email": { "type": "email", "label": "Email" },
  "address": {
    "type": "schema",
    "label": "Address",
    "schema": {
      "street": { "type": "text", "label": "Street" },
      "zip": { "type": "text", "label": "ZIP Code" }
    }
  }
}
```

## Notes
- The backend is CORS-enabled for local development.
- For schema format details, see the root-level README or the frontend documentation.
