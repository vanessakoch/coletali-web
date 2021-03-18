/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, Paper, TextField } from '@material-ui/core';
import { useForm } from "react-hook-form";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import MenuAdmin from '../../../components/MenuAdmin/menu-admin';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import api from '../../../services/api';
import Dropzone from '../../../components/Dropzone';

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
  titleItem: {
    textAlign: 'center',
    marginTop: '50px'
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    marginTop: '10px',
    marginBottom: '50px',
  }
}));

export default function InsertCollect() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [number, setNumber] = useState('');
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const { register, handleSubmit } = useForm();
  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    api.get('items').then(response => {
      if (isMounted)
        setItems(response.data);
    })

    return () => { isMounted = false }
  }, []);

  const handleSelectedItems = (value) => () => {
    const currentIndex = selectedItems.indexOf(value);
    const newChecked = [...selectedItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedItems(newChecked);
  };

  async function onSubmit(event) {
    const items = selectedItems;
    const user_id = 1;

    const dataAddress = {
      number,
      uf,
      city,
      latitude,
      longitude
    };

    if (number !== '' && uf !== '' && city !== '' && latitude !== '' && longitude !== '') {
      let newAddress = api.post('address', dataAddress)
        .then(response => {
          return response.data.id
        })

      let id_address = await newAddress;

      const dataPoint = new FormData();

      dataPoint.append('name', name);
      dataPoint.append('email', email);
      dataPoint.append('whatsapp', whatsapp);
      dataPoint.append('items', items.join(','));
      dataPoint.append('user_id', user_id);
      dataPoint.append('address_id', id_address)

      if (selectedFile) {
        dataPoint.append('image', selectedFile);
      }

      if (name !== '' && email !== '' && whatsapp !== '' && items !== '' && user_id !== '' && selectedFile !== null) {
        const response = await api.post('collect', dataPoint);

        if (response.status === 200) {
          history.push('/admin/collect');
          alert.show('Salvo com sucesso!', { type: 'success' })
        } else {
          alert.show('Erro ao cadastrar ponto de coleta', { type: 'error' })
        }
      } else {
        alert.show('Por favor, preencha todos os dados do ponto de coleta', { type: 'error' })
      }
    } else {
      alert.show('Por favor, preencha todos os dados', { type: 'error' })
    }
  }

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Pontos de coleta'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Paper className={classes.paper}>
                  <Grid container spacing={3}>
                    <h2>Cadastrar ponto de coleta</h2>

                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="name"
                        name="name"
                        label="Nome"
                        fullWidth
                        autoComplete="name"
                        variant="outlined"
                        value={name}
                        ref={register}
                        onChange={e => setName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                        id="whatsapp"
                        type="number"
                        name="whatsapp"
                        label="WhatsApp"
                        fullWidth
                        autoComplete="whatsapp"
                        variant="outlined"
                        value={whatsapp}
                        ref={register}
                        onChange={e => setWhatsapp(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        type="number"
                        id="number"
                        name="number"
                        label="Número"
                        fullWidth
                        variant="outlined"
                        value={number}
                        ref={register}
                        onChange={e => setNumber(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="city"
                        name="city"
                        label="Cidade"
                        fullWidth
                        autoComplete="city"
                        variant="outlined"
                        value={city}
                        ref={register}
                        onChange={e => setCity(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="uf"
                        name="uf"
                        label="Estado"
                        fullWidth
                        variant="outlined"
                        value={uf}
                        ref={register}
                        onChange={e => setUf(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="latitude"
                        name="latitude"
                        label="Latitude"
                        fullWidth
                        variant="outlined"
                        value={latitude}
                        ref={register}
                        onChange={e => setLatitude(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="longitude"
                        name="longitude"
                        label="Longitude"
                        fullWidth
                        variant="outlined"
                        value={longitude}
                        ref={register}
                        onChange={e => setLongitude(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Dropzone
                        onFileUpload={setSelectedFile}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <h2 className={classes.titleItem}>Selecione os itens de coleta</h2>
                    <List className={classes.list}>

                      {items.map(value => {
                        if (!value.isDonationItem) {
                          const labelId = `checkbox-list-label-${value.id}`;

                          return (
                            <ListItem key={value.id} role={undefined} dense button
                              onClick={handleSelectedItems(value.id)}>
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={selectedItems.indexOf(value.id) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={value.title} />
                            </ListItem>
                          )
                        };
                      })}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button variant="contained" color="primary" type="submit">
                      SALVAR
                    </Button>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </form>
        </Container>
      </main>
    </div>
  );
}