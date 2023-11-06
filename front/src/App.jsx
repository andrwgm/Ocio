import { CssBaseline, Paper } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import Login from './pages/login/login';
import Home from './pages/home/home';
import Blog from './pages/eventoDashboard/Blog';
import Payment from './pages/payment/Checkout';
import RegisterCliente from './pages/register/registerCliente';
import RegisterEmpresa from './pages/register/registerEmpresa';
import RegisterAdmin from './pages/register/registerAdmin';
import DashboardAdmin from './pages/adminDashboard/Dashboard';
import DashboardAdminVentas from './pages/adminDashboard/ventas/Dashboard';
import DashboardEmpresa from './pages/empresaDashboard/Dashboard';
import DashboardEmpresaCreateEvent from './pages/empresaDashboard/crearEvento/Dashboard';
import DashboardEmpresaSetEntrada from './pages/empresaDashboard/crearEntrada/Dashboard';
import DashboardEmpresaProfile from './pages/empresaDashboard/profile/Dashboard';
import DashboardEmpresaEditProfile from './pages/empresaDashboard/editProfile/Dashboard';
import DashboardEmpresaVentas from './pages/empresaDashboard/ventas/Dashboard';
import DashboardClienteProfile from './pages/home/profile/Dashboard';
import DashboardClienteEntradas from './pages/home/entradas/Dashboard';
import DashboardClienteEditProfile from './pages/home/editProfile/Dashboard';
import NotFound from './util/NotFound';

const App = () => {
  // Preferencia por el modo oscuro
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // Lee el modo del sistema y almacena la preferencia en la variable prefersDarkMode

  // Tema personalizado con color principal naranja
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: !!prefersDarkMode ? 'dark' : 'light', // El modo del tema será oscuro si prefersDarkMode es verdadero, de lo contrario, será claro
    }
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Ruta exacta para la página de inicio, renderiza el componente Home */}
          <Route exact path="/" element={<Home />} />
          {/* Ruta exacta para un evento específico, renderiza el componente Blog */}
          <Route exact path="/evento/:id" element={<Blog />} />
          {/* Ruta exacta para la página de inicio de sesión, renderiza el componente Login */}
          <Route exact path="/login" element={<Login />} />
          {/* Ruta exacta para el registro de cliente, renderiza el componente RegisterCliente */}
          <Route exact path="/register/cliente" element={<RegisterCliente />} />
          {/* Ruta exacta para el registro de empresa, renderiza el componente RegisterEmpresa */}
          <Route exact path="/register/empresa" element={<RegisterEmpresa />} />
          {/* Ruta exacta para el registro de administrador, renderiza el componente RegisterAdmin */}
          <Route exact path="/register/admin" element={<RegisterAdmin />} />
          {/* Ruta exacta para el dashboard de empresa, renderiza el componente DashboardEmpresa */}
          <Route exact path="/dashboard/empresa" element={<DashboardEmpresa />} />
          {/* Ruta exacta para el perfil de empresa en el dashboard, renderiza el componente DashboardEmpresaProfile */}
          <Route exact path="/dashboard/empresa/profile" element={<DashboardEmpresaProfile />} />
          {/* Ruta exacta para editar el perfil de empresa en el dashboard, renderiza el componente DashboardEmpresaEditProfile */}
          <Route exact path="/dashboard/empresa/profile/edit" element={<DashboardEmpresaEditProfile />} />
          {/* Ruta exacta para crear un nuevo evento en el dashboard de empresa, renderiza el componente DashboardEmpresaCreateEvent */}
          <Route exact path="/dashboard/empresa/event/new" element={<DashboardEmpresaCreateEvent />} />
          {/*Ruta exacta para crear una nueva entrada en el dashboard de empresa, renderiza el componente DashboardEmpresaSetEntrada */}
          <Route exact path="/dashboard/empresa/entrada/new" element={<DashboardEmpresaSetEntrada />} />
          {/*  Ruta exacta para las ventas en el dashboard de empresa, renderiza el componente DashboardEmpresaVentas*/}
          <Route exact path="/dashboard/empresa/ventas" element={<DashboardEmpresaVentas />} />
          {/* Ruta exacta para el perfil de cliente en el dashboard, renderiza el componente DashboardClienteProfile */}
          <Route exact path="/dashboard/cliente/profile" element={<DashboardClienteProfile />} />
          {/* Ruta exacta para editar el perfil de cliente en el dashboard, renderiza el componente DashboardClienteEditProfile*/}
          <Route exact path="/dashboard/cliente/profile/edit" element={<DashboardClienteEditProfile />} />
          {/* Ruta exacta para las entradas de cliente en el dashboard, renderiza el componente DashboardClienteEntradas */}
          <Route exact path="/dashboard/cliente/entradas" element={<DashboardClienteEntradas />} />
          {/* Ruta exacta para el dashboard de administrador, renderiza el componente DashboardAdmin */}
          <Route exact path="/dashboard/admin" element={<DashboardAdmin />} />
          {/* Ruta exacta para las ventas en el dashboard de administrador, renderiza el componente DashboardAdminVentas */}
          <Route exact path="/dashboard/admin/ventas" element={<DashboardAdminVentas />} />
          {/* Ruta exacta para el pago, renderiza el componente Payment */}
          <Route exact path="/payment/:id/:num" element={<Payment />} />
          {/* Ruta para errores 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; // Exporta el componente App como el componente principal de la aplicación
