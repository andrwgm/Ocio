import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export const AddressForm = () => {

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [nombreError, setNombreError] = useState(false);
  const [apellidosError, setApellidosError] = useState(false);
  const [dniError, setDniError] = useState(false);

  const theme = createTheme();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);

  const datos = clientes.length > 0 ? clientes.map((cliente, index) => ({
    email: cliente.email,
    nombre: cliente.nombre,
    apellidos: cliente.apellidos,
    dni: cliente.dni,
  })) : [];

  const enviarRegistro = (event) => {
    event.preventDefault();
    setEmailError(false);
    setNombreError(false);
    setApellidosError(false);
    setDniError(false);

    if (email === '') setEmailError(true);
    if (nombre === '') setNombreError(true);
    if (apellidos === '') setApellidosError(true);
    if (dni === '') setDniError(true);
  };

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
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Datos personales
      </Typography>
      <Grid container spacing={3}>
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
        <Grid item xs={12} sm={6}>
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

        <Grid item xs={12} sm={6}>
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
      </Grid>
    </React.Fragment >
  );
}

export default AddressForm;