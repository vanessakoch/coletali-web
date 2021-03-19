import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from "react-leaflet";
import { TOKEN_KEY } from './../../services/auth';
import { useAlert } from 'react-alert';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';
import axios from 'axios';
import mapIcon from '../../utils/mapIcon';
import Menubar from '../../components/Menubar';
import { useForm } from 'react-hook-form';

import './styles.css';

function CreatePoint() {
  const [user, setUser] = useState([]);
  const [items, setItems] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);
  const [initialPosition, setInitialPosition] = useState([0, 0]);
  const [isDonationPoint, setDonationPoint] = useState(true);
  const { register, handleSubmit } = useForm();

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState([0, 0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    number: '',
  })
  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    async function getUser() {
      const config = {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem(TOKEN_KEY)
        }
      }

      await api.get('/me', { ...config }).then(userId => {
        setUser(userId.data[0])
      })
    }

    getUser()
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    })
  }, [])

  useEffect(() => {
    async function loadItems() {
      const response = await api.get('items');
      setItems(response.data);
    }
    loadItems();
  }, []);

  useEffect(() => {
    async function loadUfs() {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const uf = response.data.map(uf => uf.sigla)
      setUfs(uf);
    }
    loadUfs();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (selectedUf === '0') {
        return;
      }

      const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`);
      const city = response.data.map(city => city.nome)
      setCities(city);
    }

    loadCities();
  }, [selectedUf]);

  function handleSelectedUf(event) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectedCity(event) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value })
  }

  function handleSelectedItem(id) {
    const selected = selectedItems.findIndex(item => item === id);

    if (selected >= 0) {
      const filtered = selectedItems.filter(item => item !== id);
      setSelectedItems(filtered);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function onSubmit(event) {
    const { name, email, whatsapp, number } = inputData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const dataAddress = {
      number,
      uf,
      city,
      latitude,
      longitude
    };

    let newAddress = await api.post('address', dataAddress)
    console.log(newAddress)
    if(!newAddress.data.id) {
      alert.show('Verifique seus dados', { type: 'error' })
      return new Error();
    }

    let id_address = newAddress.data.id

    const dataPoint = new FormData();

    if (name !== '' && email !== '' && whatsapp !== '' && items.length !== 0 && selectedFile !== undefined) {
      dataPoint.append('name', name);
      dataPoint.append('email', email);
      dataPoint.append('whatsapp', whatsapp);
      dataPoint.append('items', items.join(','));
      dataPoint.append('user_id', user.id);
      dataPoint.append('address_id', Number(id_address))

      if (selectedFile) {
        dataPoint.append('image', selectedFile);
      }

      let response;

      if (isDonationPoint) {
        response = await api.post('donate', dataPoint)
      } else {
        response = await api.post('collect', dataPoint)
      }

      if (response.status === 200) {
        history.push('/app');
        alert.show('Ponto de coleta criado com sucesso!', { type: 'success' })
      } else {
        alert.show('Erro durante o cadastro, tente novamente', { type: 'error' })
      }
    } else {
      alert.show('Verifique os dados digitados', { type: 'error' })
    }

  }

  return (
    <div id="page-create-point">
      <Menubar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>
          Cadastro do ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              ref={register}
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                ref={register}
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="number"
                name="whatsapp"
                id="whatsapp"
                ref={register}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={initialPosition}
            style={{ width: "100%", height: 280 }}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
            />

            <Marker
              interactive={false}
              icon={mapIcon}
              position={selectedPosition}
            />
          </Map>

          <div className="field-group">

            <div className="field">
              <label htmlFor="number">Número</label>
              <input
                type="number"
                name="number"
                id="number"
                ref={register}
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select
                name="uf"
                id="uf"
                ref={register}
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value="0">Selecione</option>

                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                ref={register}
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0">Selecione</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="input-block">
            <legend>
              <h2>Tipo da localização</h2>
            </legend>

            <div className="button-select">
              <button
                type="button"
                className={!isDonationPoint ? "active" : ""}
                onClick={() => setDonationPoint(false)}
              >Coleta
              </button>

              <button type="button"
                className={isDonationPoint ? "active" : ""}
                onClick={() => setDonationPoint(true)}
              >Doação
              </button>
            </div>
          </div>
        </fieldset>

        <Dropzone onFileUpload={setSelectedFile} />

        <fieldset>

          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => {
              if (isDonationPoint) {
                if (item.isDonationItem) {
                  return <li
                    key={item.id}
                    onClick={() => handleSelectedItem(item.id)}
                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                  >
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>
                }
              } else {
                if (!item.isDonationItem) {
                  return <li
                    key={item.id}
                    onClick={() => handleSelectedItem(item.id)}
                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                  >
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>
                }
              }
              return null;
            })}
          </ul>

        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>

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

export default CreatePoint;