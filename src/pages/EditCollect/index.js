import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Map, TileLayer, Marker } from "react-leaflet";
import { useAlert } from 'react-alert';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';
import axios from 'axios';
import mapIcon from '../../utils/mapIcon';
import Menubar from '../../components/Menubar';
import './styles.css';

export default function EditCollect() {
  const params = useParams();
  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [whatsapp, setWhatsapp] = useState([]);
  const [number, setNumber] = useState([]);
  const [addressId, setAddressId] = useState([]);

  const [items, setItems] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);
  const [initialPosition, setInitialPosition] = useState([0, 0]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState([0, 0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const alert = useAlert();
  const history = useHistory();

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

  useEffect(() => {
    async function getCollect() {
      const response = await api.get(`/collect/${params.id}`);

      setName(response.data.collect.name);
      setEmail(response.data.collect.email);
      setWhatsapp(response.data.collect.whatsapp);
      setNumber(response.data.collect.number);
      setSelectedCity(response.data.collect.city);
      setSelectedUf(response.data.collect.uf);
      setAddressId(response.data.collect.address_id);
      setSelectedFile(response.data.collect.image_url);
      setSelectedItems(response.data.items.map(item => item.id));
      setInitialPosition([response.data.collect.latitude, response.data.collect.longitude]);
    }
    getCollect();
  }, [params.id]);

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

  function handleSelectedItem(id) {
    const selected = selectedItems.findIndex(item => item === id);

    if (selected >= 0) {
      const filtered = selectedItems.filter(item => item !== id);
      setSelectedItems(filtered);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

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

    await api.put(`address/edit/${addressId}`, dataAddress)

    const dataPoint = new FormData();

    dataPoint.append('name', name);
    dataPoint.append('email', email);
    dataPoint.append('whatsapp', whatsapp);
    dataPoint.append('items', items.join(','));

    if (selectedFile) {
      dataPoint.append('image', selectedFile);
    }

    const response = await api.put(`collect/edit/${params.id}`, dataPoint);

    if (response.status === 200) {
      history.push('/point/list');
      alert.show('Salvo com sucesso!', { type: 'success' })
    } else {
      alert.show('Erro ao editar ponto de coleta', { type: 'error' })
    }
  }

  return (
    <div id="page-create-point">
      <Menubar />
      <form onSubmit={handleSubmit}>
        <h1>
          Editar ponto de coleta
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
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione novamente a localização no mapa</span>
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
                value={number}
                onChange={e => setNumber(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select
                name="uf"
                id="uf"
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
              <h2>Caso queira alterar a foto, clique abaixo.</h2>
            </legend>
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
              return null;
            })}
          </ul>
        </fieldset>

        <button type="submit">SALVAR</button>

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