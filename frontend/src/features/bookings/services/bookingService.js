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
   * FastAPI endpoint requires Form(...) — always send as multipart/form-data.
   * Accepts either a FormData object or a plain {new_status} object.
   * @param {string|number} id
   * @param {FormData|{new_status: string}} data
   * @returns {Promise<any>}
   */
  updateBookingStatus: async (id, data) => {
    // Normalize: if caller already passes FormData, use it directly.
    // Otherwise, build FormData from a plain object so FastAPI Form(...) parses correctly.
    let formPayload;
    if (data instanceof FormData) {
      formPayload = data;
    } else {
      formPayload = new FormData();
      const status = data?.new_status || data?.status || data;
      formPayload.append('new_status', status);
    }
    return await apiClient.put(`/bookings/${id}/status`, formPayload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
 * Open and view a booking document in a new tab.
 * Handles authentication and correct MIME types via Blob.
 * HOTFIX: Includes robust Blob error parsing for 400/404/500 from Appwrite.
 * @param {string|number} id
 */
viewDocument: async (id) => {
  try {
    // When responseType:'blob', apiClient interceptor returns response.data (the Blob directly)
    const blob = await apiClient.get(`/bookings/${id}/document`, {
      responseType: 'blob'
    });

    // Guard: confirm we actually received a Blob before creating an object URL
    if (!blob || !(blob instanceof Blob)) {
      throw new Error('Server tidak mengembalikan file yang valid.');
    }

    // Guard: if Blob is JSON (error payload disguised as blob), parse and throw it
    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let detail = 'Dokumen tidak dapat dimuat.';
      try { detail = JSON.parse(text)?.detail || detail; } catch (_) {}
      throw new Error(detail);
    }

    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    // Revoke after a delay to free memory once the tab has loaded
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);

  } catch (error) {
    // Re-parse Axios blob error response (400/404/500) into readable message
    const axiosError = error?.response;
    if (axiosError?.data instanceof Blob) {
      try {
        const text = await axiosError.data.text();
        const parsed = JSON.parse(text);
        // DEBUG: Expose exact Appwrite/FastAPI error detail to console for demo diagnosis
        console.error(
          `[viewDocument] HTTP ${axiosError.status} from /bookings/${error?.config?.url}:`,
          parsed
        );
        const msg = parsed?.detail || 'Dokumen tidak tersedia atau gagal dimuat dari cloud storage.';
        throw new Error(msg);
      } catch (parseErr) {
        if (parseErr.message && !parseErr.message.includes('JSON')) {
          throw parseErr; // rethrow the meaningful error
        }
      }
    }

    // Specific status-code user messages
    const status = axiosError?.status;
    if (status === 400) {
      throw new Error('Dokumen tidak tersedia atau gagal dimuat dari cloud storage.');
    }
    if (status === 404) {
      throw new Error('Dokumen tidak ditemukan. Mungkin belum diunggah oleh pemohon.');
    }
    if (status === 403) {
      throw new Error('Anda tidak memiliki izin untuk mengakses dokumen ini.');
    }

    // Fallback: rethrow original
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
