// userContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Custom Hook para acceder al contexto
export function useAuth() {
  return useContext(UserContext);
}

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userJson, setUserJson] = useState(null); // Estado para el usuario
  const [isLoggendIn, setIsLoggendIn] = useState(false); // Estado para saber si el usuario está logueado
  
  return (
    <UserContext.Provider value={{ userJson, setUserJson, isLoggendIn, setIsLoggendIn }}>
      {children}
    </UserContext.Provider>
  );
};
