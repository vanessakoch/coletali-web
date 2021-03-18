import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ImgAdmin from '../../../assets/images/admin.svg';
import MenuAdmin from '../../../components/MenuAdmin/menu-admin';

import './styles.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  dashWelcome: {
    textAlign: 'center',
    fontSize: '20px',
    margin: '40px 0'
  }
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Dashboard'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid className={classes.dashWelcome}>
            <h1 className="admin-app-title">COLETALI</h1>
            <h2>Bem vindo administrador!</h2>
            <p>Aqui você poderá adicionar, editar ou remover os pontos de doações,
            coletas e usuários.
            </p>
          </Grid>
          <Grid container spacing={3}>
            <img src={ImgAdmin} alt="Imagem da página administrativa" />
          </Grid>
        </Container>
      </main>
    </div>
  );
}