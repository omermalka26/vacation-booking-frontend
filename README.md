# 🏖️ Vacation Booking System

A full-stack web application for booking vacation packages, built with Flask (Backend) and React (Frontend).

## 🌟 Features

### For Users:
- **User Registration & Authentication** - Secure JWT-based authentication
- **Browse Vacations** - View available vacation packages with images and details
- **Like/Unlike Vacations** - Express interest in vacation packages
- **Responsive Design** - Works perfectly on desktop and mobile devices

### For Administrators:
- **Admin Dashboard** - Manage all vacation packages
- **Add New Vacations** - Create new vacation packages with images
- **Edit Vacations** - Update existing vacation details
- **Delete Vacations** - Remove vacation packages
- **View Statistics** - See total and active vacations count

## 🛠️ Tech Stack

### Backend (Flask):
- **Flask** - Web framework
- **SQLite** - Database
- **PyJWT** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - Password hashing and file handling
- **Pillow** - Image processing

### Frontend (React):
- **React 18** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests

## 📁 Project Structure

```
Project Pt2/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── api/           # API service
│   │   └── App.js         # Main app component
│   ├── package.json
│   └── README.md
└── Project/               # Flask Backend
    ├── controllers/       # Business logic
    ├── models/           # Database models
    ├── routes/           # API endpoints
    ├── decorators/       # Authentication decorators
    ├── images/           # Vacation images
    ├── app.py           # Main Flask app
    ├── requirements.txt  # Python dependencies
    └── projectdb.db     # SQLite database
```

## 🚀 Installation & Setup

### Prerequisites:
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup:
1. Navigate to the backend directory:
   ```bash
   cd Project
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup:
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Users can create new accounts
- **Login**: Users authenticate with email and password
- **Protected Routes**: Admin routes require authentication and admin privileges
- **Token Storage**: JWT tokens are stored in localStorage

## 🎨 UI/UX Features

- **Modern Design**: Clean, responsive interface with ocean blue theme
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Role-Based UI**: Different interfaces for users and administrators
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: User-friendly error messages and retry options

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 API Endpoints

### Authentication:
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user info

### Vacations:
- `GET /vacations` - Get all vacations
- `POST /vacations` - Create new vacation (admin only)
- `PUT /vacations/:id` - Update vacation (admin only)
- `DELETE /vacations/:id` - Delete vacation (admin only)
- `GET /vacations/user-likes` - Get user's liked vacations

### Countries:
- `GET /countries` - Get all countries

### Likes:
- `POST /likes` - Add like to vacation
- `DELETE /likes/:vacation_id` - Remove like from vacation

## 🗄️ Database Schema

### Users Table:
- `user_id` (Primary Key)
- `first_name`
- `last_name`
- `email`
- `password_hash`
- `role_id`

### Vacations Table:
- `vacation_id` (Primary Key)
- `vacation_description`
- `country_id`
- `vacation_start`
- `vacation_end`
- `price`
- `picture_file_name`

### Countries Table:
- `country_id` (Primary Key)
- `country_name`

### Likes Table:
- `like_id` (Primary Key)
- `user_id`
- `vacation_id`

## 🚀 Deployment

### Backend Deployment:
1. Set up a production server (e.g., Heroku, DigitalOcean)
2. Install Python and dependencies
3. Set environment variables
4. Run with a production WSGI server (e.g., Gunicorn)

### Frontend Deployment:
1. Build the production version: `npm run build`
2. Deploy the `build` folder to a static hosting service (e.g., Netlify, Vercel)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as a full-stack development project demonstrating modern web development practices.

---

**Happy Vacation Booking! 🏖️✈️**
