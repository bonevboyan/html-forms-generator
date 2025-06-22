# HTML Forms Generator – Backend

The Express/TypeScript/Prisma backend for the HTML Forms Generator project, deployed at [html-forms-generator.onrender.com](https://html-forms-generator.onrender.com).

## Features
- **Form Generation:**
  - Dynamic HTML form generation from JSON schemas
  - Support for nested schemas and field ordering
  - Field hints and validation
- **Database & Storage:**
  - PostgreSQL database with Prisma ORM
  - Form schema storage
  - Response collection
  - Public/private form access control
- **Authentication:**
  - JWT-based auth with Supabase
  - Protected routes for form management
  - Public routes for form submission
- **API Structure:**
  - RESTful endpoints
  - Clean middleware organization
  - Error handling and validation

## Directory Structure
```
server/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── auth.ts      # Authentication routes
│   │   └── forms.ts     # Form management routes
│   ├── middleware/      # Express middleware
│   │   └── authenticate.ts # JWT authentication
│   ├── utils/          
│   │   ├── formGenerator.ts # HTML generation
│   │   └── validation.ts    # Schema validation
│   ├── db.ts           # Prisma client setup
│   └── index.ts        # Express server setup
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── Dockerfile         # Production Docker setup
└── README.md         # This file
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

## Deployment
The backend is deployed on Render at [html-forms-generator.onrender.com](https://html-forms-generator.onrender.com).

### Deploy your own version:

1. Fork the repository
2. Create a Render web service
3. Connect to your fork
4. Configure environment variables:
   ```
   DATABASE_URL=your_supabase_postgres_url
   SUPABASE_JWT_SECRET=your_jwt_secret
   SUPABASE_PROJECT_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
5. Set the build command to:
   ```sh
   npm install && npm run build
   ```
6. Set the start command to:
   ```sh
   npm start
   ```

The Dockerfile is also available for container-based deployments, with proper handling of Prisma migrations and client generation.

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
