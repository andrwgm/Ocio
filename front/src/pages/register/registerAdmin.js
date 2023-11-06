import React, { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Ocio
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export const RegisterAdmin = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [userError, setUserError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const theme = createTheme();
    const navigate = useNavigate();

    //Validar email
    function validarEmail(username) {
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formatoEmail.test(username);
    }

    //Validar contraseña
    function validarContrasena(password) {
        const longitud = 8;
        const mayuscula = /[A-Z]/.test(password);
        const minuscula = /[a-z]/.test(password);
        const numero = /[0-9]/.test(password);

        return (password.length >= longitud && minuscula && mayuscula && numero);
    }


    const enviarRegistro = (event) => {

        event.preventDefault();

        setUserError(false);
        setPasswordError(false);

        if (username === '') setUserError(true);
        if (password === '') setPasswordError(true);

        // Realizar la solicitud de registro si todos los atributos introducidos
        if (!!username && !!password) {
            axios({
                url: 'http://localhost:8080/register/admin',
                method: 'POST',
                data: {
                    username: username,
                    password: password,
                }
            }).then(response => {
                if (response.data.status === 'OK') navigate('/login');
                else navigate(0);
            })
        }

    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cuenta administrativa
                    </Typography>
                    <Box component="form" noValidate onSubmit={enviarRegistro} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    onChange={e => setUsername(e.target.value)}
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    onChange={e => setPassword(e.target.value)}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            onSubmit={enviarRegistro}
                            onClick={enviarRegistro}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Regístrate
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login">
                                    <br></br>
                                    ¿Ya tienes una cuenta? Inicia sesión
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default RegisterAdmin;