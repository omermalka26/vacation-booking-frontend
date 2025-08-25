# Vacation Booking System - Frontend

A modern React-based frontend for a vacation booking system with user authentication, admin dashboard, and responsive design.

## 🚀 Features

- **User Authentication**: Login/Register with JWT tokens
- **Vacation Browsing**: View all available vacations with images
- **Like System**: Users can like/unlike vacations
- **Admin Dashboard**: Full CRUD operations for vacations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Ocean blue theme with glassmorphism effects

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, Context API
- **Styling**: CSS3 with modern design patterns
- **HTTP Client**: Fetch API
- **State Management**: React Context API

## 📁 Project Structure

```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── UserContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Vacations.js
│   │   ├── Admin.js
│   │   ├── AddVacation.js
│   │   └── EditVacation.js
│   ├── api/
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── package.json
```

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <frontend-repo-url>
   cd vacation-booking-frontend
   ```

2. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🔗 Backend Repository

This frontend connects to a separate Flask backend API. You'll need to:

1. **Clone the backend repository**:
   ```bash
   git clone <backend-repo-url>
   cd vacation-booking-backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the backend server**:
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

## 👤 Authentication

### Default Admin User
- **Email**: admin@admin.com
- **Password**: admin
- **First Name**: Admin
- **Last Name**: User
- **Role**: Admin

### Regular User Registration
Users can register with any email and password.

### Admin Access
After logging in as admin, you'll see an "Admin Dashboard" button on the home page that gives you access to:
- View all vacations in a table format
- Add new vacations with images
- Edit existing vacations
- Delete vacations
- View like counts for each vacation

## 🎨 UI/UX Features

- **Ocean Blue Theme**: Consistent color scheme throughout
- **Glassmorphism Effects**: Modern transparent cards with blur
- **Responsive Design**: Adapts to all screen sizes
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: User feedback during API calls

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted navigation and card layouts
- **Mobile**: Touch-friendly interface with mobile-optimized navigation

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/api/api.js` if needed:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

## 🚀 Deployment

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting service (Netlify, Vercel, etc.)

### Backend Deployment
Deploy the backend to your preferred hosting service (Heroku, Railway, etc.)

## 📝 API Endpoints

The frontend communicates with these backend endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `GET /vacations` - Get all vacations
- `POST /vacations` - Create vacation (admin)
- `PUT /vacations/:id` - Update vacation (admin)
- `DELETE /vacations/:id` - Delete vacation (admin)
- `POST /likes` - Add like
- `DELETE /likes` - Remove like
- `GET /countries` - Get all countries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is the frontend repository. Make sure to also set up the backend repository for full functionality.
