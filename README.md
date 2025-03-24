# Chat App Deployment Guide

This is a full-stack chat application with real-time messaging capabilities. The project consists of a React frontend (using Vite) and a Node.js/Express backend, with MongoDB for data storage, Cloudinary for file uploads, and Socket.io for real-time communication.

## Project Structure

- `/frontend` - React/Vite application
- `/backend` - Node.js/Express server
- `/public` - Static assets

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account
- Cloudinary account
- Hosting platforms accounts (Vercel/Netlify for frontend, Render/Railway/Heroku for backend)

## Local Development Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:
   ```
   cd frontend && npm install
   cd backend && npm install
   ```
3. Create `.env` files in both directories with the required environment variables
4. Start the development servers:
   ```
   # For backend
   cd backend && npm run dev
   
   # For frontend
   cd frontend && npm run dev
   ```

## Deployment Steps

### Backend Deployment (Render/Railway/Heroku)

1. Create an account on your preferred hosting platform (Render recommended)
2. Create a new Web Service and connect your repository
3. Set the following configuration:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     PORT=5000 (or any port provided by the platform)
     MONGO_URI=your_mongodb_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     JWT_SECRET=your_jwt_secret
     FRONTEND_URL=your_frontend_url_after_deployment
     ```

### Frontend Deployment (Vercel/Netlify)

1. Create an account on your preferred hosting platform (Vercel recommended for React apps)
2. Connect your repository and select the frontend directory as the root
3. Set the following build configuration:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_BACKEND_URL=your_deployed_backend_url
     ```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account and set up a new cluster
2. Create a database user with read/write privileges
3. Whitelist all IP addresses (`0.0.0.0/0`) for development or specific IPs for production
4. Get your connection string and replace `<password>` with your database user password
5. Add this connection string to your backend's environment variables as `MONGO_URI`

### Cloudinary Setup

1. Create a Cloudinary account
2. Navigate to Dashboard to get your cloud name, API key, and API secret
3. Add these credentials to your backend's environment variables

## Post-Deployment Checklist

1. Test user registration and login
2. Test real-time messaging
3. Test file uploads
4. Verify that environment variables are properly set
5. Check for CORS issues
6. Ensure the database connection is working
7. Monitor logs for any errors

## Troubleshooting

- **CORS Issues**: Ensure the `FRONTEND_URL` environment variable on your backend is set correctly
- **Socket Connection Errors**: Verify that your frontend is using the correct backend URL for the socket connection
- **Database Connection Issues**: Check your MongoDB Atlas network access settings
- **Authentication Errors**: Verify that your JWT_SECRET is properly set

## Production Considerations

- Enable HTTPS for secure communication
- Implement rate limiting to prevent abuse
- Set up proper logging and monitoring
- Consider using a CDN for static assets
- Implement proper error handling and user feedback 