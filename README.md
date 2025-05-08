# MEAN Stack Movie Application

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Angular CLI (for frontend)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and add needed content to .env

4. Start the server:
   ```
    node server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm start
   ```

3. Configure the API URL:
   - For development: The default configuration in `src/environments/environment.ts` uses `http://localhost:3000/api`
   - For production: Update `src/environments/environment.prod.ts` with your production API URL

4. Start the development server:
   ```bash
   ng serve
   ```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Features
- User registration and login
- Movie search and management
- Personal movie lists
- OMDB API integration

## Troubleshooting
If you encounter any issues:
1. Ensure MongoDB is running
2. Check that all environment variables are properly set
3. Verify that both frontend and backend servers are running
4. Check the browser console and server logs for error messages
5. If you're running the backend on a different port or host, update the `apiUrl` in `frontend/src/environments/environment.ts`

## Authentication Flow
1. Register a new account using the registration form
2. Login with your credentials
3. The application will automatically:
   - Store your JWT token
   - Extract and store your user ID
   - Use the token for authenticated requests
