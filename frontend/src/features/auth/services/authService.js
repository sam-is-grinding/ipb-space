import apiClient from '../../../shared/services/api/apiClient';

/**
 * @typedef {Object} UserLogin
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 */

/**
 * @typedef {Object} UserCreate
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 * @property {string} full_name - The user's full name
 * @property {string} [phone_number] - The user's phone number
 */

export const authService = {
  /**
   * Register a new user
   * @param {UserCreate} data 
   * @returns {Promise<any>}
   */
  register: async (data) => {
    return await apiClient.post('/auth/register', data);
  },

  /**
   * Login a user
   * @param {UserLogin} credentials 
   * @returns {Promise<any>}
   */
  login: async (credentials) => {
    return await apiClient.post('/auth/login', credentials);
  },

  /**
   * Refresh authentication token
   * @returns {Promise<any>}
   */
  refresh: async () => {
    return await apiClient.post('/auth/refresh');
  },

  /**
   * Logout user by clearing local storage
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
