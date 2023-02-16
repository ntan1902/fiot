import {Marker, Popup} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster/src/react-leaflet-markercluster";
import * as React from "react";

const DeviceMarkers = (props) => {
  const {markers} = props
  return (
      <>

        <MarkerClusterGroup>
          {
            markers.map((marker, index) =>
                <Marker key={index} position={[marker.latitude, marker.longitude]}>
                  <Popup>
                    <ul>

                      {
                        Object.entries(marker)
                            .map(([key, value]) => <li><b>{key}</b>: {"" + value}</li>)
                      }

                    </ul>
                  </Popup>
                </Marker>
            )
          }
        </MarkerClusterGroup>
      </>
  )
}

export default DeviceMarkers;