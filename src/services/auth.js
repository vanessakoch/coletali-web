
export const TOKEN_KEY = "4e7994c1396e90bf45b9fcddbaa87c8b62add66223135cf227e200ce3dab7c8f";

export const isAuthenticated = () =>
  localStorage.getItem(TOKEN_KEY) !== null;

export const isAdmin = () =>
  localStorage.getItem('is_admin') !== null &&
  Number(localStorage.getItem('is_admin')) === 1;

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY);

export const login = (user) => {
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem('is_admin', user.is_admin);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('is_admin');
};
