import React, {useEffect} from "react"
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useSelector, useDispatch} from "react-redux"
import moment from "moment"
import {groupBy, sortBy, uniq, get, find} from "lodash"
import {loadTelemetryByDeviceId} from "../../actions/telemetry"

const barColors = ["blue", "red", "green", "black", "yellow", "cyan", "grey", "purple"]
const data = []

const DeviceBarChart = (props) => {
  const dispatch = useDispatch()

  const {dataSources} = props
  const {telemetries} = useSelector((state) => state.telemetries)
  const {devices} = useSelector((state) => state.devices)

  const deviceIds = dataSources && Object.keys(dataSources)
  const finalData = []
  const finalUniqueKeys = []

  useEffect(() => {
    deviceIds.forEach(async (deviceId) => {
      await dispatch(loadTelemetryByDeviceId(deviceId))
    })
  }, [])

  deviceIds.forEach((deviceId) => {
    const uniqueKeys = uniq(dataSources[deviceId])
    const deviceInfo = find(devices, {id: deviceId})
    const deviceName = get(deviceInfo, "name")
    const combineKeys = uniqueKeys.map((k) => {
      return `${deviceName}:${k}`
    })
    finalUniqueKeys.push(...combineKeys)
    const groupedTsArray = groupBy(sortBy(telemetries[deviceId], "ts"), "ts")

    for (const [key, value] of Object.entries(groupedTsArray)) {
      const kv = {
        ts: moment(parseInt(key)).format("HH:mm:ss"),
      }

      value.forEach((v) => {
        if (uniqueKeys.includes(v.key)) {
          const combineKey = `${deviceName}:${v.key}`
          kv[combineKey] = v.value
        }
      })

      data.push(kv)

      if (data.length > telemetries[deviceId].length || data.length > 30) {
        data.shift()
      }
    }
    finalData.push(...data)
  })

  return (
    <>
      {finalUniqueKeys.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={finalData}
            width={500}
            height={300}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" minTickGap={50} tickLine={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            {finalUniqueKeys.map((k, idx) => (
              <Bar dataKey={k} fill={barColors[idx]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  )
}

export default DeviceBarChart
