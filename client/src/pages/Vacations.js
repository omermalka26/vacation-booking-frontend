import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { vacationAPI, likeAPI, countryAPI } from '../api/api';
import './Vacations.css';

const Vacations = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, loading: userLoading } = useUser();
  const [vacations, setVacations] = useState([]);
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedVacations, setLikedVacations] = useState(new Set());

  useEffect(() => {
    if (!userLoading) {
      fetchVacations();
    }
  }, [userLoading]);

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
      
      // If user is authenticated, fetch liked vacations
      if (isAuthenticated) {
        try {
          const likedResponse = await vacationAPI.getUserLikedVacations();
          const likedVacationsList = likedResponse.liked_vacations || [];
          setLikedVacations(new Set(likedVacationsList));
        } catch (err) {
          console.error('Error fetching liked vacations:', err);
          // Don't fail the whole request if this fails
        }
      }
    } catch (err) {
      setError('Error loading vacations');
      console.error('Error fetching vacations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (vacationId) => {
    if (!isAuthenticated) {
      alert('You must be logged in to like vacations');
      return;
    }

    if (isAdmin) {
      alert('Administrators cannot like vacations');
      return;
    }

    try {
      if (likedVacations.has(vacationId)) {
                 // Remove like
         await likeAPI.remove(vacationId);
        setLikedVacations(prev => {
          const newSet = new Set(prev);
          newSet.delete(vacationId);
          return newSet;
        });
        
                 // Update likes count
         setVacations(prev => prev.map(vacation => 
           vacation.vacation_id === vacationId 
             ? { ...vacation, likes_count: Math.max(0, vacation.likes_count - 1) }
             : vacation
         ));
      } else {
                 // Add like
         await likeAPI.add(vacationId);
        setLikedVacations(prev => new Set([...prev, vacationId]));
        
                 // Update likes count
         setVacations(prev => prev.map(vacation => 
           vacation.vacation_id === vacationId 
             ? { ...vacation, likes_count: vacation.likes_count + 1 }
             : vacation
         ));
      }
    } catch (err) {
      console.error('Error handling like:', err);
      alert('Error updating like');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(price);
  };

  const getImageUrl = (fileName) => {
    return `http://localhost:5000/images/${fileName}`;
  };

  // Sort vacations by start date (ascending)
  const sortedVacations = [...vacations].sort((a, b) => 
    new Date(a.vacation_start) - new Date(b.vacation_start)
  );

  const handleEditVacation = (vacationId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      alert('Only administrators can edit vacations');
      return;
    }
    navigate(`/admin/edit-vacation/${vacationId}`);
  };

  const handleDeleteVacation = async (vacationId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      alert('Only administrators can delete vacations');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this vacation?');
    if (!confirmed) {
      return;
    }

    try {
      await vacationAPI.delete(vacationId);
      setVacations(prev => prev.filter(v => v.vacation_id !== vacationId));
    } catch (err) {
      console.error('Error deleting vacation:', err);
      alert('Error deleting vacation');
    }
  };

  const handleAddVacation = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      alert('Only administrators can add vacations');
      return;
    }
    navigate('/admin/add-vacation');
  };

  if (userLoading || loading) {
    return (
      <div className="vacations-container">
               <div className="loading">
         <div className="spinner"></div>
         <p>{userLoading ? 'Loading user...' : 'Loading vacations...'}</p>
       </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vacations-container">
               <div className="error">
         <h2>Error</h2>
         <p>{error}</p>
         <button onClick={fetchVacations} className="retry-btn">
           Try Again
         </button>
       </div>
      </div>
    );
  }

  return (
    <div className="vacations-container">
      <div className="vacations-header">
        <h1>🏖️ Available Vacations</h1>
        <p>Discover our amazing destinations</p>
        {isAdmin && (
          <button onClick={handleAddVacation} className="add-vacation-btn">
            ➕ Add New Vacation
          </button>
        )}
      </div>

      {vacations.length === 0 ? (
         <div className="no-vacations">
           <h2>No vacations available at the moment</h2>
           <p>Please try again later</p>
         </div>
       ) : (
        <div className="vacations-grid">
          {sortedVacations.map((vacation) => (
             <div key={vacation.vacation_id} className="vacation-card">
              <div className="vacation-image">
                                 <img 
                   src={getImageUrl(vacation.picture_file_name)}
                   alt={vacation.vacation_description}
                                       onError={(e) => {
                      // If image fails to load, use placeholder with country name
                      const countryName = vacation.vacation_description.split(' ').pop() || 'Vacation';
                      e.target.src = `https://via.placeholder.com/300x200/667eea/ffffff?text=${countryName}`;
                    }}
                 />
              </div>
              
                             <div className="vacation-content">
                                   <h3 className="vacation-title" title={vacation.vacation_description}>{vacation.vacation_description}</h3>
                
                                                   <div className="vacation-details">
                                         <div className="detail-item">
                       <span className="detail-label">Country:</span>
                       <span className="detail-value country">{countries[vacation.country_id] || 'Unknown'}</span>
                     </div>
                     

                     
                     <div className="detail-item">
                       <span className="detail-label">Start Date:</span>
                       <span className="detail-value">{formatDate(vacation.vacation_start)}</span>
                     </div>
                     
                     <div className="detail-item">
                       <span className="detail-label">End Date:</span>
                       <span className="detail-value">{formatDate(vacation.vacation_end)}</span>
                     </div>
                     
                     <div className="detail-item">
                       <span className="detail-label">Price:</span>
                       <span className="detail-value price">{formatPrice(vacation.price)}</span>
                     </div>
                  </div>
                
                                 <div className="vacation-actions">
                   {!isAdmin ? (
                     <>
                       <button
                         onClick={() => handleLike(vacation.vacation_id)}
                         className={`like-btn ${likedVacations.has(vacation.vacation_id) ? 'liked' : ''}`}
                         disabled={!isAuthenticated}
                       >
                         {likedVacations.has(vacation.vacation_id) ? '❤️' : '🤍'} 
                         {vacation.likes_count || 0}
                       </button>
                       
                       {!isAuthenticated && (
                         <span className="login-required">
                           Login to like vacations
                         </span>
                       )}
                     </>
                                       ) : (
                      <div className="likes-display">
                        <span className="likes-icon">❤️</span>
                        <span className="likes-count">{vacation.likes_count || 0}</span>
                      </div>
                    )}
                  
                  {isAdmin && (
                    <div className="admin-actions">
                      <button
                        onClick={() => handleEditVacation(vacation.vacation_id)}
                        className="edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVacation(vacation.vacation_id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vacations;
