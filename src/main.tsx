import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styl.css';
import './ciemny.css';
import { App } from './App.tsx';
import { jezyk, t } from './teksty.ts';

document.documentElement.lang = jezyk;
document.title = t.tytul;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
