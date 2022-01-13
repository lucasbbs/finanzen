import jwt_decode from 'jwt-decode';
export const TOKEN_KEY = 'userInfo';

export const isAuthenticated = () => {
  const userInfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
  if (userInfo?.token) {
    const decoded = jwt_decode(userInfo.token);
    if (decoded.exp < new Date().getTime() / 1000) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
  }
  return userInfo !== null;
};

export const isFirtAccess = () => {
  const userInfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return userInfo.isFirstAccess;
};

export const hasRestoredLogin = () => {
  const userInfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return userInfo.hasRestoredLogin;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
