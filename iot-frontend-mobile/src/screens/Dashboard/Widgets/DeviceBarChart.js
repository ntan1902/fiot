import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { loadTelemetryByDeviceId } from '../../../actions/telemetry'
import { groupBy, find, get, isEmpty } from 'lodash'
import { VictoryChart, VictoryBar } from 'victory-native'

const data = []

const DeviceBarChart = (props) => {
  const dispatch = useDispatch()
  const { dataSources } = props
  const { telemetries } = useSelector((state) => state.telemetries)
  const {
    openedDashboard: { isOpen },
  } = useSelector((state) => state.dashboards)
  const { devices } = useSelector((state) => state.devices)
  const deviceIds = dataSources && Object.keys(dataSources)
  const [keys, setKeys] = useState([])
  const [finishLoadingTelemetry, setFinishLoadingTelemetry] = useState(false)

  useEffect(() => {
    deviceIds.forEach(async (deviceId) => {
      await dispatch(loadTelemetryByDeviceId(deviceId))
    })
    setFinishLoadingTelemetry(true)
  }, [])
  useEffect(() => {
    if (isOpen && finishLoadingTelemetry) {
      const totalTelemetries = []
      const totalUniqueKeys = []

      !isEmpty(telemetries) &&
        !isEmpty(deviceIds) &&
        deviceIds.forEach((deviceId) => {
          // Gather uniqueKeys from devices
          const uniqueKeys = dataSources[deviceId]
          !isEmpty(uniqueKeys) &&
            uniqueKeys.forEach((uk) => {
              const deviceInfo = find(devices, { id: deviceId })
              const combineKey = `${get(deviceInfo, 'name')}:${uk}`
              totalUniqueKeys.push(combineKey)
            })

          // Gather ts from devices
          const data = get(telemetries, deviceId, null)
          if (data) {
            totalTelemetries.push(...get(telemetries, deviceId))
          }
        })

      setKeys(totalUniqueKeys)

      const groupedTsArray = groupBy(totalTelemetries, 'ts')
      const sortedGroupTsArray = Object.keys(groupedTsArray)
        .sort()
        .reduce(
          (newGroup, currentTs) => (
            (newGroup[currentTs] = groupedTsArray[currentTs]), newGroup
          ),
          {}
        )
      for (const [key, value] of Object.entries(sortedGroupTsArray)) {
        const kv = {
          ts: moment(parseInt(key)).format('HH:mm:ss'),
        }
        value.forEach((v) => {
          const deviceInfo = find(devices, { id: v.entityId })
          const combineKey = `${get(deviceInfo, 'name')}:${v.key}`
          if (totalUniqueKeys.includes(combineKey)) {
            kv[combineKey] = v.value
          }
        })

        data.push(kv)
        if (data.length > totalTelemetries?.length || data.length > 30) {
          data.shift()
        }
      }
    }
  }, [telemetries])

  console.log('BarChart data', data);

  return (
    <>
      {keys.length > 0 && (
        <VictoryChart>
          <VictoryBar
            style={{
              data: { stroke: '#c43a31' },
              parent: { border: '1px solid #ccc' },
            }}
            data={[...data]}
            x="ts"
            y={keys}
          />
        </VictoryChart>
      )}
    </>
  )
}

export default DeviceBarChart
