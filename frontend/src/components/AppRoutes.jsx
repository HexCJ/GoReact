import { Routes, Route, Navigate } from 'react-router-dom';
import UserList from './UserList';
import UserForm from './UserForm';
import UserProfile from './UserProfile';
import UserDetail from './UserDetail';

const AppRoutes = ({ isLoggedIn }) => {
  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/users/list" element={
        <ProtectedRoute>
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/users/create" element={
        <ProtectedRoute>
          <UserDetail />
        </ProtectedRoute>
      } />
      <Route path="/users/:id/edit" element={
        <ProtectedRoute>
          <UserDetail />
        </ProtectedRoute>
      } />
      <Route path="/users/:id/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;