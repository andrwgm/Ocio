import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './Footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainFeaturedPost from './MainFeaturedPost';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EuroIcon from '@mui/icons-material/Euro';
import PersonIcon from '@mui/icons-material/Person';
import Groups2Icon from '@mui/icons-material/Groups2';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import backgroundImage from '../../util/backgroundPhoto.jpeg';

const defaultTheme = createTheme();

const Blog = () => {
  const [event, setEvents] = useState([]);
  const [entrada, setEntradas] = useState([]);
  const [numEnt, setNumEnt] = useState([]);
  const [numValid, setValid] = useState([]);
  const [entradasSelecciones, setEntradasSelecciones] = useState([]);

  const { id } = useParams();

  const mainFeaturedPost = {
    title: `${event.nombre}`,
    description: `${event.descripcion}`,
    //image: 'https://source.unsplash.com/random/2400x2000/?concert',
    imageText: 'main image description',
  };

  const [logged, setLogged] = useState(false);

  useEffect(() => {

    if (!!localStorage.getItem('user')) setLogged(true);

    axios({
      url: `http://localhost:8080/eventos/${id}`,
      method: 'GET'
    }).then(res => {
      setEvents(res.data);
      axios({
        url: 'http://localhost:8080/entradas',
        method: 'POST',
        data: {
          evento: res.data.id
        }
      }).then(response => {
        setEntradas(response.data);
        setEntradasSelecciones(response.data.map(() => ({
          numEnt: 0,
          numValid: true
        })));
      }).catch(error => {
      });
    }).catch(err => {
    });
  }, [id]);

  const handleEntradasChange = (index, value) => {
    setEntradasSelecciones(prevState => {
      const newState = [...prevState];
      newState[index].numEnt = value;
      newState[index].numValid = value === 0;
      return newState;
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Button color="inherit" href="/">
            <ConfirmationNumberIcon />
          </Button>
          <Typography variant="h6" color="inherit" noWrap>
            Ocio
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{
        bgcolor: 'transparent',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,1) 100%), url(${backgroundImage})`,
        backgroundSize: 'auto',
        backgroundPosition: 'top',
        minHeight: '100vh',
      }}>
        <Container maxWidth="lg" >
          <br />
          <Box>
            <MainFeaturedPost post={mainFeaturedPost} />
            {event && (
              <Card sx={{ mt: 4, backgroundColor: '#F4F6F6' }}>
                <CardContent>
                  <Box>
                    <Typography variant="subtitle1">
                      <CalendarMonthIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />&nbsp;{event.fecha}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle1">
                      <LocationOnIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />&nbsp;{event.ubicacion}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle1">
                      <EuroIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />&nbsp;{event.precio}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle1">
                      <PersonIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />&nbsp;{event.artista}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle1">
                      <Groups2Icon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />&nbsp;{event.aforo}
                    </Typography>
                    <br></br>
                    <Typography variant="subtitle1">
                      <BusinessIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />&nbsp;{event.empresa}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
          <Box>
            {entrada &&
              entrada.map((ent, index) => (
                <Card key={index} sx={{ mt: 4, backgroundColor: '#F4F6F6' }}>
                  <CardContent>
                    <Box>
                      <Grid container component="main">
                        <Grid item xs={12} sm={6}
                          sx={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1549499090-d7ac0cec89f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80)',
                            //backgroundImage: 'url(https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            margin: '-1em',
                            marginBottom: '-1.5em'
                          }} />
                        <Grid item xs={12} sm={8} md={5} elevation={6} square sx={{ marginLeft: '2em', marginRight: '1em' }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2">
                              <CalendarMonthIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />{event.nombre}
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
                              <LocalActivityIcon sx={{ verticalAlign: 'middle', marginLeft: '5px', marginRight: '1em' }} />{ent.entradasdisponibles} entradas disponibles
                            </Typography>
                            <br></br>
                          </Grid>
                          <Typography variant="h9" fontWeight="bold">
                            Selecciona las entradas
                          </Typography>
                          <FormControl required sx={{ verticalAlign: 'middle' }}>
                            <Select
                              sx={{ width: '3.5em', height: '3em', marginLeft: '5px', marginRight: '1em' }}
                              id={`numEnt-${index}`}
                              label=""
                              value={entradasSelecciones[index].numEnt} // Valor del arreglo correspondiente
                              onChange={e => handleEntradasChange(index, e.target.value)} // Llamada a la función handleEntradasChange con el índice
                            >
                              <MenuItem value='1'>1</MenuItem>
                              <MenuItem value='2'>2</MenuItem>
                              <MenuItem value='3'>3</MenuItem>
                              <MenuItem value='4'>4</MenuItem>
                              <MenuItem value='5'>5</MenuItem>
                              <MenuItem value='6'>6</MenuItem>
                              <MenuItem value='7'>7</MenuItem>
                              <MenuItem value='8'>8</MenuItem>
                              <MenuItem value='9'>9</MenuItem>
                              <MenuItem value='10'>10</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {logged ?

                          <Button
                            align="center"
                            variant="contained"
                            color="primary"
                            size="small"
                            href={`/payment/${ent.id}/${entradasSelecciones[index].numEnt}`}
                            disabled={entradasSelecciones[index].numValid}
                            sx={{ marginTop: 'auto', height: '3em' }}
                          >
                            <ShoppingCartIcon />
                          </Button>

                          :

                          <Button
                            align="center"
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={true}
                            sx={{ marginTop: 'auto', height: '3em' }}
                          >
                            <ShoppingCartIcon />
                          </Button>

                        }
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
          <br></br>
          <Button style={{ marginRight: '0.5em', color: '#85929E' }} size="large" href="/">
            <ArrowBackIcon fontSize="large" />
          </Button>
        </Container>
      </Box>
      <Footer />
    </ThemeProvider >
  );
};

export default Blog;
