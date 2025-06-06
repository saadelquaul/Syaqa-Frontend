import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.token) {

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };

    }
    
    return { success: false, error: "No token received" };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || "Login failed" 
    };
  }
}

export async function register(userData) {
  try {
    const formData = new FormData();
    
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.password_confirmation);
    
    formData.append('date_of_birth', userData.date_of_birth);
    formData.append('address', userData.address);
    formData.append('phone', userData.phone);
    formData.append('license_type', userData.license_type);
    formData.append('profile_picture', `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`);
    formData.append('enrollment_date', userData.enrollment_date);
    formData.append('CIN', userData.cin_file);

    
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    return { 
      success: false, 
      error: error.response?.data?.message || "L'inscription a échoué",
      validationErrors: error.response?.data?.errors
    };
  }
}

export async function logout() {

    axios.post(`${API_URL}/logout`, {}, {
    headers: getAuthHeader()
  });
  
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    window.location.href = '/login';
  
  
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}