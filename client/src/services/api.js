import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL
});

// Attach JWT token to outgoing requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fgag_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler (e.g. 401 redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('fgag_token');
        localStorage.removeItem('fgag_admin');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// Settings Service
export const settingsService = {
  getPublic: () => api.get('/settings/public'),
  getAdmin: (group) => api.get(`/settings/admin${group ? `?group=${group}` : ''}`),
  update: (settings) => api.post('/settings', { settings })
};

// Events Service
export const eventsService = {
  getAll: () => api.get('/events'),
  getFeatured: () => api.get('/events/featured'),
  getById: (id) => api.get(`/events/${id}`),
  create: (formData) => api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/events/${id}`)
};

// Ministries Service
export const ministriesService = {
  getPublic: () => api.get('/ministries'),
  getAllAdmin: () => api.get('/ministries/all'),
  create: (formData) => api.post('/ministries', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/ministries/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/ministries/${id}`)
};

// Leadership Service
export const leadershipService = {
  getAll: () => api.get('/leadership'),
  create: (formData) => api.post('/leadership', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/leadership/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/leadership/${id}`)
};

// Gallery Service
export const galleryService = {
  getImages: (category) => api.get(`/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getCategories: () => api.get('/gallery/categories'),
  upload: (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`)
};

// Prayer Service
export const prayerService = {
  submit: (data) => api.post('/prayer', data),
  getAll: (status) => api.get(`/prayer${status ? `?status=${status}` : ''}`),
  updateStatus: (id, status) => api.put(`/prayer/${id}/status`, { status }),
  delete: (id) => api.delete(`/prayer/${id}`)
};

// Volunteer Service
export const volunteerService = {
  submit: (data) => api.post('/volunteer', data),
  getAll: (status) => api.get(`/volunteer${status ? `?status=${status}` : ''}`),
  updateStatus: (id, status) => api.put(`/volunteer/${id}/status`, { status }),
  delete: (id) => api.delete(`/volunteer/${id}`)
};

// Analytics Service
export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard')
};

// Sermon / Media Service
export const sermonService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.all) query.append('all', 'true');
    const queryString = query.toString();
    return api.get(`/sermons${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/sermons/${id}`),
  create: (formData) => {
    const isFormData = formData instanceof FormData;
    return api.post('/sermons', formData, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  },
  update: (id, formData) => {
    const isFormData = formData instanceof FormData;
    return api.put(`/sermons/${id}`, formData, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  },
  delete: (id) => api.delete(`/sermons/${id}`)
};

// Promise Verses Service
export const verseService = {
  getCurrentMonthly: () => api.get('/verses/monthly/current'),
  getAllMonthly: () => api.get('/verses/monthly'),
  createMonthly: (data) => api.post('/verses/monthly', data),
  updateMonthly: (id, data) => api.put(`/verses/monthly/${id}`, data),
  deleteMonthly: (id) => api.delete(`/verses/monthly/${id}`)
};

// Contact Messages Service
export const contactService = {
  submit: (data) => api.post('/contact', data),
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    return api.get(`/contact${queryString ? `?${queryString}` : ''}`);
  },
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`)
};

// Donations Service
export const donationsService = {
  getPurposes: (isAdmin = false) => api.get(`/donations/purposes${isAdmin ? '?admin=true' : ''}`),
  createPurpose: (data) => api.post('/donations/purposes', data),
  updatePurpose: (id, data) => api.put(`/donations/purposes/${id}`, data),
  deletePurpose: (id) => api.delete(`/donations/purposes/${id}`),

  getRecords: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    return api.get(`/donations/records${queryString ? `?${queryString}` : ''}`);
  },
  createRecord: (data) => api.post('/donations/records', data),
  updateRecord: (id, data) => api.put(`/donations/records/${id}`, data),
  deleteRecord: (id) => api.delete(`/donations/records/${id}`)
};

export default api;


