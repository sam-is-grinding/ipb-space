import apiClient from '../../../shared/services/api/apiClient';

/**
 * @typedef {Object} UserProfile
 * @property {string|number} id - User ID
 * @property {string} email - User email
 * @property {string} full_name - User full name
 * @property {string} role - User role (civitas, facility_admin, super_admin)
 */

export const userService = {
  /**
   * Get the current authenticated user's profile
   * @returns {Promise<any>}
   */
  getCurrentUser: async () => {
    return await apiClient.get('/users/me');
  },

  /**
   * Get all users
   * @returns {Promise<any>}
   */
  getAllUsers: async () => {
    return await apiClient.get('/users/');
  },

  /**
   * Get a specific user by ID
   * @param {string|number} id 
   * @returns {Promise<any>}
   */
  getUserById: async (id) => {
    return await apiClient.get(`/users/${id}`);
  }
};
