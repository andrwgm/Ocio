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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const RegisterCliente = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [dni, setDni] = useState("");
    const [fechanacimiento, setFechanacimiento] = useState("");

    const theme = createTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [registerError, setRegisterError] = useState(false);

    const [nombreValido, setNombreValido] = useState(true);
    const [apellidosValido, setApellidosValido] = useState(true);
    const [emailValido, setEmailValido] = useState(true);
    const [passwordValido, setPasswordValido] = useState(true);
    const [dniValido, setDniValido] = useState(true);
    const [fechaValido, setFechaValido] = useState(true);

    const [nombreError, setNombreError] = useState("");
    const [apellidosError, setApellidosError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [dniError, setDniError] = useState("");
    const [fechaError, setFechaError] = useState("");

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

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

    //Validar nombre
    function validarNombre(nombre) {
        const formatoNombre = /^[a-zA-Z]+$/;
        return formatoNombre.test(nombre);
    }

    //Validar apellidos
    function validarApellidos(apellidos) {
        const formatoApellidos = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
        return formatoApellidos.test(apellidos);
    }

    //Validar fecha
    function validarFecha(fechanacimiento) {
        const moment = require('moment');
        const fecha = moment(fechanacimiento, 'YYYY-MM-DD');
        const fechaActual = moment();
        const edad = fechaActual.diff(fecha, 'years');
        return edad >= 18;
    }

    //Validar DNI
    function validarDNI(dni) {
        const formatoDNI = /^\d{8}[a-zA-Z]$/;

        if (!formatoDNI.test(dni)) {
            return false;
        }

        const letrasValidas = "TRWAGMYFPDXBNJZSQVHLCKE";
        const letra = dni.charAt(dni.length - 1).toUpperCase();
        const numeros = parseInt(dni.substr(0, dni.length - 1), 10);
        const letraCalculada = letrasValidas.charAt(numeros % 23);

        return letra === letraCalculada;
    }


    const enviarRegistro = (event) => {
        try {
            event.preventDefault();

            setRegisterError(false);
            setOpen(true);

            if (nombre === '') {
                setNombreValido(false);
                setNombreError("Campo obligatorio");
            }

            if (apellidos === '') {
                setApellidosValido(false);
                setApellidosError("Campo obligatorio");
            }

            if (username === '') {
                setEmailValido(false);
                setEmailError("Campo obligatorio");
            }

            if (password === '') {
                setPasswordValido(false);
                setPasswordError("Campo obligatorio");
            }

            if (dni === '') {
                setDniValido(false);
                setDniError("Campo obligatorio");
            }

            if (fechanacimiento === '') {
                setFechaValido(false);
                setFechaError("Campo obligatorio");
            }

            // Realizar la solicitud de registro si todos los atributos introducidos
            if (!!nombre && !!apellidos && !!username && !!password && !!dni && !!fechanacimiento) {

                if (validarNombre(nombre)) {
                    setNombreValido(true);
                } else {
                    setNombreValido(false);
                    setNombreError("Formato incorrecto");
                }

                if (validarApellidos(apellidos)) {
                    setApellidosValido(true);
                } else {
                    setApellidosValido(false);
                    setApellidosError("Formato incorrecto");
                }

                if (validarEmail(username)) {
                    setEmailValido(true);
                } else {
                    setEmailValido(false);
                    setEmailError("Formato incorrecto");
                }

                if (validarContrasena(password)) {
                    setPasswordValido(true);
                } else {
                    setPasswordValido(false);
                    setPasswordError("La contraseña debe incluir 8 caracteres con al menos una mayúscula, una minúscula y un número");
                }

                if (validarDNI(dni)) {
                    setDniValido(true);
                } else {
                    setDniValido(false);
                    setDniError("Formato incorrecto");
                }

                if (validarFecha(fechanacimiento)) {
                    setFechaValido(true);
                } else {
                    setFechaValido(false);
                    setFechaError("Formato incorrecto");
                }

                // Realizar la solicitud de registro si todos los atributos son válidos
                if (validarNombre(nombre) && validarApellidos(apellidos) && validarEmail(username) && validarContrasena(password) && validarDNI(dni) && validarFecha(fechanacimiento)) {

                    axios({
                        url: 'http://localhost:8080/register/cliente',
                        method: 'POST',
                        data: {
                            username: username,
                            password: password,
                            nombre: nombre,
                            apellidos: apellidos,
                            dni: dni,
                            fechanacimiento: fechanacimiento
                        }
                    }).then(response => {
                        if (response.data.status === 'OK') {
                            setSuccess(true);
                            navigate('/login');
                        } else {
                            navigate(0);
                        }
                    }).catch(error => {
                        setRegisterError(true);
                    })
                }
            }

        } catch (error) {
            console.log(error);
            setSuccess(false);
            setOpen(true);
            setRegisterError(true);
        }
    };


    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            {registerError && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Fallo al crear cuenta
                    </Alert>
                </Snackbar>
            )}
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
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Crea tu cuenta en Ocio
                    </Typography>
                    <Box component="form" noValidate onSubmit={enviarRegistro} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!nombreValido}
                                    helperText={nombreError}
                                    required
                                    fullWidth
                                    autoComplete="nombre"
                                    name="nombre"
                                    onChange={e => { setNombre(e.target.value); setNombreValido(true); setNombreError("") }}
                                    id="nombre"
                                    label="Nombre"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!apellidosValido}
                                    helperText={apellidosError}
                                    required
                                    fullWidth
                                    onChange={e => { setApellidos(e.target.value); setApellidosValido(true); setApellidosError("") }}
                                    id="apellidos"
                                    label="Apellidos"
                                    name="apellidos"
                                    autoComplete="apellidos"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!emailValido}
                                    helperText={emailError}
                                    required
                                    fullWidth
                                    onChange={e => { setUsername(e.target.value); setEmailValido(true); setEmailError("") }}
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!passwordValido}
                                    helperText={passwordError}
                                    required
                                    fullWidth
                                    onChange={e => { setPassword(e.target.value); setPasswordValido(true); setPasswordError("") }}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!dniValido}
                                    helperText={dniError}
                                    required
                                    fullWidth
                                    onChange={e => { setDni(e.target.value); setDniValido(true); setDniError("") }}
                                    name="dni"
                                    label="DNI"
                                    id="dni"
                                    autoComplete="dni"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!fechaValido}
                                    helperText={fechaError}
                                    required
                                    fullWidth
                                    onChange={e => { setFechanacimiento(e.target.value); setFechaValido(true); setFechaError("") }}
                                    name="fechanacimiento"
                                    label="Fecha de Nacimiento"
                                    id="fechanacimiento"
                                    autoComplete="fechanacimiento"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            onSubmit={enviarRegistro}
                            onClick={enviarRegistro}
                            sx={{ mt: 2, mb: 1 }}
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
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default RegisterCliente;