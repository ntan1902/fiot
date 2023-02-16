import React, {useEffect, useState} from "react"
import {Table, Checkbox, Modal} from "antd"
import DeviceService from "../../services/device"
import moment from "moment"
import {isArray} from "lodash"

const DeviceListTable = (props) => {
  const {deviceId, openGatewayDevices, setOpenGatewayDevices} = props
  const [devices, setDevices] = useState([])

  useEffect(async () => {
    if (deviceId) {
      const devices = await DeviceService.getGatewayDevices(deviceId)
      setDevices(devices)
    }
  }, [openGatewayDevices])

  const dataArray =
    isArray(devices) &&
    devices.map((device, index) => {
      return {
        key: index,
        id: device.id,
        createdAt: device.createdAt,
        name: device.name,
        label: device.label,
        isGateway: device.isGateway,
      }
    })

  const columns = [
    {
      title: "Created time",
      dataIndex: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text,
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      render: (text) => text,
    },
    {
      title: "Is Gateway",
      dataIndex: "isGateway",
      key: "isGateway",
      render: (value) => <Checkbox checked={value} disabled={true}></Checkbox>,
    },
  ]

  return (
    <Modal
      title={<h2>Gateway Devices</h2>}
      visible={openGatewayDevices}
      onCancel={() => setOpenGatewayDevices(false)}
      centered={true}
      footer={null}
      width={800}
    >
      <div className="custom-table">
        <Table columns={columns} dataSource={dataArray} />
      </div>
    </Modal>
  )
}

export default DeviceListTable
