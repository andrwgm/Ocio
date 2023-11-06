import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Logout from '../../util/logout';
import PersonIcon from '@mui/icons-material/Person';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import backgroundImage from '../../util/backgroundPhoto.jpeg';


function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
                Ocio
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function LogButton() {
    if (!!localStorage.getItem('user')) {
        if (localStorage.getItem('type') === 'cliente') {
            return (
                <>
                    <Logout />
                    <Button variant="h6" color="inherit" href="/dashboard/cliente/profile">
                        <PersonIcon />
                    </Button>
                </>
            );
        }
        if (localStorage.getItem('type') === 'empresa') {
            return (
                <>
                    <Logout />
                    <Button variant="h6" color="inherit" href="/dashboard/empresa/profile">
                        <PersonIcon />
                    </Button>
                </>
            );
        }
        if (localStorage.getItem('type') === 'admin') {
            return (
                <>
                    <Logout />
                    <Button variant="h6" color="inherit" href="/dashboard/admin">
                        <PersonIcon />
                    </Button>
                </>
            );

        }
    }
    else return (<Button variant="h6" color="inherit" href="/login" style={{ marginLeft: 'auto' }}>Iniciar sesión</Button>)
}

const Home = () => {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;
    const totalPages = Math.ceil(events.length / eventsPerPage);

    useEffect(() => {

        axios({
            url: 'http://localhost:8080/eventos',
            method: 'POST',
            data: {
                after: '01/01/1900'
            }
        }).then(res => {
            setEvents(res.data);
        }).catch(err => {
        });

    }, []);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const displayedEvents = events.slice(startIndex, endIndex);

    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme} >
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%">
                        <Button color="inherit" href="/">
                            <ConfirmationNumberIcon />
                        </Button>
                        <Typography variant="h6" color="inherit" noWrap>
                            Ocio
                        </Typography>
                        {LogButton()}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{
                bgcolor: 'transparent',
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,1) 100%), url(${backgroundImage})`,
                backgroundSize: 'auto',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}>
                <Box
                    sx={{

                        bgcolor: 'transparent',
                        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 80%)`,
                        //bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="#0d0d0d"
                            gutterBottom
                        >
                            Ocio a tu alcance
                        </Typography>
                        <Typography variant="h5" align="center" color="#000000" paragraph>
                            La plataforma web que despierta tus sentidos y te conecta con los eventos más emocionantes del momento.
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8, bgcolor: "rgba(0, 0, 0, 0)", backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 10%, rgba(0, 0, 0, 0.1) 80%)`, borderRadius: '5px' }} maxWidth="md">
                    <Grid container spacing={4}>
                        {displayedEvents.map(event => (
                            <Grid item key={event.id} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F4F6F6' }}>
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            pt: '56.25%',
                                        }}
                                        image="https://images.unsplash.com/photo-1518911710364-17ec553bde5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {event.nombre}
                                        </Typography>
                                        <Typography>
                                            {event.descripcion}
                                        </Typography>
                                    </CardContent>
                                    <CardActions >
                                        <Button sx={{ marginLeft: 'auto', color: '#85929E' }} size="small" href={`/evento/${event.id}`}><ControlPointIcon /></Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    {currentPage > 1 && (
                        <Button onClick={handlePreviousPage} style={{ marginRight: '0.5em', color: '#85929E' }} size="large">
                            <ArrowBackIcon fontSize="large" />
                        </Button>
                    )}
                    <Typography variant="h6" style={{ marginTop: '0.4em', verticalAlign: 'middle', margin: '2em' }}>{currentPage}</Typography>
                    {currentPage < totalPages && (
                        <Button onClick={handleNextPage} size="large" style={{ color: '#85929E' }}>
                            <ArrowForwardIcon fontSize="large" />
                        </Button>
                    )}
                </Box>
            </Box>
            <Box sx={{ /*bgcolor: 'background.paper',*/ p: 3 }} component="footer">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Copyright '}
                    <Link color="inherit" href="/">
                        Ocio
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
        </ThemeProvider>
    );
}
export default Home;
