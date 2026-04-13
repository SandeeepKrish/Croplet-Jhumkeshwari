import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = 'https://croplet-jhumkeshwari.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Products API
export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await api.get(`/products/search?query=${query}`);
  return response.data;
};

export const addProduct = async (formData, token) => {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteProduct = async (id, token) => {
  const response = await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

// Admin API
export const fetchUsers = async (token) => {
  const response = await api.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchOrders = async (token) => {
  const response = await api.get('/admin/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateOrderStatus = async (orderId, status, token) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const adminLogin = async (credentials) => {
  const response = await api.post('/admin/login', credentials);
  return response;
};

// Auth API
export const sendOTP = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response;
};

export const verifyOTP = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response;
};

export const updateProfile = async (email, name, phone) => {
  const response = await api.post('/auth/update-profile', { email, name, phone });
  return response;
};

export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response;
};

export const fetchUserOrders = async (userId) => {
  const response = await api.get(`/orders/mine/${userId}`);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/cancel/${orderId}`);
  return response.data;
};

// =====================
// USER (Wishlist & Address)
// =====================
export const fetchWishlist = async (userId) => {
  const response = await api.get(`/users/${userId}/wishlist`);
  return response.data;
};

export const addToWishlist = async (userId, productId) => {
  const response = await api.post(`/users/${userId}/wishlist`, { productId });
  return response.data;
};

export const removeFromWishlist = async (userId, productId) => {
  const response = await api.delete(`/users/${userId}/wishlist/${productId}`);
  return response.data;
};

// =====================
// CONTACT & MESSAGES
// =====================
export const sendMessage = async (messageData) => {
  const response = await api.post('/contact', messageData);
  return response.data;
};

export const fetchMessages = async (token) => {
  const response = await api.get('/admin/messages', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteMessage = async (id, token) => {
  const response = await api.delete(`/admin/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchAddresses = async (userId) => {
  const response = await api.get(`/users/${userId}/addresses`);
  return response.data;
};

export const addAddress = async (userId, addressData) => {
  const response = await api.post(`/users/${userId}/addresses`, addressData);
  return response.data;
};

export const deleteAddress = async (userId, addressId) => {
  const response = await api.delete(`/users/${userId}/addresses/${addressId}`);
  return response.data;
};

// Helper for image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Clean up hardcoded localhost URLs from old database records
  if (imagePath.includes('http://localhost:5000')) {
    imagePath = imagePath.replace('http://localhost:5000', '');
  }

  if (imagePath.startsWith('http')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}${path}`;
};

export default api;
