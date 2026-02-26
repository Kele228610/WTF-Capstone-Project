import { createBrowserRouter } from 'react-router';
import Root from './Root';
import HomePage from '../features/home/HomePage';
import SignInPage from '../features/auth/SignInPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'signin',
        Component: SignInPage,
      },
    ],
  },
]);