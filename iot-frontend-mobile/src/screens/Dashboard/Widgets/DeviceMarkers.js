import { Marker } from 'react-native-maps'

const DeviceMarkers = (props) => {
  const { markers } = props
  console.log("markers: ", markers)
  return (
    <>
      {markers.map((marker, index) => (
        <Marker key={index} coordinate={{latitude: marker?.latitude, longitude: marker?.longitude}} />
      ))}
    </>
  )
}

export default DeviceMarkers
