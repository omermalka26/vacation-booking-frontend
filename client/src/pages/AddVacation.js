import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { vacationAPI, countryAPI } from '../api/api';
import './AddVacation.css';

const AddVacation = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    vacation_description: '',
    country_id: '',
    vacation_start: '',
    vacation_end: '',
    price: '',
    picture_file_name: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    fetchCountries();
  }, [isAdmin, navigate]);

  const fetchCountries = async () => {
    try {
      const response = await countryAPI.getAll();
      setCountries(response.countries || response.data || []);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.vacation_description.trim()) {
      newErrors.vacation_description = 'Description is required';
    }

    if (!formData.country_id) {
      newErrors.country_id = 'Country is required';
    }

    if (!formData.vacation_start) {
      newErrors.vacation_start = 'Start date is required';
    } else if (formData.vacation_start < today) {
      newErrors.vacation_start = 'Start date cannot be in the past';
    }

    if (!formData.vacation_end) {
      newErrors.vacation_end = 'End date is required';
    } else if (formData.vacation_end <= formData.vacation_start) {
      newErrors.vacation_end = 'End date must be after start date';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0 || price > 10000) {
        newErrors.price = 'Price must be between 0 and 10,000';
      }
    }

    if (!formData.picture_file_name) {
      newErrors.picture_file_name = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        picture_file_name: file.name
      }));
      
      if (errors.picture_file_name) {
        setErrors(prev => ({
          ...prev,
          picture_file_name: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Add all form data
      formDataToSend.append('vacation_description', formData.vacation_description);
      formDataToSend.append('country_id', formData.country_id);
      formDataToSend.append('vacation_start', formData.vacation_start);
      formDataToSend.append('vacation_end', formData.vacation_end);
      formDataToSend.append('price', formData.price);
      
      // Add the file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      await vacationAPI.createWithFile(formDataToSend);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Error creating vacation');
      console.error('Error creating vacation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="add-vacation-container">
      <div className="add-vacation-card">
        <div className="add-vacation-header">
          <h1>Add New Vacation</h1>
          <p>Fill in the details to create a new vacation package</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-vacation-form">
          <div className="form-group">
            <label htmlFor="vacation_description" className="form-label">
              Description *
            </label>
            <textarea
              id="vacation_description"
              name="vacation_description"
              value={formData.vacation_description}
              onChange={handleInputChange}
              className={`form-input ${errors.vacation_description ? 'error' : ''}`}
              placeholder="Enter vacation description"
              rows="3"
            />
            {errors.vacation_description && (
              <span className="error-text">{errors.vacation_description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="country_id" className="form-label">
              Country *
            </label>
            <select
              id="country_id"
              name="country_id"
              value={formData.country_id}
              onChange={handleInputChange}
              className={`form-input ${errors.country_id ? 'error' : ''}`}
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
            {errors.country_id && (
              <span className="error-text">{errors.country_id}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vacation_start" className="form-label">
                Start Date *
              </label>
              <input
                type="date"
                id="vacation_start"
                name="vacation_start"
                value={formData.vacation_start}
                onChange={handleInputChange}
                className={`form-input ${errors.vacation_start ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.vacation_start && (
                <span className="error-text">{errors.vacation_start}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="vacation_end" className="form-label">
                End Date *
              </label>
              <input
                type="date"
                id="vacation_end"
                name="vacation_end"
                value={formData.vacation_end}
                onChange={handleInputChange}
                className={`form-input ${errors.vacation_end ? 'error' : ''}`}
                min={formData.vacation_start || new Date().toISOString().split('T')[0]}
              />
              {errors.vacation_end && (
                <span className="error-text">{errors.vacation_end}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price (ILS) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="Enter price (0-10,000)"
              min="0"
              max="10000"
              step="0.01"
            />
            {errors.price && (
              <span className="error-text">{errors.price}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="picture_file_name" className="form-label">
              Image *
            </label>
            <input
              type="file"
              id="picture_file_name"
              name="picture_file_name"
              onChange={handleFileChange}
              className={`form-input file-input ${errors.picture_file_name ? 'error' : ''}`}
              accept="image/*"
            />
            {errors.picture_file_name && (
              <span className="error-text">{errors.picture_file_name}</span>
            )}
            <small className="form-help">
              Upload an image file (JPG, PNG, etc.)
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Vacation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVacation;
