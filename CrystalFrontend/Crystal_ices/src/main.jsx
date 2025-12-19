import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';

import Project from './Pages/Project.jsx';
import Catalogue from './Pages/Catalogue.jsx';
import News from './Pages/News.jsx';
import Careers from './Pages/Careers.jsx';
import Privacy from './Pages/Privacy.jsx';
import Services from './Pages/Services.jsx';
import Auth from './Pages/Auth.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/project",
        element: <Project />,
      },
      {
        path: "/catalogue",
        element: <Catalogue />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/careers",
        element: <Careers />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/auth",
        element: <Auth/>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
)
