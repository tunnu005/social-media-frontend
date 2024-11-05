import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './authContextprovider';
import axios from 'axios';
import { serverapi } from '@/data/server';

function AuthenticatedLayout() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${serverapi}/api/auth/verifyToken`, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
      });
  }, [setIsAuthenticated]);

  if (isAuthenticated === false) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />; // Renders child routes if authenticated
}

export default AuthenticatedLayout;
