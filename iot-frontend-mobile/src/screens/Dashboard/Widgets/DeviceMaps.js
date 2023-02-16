import { useEffect, useState } from 'react'
import { uniqBy } from 'lodash'
import { useSelector } from 'react-redux'
import MapView, { UrlTile } from 'react-native-maps'
import { Dimensions, StyleSheet } from 'react-native'
import DeviceMarkers from './DeviceMarkers'

const DEFAULT_LATITUDE = 10.74718
const DEFAULT_LONGITUDE = 106.64773

const DeviceMaps = (props) => {
  const { dataSources } = props
  const [markers, setMarkers] = useState([])

  const { latestTelemetries } = useSelector((state) => state.telemetries)

  const [region, setRegion] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: 0,
    longitudeDelta: 0,
  })

  useEffect(() => {
    const deviceIds = dataSources && Object.keys(dataSources)
    const markerList = []

    // eslint-disable-next-line no-restricted-syntax
    for (const deviceId of deviceIds) {
      const uniqueKvs = uniqBy(latestTelemetries[deviceId], 'key')
      const marker = {
        latitude: null,
        longitude: null,
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const { key, value } of uniqueKvs) {
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
    <MapView
      initialRegion={region}
      zoom={13}
      scrollWheelZoom
      style={styles.map}
    >
      <UrlTile
        /**
         * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
         * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
         */
        urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        shouldReplaceMapContent
        /**
         * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
         * MKTileOverlay. iOS only.
         */
        maximumZ={19}
        /**
         * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
         * to be used. Its default value is false.
         */
        flipY={false}
      />
      <DeviceMarkers dataSources={dataSources} markers={markers} />
    </MapView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default DeviceMaps
