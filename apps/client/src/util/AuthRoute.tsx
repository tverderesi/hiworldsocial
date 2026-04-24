import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ children }) {
  const { authLoading, user } = useContext(AuthContext);

  if (authLoading) {
    return null;
  }

  return user ? <Navigate to='/' /> : children;
}

export default AuthRoute;
