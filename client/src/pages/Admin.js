import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { vacationAPI, countryAPI } from '../api/api';
import './Admin.css';

const Admin = () => {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [vacations, setVacations] = useState([]);
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    fetchVacations();
  }, [isAdmin, navigate]);

  const fetchVacations = async () => {
    try {
      setLoading(true);
      
      // Fetch vacations
      const vacationsResponse = await vacationAPI.getAll();
      setVacations(vacationsResponse.vacations || vacationsResponse.data || []);
      
      // Fetch countries
      const countriesResponse = await countryAPI.getAll();
      const countriesData = countriesResponse.countries || countriesResponse.data || [];
      
      // Convert countries array to object with country_id as key
      const countriesMap = {};
      countriesData.forEach(country => {
        countriesMap[country.country_id] = country.country_name;
      });
      setCountries(countriesMap);
      
      setError(null);
    } catch (err) {
      setError('Error loading vacations');
      console.error('Error fetching vacations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVacation = () => {
    navigate('/admin/add-vacation');
  };

  const handleEditVacation = (vacationId) => {
    navigate(`/admin/edit-vacation/${vacationId}`);
  };

  const handleDeleteVacation = async (vacationId) => {
    if (window.confirm('Are you sure you want to delete this vacation?')) {
      try {
        await vacationAPI.delete(vacationId);
        fetchVacations(); // Refresh the list
      } catch (err) {
        setError('Error deleting vacation');
        console.error('Error deleting vacation:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(price);
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading vacations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error">
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchVacations}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.first_name} {user?.last_name}</p>
        <button className="add-vacation-btn" onClick={handleAddVacation}>
          + Add New Vacation
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Vacations</h3>
          <p className="stat-number">{vacations.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Vacations</h3>
          <p className="stat-number">
            {vacations.filter(v => new Date(v.vacation_start) > new Date()).length}
          </p>
        </div>
      </div>

      <div className="vacations-table-container">
        <h2>Manage Vacations</h2>
        {vacations.length === 0 ? (
          <div className="no-vacations">
            <p>No vacations found. Add your first vacation!</p>
          </div>
        ) : (
          <div className="vacations-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Country</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Price</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vacations.map((vacation) => (
                  <tr key={vacation.vacation_id}>
                    <td>
                      <img 
                        src={`http://localhost:5000/images/${vacation.picture_file_name}`}
                        alt={vacation.vacation_description}
                        className="vacation-thumbnail"
                      />
                    </td>
                    <td>{vacation.vacation_description}</td>
                    <td>{countries[vacation.country_id] || 'Unknown'}</td>
                    <td>{formatDate(vacation.vacation_start)}</td>
                    <td>{formatDate(vacation.vacation_end)}</td>
                    <td className="price">{formatPrice(vacation.price)}</td>
                    <td className="likes-cell">
                      <div className="likes-display">
                        <span className="likes-icon">❤️</span>
                        <span className="likes-count">{vacation.likes_count || 0}</span>
                      </div>
                    </td>
                    <td className="actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditVacation(vacation.vacation_id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteVacation(vacation.vacation_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
