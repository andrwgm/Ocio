import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Review() {

  
  const { id, num } = useParams();
  const [compra, setCompra] = useState([]);
  const [clientes, setClientes] = useState([]);

  const datosPago = [
    { campo: 'Nº tarjeta', valor: localStorage.getItem('tarjeta') },
    { campo: 'Caducidad', valor: localStorage.getItem('caducidad') },
    { campo: 'CVV', valor: localStorage.getItem('cvv') },
  ];
  
  useEffect(() => {

    axios({
      url: `http://localhost:8080/payment/${id}/${num}`,
      method: 'GET'
    }).then(res => {
      setCompra([res.data]);
    }).catch(err => {
    });

    axios({
      url: 'http://localhost:8080/profile',
      method: 'POST',
      data: {
        typeUserProfile: localStorage.getItem('type'),
        email: localStorage.getItem('user'),
      }
    }).then(res => {
      setClientes(res.data);

    }).catch(err => {
    });
    

  }, [id, num]);

  const datosCliente = clientes.length > 0 ? clientes.map((cliente, index) => ({
    email: cliente.email,
    nombre: cliente.nombre,
    apellidos: cliente.apellidos,
    dni: cliente.dni
  })) : [];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Resumen de la compra
      </Typography>
      <List disablePadding>
        {compra && compra.length > 0 ? (
          compra.map((item) => (
            <ListItem key={item.entrada} sx={{ py: 1, px: 0 }}>
              <ListItemText primary={item.info} secondary={"Cantidad:" + item.cantidad} />

              <Typography variant="body2">{item.precio} €</Typography>
            </ListItem>
          ))
        ) : (
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="No hay entradas seleccionadas" />
          </ListItem>
        )}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          {compra && compra.length > 0 ? (
            compra.map((item) => (
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {compra.reduce((total, item) => total + item.precio, 0) /*Para que sume todos los precios en caso de haber varios tipos*/} €
              </Typography>
            ))
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              0 €
            </Typography>
          )}

        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Datos de contacto
          </Typography>
          <Typography gutterBottom>{clientes.nombre} {clientes.apellidos}</Typography>
          <Typography gutterBottom>{clientes.email}</Typography>

        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Detalles de pago
          </Typography>
          <Grid container>
            {datosPago.map((dato) => (
              <React.Fragment key={dato.campo}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{dato.campo}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ marginLeft: '-1em' }}>
                  <Typography gutterBottom>{dato.valor}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}