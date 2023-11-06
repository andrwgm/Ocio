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

export const ModificarEmpresa = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [cif, setCif] = useState("");
    const [domicilio, setDomicilio] = useState("");
    const [responsable, setResponsable] = useState("");
    const [capital, setCapital] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nombreError, setNombreError] = useState(false);
    const [telefonoError, setTelefonoError] = useState(false);
    const [cifError, setCifError] = useState(false);
    const [domicilioError, setDomicilioError] = useState(false);
    const [responsableError, setResponsableError] = useState(false);
    const [capitalError, setCapitalError] = useState(false);


    const [modifPerfilOpen, setModifPerfilOpen] = useState(false);

    const theme = createTheme();
    const navigate = useNavigate();

    const [empresas, setEmpresas] = useState([]);

    const datos = empresas.lenght > 0 ? empresas.map((empresa, index) => ({
        id: empresa.id,
        email: empresa.email,
        nombre: empresa.nombre,
        telefono: empresa.telefono,
        cif: empresa.cif,
        domicilio: empresa.domicilio,
        responsable: empresa.responsable,
        capital: empresa.capital,
        verificado: empresa.verificado,
    })) : [];

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setModifPerfilOpen(false);
    };

    const deleteProfile = () => {
        axios({
            url: 'http://localhost:8080/logout',
            method: 'POST',
            withCredentials: true
        }).then(response => {
            axios({
                url: 'http://localhost:8080/delete/empresa',
                method: 'POST',
                data: {
                    username: localStorage.getItem('user')
                }
            }).then(res => {
                localStorage.clear();
                navigate("/");
            }).catch(error => {
            });
        });
    }

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
            setEmpresas(res.data);
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
                    Perfil de empresa
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
                                value={empresas.nombre}
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                label="Empresa"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={empresas.email}
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
                                value={empresas.telefono}
                                label="Teléfono"
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
                                value={empresas.cif}
                                label="CIF"
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
                                value={empresas.domicilio}
                                label="Domicilio social"
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
                                value={empresas.responsable}
                                label="Responsable de la Empresa"
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
                                value={empresas.capital}
                                label="Capital social"
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
                        <Button variant="outlined" color="primary" href="/dashboard/empresa/profile/edit">
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

export default ModificarEmpresa;