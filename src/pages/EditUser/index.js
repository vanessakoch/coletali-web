import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../services/api';
import Menubar from '../../components/Menubar';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import './styles.css';

export default function EditUser() {
  const params = useParams();
  const [full_name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const alert = useAlert();

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      api.get(`/user/${params.id}`).then(response => {
        setName(response.data.user.full_name);
        setCpf(response.data.user.cpf);
        setEmail(response.data.user.email);
        setPassword(response.data.user.password);
        setPhone(response.data.user.phone);
      });

    return () => { isMounted = false };
  }, [params.id]);

  async function onSubmit(event) {
    const data = { full_name, cpf, email, password, phone }

    if (full_name !== '' && cpf !== '' && email !== '' && password !== '' && phone !== '') {
      const response = await api.put(`user/edit/${params.id}`, data);

      if (response.status === 200) {
        history.push('/app');
        alert.show('Salvo com sucesso!', { type: 'success' })
      } else {
        alert.show('Erro ao atualizar o usuário', { type: 'error' })
      }
    } else {
      alert.show('Por favor, preencha todos os dados!', { type: 'error' })
    }
  }


  return (
    <div id="page-edit-user">
      <Menubar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>
          Editar perfil
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              required
              type="text"
              name="name"
              id="name"
              value={full_name}
              ref={register}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="cpf">CPF</label>
              <input
                required
                type="number"
                name="cpf"
                id="cpf"
                value={cpf}
                ref={register}
                onChange={e => setCpf(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                required
                type="text"
                name="email"
                id="email"
                value={email}
                ref={register}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                required
                variant="outlined"
                type="password"
                name="password"
                id="password"
                value={password}
                ref={register}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Telefone</label>
              <input
                required
                type="number"
                name="phone"
                id="phone"
                value={phone}
                ref={register}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        <button type="submit">Salvar</button>

        <div className="icon-signature">
          <span>Ícones feitos por
            <a href="http://www.freepik.com/"
              title="Freepik"> Freepik
            </a>
            <span> em </span>
            <a href="https://www.flaticon.com/br/"
              title="Flaticon"> www.flaticon.com
            </a>
          </span>
        </div>

      </form>
    </div>
  );
};

