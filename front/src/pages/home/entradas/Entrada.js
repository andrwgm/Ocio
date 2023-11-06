import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EuroIcon from '@mui/icons-material/Euro';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Row = ({ row }) => {

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center">{row.evento}</TableCell>
        <TableCell align="center">{row.descripcion}</TableCell>
        <TableCell align="center">{row.precio}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};


const EntradaTable = () => {

  const [open, setOpen] = useState(false);

  const [entrada, setEntrada] = useState([]);
  const [entradasSelecciones, setEntradasSelecciones] = useState([]);
  const [numEnt, setNumEnt] = useState([]);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {

    setOpen(false);

    axios({
      url: 'http://localhost:8080/ventas',
      method: 'POST',
      data: {
        cliente: localStorage.getItem('user'),
      }
    }).then(res => {
      setEntrada(res.data);
      setEntradasSelecciones(res.data.map(() => ({ numEnt: '' })));
    }).catch(err => {
      setOpen(true);
    });
  }, []);

  const handleEntradasChange = (index, value) => {
    setEntradasSelecciones(prevState => {
      const newState = [...prevState];
      newState[index].numEnt = value;
      newState[index].numValid = value === 0;
      return newState;
    });
  };

  const columns = [
    { field: 'evento', headerName: 'Evento', width: 100 },
    { field: 'descripcion', headerName: 'Descripcion', width: 800 },
    { field: 'precio', headerName: 'Precio', width: 125 },
  ];

  const rows = entrada.map((entradas, index) => ({
    id: index + 1,
    evento: entradas.evento,
    descripcion: entradas.descripcion,
    precio: entradas.precio,
  }));

  return (

    <Box>
      {entrada &&
        entrada.map((ent, index) => (
          <Card key={index} sx={{ mt: 4, backgroundColor: '#F4F6F6' }}>
            <CardContent>
              <Grid container component="main">
                <Grid item xs={12} sm={6}
                  sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random/2400x2000/?concert)',
                    backgroundRepeat: 'no-repeat',
                    margin: '-1em',
                    marginBottom: '-1.5em'
                  }} />
                <Grid container columns={16} md={7} sx={{ marginLeft: '2em' }}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle2">
                      <CalendarMonthIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />{ent.evento}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle2">
                      <GpsFixedIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />{ent.descripcion}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle2">
                      <EuroIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />{ent.precio} €
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle2">
                      <LocalActivityIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />{ent.cantidad} entradas adquiridas
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8} sx={{ marginTop: '2em', display: 'flex', verticalAlign: 'middle', justifyContent: 'flex-end' }}>
                    <QRCode size={100} value={ent.id} />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

      <Snackbar open={open} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          No tienes compras realizadas
        </Alert>
      </Snackbar>
    </Box>
  );

};

export default EntradaTable;