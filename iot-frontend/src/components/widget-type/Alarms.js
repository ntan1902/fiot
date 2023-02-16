import moment from "moment"
import {Table, Tag} from "antd"
import React from "react"

const colorSeverity = {
  CRITICAL: "red",
  MAJOR: "volcano",
  MINOR: "orange",
  WARNING: "gold",
  INDETERMINATE: "#f50",
}

const valueSeverity = {
  WARNING: 1,
  MINOR: 2,
  MAJOR: 3,
  CRITICAL: 4,
  INDETERMINATE: 5,
}

const DeviceAlarm = (props) => {
  const alarms = [
    {
      key: 0,
      createdAt: Date.now(),
      name: "Device's temperature is too high",
      severity: "WARNING",
      detail: "Device Light's temperature is over 100 °C",
    },
    {
      key: 1,
      createdAt: Date.now(),
      name: "Device's temperature is too high",
      severity: "MINOR",
      detail: "Device Light's temperature is over 100 °C",
    },
    {
      key: 2,
      createdAt: Date.now(),
      name: "Device's temperature is too high",
      severity: "MAJOR",
      detail: "Device Light's temperature is over 100 °C",
    },
    {
      key: 3,
      createdAt: Date.now(),
      name: "Device's temperature is too high",
      severity: "CRITICAL",
      detail: "Device Light's temperature is over 100 °C",
    },
    {
      key: 4,
      createdAt: Date.now(),
      name: "Device's temperature is too high",
      severity: "INDETERMINATE",
      detail: "Device Light's temperature is over 100 °C",
    },
  ]

  let dataArray = alarms.map((alarm, index) => {
    return {
      key: index,
      createdAt: alarm.createdAt,
      name: alarm.name,
      severity: alarm.severity,
      detail: alarm.detail,
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
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      sorter: (a, b) => valueSeverity[a.severity] - valueSeverity[b.severity],
      render: (severity) => (
        <Tag color={colorSeverity[severity]} key={severity}>
          {severity}
        </Tag>
      ),
    },
    {
      title: "Detail",
      dataIndex: "detail",
    },
  ]

  return (
    <div className="custom-table">
      <Table columns={columns} dataSource={dataArray} />
    </div>
  )
}

export default DeviceAlarm
