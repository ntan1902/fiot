import React, {useState} from "react"
import {Form, Input, message, Modal, Tooltip, Button, Divider, Popconfirm, Table, Card, Checkbox} from "antd"
import constant from "../../helpers/constants"
import {SimulatorDeviceService} from "../../services"
import {useDispatch} from "react-redux"
import {createSimulatorDevice} from "../../actions/simulatorDevices"
import CreateDataSources from "./CreateDataSources"

const styleButton = {
  style: {borderRadius: "5px"},
  size: "large",
}

const CreateSimulatorDeviceModal = (props) => {
  const {openCreateSimulatorDevice, setOpenCreateSimulatorDevice} = props

  const {getFieldDecorator} = props.form

  const [openCreateDataSources, setOpenCreateDataSources] = useState(false)
  const [dataSources, setDataSources] = useState([])
  const [curDataSource, setCurDataSource] = useState("{}") 
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) => text.toUpperCase()
    },
    {
      title: "Value",
      dataIndex: "value",
      sorter: (a, b) => a.value - b.value,
      render: (text) => text + ""
    },
    {
      title: "Auto generate",
      dataIndex: "autoGenerate",
      render: (text) => text + ""
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
          const newDevice = await SimulatorDeviceService.create(requestBody)
          dispatch(createSimulatorDevice(newDevice))
        } catch (e) {
          message.error(e.response.data.message)
          return
        }
        message.success("Create device successfully!")
        props.form.resetFields()
        setOpenCreateSimulatorDevice(false)
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
        isEdit={isEdit}/>
      <Modal
        title={<h2>Create Simulator Device</h2>}
        visible={openCreateSimulatorDevice}
        onOk={handleCreateDeviceSubmit} //submit form here
        okText={"Create"}
        okButtonProps={styleButton}
        onCancel={() => {
          setCurDataSource({})
          setDataSources([])
          setOpenCreateSimulatorDevice(false)
        }}
        width="800px"
        bodyStyle={{ overflowY: "scroll", height: "800px" }}
        cancelButtonProps={styleButton}
        centered={true}
        destroyOnClose={true}
      >
        <Form className="create_simulator_device_form" layout="vertical">
          <Form.Item label="Device token">
            {getFieldDecorator("deviceToken", {
              rules: [
                {
                  required: true,
                  message: "Please input Device token!",
                  whitespace: true,
                },
              ],
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
              initialValue: 5000,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Is Alive">
            {getFieldDecorator("isAlive", {
              initialValue: false,
              valuePropName: "checked"
            })(<Checkbox />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Form.create({name: "create_simulator_device_form"})(CreateSimulatorDeviceModal)
