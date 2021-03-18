import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaEnvelopeOpenText } from "react-icons/fa";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";

import "./styles.css";

import Menubar from "../../components/Menubar";
import mapIcon from "../../utils/mapIcon";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function PointDetail() {
  const params = useParams();
  const [point, setPoint] = useState();
  const [items, setItems] = useState([]);
  const [pointType, setPointType] = useState([]);

  useEffect(() => {
    async function getType() {
      setPointType(window.location.pathname.split('/')[1])

      const response = await api.get(`/${pointType}/${params.id}`);
      if (pointType === 'collect')
        setPoint(response.data.collect);
      else {
        setPoint(response.data.donate);
      }
      setItems(response.data.items);
    }
    getType();
  }, [params.id, pointType]);

  if (!point) {
    return <Loading />
  }

  return (
    <div id="page-point">
      <Menubar />

      <main>
        <div className="point-details">
          <div className="image">
            <img
              src={point.image_url}
              alt={point.name}
            />
          </div>

          <div className="point-details-content">
            <h1>{point.name}</h1>

            <h2>Itens de coleta</h2>

            <div className="box-items">
              {items.map(item =>
                <div key={item.id} className="items">
                  <h4>{item.title}</h4>
                  <p>{item.information === null ? '' : item.information}</p>
                </div>
              )}
            </div>

            <h2>Localização</h2>

            <div>

              <div className="location">
                <p>{point.city} - {point.uf}, Número {point.number}</p>
              </div>

              <div className="map-container">
                
                <Map
                  center={[point.latitude, point.longitude]}
                  zoom={16}
                  style={{ width: "100%", height: 280 }}
                  dragging={false}
                  touchZoom={false}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  name="map"
                >

                  <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                  />

                  <Marker
                    interactive={false}
                    icon={mapIcon}
                    position={[point.latitude, point.longitude]}
                  />

                </Map>

                <footer>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`}
                  >
                    Ver a rota no Google Maps
                    </a>
                </footer>

              </div>
            </div>

            <h2>Contato</h2>

            <div className="contact-container">
              <a 
                href={`https://web.whatsapp.com/send?phone=55${point.whatsapp}&text=Olá, tudo bem? Gostaria de mais informações sobre o ponto de coleta.`} 
                target="_blank" rel="noreferrer"
              >
                <FaWhatsapp size={20} color="#FFF" />
                WhatsApp
              </a>

                <a 
                  href={`mailto:${point.email}`} 
                  target="_blank" rel="noreferrer"
                >
                  <FaEnvelopeOpenText size={20} color="#FFF" />
                  Enviar e-mail
                </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
