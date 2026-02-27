import { Route } from 'react-router-dom';
import RoleIndex from '../components/role/RoleIndex';
import RoleAdd from '../components/role/RoleAdd';
import RoleEdit from '../components/role/RoleEdit';

export const roleRoutes = [
  { path: '/roles', element: <RoleIndex /> },
  { path: '/roles/create', element: <RoleAdd /> },
  { path: '/roles/:id/edit', element: <RoleEdit /> },
];
