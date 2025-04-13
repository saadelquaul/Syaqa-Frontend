import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const authService = {
  
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Login successful:', response.data.user, '/nToken:', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Une erreur s'est produite lors de la connexion" };
    }
  },

  logout: () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(error => console.error('Logout error:', error));
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;