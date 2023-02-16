import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'
import RNSpeedometer from 'react-native-speedometer'

const DeviceRadialGauge = (props) => {
  const { dataSources, width, height } = props
  const deviceId = Object.keys(dataSources)[0]
  const { latestTelemetries } = useSelector((state) => state.telemetries)
  const latestTelemetry = {}
  const uniqueKvs = uniqBy(latestTelemetries[deviceId], 'key')

  for (const { key, value } of uniqueKvs) {
    if (key === dataSources[deviceId][0]) {
      latestTelemetry.key = key
      latestTelemetry.value = value
    }
  }

  return (
    <RNSpeedometer
      minValue={-60}
      maxValue={100}
      value={latestTelemetry.value ? latestTelemetry.value : 0}
      labels={[
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#87C6FB',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#B1DAFC',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#D7EDFE',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#FFD5D6',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#FFAAAD',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#FF7C83',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#FF4458',
        },
        {
          name: latestTelemetry.key
            ? latestTelemetry.key.charAt(0).toUpperCase() +
              latestTelemetry.key.slice(1)
            : '',
          labelColor: '#000000',
          activeBarColor: '#FF002A',
        },
      ]}
    />
  )
}

export default DeviceRadialGauge
