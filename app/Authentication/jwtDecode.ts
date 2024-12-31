'use client';
import {jwtDecode, JwtPayload} from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    if(isTokenValid(decoded)){    
      return decoded; // Example: { userId: 123, exp: 1678901234 }
    }else{
      return null;
    }

  } catch (err) {
    console.error('Invalid token');
    return null;
  }
};

export const isTokenValid = (decoded : JwtPayload) => {
  
  if (!decoded.exp) {
    console.warn('Token does not have an exp field');
    return false;
  }
  const isExpired = decoded.exp * 1000 < Date.now(); // Convert exp to milliseconds
  
  if (isExpired) {
    localStorage.removeItem('token'); // Clear expired token
    return false;
  }

  return true;
};
