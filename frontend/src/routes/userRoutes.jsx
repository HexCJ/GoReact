import { Route } from 'react-router-dom';
import UserIndex from '../components/user/UserIndex';
import UserEdit from '../components/user/UserEdit';
import UserProfile from '../components/user/UserProfile';

export const userRoutes = [
  { path: '/', element: <UserIndex /> },
  { path: '/users', element: <UserIndex /> },
  { path: '/users/list', element: <UserIndex /> },
  { path: '/users/create', element: <UserEdit /> },
  { path: '/users/:id/edit', element: <UserEdit /> },
  { path: '/users/:id/profile', element: <UserProfile /> },
];
