import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function PaymentForm() {

  const [tarjeta, setTarjeta] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvInfo, setCvvInfo] = useState("Grupo de tres número de la parte trasera de la tarjeta");

  const [tarjetaValid, setTarjetaValid] = useState(true);
  const [caducidadValid, setCaducidadValid] = useState(true);
  const [cvvValid, setCvvValid] = useState(true);

  const [tarjetaValidError, setTarjetaValidError] = useState("");
  const [caducidadValidError, setCaducidadValidError] = useState("");
  const [cvvValidError, setCvvValidError] = useState("");

  //Validar tarjeta
  function validarTarjeta(tarjeta) {
    if (tarjeta.length !== 16) {
      return false;
    }
    if (!/^\d+$/.test(tarjeta)) {
      return false;
    }
    return true;
  }

  //Validar fecha de caducidad
  function validarCaducidad(caducidad) {
    if (caducidad.length !== 7) {
      return false;
    }
    const regex = /^(0[1-9]|1[0-2])\/(20\d{2}|2[1-9]\d{1})$/;
    if (!regex.test(caducidad)) {
      return false;
    }
    return true;
  }

  //Validar CVV
  function validarCvv(cvv) {
    if (cvv.length !== 3) {
      return false;
    }
    if (!/^\d+$/.test(cvv)) {
      return false;
    }
    return true;
  }

  useEffect((e) => {
    localStorage.setItem('tarjeta', tarjeta);
    localStorage.setItem('caducidad', caducidad);
    localStorage.setItem('cvv', cvv);

    if (tarjeta !== '') {
      if (validarTarjeta(tarjeta)) {
        setTarjetaValid(true);
        setTarjetaValidError("");
      } else {
        setTarjetaValid(false);
        setTarjetaValidError("Formato incorrecto");
      }
    } else {
      setTarjetaValid(true);
      setTarjetaValidError("");
    }

    if (caducidad !== '') {
      if (validarCaducidad(caducidad)) {
        setCaducidadValid(true);
        setCaducidadValidError("");
      } else {
        setCaducidadValid(false);
        setCaducidadValidError("Formato incorrecto");
      }
    } else {
      setCaducidadValid(true);
      setCaducidadValidError("");
    }

    if (cvv !== '') {
      setCvvInfo("");
      if (validarCvv(cvv)) {
        setCvvValid(true);
        setCvvValidError("");
        setCvvInfo("Grupo de tres número de la parte trasera de la tarjeta");
      } else {
        setCvvValid(false);
        setCvvValidError("Formato incorrecto");
      }
    } else {
      setCvvValid(true);
      setCvvValidError("");
      setCvvInfo("Grupo de tres número de la parte trasera de la tarjeta");
    }

  });

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Introduzca los datos de su tarjeta
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            error={!tarjetaValid}
            helperText={tarjetaValidError}
            id="cardNumber"
            label="Número de tarjeta"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
            onChange={e => { setTarjeta(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            error={!caducidadValid}
            helperText={caducidadValidError}
            id="expDate"
            label="Fecha de caducidad"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            onChange={e => { setCaducidad(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            error={!cvvValid}
            helperText={cvvValid ? cvvInfo : cvvValidError}
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
            onChange={e => { setCvv(e.target.value) }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
