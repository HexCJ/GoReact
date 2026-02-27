import { Routes, Route, Navigate } from 'react-router-dom';
import { userRoutes } from '../routes/userRoutes';
import { menuRoutes } from '../routes/menuRoutes';
import { roleRoutes } from '../routes/roleRoutes';

const AppRoutes = ({ isLoggedIn }) => {
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  const createProtectedRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={<ProtectedRoute>{route.element}</ProtectedRoute>}
      />
    ));
  };

  return (
    <Routes>
      {createProtectedRoutes(userRoutes)}
      {createProtectedRoutes(menuRoutes)}
      {createProtectedRoutes(roleRoutes)}
    </Routes>
  );
};

export default AppRoutes;
