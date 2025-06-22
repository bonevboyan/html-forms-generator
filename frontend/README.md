# HTML Forms Generator – Frontend

The React frontend for the HTML Forms Generator project, deployed at [html-forms-generator-zeta.vercel.app](https://html-forms-generator-zeta.vercel.app). Build, share, and manage forms with a modern, intuitive interface.

## Features
- **Visual Form Builder:**
  - Drag-and-drop field organization with position tracking
  - Support for text, email, date, select, textarea fields
  - Nested schemas for complex form structures
  - Field hints and descriptions
  - Real-time form preview
- **Form Management:**
  - Save and organize your forms
  - Generate public sharing links
  - View and manage form responses
  - Response table with proper date formatting
- **Modern UI/UX:**
  - Material-UI components and styling
  - Responsive design
  - Loading states and error handling
  - Success notifications and redirects
- **Authentication:**
  - Secure login/register with Supabase
  - Protected routes for form management

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

## Deployment
The frontend is deployed on Vercel at [html-forms-generator-zeta.vercel.app](https://html-forms-generator-zeta.vercel.app).

To deploy your own version:
1. Fork the repository
2. Connect your fork to Vercel
3. Configure the following environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```
4. Deploy! Vercel will automatically build and deploy your changes

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
