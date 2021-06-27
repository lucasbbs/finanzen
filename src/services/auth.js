export const TOKEN_KEY = 'userInfo';

export const isAuthenticated = () => {
  const userInfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return userInfo !== null;
};

export const isFirtAccess = () => {
  const userInfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return userInfo.isFirstAccess;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
