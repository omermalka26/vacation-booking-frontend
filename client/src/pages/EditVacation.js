import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { vacationAPI, countryAPI } from '../api/api';
import './EditVacation.css';

const EditVacation = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(formData);
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [isAdmin, navigate, id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vacation, countriesResponse] = await Promise.all([
        vacationAPI.getById(id),
        countryAPI.getAll()
      ]);
      
     
     
      setFormData({
        vacation_description: vacation.vacation_description || '',
        country_id: vacation.country_id?.toString() || '',
        vacation_start: vacation.vacation_start ? vacation.vacation_start.split('T')[0] : '',
        vacation_end: vacation.vacation_end ? vacation.vacation_end.split('T')[0] : '',
        price: vacation.price?.toString() || '',
        picture_file_name: vacation.picture_file_name || ''
      });

      setCountries(countriesResponse.countries || countriesResponse.data || []);
    } catch (err) {
      setError('Error loading vacation data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vacation_description.trim()) {
      newErrors.vacation_description = 'Description is required';
    }

    if (!formData.country_id) {
      newErrors.country_id = 'Country is required';
    }

    if (!formData.vacation_start) {
      newErrors.vacation_start = 'Start date is required';
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        picture_file_name: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Check if a new file was selected
      if (selectedFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        
        // Add all form data
        formDataToSend.append('vacation_description', formData.vacation_description);
        formDataToSend.append('country_id', formData.country_id);
        formDataToSend.append('vacation_start', formData.vacation_start);
        formDataToSend.append('vacation_end', formData.vacation_end);
        formDataToSend.append('price', formData.price);
        
        // Add the new file
        formDataToSend.append('image', selectedFile);

        await vacationAPI.updateWithFile(id, formDataToSend);
      } else {
        // Regular JSON update without file
        const vacationData = {
          ...formData,
          price: parseFloat(formData.price),
          country_id: parseInt(formData.country_id)
        };

        // Remove picture_file_name if it's empty (not required for updates)
        if (!vacationData.picture_file_name || vacationData.picture_file_name.trim() === '') {
          delete vacationData.picture_file_name;
        }

        await vacationAPI.update(id, vacationData);
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Error updating vacation');
      console.error('Error updating vacation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="edit-vacation-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading vacation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-vacation-container">
      <div className="edit-vacation-card">
        <div className="edit-vacation-header">
          <h1>Edit Vacation</h1>
          <p>Update the vacation details</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-vacation-form">
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
                min={formData.vacation_start}
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
              Image
            </label>
            {formData.picture_file_name && (
              <div className="current-image">
                <img 
                  src={`http://localhost:5000/images/${formData.picture_file_name}`}
                  alt="Current vacation image"
                  className="image-preview"
                />
                <p className="current-image-name">Current: {formData.picture_file_name}</p>
              </div>
            )}
            <input
              type="file"
              id="picture_file_name"
              name="picture_file_name"
              onChange={handleFileChange}
              className="form-input file-input"
              accept="image/*"
            />
            <small className="form-help">
              Leave empty to keep the current image, or upload a new one
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVacation;
