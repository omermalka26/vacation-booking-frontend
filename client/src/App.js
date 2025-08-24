// App.js - Main component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Vacations from './pages/Vacations';
import Admin from './pages/Admin';
import AddVacation from './pages/AddVacation';
import EditVacation from './pages/EditVacation';
import './App.css';

// Home page component
const Home = () => {
  const { isAuthenticated, user, isAdmin, loading } = useUser();

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="home-container">
        <div className="home-logo">
          🏖️ Vacation Booking
        </div>
        <h1>Welcome back, {user?.first_name}!</h1>
        <p>Ready to explore amazing destinations?</p>
        <div className="home-actions">
          <Link to="/vacations" className="home-btn primary">
            🏖️ Browse Vacations
          </Link>
          {isAdmin && (
            <Link to="/admin" className="home-btn secondary">
              ⚙️ Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-logo">
        🏖️ Vacation Booking
      </div>
      <h1>Welcome!</h1>
      <p>Login or register to get started</p>
      <div className="home-actions">
        <Link to="/login" className="home-btn primary">
          🔑 Login
        </Link>
        <Link to="/register" className="home-btn secondary">
          📝 Register
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vacations" element={<Vacations />} />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-vacation" element={
                <ProtectedRoute requireAdmin={true}>
                  <AddVacation />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-vacation/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <EditVacation />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
