import * as React from "react"
import {useDispatch, useSelector} from "react-redux"
import {Table} from "antd";
import {useEffect, useState} from "react";
import {loadTelemetryByDeviceId} from "../../actions/telemetry";
import {isEmpty, find, get} from "lodash";

const DeviceTableCard = (props) => {
  const dispatch = useDispatch()
  const [columns, setColumns] = useState([])
  const [dataArray, setDataArray] = useState([])

  const {dataSources} = props
  const {latestTelemetries} = useSelector((state) => state.telemetries)
  const {devices} = useSelector((state) => state.devices)

  const deviceIds = dataSources && Object.keys(dataSources)

  useEffect(() => {
    deviceIds.forEach(async (deviceId) => {
      await dispatch(loadTelemetryByDeviceId(deviceId))
    })
  }, [])

  useEffect(() => {
    const totalLatestTelemetry = []
    const totalUniqueKeys = [
      {
        title: "Device Name",
        dataIndex: "deviceName"
      }
    ]

    !isEmpty(latestTelemetries) &&
    !isEmpty(deviceIds) &&
    deviceIds.forEach((deviceId) => {
      // Gather uniqueKeys from devices
      const uniqueKeys = dataSources[deviceId]
      const deviceInfo = find(devices, {id: deviceId})
      const telemetryRow = {
        deviceName: get(deviceInfo, 'name')
      };

      const deviceLatestTelemetries = latestTelemetries[deviceId]
      !isEmpty(uniqueKeys) &&
      uniqueKeys.forEach((uk) => {
        const uniqueKeyTitles = totalUniqueKeys.map(k => k.title)
        !uniqueKeyTitles.includes(uk) && totalUniqueKeys.push({
          title: uk,
          dataIndex: uk
        })

        deviceLatestTelemetries.forEach((t) => {
          if (t.key === uk){
            telemetryRow[uk] = t.value + ""
          }
        })
      })
      totalLatestTelemetry.push(telemetryRow)
    })

    setColumns(totalUniqueKeys)
    setDataArray(totalLatestTelemetry)
  }, [latestTelemetries])

  return (
      <Table
          columns={columns || []}
          dataSource={dataArray || []}
          scroll={{x: 768}}
      />
  )
}

export default DeviceTableCard
