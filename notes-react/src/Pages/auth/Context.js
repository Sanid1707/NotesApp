import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch userId and token from localStorage
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    setUserId(storedUserId);
    setToken(storedToken);

    // Log userId and token in the console
    console.log('User ID:', storedUserId);
    console.log('Token:', storedToken);
  }, []);

  return (
    <UserContext.Provider value={{ userId, token }}>
      {children}
    </UserContext.Provider>
  );
};