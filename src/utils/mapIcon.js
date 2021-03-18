import Leaflet from "leaflet";

import mapMarkerImg from "../assets/images/mapIcon.png";

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [48, 58],
  iconAnchor: [12, 55],
  popupAnchor: [110, 20],
});

export default mapIcon;