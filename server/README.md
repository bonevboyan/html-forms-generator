# HTML Forms Generator – Backend (Server)

This is the backend (server) for the HTML Forms Generator project. It is built with Express and TypeScript, and is responsible for generating HTML forms from JSON schemas.

## Directory Structure

```
server/
├── src/            # Backend source code
│   ├── index.ts    # Express server entry point
│   ├── formGenerator.ts # Form generation logic
│   └── types.ts    # Type definitions
├── package.json    # Backend dependencies
├── package-lock.json
├── tsconfig.json   # TypeScript configuration
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
   The backend will run on [http://localhost:3000](http://localhost:3000) or the port specified in your environment.

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
- For schema format details, see the root-level README.

## License
MIT 