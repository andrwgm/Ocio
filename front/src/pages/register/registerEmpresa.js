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

export const RegisterEmpresa = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [cif, setCif] = useState("");
    const [domicilio, setDomicilio] = useState("");
    const [responsable, setResponsable] = useState("");
    const [capital, setCapital] = useState("");

    const theme = createTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [registerError, setRegisterError] = useState(false);

    const [emailValido, setEmailValido] = useState(true);
    const [passwordValido, setPasswordValido] = useState(true);
    const [nombreValido, setNombreValido] = useState(true);
    const [telefonoValido, setTelefonoValido] = useState(true);
    const [cifValido, setCifValido] = useState(true);
    const [domicilioValido, setDomicilioValido] = useState(true);
    const [responsableValido, setResponsableValido] = useState(true);
    const [capitalValido, setCapitalValido] = useState(true);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nombreError, setNombreError] = useState("");
    const [telefonoError, setTelefonoError] = useState("");
    const [cifError, setCifError] = useState("");
    const [domicilioError, setDomicilioError] = useState("");
    const [responsableError, setResponsableError] = useState("");
    const [capitalError, setCapitalError] = useState("");

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
    function validarEmail(email) {
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formatoEmail.test(email);
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
        const formatoNombre = /^[a-zA-Z ,.-]+$/;
        return formatoNombre.test(nombre);
    }

    //Validar teléfono
    function validarTelefono(telefono) {
        const formatoTelefono = /^\d{9}$/;
        return formatoTelefono.test(telefono);
    }

    //Validar CIF
    function validarCIF(cif) {
        if (cif.length !== 9) {
            return false;
        }

        const letra = cif.charAt(0);
        if (!/^[A-Za-z]$/.test(letra)) {
            return false;
        }

        const digitos = cif.substr(1);
        if (!/^\d{8}$/.test(digitos)) {
            return false;
        }

        return true;
    }

    //Validar domicilio
    function validarDomicilio(domicilio) {
        const formatoDomicilio = /^[a-zA-Z0-9\s\.,#-]+$/;
        return formatoDomicilio.test(domicilio);
    }

    //Validar responsable
    function validarResponsable(responsable) {
        const formatoResponsable = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
        return formatoResponsable.test(responsable);
    }

    //Validar capital
    function validarCapital(capital) {
        const formatoCapital = /^\d+(\.\d{1,2})?$/;
        return formatoCapital.test(capital);
    }

    const enviarRegistro = (event) => {

        try {

            event.preventDefault();

            setRegisterError(false);
            setOpen(true);

            if (email === '') {
                setEmailValido(false);
                setEmailError("Campo obligatorio");
            }

            if (password === '') {
                setPasswordValido(false);
                setPasswordError("Campo obligatorio");
            }

            if (nombre === '') {
                setNombreValido(false);
                setNombreError("Campo obligatorio");
            }

            if (telefono === '') {
                setTelefonoValido(false);
                setTelefonoError("Campo obligatorio");
            }

            if (cif === '') {
                setCifValido(false);
                setCifError("Campo obligatorio");
            }

            if (domicilio === '') {
                setDomicilioValido(false);
                setDomicilioError("Campo obligatorio");
            }

            if (responsable === '') {
                setResponsableValido(false);
                setResponsableError("Campo obligatorio");
            }

            if (capital === '') {
                setCapitalValido(false);
                setCapitalError("Campo obligatorio");
            }

            // Realizar la solicitud de registro si todos los atributos introducidos
            if (!!email && !!password && !!nombre && !!telefono && !!cif && !!domicilio && !!responsable && !!capital) {

                if (validarEmail(email)) {
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

                if (validarNombre(nombre)) {
                    setNombreValido(true);
                } else {
                    setNombreValido(false);
                    setNombreError("Formato incorrecto");
                }

                if (validarTelefono(telefono)) {
                    setTelefonoValido(true);
                } else {
                    setTelefonoValido(false);
                    setTelefonoError("Formato incorrecto");
                }

                if (validarCIF(cif)) {
                    setCifValido(true);
                } else {
                    setCifValido(false);
                    setCifError("El CIF debede cumplir el siguiente formato B12345678");
                }

                if (validarDomicilio(domicilio)) {
                    setDomicilioValido(true);
                } else {
                    setDomicilioValido(false);
                    setDomicilioError("Formato incorrecto");
                }

                if (validarResponsable(responsable)) {
                    setResponsableValido(true);
                } else {
                    setResponsableValido(false);
                    setResponsableError("Formato incorrecto");
                }

                if (validarCapital(capital)) {
                    setCapitalValido(true);
                } else {
                    setCapitalValido(false);
                    setCapitalError("Formato incorrecto");
                }

                // Realizar la solicitud de registro si todos los atributos son válidos
                if (validarEmail(email) && validarContrasena(password) && validarNombre(nombre) && validarTelefono(telefono) && validarCIF(cif) && validarDomicilio(domicilio) && validarResponsable(responsable) && validarCapital(capital)) {
                    axios({
                        url: 'http://localhost:8080/register/empresa',
                        method: 'POST',
                        data: {
                            username: email,
                            password: password,
                            nombre: nombre,
                            telefono: telefono,
                            cif: cif,
                            domicilio: domicilio,
                            responsable: responsable,
                            capital: capital
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
                        Crea tu cuenta de empresa en Ocio
                    </Typography>
                    <Box component="form" noValidate onSubmit={enviarRegistro} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    error={!nombreValido}
                                    helperText={nombreError}
                                    required
                                    fullWidth
                                    id="nombre"
                                    onChange={e => { setNombre(e.target.value); setNombreValido(true); setNombreError("") }}
                                    label="Empresa"
                                    name="nombre"
                                    autoComplete="nombre"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!emailValido}
                                    helperText={emailError}
                                    required
                                    fullWidth
                                    id="email"
                                    onChange={e => { setEmail(e.target.value); setEmailValido(true); setEmailError("") }}
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
                                    error={!telefonoValido}
                                    helperText={telefonoError}
                                    required
                                    fullWidth
                                    onChange={e => { setTelefono(e.target.value); setTelefonoValido(true); setTelefonoError("") }}
                                    name="telefono"
                                    label="Teléfono"
                                    id="telefono"
                                    autoComplete="telefono"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!cifValido}
                                    helperText={cifError}
                                    required
                                    fullWidth
                                    onChange={e => { setCif(e.target.value); setCifValido(true); setCifError("") }}
                                    name="cif"
                                    label="CIF"
                                    id="cif"
                                    autoComplete="cif"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!domicilioValido}
                                    helperText={domicilioError}
                                    required
                                    fullWidth
                                    onChange={e => { setDomicilio(e.target.value); setDomicilioValido(true); setDomicilioError("") }}
                                    name="domicilio"
                                    label="Domicilio Social"
                                    id="domicilio"
                                    autoComplete="domicilio"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!responsableValido}
                                    helperText={responsableError}
                                    required
                                    fullWidth
                                    onChange={e => { setResponsable(e.target.value); setResponsableValido(true); setResponsableError("") }}
                                    name="responsable"
                                    label="Responsable de la Empresa"
                                    id="responsable"
                                    autoComplete="responsable"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!capitalValido}
                                    helperText={capitalError}
                                    required
                                    fullWidth
                                    onChange={e => { setCapital(e.target.value); setCapitalValido(true); setCapitalError("") }}
                                    name="capital"
                                    label="Capital social (€)"
                                    id="capital"
                                    autoComplete="capital"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            onSubmit={enviarRegistro}
                            onClick={enviarRegistro}
                            sx={{ mt: 6 }}
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

export default RegisterEmpresa;