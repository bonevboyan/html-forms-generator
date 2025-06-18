# HTML Forms Generator

A TypeScript Express application that generates HTML forms from JSON schemas.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Development

To run the application in development mode:
```bash
npm run dev
```

## Building

To build the application:
```bash
npm run build
```

## Running

To run the built application:
```bash
npm start
```

## Usage

Send a POST request to `/generate-form` with a JSON schema in the request body. The server will return the generated HTML form.

Example request:
```bash
curl -X POST http://localhost:3000/generate-form \
  -H "Content-Type: application/json" \
  -d '{
    "birthdate": {
      "type": "date",
      "label": "Date of birth",
      "hint": "We will send you a gift!"
    },
    "gender": {
      "type": "select",
      "options": [[0, "Male"], [1, "Female"], [9, "Do not specify"]],
      "placeholder": "Please select"
    },
    "address": {
      "type": "schema",
      "schema": {
        "zip": {
          "type": "text",
          "pattern": "[1-9]{1}[0-9]{3}"
        },
        "street": {
          "type": "textarea"
        }
      }
    }
  }'
```

## Schema Format

Each schema entry should have:
- `type`: The type of input (text, date, select, textarea, schema)
- `label` (optional): The label text for the input
- `hint` (optional): A hint text displayed below the input
- For select inputs:
  - `options`: Array of [value, label] pairs
  - `placeholder` (optional): Placeholder text
- For schema type:
  - `schema`: Nested schema object
- Any other attributes will be passed directly to the HTML element 