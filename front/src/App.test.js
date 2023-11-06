import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />); // Renderizamos el componente App en un entorno de prueba
  const linkElement = screen.getByText(/learn react/i); // Buscamos un elemento que contenga el texto 'learn react' (insensible a mayúsculas y minúsculas) en la pantalla renderizada
  expect(linkElement).toBeInTheDocument(); // Verificamos que el elemento buscado esté presente en la pantalla
});