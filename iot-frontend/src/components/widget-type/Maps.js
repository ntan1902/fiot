import * as React from "react";
import {MapContainer, TileLayer} from 'react-leaflet'

let latitude = 10.747180;
let longitude = 106.647730;

const DeviceMaps = (props) => {
  return (
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={true}
                    attributionControl={false}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
  );
};


export default DeviceMaps;
