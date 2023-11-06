import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function Error() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h1">
              404
            </Typography>
            <Typography variant="h6">
              Bro te has colado con la pagina, no existe
            </Typography>
            <Button variant="contained" href="/">
              Back Home
            </Button>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://pbs.twimg.com/media/ETAv1npWAAIJ8ll?format=jpg&name=small"
              alt=""
              width={659} height={500}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* 
  Comentario: El componente Error representa la página de error 404. Muestra un mensaje de error, una imagen y un botón para volver a la página de inicio.
*/
