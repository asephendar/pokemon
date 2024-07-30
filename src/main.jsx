import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PokemonList from './pages/pokemon.jsx';
import BerryList from './pages/bag.jsx';
import { PokemonProvider } from './contexts/PokemonContext';
import { BerryProvider } from './contexts/BerryContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PokemonList />,
  },
  {
    path: '/pokemon',
    element: <PokemonList />,
  },
  {
    path: '/bag',
    element: <BerryList />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PokemonProvider>
      <BerryProvider>
        <RouterProvider router={router} />
      </BerryProvider>
    </PokemonProvider>
  </React.StrictMode>,
);
