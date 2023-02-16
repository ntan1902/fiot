import React, {useEffect, useState} from "react"
import {Form, Input, message, Modal, Tooltip, Button, Divider, Popconfirm, Table, Card, Checkbox} from "antd"
import {SimulatorDeviceService} from "../../services"
import {useDispatch} from "react-redux"
import {updateSimulatorDevice} from "../../actions/simulatorDevices"
import CreateDataSources from "./CreateDataSources"
import {get} from "lodash"

const styleButton = {
  style: {borderRadius: "5px"},
  size: "large",
}

const InfoSimulatorDeviceModal = (props) => {
  const {curSimulatorDevice, openInfoModal, setOpenInfoModal} = props
  const {getFieldDecorator} = props.form

  const [openCreateDataSources, setOpenCreateDataSources] = useState(false)
  const [deviceToken, setDeviceToken] = useState("")
  const [requestInterval, setRequestInterval] = useState(5000)
  const [dataSources, setDataSources] = useState([])
  const [isAlive, setIsAlive] = useState(false)

  const [curDataSource, setCurDataSource] = useState("{}")
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    setDeviceToken(get(curSimulatorDevice, "deviceToken", ""))
    setRequestInterval(get(curSimulatorDevice, "requestInterval", 5000))
    setDataSources(JSON.parse(get(curSimulatorDevice, "dataSources", "[]")))
    setIsAlive(get(curSimulatorDevice, 'isAlive', false))
  }, [openInfoModal])

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Value",
      dataIndex: "value",
      sorter: (a, b) => a.value - b.value,
      render: (text) => text + "",
    },
    {
      title: "Auto generate",
      dataIndex: "autoGenerate",
      render: (text) => text + "",
    },
    {
      title: "Actions",
      render: (record) => (
        <span>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setCurDataSource(record)
                setIsEdit(true)
                setOpenCreateDataSources(true)
              }}
              type="primary"
              shape="circle"
              icon="edit"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure to delete datasource?"
            onConfirm={() => confirmDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="danger" shape="circle" icon="delete" />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    },
  ]

  const confirmDelete = async (key) => {
    const newDatasourceList = dataSources.filter((a) => a.key !== key)
    setDataSources(newDatasourceList)
  }

  const handleOpenCreateDatasource = () => {
    setIsEdit(false)
    setOpenCreateDataSources(true)
  }

  const handleCreateDeviceSubmit = async (e) => {
    e.preventDefault()
    const fields = ["deviceToken", "requestInterval", "isAlive"]

    props.form.validateFields(fields, async (err, values) => {
      if (!err) {
        try {
          const {deviceToken, requestInterval, isAlive} = values
          const requestBody = {
            deviceToken,
            dataSources: JSON.stringify(dataSources),
            requestInterval: Number(requestInterval),
            isAlive: !!isAlive
          }
          const newDevice = await SimulatorDeviceService.update(curSimulatorDevice.id, requestBody)
          dispatch(updateSimulatorDevice(newDevice))
        } catch (e) {
          message.error(e.response.data.message)
          return
        }
        message.success("Save simulator device successfully!")
        props.form.resetFields()
        setOpenInfoModal(false)
      }
    })
  }

  return (
    <>
      <CreateDataSources
        openCreateDataSources={openCreateDataSources}
        setOpenCreateDataSources={setOpenCreateDataSources}
        form={props.form}
        dataSources={dataSources}
        curDataSource={curDataSource}
        setDataSources={setDataSources}
        isEdit={isEdit}
      />
      <Modal
        title={<h2>Edit Simulator Device</h2>}
        visible={openInfoModal}
        onOk={handleCreateDeviceSubmit} //submit form here
        okText={"Save"}
        okButtonProps={styleButton}
        onCancel={() => {
          setCurDataSource({})
          setDataSources([])
          setOpenInfoModal(false)
        }}
        width="800px"
        bodyStyle={{overflowY: "scroll", height: "800px"}}
        cancelButtonProps={styleButton}
        centered={true}
        destroyOnClose={true}
      >
        <Form className="edit_simulator_device_form" layout="vertical">
          <Form.Item label="Device token">
            {getFieldDecorator("deviceToken", {
              rules: [
                {
                  required: true,
                  message: "Please input Device token!",
                  whitespace: true,
                },
              ],
              initialValue: deviceToken,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Datasources">
            <Card
              extra={<Button type="primary" shape="circle" icon="plus" onClick={() => handleOpenCreateDatasource()} />}
            >
              <div className="custom-table">
                <Table columns={columns} dataSource={dataSources} />
              </div>
            </Card>
          </Form.Item>
          <h1 />
          <Form.Item label="Request Interval (ms)">
            {getFieldDecorator("requestInterval", {
              initialValue: requestInterval,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Is Alive">
            {getFieldDecorator("isAlive", {
              initialValue: isAlive,
              valuePropName: "checked",
            })(<Checkbox />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Form.create({name: "edit_simulator_device_form"})(InfoSimulatorDeviceModal)
