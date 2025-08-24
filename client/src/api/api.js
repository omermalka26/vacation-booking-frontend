// api.js - פונקציות API לתקשורת עם השרת
// For production, change this to your backend URL:
// const API_BASE_URL = 'https://your-backend-url.com';
const API_BASE_URL = 'http://localhost:5000';

// פונקציה עזר לשליחת בקשות
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    console.log('API Response:', { status: response.status, data }); // Debug log
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// פונקציות Authentication
export const authAPI = {
  login: (email, password) => 
    apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  register: (userData) => 
    apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  getMe: () => apiRequest('/me')
};

// פונקציות Vacations
export const vacationAPI = {
  getAll: () => apiRequest('/vacations'),
  getById: (id) => apiRequest(`/vacations/${id}`),
  getUserLikedVacations: () => apiRequest('/vacations/user-likes'),
  create: (vacationData) => 
    apiRequest('/vacations', {
      method: 'POST',
      body: JSON.stringify(vacationData)
    }),
  createWithFile: (formData) => {
    const token = localStorage.getItem('token');
    
    return fetch(`${API_BASE_URL}/vacations`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    }).then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          throw new Error(data.error || data.message || 'Something went wrong');
        }
        return data;
      });
    });
  },
  update: (id, vacationData) => 
    apiRequest(`/vacations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vacationData)
    }),
  updateWithFile: (id, formData) => {
    const token = localStorage.getItem('token');
    
    return fetch(`${API_BASE_URL}/vacations/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    }).then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          throw new Error(data.error || data.message || 'Something went wrong');
        }
        return data;
      });
    });
  },
  delete: (id) => 
    apiRequest(`/vacations/${id}`, {
      method: 'DELETE'
    })
};

// פונקציות Likes
export const likeAPI = {
  add: (vacationId) => 
    apiRequest('/likes', {
      method: 'POST',
      body: JSON.stringify({ vacation_id: vacationId })
    }),
  remove: (vacationId) => 
    apiRequest(`/likes/${vacationId}`, {
      method: 'DELETE'
    })
};

// פונקציות Countries
export const countryAPI = {
  getAll: () => apiRequest('/countries'),
  getById: (id) => apiRequest(`/countries/${id}`)
};
