import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styl.css';
import { App } from './App.tsx';
import { PrzelacznikPrototypu } from './prototyp-symbole.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {import.meta.env.DEV && <PrzelacznikPrototypu />}
  </StrictMode>,
);
