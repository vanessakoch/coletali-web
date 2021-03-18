import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft } from 'react-icons/fi';
import { useAlert } from 'react-alert';
import api from '../../services/api';
import signupImg from '../../assets/images/signup.svg';

import './styles.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  login: {
    color: 'var(--color-purple-img)',
    textDecoration: 'none',
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const [full_name, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register, handleSubmit } = useForm();
  const alert = useAlert();
  const history = useHistory();

  async function onSubmit() {
    const is_admin = false;

    const user = {
      full_name,
      cpf,
      email,
      phone,
      password,
      is_admin
    }

    if (full_name !== '' && cpf !== '' && email !== '' && password !== '' && phone !== '') {
      const users = await api.get('user');
      const usersFound = users.data.filter(user => user.email === email);

      if (usersFound.length > 0) {
        alert.show('Já existe cadastro com este e-mail', { type: 'error' })
        return
      }

      const response = await api.post('user', user);

      if (response.status === 200) {
        history.push('/login');
        alert.show('Cadastro salvo com sucesso!', { type: 'success' })
      } else {
        alert.show('Erro ao cadastrar usuario', { type: 'error' })
      }
    } else {
      alert.show('Por favor, preencha todos os dados!', { type: 'error' })
    }
  }

  return (
    <div id="page-signup">
      <aside>
        <div>
          <Link
            className="aside-goback"
            to='/app'
          >
            <FiArrowLeft />
            Página inicial
          </Link>
          <img
            src={signupImg}
            alt="Plataforma de Coleta"
            className="background-image"
          />
        </div>
      </aside>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <div className={classes.paper}>
          <Grid align="center">
            <h2>Cadastro de Usuário</h2>
          </Grid>

          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="full_name"
                  name="full_name"
                  variant="outlined"
                  required
                  className={classes.input}
                  ref={register}
                  id="full_name"
                  value={full_name}
                  label="Nome completo"
                  autoFocus
                  onChange={e => setFullName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  className={classes.input}
                  id="cpf"
                  label="CPF"
                  name="cpf"
                  type="number"
                  value={cpf}
                  ref={register}
                  onChange={e => setCpf(e.target.value)}
                  autoComplete="cpf"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  className={classes.input}
                  id="phone"
                  label="Telefone"
                  name="phone"
                  value={phone}
                  type="number"
                  ref={register}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  className={classes.input}
                  id="email"
                  label="E-mail"
                  name="email"
                  type="email"
                  value={email}
                  ref={register}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  className={classes.input}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  ref={register}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <div className="btn-container">
              <button
                type="submit"
                variant="contained"
                color="primary"
                className="submit"
              >
                Cadastrar
              </button>

            </div>
            <Grid container justify="flex-end">
              <Link className={classes.login} to="/login" variant="body2">
                Já possui uma conta? Entrar
              </Link>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}