# YelpCamp 🏕️

YelpCamp is a full-featured campground listing web application that allows users to create, view, and review campgrounds from around the world.

## 🌟 Features

- User registration, login, and logout with Passport.js
- Authenticated users can create, edit, and delete their own campgrounds
- Campgrounds can be reviewed by any logged-in user
- Dynamic map integration using **MapTiler API**
- Image upload and storage using **Cloudinary**
- Flash messages for user feedback (success/error)
- Input sanitization and security headers using `helmet` and `express-mongo-sanitize`
- Responsive frontend built with EJS templating

## 🗂️ Campground Attributes

Each campground includes:
- **Name**: Title of the campground
- **Location**: Geographical location (mapped)
- **Price**: Cost per night
- **Description**: Detailed text
- **Author**: User who created the campground
- **Images**: Uploaded and displayed from Cloudinary
- **Reviews**: Rating and comment by users

## 🔒 Authentication & Authorization

- Users must log in to create or edit a campground
- Only the original author can modify or delete their content
- Reviews are tied to users, who can delete their own reviews

## 🗺 Map Integration

- Interactive maps display campground locations using the **MapTiler API**
- Location input is geocoded to coordinates on submission

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/yelpcamp.git
   cd yelpcamp
Install dependencies:

npm install
Set up environment variables in a .env file:

.env file

DB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_secret
MAPTILER_API_KEY=your_maptiler_key
Start the app:

npm run dev
Visit: http://localhost:3000

📦 Tech Stack
Backend: Node.js, Express.js, MongoDB, Mongoose

Authentication: Passport.js with local strategy

Frontend: EJS templating engine

Map: MapTiler API

File Uploads: Multer + Cloudinary

📁 Folder Structure
/models – Mongoose models

/routers – Route definitions for campgrounds, reviews, and users

/views – EJS templates

/public – Static assets (CSS, JS)

/utils – Custom error handling

/schemas.js – JOI validation schemas

/middleware.js – Access control and validation middleware

🛡 Security
Sanitized HTML input to prevent XSS

Helmet for setting secure HTTP headers

Secure cookies and session handling

Developed as a project to understand RESTful routing, authentication, and full-stack integration
