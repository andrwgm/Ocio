import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

const Row = ({ row }) => {

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center">{row.nombre}</TableCell>
        <TableCell align="center">{row.descripcion}</TableCell>
        <TableCell align="center">{row.fecha}</TableCell>
        <TableCell align="center">{row.ubicacion}</TableCell>
        <TableCell align="center">{row.precio}</TableCell>
        <TableCell align="center">{row.artista}</TableCell>
        <TableCell align="center">{row.aforo}</TableCell>
        <TableCell align="center">{row.activo}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const EmpresaTable = () => {

  const { differenceInDays } = require('date-fns');
  const fechaActual = new Date();

  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [entradaInsertOpen, setEntradaInsertOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setOpenTime(false);
    setEntradaInsertOpen(false);
  };

  //Descomentar cuando haya eventos posteriores al dia de hoy   let today = new Date().toISOString().slice(0, 10);

  useEffect(() => {

    setOpen(false);
    setOpenTime(false);

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
          url: 'http://localhost:8080/eventos',
          method: 'POST',
          data: {
            empresa: localStorage.getItem('user'),
          },
        }).then((res) => {
          setEventos(res.data);

          if(localStorage.getItem('entradaInsertada') === 'true'){
            setEntradaInsertOpen(true);
            localStorage.removeItem('entradaInsertada');
          }
        }).catch((err) => {
          setErrorMsg("No tiene eventos registrados");
          setOpen(true);
        });
      }
    }).catch(err => {
      setErrorMsg("Empresa no verificada");
      setOpen(true);
    });

  }, []);
  
  const activeEvent = (params) => {
    const empresa = params.row;
    
    localStorage.setItem('row', params.row.fecha);
    const fechaObjetivo = new Date(params.row.fecha);
    const diasRestantes = differenceInDays(fechaObjetivo, fechaActual);
    localStorage.setItem('fechaobj', fechaObjetivo);
    localStorage.setItem('fechaActu', fechaActual);
    localStorage.setItem('diasquequedan', diasRestantes);

    if (diasRestantes > 1) {
      axios({
        url: 'http://localhost:8080/eventos/active',
        method: 'POST',
        data: {
          empresa: localStorage.getItem('user'),
          id: Number(params.row.id),
          activo: empresa.activo
        },
      }).then((res) => {
        setTimeout(() => {
          navigate(0);
        }, 1000);
      }).catch((err) => {
      });
    } else {
      setOpenTime(true);
    }

  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'nombre', headerName: 'Nombre', width: 225 },
    { field: 'descripcion', headerName: 'Descripcion', width: 150 },
    { field: 'fecha', headerName: 'Fecha', width: 125 },
    { field: 'ubicacion', headerName: 'Ubicacion', width: 125 },
    { field: 'precio', headerName: 'Precio', width: 75 },
    { field: 'artista', headerName: 'Artista', width: 125 },
    { field: 'aforo', headerName: 'Aforo', width: 75 },
    {
      field: 'activo',
      headerName: 'Activo',
      width: 50,
      align: 'center',
      renderCell: (params) => {
        if (params.row.activo) {
          return (
            <Button onClick={() => activeEvent(params)}>
              <CheckCircleIcon style={{ color: 'green' }} />
            </Button>
          );
        } else {
          return (
            <Button onClick={() => activeEvent(params)}>
              <CancelIcon style={{ color: '#C62828' }} />
            </Button>
          );
        }
      }
    },
    {
      headerName: 'Eliminar',
      width: 75,
      renderCell: (params) => {

        const fechaObjetivo = new Date(params.row.fecha);
        const diasRestantes = differenceInDays(fechaObjetivo, fechaActual);

        const eliminarEvent = () => {
          if (diasRestantes > 1) {
            axios({
              url: 'http://localhost:8080/eventos/delete',
              method: 'POST',
              data: {
                empresa: localStorage.getItem('user'),
                id: Number(params.row.id)
              }
            }).then(res => {
              console.log(params.row.id)
              navigate(0);
            }).catch(err => {
            });

          } else {
            setOpenTime(true);
          }

        };

        return (
          <Button onClick={eliminarEvent}>
            <DeleteIcon style={{ color: '#C62828' }} />
          </Button>
        );
      },
    },
  ];

  const rows = eventos.map((empresa, index) => ({
    id: empresa.id,
    nombre: empresa.nombre,
    descripcion: empresa.descripcion,
    fecha: empresa.fecha,
    ubicacion: empresa.ubicacion,
    precio: empresa.precio,
    artista: empresa.artista,
    aforo: empresa.aforo,
    activo: empresa.activo,
  }));

  return (
    <Box>
      {eventos.length > 0 ? (
        <Box style={{ height: '25em', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'nombre', sort: 'asc' }],
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

      <Snackbar open={openTime} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Quedan menos de 24 horas, no puedes modificarlo
        </Alert>
      </Snackbar>

      <Snackbar open={entradaInsertOpen} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Entrada insertada correctamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmpresaTable;