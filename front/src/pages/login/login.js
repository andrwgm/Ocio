import React, { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const Login = () => {

    const [tipo, setTipo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const theme = createTheme();
    const navigate = useNavigate();

    const [emailValido, setEmailValido] = useState(true);
    const [passwordValido, setPasswordValido] = useState(true);
    const [tipoValido, setTipoValido] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [tipoError, setTipoError] = useState("");

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

    const handleSubmit = async (event) => {

        try {
            event.preventDefault();

            setLoginError(false);
            setOpen(true);

            if (email === '') {
                setEmailValido(false);
                setEmailError("Campo obligatorio");
            }

            if (password === '') {
                setPasswordValido(false);
                setPasswordError("Campo obligatorio");
            }

            if (tipo === '') {
                setTipoValido(false);
                setTipoError("Campo obligatorio");
            }

            if (!!email && !!password && !!tipo) {

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

                if (validarEmail(email) && validarContrasena(password) && tipo !== '') {

                    if (tipo === 'cliente') {
                        axios({
                            url: 'http://localhost:8080/login/cliente',
                            method: 'POST',
                            withCredentials: true,
                            data: {
                                username: email,
                                password: password,
                            }
                        }).then(response => {
                            if (response.data.status === 'OK') {
                                localStorage.setItem('user', email);
                                localStorage.setItem('type', tipo);
                                navigate('/');
                                setSuccess(true);
                            }
                        }).catch(error => {
                            setLoginError(true);
                        })
                    }
                    if (tipo === 'empresa') {
                        axios({
                            url: 'http://localhost:8080/login/empresa',
                            method: 'POST',
                            withCredentials: true,
                            data: {
                                username: email,
                                password: password,
                            }
                        }).then(response => {
                            if (response.data.status === 'OK') {
                                localStorage.setItem('user', email);
                                localStorage.setItem('type', tipo);
                                navigate('/dashboard/empresa');
                                setSuccess(true);
                            }
                        }).catch(error => {
                            setLoginError(true);
                        })
                    }
                    if (tipo === 'admin') {
                        axios({
                            url: 'http://localhost:8080/login/admin',
                            method: 'POST',
                            withCredentials: true,
                            data: {
                                username: email,
                                password: password,
                            }
                        }).then(response => {
                            if (response.data.status === 'OK') {
                                localStorage.setItem('user', email);
                                localStorage.setItem('type', tipo);
                                navigate('/dashboard/admin');
                                setSuccess(true);
                            }

                        }).catch(error => {
                            setLoginError(true);
                        })
                    }
                }
            }

        } catch (error) {
            setSuccess(false);
            setOpen(true);
            setLoginError(true);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            {loginError && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Fallo al iniciar sesión
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
                    //backgroundImage: 'url(https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
                    backgroundImage: 'url(https://source.unsplash.com/random/2400x2000/?concert)',
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
                        Inicia sesión
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <FormControl
                            fullWidth
                            required>
                            <InputLabel id="tipo">Tipo</InputLabel>
                            <Select
                                required
                                error={!tipoValido}
                                helperText={tipoError}
                                id="tipo"
                                label="Tipo"
                                value={tipo}
                                onChange={e => { setTipo(e.target.value); setTipoValido(true); setTipoError("") }}
                            >
                                <MenuItem value='cliente'>Cliente</MenuItem>
                                <MenuItem value='empresa'>Empresa</MenuItem>
                                <MenuItem value='admin'>Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            error={!emailValido}
                            helperText={emailError}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            onChange={e => { setEmail(e.target.value); setEmailValido(true); setEmailError("") }}
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            error={!passwordValido}
                            helperText={passwordError}
                            margin="normal"
                            required
                            fullWidth
                            onChange={e => { setPassword(e.target.value); setPasswordValido(true); setPasswordError("") }}
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            onSubmit={handleSubmit}
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Iniciar sesión
                        </Button>

                        <Grid container>
                            <Grid item xs>
                                <Link href="https://cdn.memegenerator.es/imagenes/memes/full/1/14/1142223.jpg">
                                    <br></br>
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </Grid>
                            <Grid item>
                                <br></br>
                                ¿Todavía no tienes una cuenta?
                                <br></br>
                                Regístrate como&nbsp;
                                <Link href="/register/cliente">
                                    cliente
                                </Link>
                                &nbsp;o&nbsp;
                                <Link href="/register/empresa">
                                    empresa
                                </Link>
                            </Grid>
                        </Grid>
                        <Button color="primary" href="/">
                            <KeyboardBackspaceIcon sx={{ fontSize: '2rem' }} />
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );

}

export default Login;