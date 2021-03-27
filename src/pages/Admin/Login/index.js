import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { login, logout } from "../../../services/auth";
import { useAlert } from 'react-alert';
import api from "../../../services/api";
import authImg from '../../../assets/images/authentication.svg';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '100%'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginAdmin() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const alert = useAlert();
  const history = useHistory();

  function handleEmail(event) {
    const email = event.target.value
    setEmail(email);
  }

  function handlePassword(event) {
    const password = event.target.value
    setPassword(password);
  }

  async function handleSubmit() {
    if (!email || !password) {
      alert.show('Preencha e-mail e senha para continuar', { type: 'error' })
    } else {
      try {
        const base = btoa(email + ":" + password);

        let getUser = await api.get('/login', {
          headers: {
            'authorization': `Basic ${base}`
          }
        })
          .then(response => {
            if (response.data.user.is_admin === 1) {
              return {
                token: response.data.token,
                is_admin: response.data.user.is_admin
              }
            } else {
              return
            }
          })
          .catch(err => {
            return
          })

        if (getUser) {
          login(getUser);
          history.push('admin/dashboard');
          alert.show('Seja bem vindo(a)!', { type: 'success' })
        } else {
          alert.show('E-mail e senha incorretos', { type: 'error' })
        }

      } catch (err) {
        setErrorMessage("Houve um problema com o login, verifique suas credenciais.")
        logout()
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div>
          <img
            className={classes.avatar}
            src={authImg}
            alt="Imagem de autenticação"
          />
        </div>
        <h2>
          Página administrativa
        </h2>

        {!!errorMessage && <p>{errorMessage}</p>}

        <Container className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email.value}
            onChange={handleEmail}
            error={!!email.error}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password.value}
            onChange={handlePassword}
            error={!!password.error}
            autoComplete="current-password"
          />
          <div className="btn-container">
            <button onClick={handleSubmit} className="submit">
              <FiLogIn size={26} />
              <span>Acessar</span>
            </button>
          </div>
        </Container>
      </div>
      
    </Container>
  );
}