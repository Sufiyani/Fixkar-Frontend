export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userType");
  localStorage.removeItem("adminName");
  localStorage.removeItem("vendorId");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const getUserType = () => {
  return localStorage.getItem("userType");
};

export const getAdminName = () => {
  return localStorage.getItem("adminName");
};