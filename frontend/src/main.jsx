import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './Homepage.jsx';
import UserDetail from './UserDetail.jsx';
import Login from './Login.jsx';
import LogOut from './LogOut.jsx';
import Signup from './Signup.jsx';
import Header from './Header.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: 
    <div>
      <Header />
      <Homepage />
    </div>
  },
  {
    path: '/user/:username',
    element:
    <div>
      <Header />
      <UserDetail />
    </div>
  }, 
  {
    path: '/login',
    element: 
    <div>
    <Header />
    <Login />
  </div>
  },
  {
    path: '/signup',
    element: 
    <div>
    <Header />
    <Signup />
  </div>
  },
  {
    path: '/logout',
    element: 
    <div>
    <Header />
    <LogOut />
  </div>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
