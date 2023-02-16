import React, {useEffect, useState} from "react"
import {Col, Form, Row, Select, Tag, Input} from "antd"
import {uniqBy, find, get} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import {loadLatestTelemetryByDeviceId, loadTelemetryByDeviceId} from "../../actions/telemetry"
import {loadAlarmsByDeviceId} from "../../actions/alarms"

const {Option} = Select

const CreateDatasource = (props) => {
  const {getFieldDecorator} = props.form
  const {
    index,
    setTelemetryKeys,
    allowSingleTelemetry,
    allowOnlyDeviceName,
    allowSettings,
  } = props;

  const [deviceId, setDeviceId] = useState(null)
  const [latestTelemetryKeys, setLatestTelemetryKeys] = useState([])

  const dispatch = useDispatch()
  useEffect(() => {
    const loadDevice = async () => {
      if (deviceId) {
        dispatch(loadTelemetryByDeviceId(deviceId))
        dispatch(loadLatestTelemetryByDeviceId(deviceId))
        dispatch(loadAlarmsByDeviceId(deviceId))
      }
    }
    loadDevice()
  }, [deviceId])

  useEffect(() => {
    setTelemetryKeys((telemetryKeys) => {
      telemetryKeys[deviceId] = latestTelemetryKeys

      return telemetryKeys
    })
  }, [latestTelemetryKeys])

  const {devices} = useSelector((state) => state.devices)
  const {latestTelemetries} = useSelector((state) => state.telemetries)
  const selectedDevice = find(devices, {id: deviceId})

  const deviceAttributes = selectedDevice && JSON.parse(get(selectedDevice, "attributes", null))
  const deviceAttributeKeys = deviceAttributes ? deviceAttributes.map((a) => a.key) : []

  const deviceLatestTelemetries = selectedDevice && uniqBy(latestTelemetries[deviceId], "key")
  const deviceLatestTelemetryKeys = deviceLatestTelemetries ? deviceLatestTelemetries.map((t) => t.key) : []
  const dataArray = [...new Set([...deviceAttributeKeys, ...deviceLatestTelemetryKeys])]

  function tagRender(props) {
    const {label, value, closable, onClose} = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{marginRight: 3}}
      >
        {label}
      </Tag>
    )
  }

  const handleSelectDevice = (value) => {
    setDeviceId(value)
    let telemetryKeys = {}
    telemetryKeys[value] = [" "]
    allowOnlyDeviceName && setTelemetryKeys(telemetryKeys)
  }

  return (
    <>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item label="Device name">
            {getFieldDecorator(`deviceName-${index}`, {
              rules: [
                {
                  required: true,
                  message: "Please input device name!",
                },
              ],
            })(
              <Select
                key={index}
                style={{width: 300}}
                onChange={(value) => {
                  handleSelectDevice(value)
                }}
              >
                {devices.map((device) => (
                  <Option value={device.id}>{device.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        {!allowOnlyDeviceName && (
          <Col span={12}>
            <Form.Item label="Device telemetries">
              {getFieldDecorator(`telemetries-${index}`, {
                rules: [
                  {
                    required: true,
                    message: "Please input device telemetries!",
                  },
                ],
              })(
                <Select
                  mode={allowSingleTelemetry ? "default" : "multiple"}
                  showArrow
                  tagRender={tagRender}
                  style={{width: 200}}
                  onSelect={(value) => {
                    setLatestTelemetryKeys((latestTelemetryKeys) => [...latestTelemetryKeys, value])
                  }}
                  onDeselect={(value) => {
                    setLatestTelemetryKeys((latestTelemetryKeys) => latestTelemetryKeys.filter((key) => key !== value))
                  }}
                >
                  {dataArray.map((telemetry) => (
                    <Option value={telemetry}>{telemetry}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        )}
      </Row>
      {allowSettings && (
        <Row>
          <Form>
            <Form.Item label="Datasource MIN Range">
              {getFieldDecorator(`minRange`, {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: "Please input datasource MIN value range",
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Datasource MAX Range">
              {getFieldDecorator(`maxRange`, {
                initialValue: 100,
                rules: [
                  {
                    required: true,
                    message: "Please input datasource MAX value range",
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Datasource unit">
              {getFieldDecorator(`unit`, {
                initialValue: "°C",
                rules: [
                  {
                    required: true,
                    message: "Please input datasource unit",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Row>
      )}
    </>
  )
}

export default CreateDatasource
