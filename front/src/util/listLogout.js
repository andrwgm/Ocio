import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const ListLogout = () => {

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
            navigate('/');
        });

    };

    return (
        // Renderiza un botón de lista con el icono de logout y el texto "Cerrar sesión"
        <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
    );
};

export default ListLogout;
