import React, { useEffect, useState } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiPlus, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { TOKEN_KEY, logout } from './../../services/auth';
import { Link, useHistory } from 'react-router-dom';
import mapIcon from '../../utils/mapIcon';
import api from '../../services/api';

import './styles.css';

function Home() {
  const [user, setUser] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDonationPoint, setDonationPoint] = useState(true);
  const [point, setPoint] = useState([]);
  const [pointType, setPointType] = useState();
  const [initialPosition, setInitialPosition] = useState([0, 0]);

  const history = useHistory();

  useEffect(() => {
    async function getUser() {
      const config = {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem(TOKEN_KEY)
        }
      }
      const response = await api.get('/me', { ...config });
      setUser(response.data[0])
    }
    getUser();
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    })
  }, [])

  useEffect(() => {
    async function getPoints() {
      let response

      if (isDonationPoint) {
        response = await api.get('donate', {
          params: {
            items: selectedItems
          }
        });
        setPointType('donate')
      } else {
        response = await api.get('collect', {
          params: {
            items: selectedItems
          }
        });
        setPointType('collect')
      }
      setPoint(response.data);
    }

    getPoints()
  }, [isDonationPoint, selectedItems])

  useEffect(() => {
    async function getItems() {
      const response = await api.get('items');
      setItems(response.data);
    }
    getItems();
  }, []);

  function handleSelectedItem(id) {
    const selected = selectedItems.findIndex(item => item === id);

    if (selected >= 0) {
      const filtered = selectedItems.filter(item => item !== id);
      setSelectedItems(filtered);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  function handleLogout() {
    logout();
  }

  function handleLogin() {
    history.push('/login');
  }

  function handleList() {
    history.push('/point/list')
  }

  function handleEditUser() {
    history.push(`profile/${user.id}`)
  }

  return (
    <div id="page-map">

      <aside>
        <div className="aside-section">
          <div className="aside-login">
            <Link to='/'>
              <FiArrowLeft />
            </Link>
            {user ? (
              <>
                <p>Olá, {user.full_name}</p>
                <p onClick={handleEditUser}>
                  Editar perfil
                </p>
                <p onClick={handleList}>
                  Meus cadastros
                </p>
                <p onClick={handleLogout}>
                  Sair
                </p>
              </>
            )
              :
              <p onClick={handleLogin}>
                Entrar
              </p>
            }
          </div>
          <h1>Escolha um ponto de coleta no mapa</h1>
        </div>

        <div className="aside-section">
          <p>Busque pelo tipo de ponto</p>

          <div className="input-block">
            <div className="button-select">
              <button
                type="button"
                className={!isDonationPoint ? "btn active" : "btn"}
                onClick={() => setDonationPoint(false)}
              >COLETA
              </button>

              <button type="button"
                className={isDonationPoint ? "btn active" : "btn"}
                onClick={() => setDonationPoint(true)}
              >DOAÇÃO
              </button>
            </div>
          </div>
        </div>

        <div className="aside-section">
          <p>Busque através dos item(s)</p>

          <ul className="items">
            {items.map(item => {
              if (isDonationPoint) {
                if (item.isDonationItem) {
                  return <li
                    key={item.id}
                    onClick={() => handleSelectedItem(item.id)}
                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                  >
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
                    <span>{item.title}</span>
                  </li>
                }
              }
              return null;
            })}
          </ul>
        </div>
      </aside>

      <Map
        center={initialPosition}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {point.map(point => {
          return (
            <Marker
              key={point.id}
              icon={mapIcon}
              position={[point.latitude, point.longitude]}
            >
              <Popup className="map-popup" classButton={false} minWidth={240} maxWidth={240} >
                {point.name}
                {point.class}
                <Link to={`${pointType}/${point.id}`}>
                  <FiArrowRight size={20} color="#FFF" />
                </Link>

              </Popup>
            </Marker>
          )
        })}

      </Map>

      <Link to="/point/create" className="create-collect">
        <FiPlus size="32" color="#fff" />
      </Link>
    </div>
  );
}

export default Home;