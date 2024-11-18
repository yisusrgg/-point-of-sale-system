import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {DatosGlobalesProvider} from './Components/ContextoDatosGlobales';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DatosGlobalesProvider>
      <App />
    </DatosGlobalesProvider>
  </React.StrictMode>
);

