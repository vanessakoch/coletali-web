import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import Room from '@material-ui/icons/Room';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import { logout } from '../../services/auth';

import './list-menu.css';

export function handleLogout() {
  logout();
}

export const mainListItems = (
  <div>
    <Link className="list-menu" to="/admin/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </Link>
    <Link className="list-menu" to="/admin/donate">
      <ListItemIcon>
        <Room />
      </ListItemIcon>
      <ListItemText primary="Pontos de Doação" />
    </Link>
    <Link className="list-menu" to="/admin/collect">
      <ListItemIcon>
        <Room />
      </ListItemIcon>
      <ListItemText primary="Pontos de Coleta" />
    </Link>
    <Link className="list-menu" to="/admin/user">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Usuários" />
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Opções</ListSubheader>
    <Link className="list-menu" to="/" onClick={handleLogout}>
      <ListItemIcon>
        <ArrowBack />
      </ListItemIcon>
      <ListItemText primary="Sair" />
    </Link>
  </div>
);