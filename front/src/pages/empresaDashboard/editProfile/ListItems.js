import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import ListLogout from '../../../util/listLogout';
import SellIcon from '@mui/icons-material/Sell';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href="/">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Ocio" />
    </ListItemButton>
    <ListItemButton href="/dashboard/empresa/event/new">
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Nuevo evento" />
    </ListItemButton>
    <ListItemButton href="/dashboard/empresa/entrada/new">
      <ListItemIcon>
        <LocalActivityIcon />
      </ListItemIcon>
      <ListItemText primary="Nueva entrada" />
    </ListItemButton>
    <ListItemButton href="/dashboard/empresa">
      <ListItemIcon>
        <SellIcon />
      </ListItemIcon>
      <ListItemText primary=" Mis eventos" />
    </ListItemButton>
    <ListItemButton href="/dashboard/empresa/ventas">
      <ListItemIcon>
        <TrendingUpIcon />
      </ListItemIcon>
      <ListItemText primary="Ventas" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton href="/dashboard/empresa/profile">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Perfil" />
    </ListItemButton>
    <ListLogout />
  </React.Fragment>
);