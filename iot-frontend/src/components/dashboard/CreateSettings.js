import React from "react"
import {Form, Input, Select} from "antd"
import {useSelector} from "react-redux"

const {Option} = Select

const CreateSettings = (props) => {
  const {setSettings} = props
  const {getFieldDecorator} = props.form

  const {devices} = useSelector((state) => state.devices)

  const handleSelectDevice = (deviceId) => {
    setSettings({
      deviceId: deviceId
    })
  }

  return (
      <>

        <Form.Item label="Device name">
          {getFieldDecorator(`deviceName`, {
            rules: [
              {
                required: true,
                message: "Please input device name!",
              },
            ],
          })(
              <Select
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

        <Form.Item label="RPC get value method">
          {getFieldDecorator(`getMethod`, {
            initialValue: "getValue",
            rules: [
              {
                required: true,
                message: "Please input get value method!",
              },
            ],
          })(
              <Input width={100}/>
          )}
        </Form.Item>

        <Form.Item label="RPC set value method">
          {getFieldDecorator(`setMethod`, {
            initialValue: "setValue",
            rules: [
              {
                required: true,
                message: "Please input set value method!",
              },
            ],
          })(
              <Input/>
          )}
        </Form.Item>

        <Form.Item label="RPC request interval (ms)" help="Polling interval (ms) to get persistent RPC command response">
          {getFieldDecorator(`rpcRequestInterval`, {
            initialValue: 2500,
            rules: [
              {
                required: true,
                message: "Please input rpc request interval!",
              },
            ],
          })(
              <Input/>
          )}
        </Form.Item>
      </>
  )
}

export default CreateSettings
