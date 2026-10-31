const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// Admin APIs
export const adminAPI = {
  login: async (name, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, password }),
    });
    return handleResponse(response);
  },

  refreshToken: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse(response);
  },

  getPendingServices: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/services/pending`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  approveService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/approve`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  disapproveService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/disapprove`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getApprovedServices: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/services/approved`, {
      method: "GET",
    });
    return handleResponse(response);
  },

  getAllVendors: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  deleteVendor: async (vendorId) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAllBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Vendor APIs
export const vendorAPI = {
  register: async (vendorData) => {
    const response = await fetch(`${API_BASE_URL}/vendors/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendorData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/vendors/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (updateData) => {
    const response = await fetch(`${API_BASE_URL}/vendors/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  updateAvailability: async (availabilityStatus) => {
    const response = await fetch(`${API_BASE_URL}/vendors/availability`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ availabilityStatus }),
    });
    return handleResponse(response);
  },

  // Vendor Booking APIs
  getMyBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/vendor/my-bookings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await fetch(`${API_BASE_URL}/bookings/vendor/${bookingId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Service APIs
export const serviceAPI = {
  createService: async (serviceData) => {
    const response = await fetch(`${API_BASE_URL}/vendors/services`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    return handleResponse(response);
  },

  getVendorServices: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors/services`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  deleteService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/vendors/services/${serviceId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getVendorStats: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getVendorProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Booking APIs
export const bookingAPI = {
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  getAllBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getBookingById: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  deleteBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getBookingStats: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Helper functions for the vendor dashboard
export const createService = serviceAPI.createService;
export const getVendorServices = serviceAPI.getVendorServices;
export const deleteService = serviceAPI.deleteService;
export const getVendorStats = serviceAPI.getVendorStats;
export const getVendorProfile = serviceAPI.getVendorProfile;

export default {
  adminAPI,
  vendorAPI,
  serviceAPI,
  bookingAPI,
};