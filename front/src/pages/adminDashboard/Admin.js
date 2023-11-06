import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VerifiedIcon from '@mui/icons-material/Verified';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Row = ({ row }) => {

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center">{row.email}</TableCell>
        <TableCell align="center">{row.nombre}</TableCell>
        <TableCell align="center">{row.telefono}</TableCell>
        <TableCell align="center">{row.cif}</TableCell>
        <TableCell align="center">{row.domicilio}</TableCell>
        <TableCell align="center">{row.responsable}</TableCell>
        <TableCell align="center">{row.capital}</TableCell>
        <TableCell align="center">{row.verificado}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const EmpresaTable = () => {

  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  const [snackbarInfo, setSnackbarInfo] = useState({
    type: "",
    open: false,
    success: false,
    error: false,
    message: '',
  });


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarInfo((prevSnackbarInfo) => ({
      ...prevSnackbarInfo,
      open: false,
    }));
  };

  useEffect(() => {
    axios({
      url: 'http://localhost:8080/empresa/show',
      method: 'POST'
    }).then(res => {
      setEmpresas(res.data);
    }).catch(err => {
    });
  }, []);

  const columns = [
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'nombre', headerName: 'Nombre', width: 100 },
    { field: 'telefono', headerName: 'Teléfono', width: 100 },
    { field: 'cif', headerName: 'CIF', width: 100 },
    { field: 'domicilio', headerName: 'Domicilio', width: 150 },
    { field: 'responsable', headerName: 'Responsable', width: 150 },
    { field: 'capital', headerName: 'Capital', width: 100 },
    {
      field: 'verificado',
      headerName: 'Verificado',
      width: 90,
      align: 'center',
      renderCell: (params) => {
        const verificarEmpresa = () => {
          axios({
            url: 'http://localhost:8080/empresa/verif',
            method: 'POST',
            data: {
              empresa: params.row.email
            }
          }).then(res => {
            setSnackbarInfo({
              type: "1",
              open: true,
              success: true,
              error: false,
              message: 'Empresa verificada',
            });
            setTimeout(() => {
              setSnackbarInfo((prevSnackbarInfo) => ({
                ...prevSnackbarInfo,
                open: false,
                type: ""
              }));
              navigate(0);
            }, 1000);

          }).catch(err => {
            console.log(err);
            setSnackbarInfo({
              type: "1",
              open: true,
              success: false,
              error: true,
              message: 'Fallo al verificar empresa',
            });
          });

        };
        if (params.row.verificado) {
          return <VerifiedIcon color="primary" />;
        } else {
          return (
            <Button onClick={verificarEmpresa}>
              <UnpublishedIcon style={{ color: 'orange' }} />
            </Button>
          );
        }
      },
    },
    {
      headerName: 'Eliminar',
      width: 75,
      renderCell: (params) => {
        const eliminarEmpresa = () => {
          axios({
            url: 'http://localhost:8080/delete/empresa',
            method: 'POST',
            data: {
              username: params.row.email
            }
          }).then(res => {
            setSnackbarInfo({
              type: "2",
              open: true,
              success: true,
              error: false,
              message: 'Empresa eliminada',
            });
            setTimeout(() => {
              setSnackbarInfo((prevSnackbarInfo) => ({
                ...prevSnackbarInfo,
                open: false,
                type: ""
              }));
              navigate(0);
            }, 1000);
          }).catch(err => {
            console.log(err);
            setSnackbarInfo({
              type: "2",
              open: true,
              success: false,
              error: true,
              message: 'Fallo al eliminar empresa',
            });
          });
        };

        return (
          <Button onClick={eliminarEmpresa}>
            <DeleteIcon style={{ color: '#C62828' }} />
          </Button>
        );
      },
    },
  ];

  const rows = empresas.map((empresa, index) => ({
    id: index + 1,
    email: empresa.email,
    nombre: empresa.nombre,
    telefono: empresa.telefono,
    cif: empresa.cif,
    domicilio: empresa.domicilio,
    responsable: empresa.responsable,
    capital: empresa.capital,
    verificado: empresa.verificado,
  }));

  return (

    empresas.length > 0 && (
      <Box style={{ height: '25em', width: '100%' }}>

        {snackbarInfo.type === "1" && (
          <Snackbar open={snackbarInfo.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarInfo.success ? 'success' : 'warning'} sx={{ width: '100%' }}>
              {snackbarInfo.message}
            </Alert>
          </Snackbar>
        )}

        {snackbarInfo.type === "2" && (
          <Snackbar open={snackbarInfo.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarInfo.success ? 'success' : 'warning'} sx={{ width: '100%' }}>
              {snackbarInfo.message}
            </Alert>
          </Snackbar>
        )}

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
    )
  );
};

export default EmpresaTable;