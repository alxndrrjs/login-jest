import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificamos si existe un token en localStorage
    const token = localStorage.getItem('token');
    // Verificamos si existe un usuario almacenado en localStorage
    const storedUser = localStorage.getItem('authUser');

    if (token && storedUser) {
      // Si hay un token y un usuario, establecemos el usuario directamente desde localStorage
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else if (token) {
      // Si solo hay un token, obtenemos el perfil desde el backend
      fetchUserProfile(token);
    } else {
      // Si no hay ni token ni usuario, solo terminamos la carga
      setLoading(false);
    }
  }, []);

  // Función para obtener el perfil del usuario usando el token
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}` // Enviamos el token en los headers de la solicitud
        }
      });

      const userData = response.data;
      // Al recibir la respuesta, almacenamos los datos del usuario en el estado y en localStorage
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData)); // Guardamos el usuario en localStorage
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el perfil');
      setLoading(false);
    }
  };

  // Función para realizar login
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;

      // Al hacer login, guardamos el token y el usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user)); // Guardamos el usuario autenticado

      setUser(user); // Establecemos el usuario en el estado
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiamos el token y el usuario en localStorage al hacer logout
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    setUser(null); // Limpiamos el estado de usuario
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user // Determinamos si el usuario está autenticado
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
