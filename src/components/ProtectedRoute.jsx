import React from 'react';
import { Navigate } from 'react-router-dom';
import { useNovel } from '../context/NovelContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { state } = useNovel();

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !state.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;