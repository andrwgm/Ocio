import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const Row = ({ row }) => {

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.entrada}</TableCell>
        <TableCell align="center">{row.empresa}</TableCell>
        <TableCell align="center">{row.evento}</TableCell>
        <TableCell align="center">{row.cliente}</TableCell>
        <TableCell align="center">{row.cantidad}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const VentasTable = () => {


  const [ventas, setVentas] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificadoError, setVerificadoError] = useState(false);

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
      url: 'http://localhost:8080/isVerif',
      method: 'POST',
      data: {
        empresa: localStorage.getItem('user')
      }
    }).then(response => {
      if (response.data.verif === false) {
        setErrorMsg("Empresa no verificada");
        setOpen(true);
      } else {
        setOpen(false);

        axios({
          url: 'http://localhost:8080/ventas',
          method: 'POST',
          data: {
            empresa: localStorage.getItem('user')
          }
        }).then(response => {
          setVentas(response.data);

        }).catch(err => {
          setOpen(true);
          setErrorMsg("No tiene ventas registradas")

        });
      }
    }).catch(err => {
      setOpen(true);
      setErrorMsg("Empresa no verificada");
    });


  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'entrada', headerName: 'Entrada', width: 100 },
    { field: 'empresa', headerName: 'Empresa', width: 250 },
    { field: 'evento', headerName: 'Evento', width: 100 },
    { field: 'cliente', headerName: 'Cliente', width: 250 },
    { field: 'cantidad', headerName: 'Cantidad', width: 100 },
  ];

  const rows = ventas.map((venta, index) => ({
    id: venta.id,
    entrada: venta.entrada,
    empresa: venta.empresa,
    evento: venta.evento,
    cliente: venta.cliente,
    cantidad: venta.cantidad,
  }));


  return (
    <Box>
      {ventas.length > 0 ? (
        <Box style={{ height: '25em', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
          />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}

      <Snackbar open={open} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default VentasTable;