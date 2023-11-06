import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { format } from 'date-fns';

export default function Event() {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [precio, setPrecio] = useState("");
    const [artista, setArtista] = useState("");
    const [aforo, setAforo] = useState("");
    const [activo, setActivo] = useState("");

    const theme = createTheme();
    const navigate = useNavigate();

    const [ventas, setVentas] = useState([]);
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [verif, setVerif] = useState(false);
    const [crearEventoError, setCrearEventoError] = useState(false);

    const [nombreValido, setNombreValido] = useState(true);
    const [descripcionValido, setDescripcionValido] = useState(true);
    const [fechaValido, setFechaValido] = useState(true);
    const [precioValido, setPrecioValido] = useState(true);
    const [ubicacionValido, setUbicacionValido] = useState(true);
    const [artistaValido, setArtistaValido] = useState(true);
    const [aforoValido, setAforoValido] = useState(true);
    const [activoValido, setActivoValido] = useState(true);

    const [nombreError, setNombreError] = useState("");
    const [descripcionError, setDescripcionError] = useState("");
    const [fechaError, setFechaError] = useState("");
    const [ubicacionError, setUbicacionError] = useState("");
    const [precioError, setPrecioError] = useState("");
    const [artistaError, setArtistaError] = useState("");
    const [aforoError, setAforoError] = useState("");
    const [activoError, setActivoError] = useState("");

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    //Validar nombre
    function validarNombre(nombre) {
        const formatoNombre = /^[a-zA-Z0-9\s]+$/;
        return formatoNombre.test(nombre);
    }

    //Validar descripcion
    function validarDescripcion(descripcion) {
        const formatoDescripcion = /^[a-zA-Z .,]+$/;
        return formatoDescripcion.test(descripcion);
    }

    const moment = require('moment');

    //Validar fecha
    function validarFecha(fecha) {
        const fechaActual = moment();
        const fechaEvento = moment(fecha, 'YYYY-MM-DD');

        return fechaEvento.isValid() && fechaEvento.isAfter(fechaActual);
    }

    //Validar precio
    function validarPrecio(precio) {
        const formatoPrecio = /^\d+(\.\d{1,2})?$/;
        return formatoPrecio.test(precio);
    }

    //Validar ubicacion
    function validarUbicacion(ubicacion) {
        const formatoUbicacion = /^[a-zA-Z\s,]+$/;
        return formatoUbicacion.test(ubicacion);
    }

    //Validar artista
    function validarArtista(artista) {
        const formatoArtista = /^[a-zA-Z\s]+$/;
        return formatoArtista.test(artista);
    }

    //Validar aforo
    function validarAforo(aforo) {
        const formatoAforo = /^\d+(\.\d{1,2})?$/;
        return formatoAforo.test(aforo);
    }

    useEffect(() => {

        setOpen(false);

        axios({
            url: 'http://localhost:8080/isVerif',
            method: 'POST',
            data: {
                empresa: localStorage.getItem('user')
            }
        }).then(response => {
            if (response.data.verif === false) {
                setOpen(true);
                setVerif(false);
            } else {
                setOpen(false);
                setVerif(true);
            }
        }).catch(err => {
            setOpen(true);

        });
    }, []);

    const handleSubmit = (event) => {
        try {
            event.preventDefault();

            if (nombre === '') {
                setNombreValido(false);
                setNombreError("Campo obligatorio");
            }

            if (descripcion === '') {
                setDescripcionValido(false);
                setDescripcionError("Campo obligatorio");
            }

            if (fecha === '') {
                setFechaValido(false);
                setFechaError("Campo obligatorio");
            }

            if (ubicacion === '') {
                setUbicacionValido(false);
                setUbicacionError("Campo obligatorio");
            }

            if (precio === '') {
                setPrecioValido(false);
                setPrecioError("Campo obligatorio");
            }

            if (artista === '') {
                setArtistaValido(false);
                setArtistaError("Campo obligatorio");
            }

            if (aforo === '') {
                setAforoValido(false);
                setAforoError("Campo obligatorio");
            }

            if (activo === '') {
                setActivoValido(false);
                setActivoError("Campo obligatorio");
            }

            // Realizar la solicitud de registro si todos los atributos introducidos
            if (!!nombre && !!descripcion && !!fecha && !!ubicacion && !!precio && !!artista && !!aforo && !!activo) {

                if (validarNombre(nombre)) {
                    setNombreValido(true);
                } else {
                    setNombreValido(false);
                    setNombreError("Formato incorrecto");
                }

                if (validarDescripcion(descripcion)) {
                    setDescripcionValido(true);
                } else {
                    setDescripcionValido(false);
                    setDescripcionError("Formato incorrecto");
                }

                if (validarFecha(fecha)) {
                    setFechaValido(true);
                } else {
                    setFechaValido(false);
                    setFechaError("La fecha debe ser posterior a hoy");
                }

                if (validarDescripcion(ubicacion)) {
                    setUbicacionValido(true);
                } else {
                    setUbicacionValido(false);
                    setUbicacionError("Formato incorrecto");
                }

                if (validarPrecio(precio)) {
                    setPrecioValido(true);
                } else {
                    setPrecioValido(false);
                    setPrecioError("Formato incorrecto");
                }

                if (validarArtista(artista)) {
                    setArtistaValido(true);
                } else {
                    setArtistaValido(false);
                    setArtistaError("Formato incorrecto");
                }

                if (validarAforo(aforo)) {
                    setAforoValido(true);
                } else {
                    setAforoValido(false);
                    setAforoError("Formato incorrecto");
                }

                // Realizar la solicitud de registro si todos los atributos son válidos
                if (validarNombre(nombre) && validarDescripcion(descripcion) && validarFecha(fecha) && validarPrecio(precio) && validarUbicacion(ubicacion) && validarArtista(artista) && validarAforo(aforo) && activo !== '') {

                    if (verif) {
                        axios({
                            url: 'http://localhost:8080/eventos/new',
                            method: 'POST',
                            data: {
                                empresa: localStorage.getItem('user'),
                                nombre: nombre,
                                descripcion: descripcion,
                                fecha: fecha,
                                ubicacion: ubicacion,
                                precio: precio,
                                artista: artista,
                                aforo: aforo,
                                activo: activo,
                            }
                        }).then(response => {
                            if (response.data.status === 'OK') navigate('/dashboard/empresa');
                            else navigate(0);
                        })
                    } else {
                        setOpen(true);
                    }
                };
            }

        } catch (error) {
            setSuccess(false);
            setOpen(true);
            crearEventoError(true);
        }
    };

    return (

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <CssBaseline />
            <Snackbar open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    Empresa no verificada
                </Alert>
            </Snackbar>
            {crearEventoError && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Fallo al crear evento
                    </Alert>
                </Snackbar>
            )}
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Crear evento
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        error={!nombreValido}
                        helperText={nombreError}
                        margin="normal"
                        required
                        fullWidth
                        id="nombre"
                        onChange={e => { setNombre(e.target.value); setNombreValido(true); setNombreError("") }}
                        label="Nombre"
                        name="nombre"
                        autoComplete="nombre"
                    />
                    <TextField
                        error={!descripcionValido}
                        helperText={descripcionError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => { setDescripcion(e.target.value); setDescripcionValido(true); setDescripcionError("") }}
                        name="descripcion"
                        label="Descripción"
                        id="descripcion"
                        autoComplete="descripcion"
                    />
                    <TextField
                        error={!fechaValido}
                        helperText={fechaError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => {/*formatFecha*/setFecha(e.target.value); setFechaValido(true); setFechaError("") }}
                        name="fecha"
                        type="date"
                        id="fecha"
                        label="Fecha"
                        autoComplete="fecha"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        error={!precioValido}
                        helperText={precioError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => { setPrecio(e.target.value); setPrecioValido(true); setPrecioError("") }}
                        name="precio"
                        label="Precio"
                        id="precio"
                        autoComplete="precio"
                    />
                    <TextField
                        error={!ubicacionValido}
                        helperText={ubicacionError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => { setUbicacion(e.target.value); setUbicacionValido(true); setUbicacionError("") }}
                        name="ubicacion"
                        label="Ubicación"
                        id="ubicacion"
                        autoComplete="ubicacion"
                    />
                    <TextField
                        error={!artistaValido}
                        helperText={artistaError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => { setArtista(e.target.value); setArtistaValido(true); setArtistaError("") }}
                        name="artista"
                        label="Artista"
                        id="artista"
                        autoComplete="artista"
                    />
                    <TextField
                        error={!aforoValido}
                        helperText={aforoError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => { setAforo(e.target.value); setAforoValido(true); setAforoError("") }}
                        name="aforo"
                        label="Aforo"
                        id="aforo"
                        autoComplete="aforo"
                    />
                    <FormControl
                        error={!activoValido}
                        helperText={activoError}
                        margin="normal"
                        fullWidth
                        required>
                        <InputLabel>Activo</InputLabel>
                        <Select
                            id="activo"
                            label="Activo"
                            name="activo"
                            autoComplete="activo"
                            value={activo}
                            onChange={e => { setActivo(e.target.value); setActivoValido(true); setActivoError("") }}
                        >
                            <MenuItem value='true'>True</MenuItem>
                            <MenuItem value='false'>False</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Crear
                    </Button>
                </Box>
            </Box>
        </Grid >
    );
}

