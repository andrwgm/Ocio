import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const PerfilCliente = () => {

    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [dni, setDni] = useState("");
    const [fechanacimiento, setFechanacimiento] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [nombreError, setNombreError] = useState(false);
    const [apellidosError, setApellidosError] = useState(false);
    const [dniError, setDniError] = useState(false);
    const [fechanacimientoError, setFechanacimientoError] = useState(false);

    const [modifPerfilOpen, setModifPerfilOpen] = useState(false);

    const theme = createTheme();
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);

    const deleteProfile = () => {
        axios({
            url: 'http://localhost:8080/logout',
            method: 'POST',
            withCredentials: true,
        }).then(response => {
            axios({
                url: 'http://localhost:8080/delete/cliente',
                method: 'POST',
                data: {
                    username: localStorage.getItem('user')
                }
            }).then(res => {
                localStorage.clear();
                navigate("/");
            }).catch(err => {
            });
        });
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setModifPerfilOpen(false);
    };

    const datos = clientes.lenght > 0 ? clientes.map((cliente, index) => ({
        email: cliente.email,
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        dni: cliente.dni,
        fechanacimiento: new Date(cliente.fechanacimiento).toLocaleDateString()
    })) : [];

    useEffect(() => {
        axios({
            url: 'http://localhost:8080/profile',
            method: 'POST',
            withCredentials: true,
            data: {
                typeUserProfile: localStorage.getItem('type'),
                email: localStorage.getItem('user'),
            }
        }).then(res => {
            setClientes(res.data);
        }).catch(err => {
        });

        if(localStorage.getItem('perfilModif') === 'OK'){
            setModifPerfilOpen(true);
            localStorage.removeItem('perfilModif');
        }

    }, []);



    return (
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <CssBaseline />
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <AccountCircleIcon style={{ fontSize: '3rem' }} color="primary" />
                <Typography component="h1" variant="h5">
                    Perfil de la cuenta
                </Typography>

                <Snackbar open={modifPerfilOpen} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Datos actualizados
                    </Alert>
                </Snackbar>

                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={clientes.email}
                                label="Email"
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={clientes.nombre}
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                label="Nombre"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={clientes.apellidos}
                                label="Apellidos"
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={clientes.dni}
                                label="DNI"
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={new Date(clientes.fechanacimiento).toLocaleDateString()}
                                label="Fecha de nacimiento"
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" color="primary" href="/dashboard/cliente/profile/edit">
                            <ModeEditIcon />
                        </Button>
                        &nbsp;
                        <Button variant="outlined" color="error" onClick={deleteProfile}>
                            <DeleteIcon />
                        </Button>
                    </div>
                </Box>
            </Box>
        </Grid>
    );
}

export default PerfilCliente;