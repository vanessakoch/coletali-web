import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Grid, Typography, TextField, Container } from '@material-ui/core';
import { FiLogIn } from 'react-icons/fi';
import { login, logout } from "../../services/auth";
import { FiArrowLeft } from 'react-icons/fi';
import { useAlert } from 'react-alert';
import api from "../../services/api";
import signinImg from '../../assets/images/signup.svg';

import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const alert = useAlert();
  const history = useHistory();

  const isMounted = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    }
  }, []);

  function handleEmail(event) {
    const email = event.target.value
    setEmail(email);
  }

  function handlePassword(event) {
    const password = event.target.value
    setPassword(password);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      alert.show('Preencha todos os campos ', {type: 'error'})
    } else {
      try {
        const base = btoa(email + ":" + password);

        let getUser = await api.get('/login', {
          headers: {
            'authorization': `Basic ${base}`
          }
        })
          .then(response => {
            return {
              token: response.data.token,
              is_admin: response.data.user.is_admin
            }
          })
          .catch(err => {
            return
          })

        if (getUser) {
          login(getUser);
          history.push('/app');
          alert.show('Seja bem vindo(a) ', {type: 'success'})
        } else {
          alert.show('E-mail e senha incorretos ', {type: 'error'})
        }

      } catch (err) {
        setErrorMessage("Houve um problema com o login, verifique suas credenciais.")
        logout()
      }
    }
  };

  return (
    <div id="page-login">
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
            src={signinImg}
            alt="Plataforma de Coleta"
            className="background-image"
          />
        </div>
      </aside>
      <Container component="main" maxWidth="xs">
        <Grid align="center">
          <h2 className="title-login">Login</h2>
        </Grid>

        {!!errorMessage && <p>{errorMessage}</p>}

        <div className="txt-field-form">
          <TextField
            id="txtEmail"
            label="E-mail"
            type="email"
            variant="outlined"
            value={email.value}
            onChange={handleEmail}
            error={!!email.error}
            fullWidth
            required
          />
          <TextField
            id="txtSenha"
            label="Senha"
            type="password"
            variant="outlined"
            value={password.value}
            onChange={handlePassword}
            error={!!password.error}
            fullWidth
            required
          />
        </div>

        <div className="btn-container">
          <button onClick={handleSubmit} className="submit">
            <FiLogIn size={26} />
            <span>Acessar</span>
          </button>
        </div>

        <Typography>
          <Link className="link-account" to="/signup" >
            Você não tem uma conta ? Criar
            </Link>
        </Typography>

      </Container>
    </div>
  );
}

export default Login;