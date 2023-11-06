import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const steps = ['Datos', 'Método de pago', 'Información'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout() {

  const { id, num } = useParams();

  const theme = createTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const [open, setOpen] = useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const HacerPago = async () => {
    try {
      const response = await axios({
        url: 'http://localhost:8080/payment',
        method: 'POST',
        withCredentials: true,
        data: {
          email: localStorage.getItem('user'),
          entrada: id,
          cantidad: num,
          tarjeta: localStorage.getItem('tarjeta'),
          caducidad: localStorage.getItem('caducidad'),
          cvv: localStorage.getItem('cvv')
        }
      });

      localStorage.removeItem('tarjeta');
      localStorage.removeItem('caducidad');
      localStorage.removeItem('cvv');

      if (response.data.success === true) {
        await sleep(2000);
        setSuccess(true);
        await sleep(1000);
        navigate('../dashboard/cliente/entradas');
      }
    } catch (error) {
      setSuccess(false);
      setOpen(true);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%">
              <Button color="inherit" href="/">
                <ConfirmationNumberIcon />
              </Button>
              <Typography variant="h6" color="inherit" noWrap>
                Ocio
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Fallo al procesar el pago
          </Alert>
        </Snackbar>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Pago
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeStep !== 0 && (
                <Fab color="primary" variant="contained" onClick={handleBack} sx={{ mt: 5, ml: 1 }}>
                  <ArrowBackIcon />
                </Fab>
              )}
              {activeStep === steps.length - 1 ?
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Fab
                    aria-label="save"
                    color={success ? "success" : "primary"}
                    sx={{ buttonSx, mt: 4, ml: 1 }}
                    onClick={(event) => {
                      HacerPago();
                      handleButtonClick();
                    }}
                  >

                    {success ? <CheckIcon /> : <PaymentIcon />}
                    {loading && (
                      <CircularProgress
                        size={68}
                        sx={{
                          color: green[500],
                          position: 'absolute',
                          top: -6,
                          left: -6,
                          zIndex: 1,
                        }}
                      />
                    )}
                  </Fab>
                </Box>

                :
                <Fab
                  color="primary"
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 5, ml: 1 }}
                >
                  <ArrowForwardIcon />
                </Fab>}

            </Box>
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
} 