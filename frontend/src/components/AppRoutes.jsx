import { Routes, Route, Navigate } from 'react-router-dom';
import UserList from './UserList';
import UserForm from './UserForm';
import UserProfile from './UserProfile';
import UserDetail from './UserDetail';
import RBACManagement from './RBACManagement';
import MenuManagement from './MenuManagement';
import MenuForm from './MenuForm';
import MenuEdit from './MenuEdit';

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
      <Route path="/rbac" element={
        <ProtectedRoute>
          <RBACManagement />
        </ProtectedRoute>
      } />
      <Route path="/rbac/roles" element={
        <ProtectedRoute>
          <RBACManagement />
        </ProtectedRoute>
      } />
      <Route path="/rbac/permissions" element={
        <ProtectedRoute>
          <RBACManagement />
        </ProtectedRoute>
      } />
      <Route path="/rbac/role-permissions" element={
        <ProtectedRoute>
          <RBACManagement />
        </ProtectedRoute>
      } />
      <Route path="/rbac/user-roles" element={
        <ProtectedRoute>
          <RBACManagement />
        </ProtectedRoute>
      } />
      <Route path="/menu" element={
        <ProtectedRoute>
          <MenuManagement />
        </ProtectedRoute>
      } />
      <Route path="/menu/create" element={
        <ProtectedRoute>
          <MenuForm />
        </ProtectedRoute>
      } />
       <Route path="/menu/:id/edit" element={
        <ProtectedRoute>
          <MenuEdit />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;