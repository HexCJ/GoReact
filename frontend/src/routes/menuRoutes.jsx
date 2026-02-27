import { Route } from 'react-router-dom';
import MenuIndex from '../components/menu/MenuIndex';
import MenuAdd from '../components/menu/MenuAdd';
import MenuEdit from '../components/menu/MenuEdit';

export const menuRoutes = [
  { path: '/menu', element: <MenuIndex /> },
  { path: '/menu/create', element: <MenuAdd /> },
  { path: '/menu/:id/edit', element: <MenuEdit /> },
];
