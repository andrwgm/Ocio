import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const Logout = () => {

    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();

        // Realiza una solicitud de logout al servidor
        axios({
            url: 'http://localhost:8080/logout',
            method: 'POST',
            withCredentials: true
        }).then(response => {
            // Borra los datos de autenticación almacenados en el localStorage
            localStorage.clear();
            // Navega a la página de inicio
            navigate(0);
        });
    };

    return (
        // Renderiza un botón para cerrar sesión, que al hacer clic ejecuta la función handleLogout
        <Button variant="h6" color="inherit" href="/" style={{ marginLeft: 'auto' }} onClick={handleLogout}>Cerrar sesión</Button>
    );
};

export default Logout;
