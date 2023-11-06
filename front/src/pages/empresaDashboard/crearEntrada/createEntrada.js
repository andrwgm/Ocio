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

    const [empresa, setEmpresa] = useState("");
    const [evento, setEvento] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [entradas, setEntradas] = useState("");

    const theme = createTheme();
    const navigate = useNavigate();

    const [verif, setVerif] = useState(false);

    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [crearEntradaError, setCrearEntradaError] = useState(false);

    const [eventosEmpresa, setEventosEmpresa] = useState([]);
    const [eventoValido, setEventoValido] = useState(true);
    const [descripcionValido, setDescripcionValido] = useState(true);
    const [precioValido, setPrecioValido] = useState(true);
    const [entradasValido, setEntradasValido] = useState(true);

    const [eventoError, setEventoError] = useState("");
    const [descripcionError, setDescripcionError] = useState("");
    const [precioError, setPrecioError] = useState("");
    const [entradasError, setEntradasError] = useState("");

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    //Validar descipcion  
    function validarDescripcion(descripcion) {
        const formatoDescripcion = /^[a-zA-Z .,]+$/;
        return formatoDescripcion.test(descripcion);
    }

    //Validar precio
    function validarPrecio(precio) {
        const formatoPrecio = /^\d+(\.\d{1,2})?$/;
        return formatoPrecio.test(precio);
    }

    //Validar entradas
    function validarEntradas(entradas) {
        const formatoEntradas = /^\d+(\.\d{1,2})?$/;
        return formatoEntradas.test(entradas);
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
            } else {
                setVerif(true);
                setOpen(false);
            }

            axios({
                url: 'http://localhost:8080/eventos',
                method: 'POST',
                data: {
                    after: '01/01/1900',
                    empresa: localStorage.getItem('user')
                }
            }).then(res => {
                setEventosEmpresa(res.data);
            }).catch(err => {
            });

        }).catch(err => {
            setOpen(true);
        });
    }, []);

    const handleSubmit = (event) => {
        try {
            event.preventDefault();

            setEventoError(false);
            setDescripcionError(false);
            setPrecioError(false);
            setEntradasError(false);

            if (evento === '') {
                setEventoValido(false);
                setEventoError("Campo obligatorio");
            }

            if (descripcion === '') {
                setDescripcionValido(false);
                setDescripcionError("Campo obligatorio");
            }

            if (precio === '') {
                setPrecioValido(false);
                setPrecioError("Campo obligatorio");
            }

            if (entradas === '') {
                setEntradasValido(false);
                setEntradasError("Campo obligatorio");
            }

            if (!!evento && !!descripcion && !!precio && !!entradas) {


                if (validarDescripcion(descripcion)) {
                    setDescripcionValido(true);
                } else {
                    setDescripcionValido(false);
                    setDescripcionError("Formato incorrecto");
                }

                if (validarPrecio(precio)) {
                    setPrecioValido(true);
                } else {
                    setPrecioValido(false);
                    setPrecioError("Formato incorrecto");
                }

                if (validarEntradas(entradas)) {
                    setEntradasValido(true);
                } else {
                    setEntradasValido(false);
                    setEntradasError("Formato incorrecto");
                }

                if (validarDescripcion(descripcion) && validarPrecio(precio) && validarEntradas(entradas) && evento !== '') {

                    if (verif) {
                        axios({
                            url: 'http://localhost:8080/entradas/new',
                            method: 'POST',
                            data: {
                                empresa: localStorage.getItem('user'),
                                evento: evento,
                                descripcion: descripcion,
                                precio: Number(precio),
                                entradas: Number(entradas),
                            }
                        }).then(response => {
                            if (response.data.status === 'OK') {
                                navigate('/dashboard/empresa');
                                localStorage.setItem('entradaInsertada', true);
                            }
                            else navigate(0);
                        })
                    } else {
                        setOpen(true);
                    }
                };

            }

        } catch (error) {
            console.log(error);
            setSuccess(false);
            setOpen(true);
            crearEntradaError(true);
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
            {crearEntradaError && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Fallo al crear la entrada
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
                    Crear entrada
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>

                    <FormControl
                        error={!eventoValido}
                        helperText={eventoError}
                        margin="normal"
                        fullWidth
                        required>
                        <InputLabel>Evento</InputLabel>
                        <Select
                            id="evento"
                            label="Evento"
                            name="evento"
                            autoComplete="evento"
                            value={evento}
                            onChange={e => { setEvento(e.target.value); setEventoValido(true); setEventoError("") }}
                        >
                            {eventosEmpresa.map(ev => (
                                <MenuItem value={ev.id}>{ev.id} - {ev.nombre}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>


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
                        error={!entradasValido}
                        helperText={entradasError}
                        margin="normal"
                        required
                        fullWidth
                        onChange={e => { setEntradas(e.target.value); setEntradasValido(true); setEntradasError("") }}
                        name="entradas"
                        label="Numero de entradas"
                        id="entradas"
                        autoComplete="entradas"
                    />
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

