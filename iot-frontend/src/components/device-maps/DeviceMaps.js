import * as React from "react";
import {MapContainer, TileLayer} from 'react-leaflet'
import DeviceMarkers from "./DeviceMarkers";
import {useEffect, useState} from "react";
import {uniqBy} from "lodash";
import {useSelector} from "react-redux";


// HCM
//let DEFAULT_LATITUDE = 10.747180;
//let DEFAULT_LONGITUDE = 106.647730;

// HN
let DEFAULT_LATITUDE = 21.042818001881113;
let DEFAULT_LONGITUDE = 105.82232502410294;

const DeviceMaps = (props) => {
  const {dataSources} = props
  const [markers, setMarkers] = useState([])

  const {latestTelemetries} = useSelector((state) => state.telemetries);

  useEffect(() => {

    const deviceIds = dataSources && Object.keys(dataSources)
    const markerList = []

    for (let deviceId of deviceIds) {
      const uniqueKvs = uniqBy(latestTelemetries[deviceId], "key");
      const marker = {
        latitude: null,
        longitude: null
      }

      for (const {key, value} of uniqueKvs) {
        marker[key] = value
      }

      if (marker.latitude !== null && marker.longitude != null) {
        markerList.push(marker)
      }
    }

    if (markerList.length > 0) {
      setMarkers(markerList)
    }
  }, [dataSources, latestTelemetries])

  return (
      <MapContainer center={[DEFAULT_LATITUDE, DEFAULT_LONGITUDE]} zoom={13}
                    scrollWheelZoom={true}
                    attributionControl={false}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DeviceMarkers markers={markers}/>
      </MapContainer>
  );
};


export default DeviceMaps;
