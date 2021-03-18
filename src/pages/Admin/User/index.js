import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAlert } from 'react-alert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuAdmin from '../../../components/MenuAdmin/menu-admin';
import { Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import api from '../../../services/api';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  btnInsert: {
    marginBottom: 10,
    float: 'right',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
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
    fontSize: '1rem',
  },
  tableTitle: {
    margin: '16px 0'
  }
}));

export default function User() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    api.get('user').then(response => {
      setUsers(response.data);
    })
  })

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      var result = await api.delete(`/user/${id}`);
      if (result.status === 200) {
        history.push('/admin/user');
        alert.show('Registro deletado com sucesso', { type: 'success' })
      } else {
        alert.show('Ocorreu um erro. Por favor, tente novamente', { type: 'error' })
      }
    }
  }

  function handleEdit(id) {
    history.push(`/admin/user/edit/${id}`);
  }

  function handleInsert() {
    history.push(`/admin/user/insert`);
  }

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Usuários'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Button
            className={classes.btnInsert}
            variant="contained"
            color="primary"
            onClick={() => handleInsert()}>
            Adicionar usuário
          </Button>

          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <h2 className={classes.tableTitle}>Lista de usuários</h2>
                  <Grid item xs={12} sm={12}>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome completo</TableCell>
                            <TableCell align="center">CPF</TableCell>
                            <TableCell align="center">E-mail</TableCell>
                            <TableCell align="center">Telefone</TableCell>
                            <TableCell align="center">Administrador</TableCell>
                            <TableCell align="center">Opções</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map(user => (
                            <TableRow key={user.id}>
                              <TableCell component="th" scope="row">
                                {user.full_name}
                              </TableCell>
                              <TableCell align="center">{user.cpf}</TableCell>
                              <TableCell align="center">{user.email}</TableCell>
                              <TableCell align="center">{user.phone}</TableCell>
                              <TableCell align="center">{user.is_admin ? "Sim" : "Não"}</TableCell>
                              <TableCell align="center">
                                <ButtonGroup aria-label="outlined primary button group">
                                  <Button
                                    color="primary"
                                    onClick={() => handleEdit(user.id)}>
                                    Editar
                                </Button>
                                  <Button
                                    color="secondary"
                                    onClick={() => handleDelete(user.id)}>
                                    Deletar
                                </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}