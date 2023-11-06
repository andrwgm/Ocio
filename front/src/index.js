import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';

// Creamos una raíz de renderizado utilizando ReactDOM.createRoot() y le proporcionamos el elemento del DOM con el ID 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Utilizamos el método render() de la raíz de renderizado para renderizar el componente App en el elemento del DOM
root.render(
  <React.StrictMode> {/* Modo estricto de React */}
    <App /> {/* Renderizamos el componente App */}
  </React.StrictMode>
);

reportWebVitals(); // Reportamos las métricas de rendimiento web