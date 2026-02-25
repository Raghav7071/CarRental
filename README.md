# Car Rental Application

A full-stack car rental management system built with React, Express, Prisma, and ImageKit. This application allows users to browse available cars, make bookings, and manage their rentals, while providing owners with tools to manage their fleet and bookings.

## Features

### User Features
- Browse and search for available cars.
- View detailed profiles for each vehicle.
- Secure booking and payment process.
- Manage personal bookings and view history.
- Profile management including image uploads.

### Owner Features
- Dashboard for managing car listings.
- Track and manage incoming bookings.
- Update car availability and details.
- Manage customer interactions.

## Tech Stack

### Frontend
- React.js: For building the user interface.
- Vite: As the build tool and development server.
- Tailwind CSS: For styling the application.
- React Router: For navigation and routing.
- Axios: For handling API requests.
- React Toastify: For interactive notifications.

### Backend
- Node.js & Express: For the server-side logic and RESTful API.
- Prisma: As the ORM for database management.
- ImageKit: For cloud-based image storage and management.
- Multer: For handling multipart/form-data (image uploads).
- JWT (JSON Web Tokens): For secure authentication.
- Nodemailer: For sending email notifications.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.x or higher)
- npm (v7.x or higher)
- A relational database (PostgreSQL, MySQL, etc.) supported by Prisma.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rentalCar2/CarRental
   ```

2. Install dependencies for the root, client, and server:
   ```bash
   npm run install-all
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the `server` directory.
   - Add the following variables:
     ```env
     DATABASE_URL=your_database_url
     JWT_SECRET=your_jwt_secret
     IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
     IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
     IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
     EMAIL_SERVICE=your_email_service
     EMAIL_USER=your_email_user
     EMAIL_PASS=your_email_password
     ```

4. Database Migration:
   - Navigate to the server directory and run Prisma migrations:
     ```bash
     cd server
     npx prisma migrate dev
     ```

## Running the Application

You can run both the client and the server simultaneously from the root directory:

```bash
npm start
```

- The client will typically run on: `http://localhost:5173`
- The server will typically run on: `http://localhost:5000`

## Scripts

- `npm start`: Runs both client and server using concurrently.
- `npm run client`: Runs only the frontend development server.
- `npm run server`: Runs only the backend server using nodemon.
- `npm run install-all`: Installs all necessary dependencies for both frontend and backend.
