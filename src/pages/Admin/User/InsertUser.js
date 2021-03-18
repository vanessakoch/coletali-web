import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { useAlert } from 'react-alert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuAdmin from '../../../components/MenuAdmin/menu-admin';
import { Button, Checkbox, FormControlLabel, FormGroup, Paper, TextField } from '@material-ui/core';
import api from '../../../services/api';

const useStyles = makeStyles(theme => ({
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
    padding: 20,
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function InsertUser() {
  const classes = useStyles();
  const [full_name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [is_admin, setIsAdmin] = useState(false);
  const { register, handleSubmit } = useForm();
  const alert = useAlert();
  const history = useHistory();

  async function onSubmit(event) {
    const data = { full_name, cpf, email, password, phone, is_admin }

    if (full_name !== '' && cpf !== '' && email !== '' && password !== '' && phone !== '' && is_admin !== '') {
      const response = await api.post('user', data);

      if (response.status === 200) {
        history.push('/admin/user');
        alert.show('Salvo com sucesso!', { type: 'success' })
      } else {
        alert.show('Erro ao cadastrar o usuário', { type: 'error' })
      }
    } else {
      alert.show('Por favor, preencha todos os dados!', { type: 'error' })
    }

  }

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Usuários'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <h2>Cadastrar usuário</h2>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="fullName"
                      name="fullName"
                      label="Nome completo"
                      fullWidth
                      autoComplete="fullName"
                      variant="outlined"
                      value={full_name}
                      ref={register}
                      onChange={e => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cpf"
                      type="number"
                      name="cpf"
                      label="CPF"
                      fullWidth
                      autoComplete="cpf"
                      variant="outlined"
                      value={cpf}
                      ref={register}
                      onChange={e => setCpf(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      type="email"
                      id="email"
                      name="email"
                      label="E-mail"
                      fullWidth
                      autoComplete="email"
                      variant="outlined"
                      value={email}
                      ref={register}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      type="password"
                      id="password"
                      name="password"
                      label="Senha"
                      fullWidth
                      autoComplete="password"
                      variant="outlined"
                      value={password}
                      ref={register}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="number"
                      required
                      id="phone"
                      name="phone"
                      label="Telefone"
                      fullWidth
                      autoComplete="phone"
                      variant="outlined"
                      value={phone}
                      ref={register}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </Grid>
                  <FormGroup row>
                    <FormControlLabel
                      value="start"
                      control={
                        <Checkbox
                          checked={is_admin}
                          onChange={e => setIsAdmin(e.target.checked)}
                          name="isAdmin"
                          color="primary"
                          id="isAdmin" />
                      }
                      label="Administrador"
                      labelPlacement="start"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Button type="submit" variant="contained" color="primary">
                    SALVAR
                  </Button>
                </Grid>
              </Paper>
            </Grid>
          </form>
        </Container>
      </main>
    </div>
  );
}