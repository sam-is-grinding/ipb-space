import apiClient from '../../../shared/services/api/apiClient';

/**
 * @typedef {Object} BookingCreate
 * @property {string} start_time - ISO datetime string
 * @property {string} end_time - ISO datetime string
 * @property {string} purpose - Purpose of booking
 * @property {number} participants_count - Expected number of participants
 */

export const bookingService = {
  /**
   * Get all bookings
   * @returns {Promise<any>}
   */
  getAllBookings: async () => {
    return await apiClient.get('/bookings/');
  },

  /**
   * Get bookings for the currently authenticated user
   * @returns {Promise<any>}
   */
  getMyBookings: async () => {
    return await apiClient.get('/bookings/my');
  },

  /**
   * Get bookings for a specific facility
   * @param {string|number} facilityId 
   * @returns {Promise<any>}
   */
  getBookingsByFacility: async (facilityId) => {
    return await apiClient.get(`/bookings/facility/${facilityId}`);
  },

  /**
   * Get a specific booking by ID
   * @param {string|number} id 
   * @returns {Promise<any>}
   */
  getBookingById: async (id) => {
    return await apiClient.get(`/bookings/${id}`);
  },

  /**
   * Create a new booking for a facility
   * @param {string|number} facilityId 
   * @param {BookingCreate|FormData} data - Can be JSON data or FormData if uploading documents
   * @returns {Promise<any>}
   */
  createBooking: async (facilityId, data) => {
    return await apiClient.post(`/bookings/${facilityId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Update booking status (e.g., Approve, Reject)
   * @param {string|number} id 
   * @param {Object} data 
   * @param {string} data.status - The new status
   * @param {string} [data.reason] - Reason for status change (if rejected)
   * @returns {Promise<any>}
   */
  updateBookingStatus: async (id, data) => {
    return await apiClient.put(`/bookings/${id}/status`, data);
  },

  /**
   * Cancel a booking
   * @param {string|number} id 
   * @returns {Promise<any>}
   */
  cancelBooking: async (id) => {
    return await apiClient.put(`/bookings/${id}/cancel`);
  },

  /**
   * Check in a booking
   * @param {string|number} id 
   * @returns {Promise<any>}
   */
  checkInBooking: async (id) => {
    return await apiClient.put(`/bookings/${id}/check-in`);
  },

  /**
   * Delete a booking
   * @param {string|number} id 
   * @returns {Promise<any>}
   */
  deleteBooking: async (id) => {
    return await apiClient.delete(`/bookings/${id}`);
  },

  /**
   * Get booking document
   * @param {string|number} id 
   * @returns {Promise<any>}
   */
  getBookingDocument: async (id) => {
    return await apiClient.get(`/bookings/${id}/document`, {
      responseType: 'blob' // Important for file downloads
    });
  },
/**
 * Delete a booking document
 * @param {string|number} id
 * @returns {Promise<any>}
 */
deleteBookingDocument: async (id) => {
  return await apiClient.delete(`/bookings/${id}/document`);
},

/**
 * Open and view a booking document in a new tab
 * Handles authentication and correct MIME types via Blob
 * @param {string|number} id 
 */
viewDocument: async (id) => {
  try {
    const response = await apiClient.get(`/bookings/${id}/document`, {
      responseType: 'blob'
    });

    // Create blob with correct MIME type from response
    const blob = new Blob([response.data], { type: response.data.type });
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    // Cleanup: in a real app you might want to revokeObjectURL after some time
    // but for _blank tabs it needs to stay alive while loading.
  } catch (error) {
    console.error('Failed to fetch document:', error);
    throw error;
  }
},

/**
 * Confirm handover of a booking
 * @param {Object} params
...
   * @param {string} params.code - Handover confirmation code
   * @returns {Promise<any>}
   */
  confirmHandover: async (params) => {
    return await apiClient.get('/bookings/handover/confirm', { params });
  }
};
