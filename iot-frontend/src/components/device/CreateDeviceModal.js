import React, {useState} from "react"
import {Cascader, Checkbox, Form, Icon, Input, message, Modal, Tabs, Tooltip, TreeSelect} from "antd"
import constant from "../../helpers/constants"
import {DeviceService} from "../../services"
import {useDispatch, useSelector} from "react-redux"
import {createDevice} from "../../actions/devices"

const {TabPane} = Tabs
const {TextArea} = Input

const credentialsTypes = [
  {
    value: constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN,
    label: "Access token",
  },
  {
    value: constant.DEVICE_CREDENTIALS_TYPE_X_509,
    label: "X.509",
  },
  {
    value: constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC,
    label: "MQTT Basic",
  },
]

const styleButton = {
  style: {borderRadius: "5px"},
  size: "large",
}

const CreateDeviceModal = (props) => {
  const {openCreateDevice, handleOpenCreateDevice} = props
  const {getFieldDecorator} = props.form

  const {ruleChains} = useSelector((state) => state.ruleChains)
  const {tenants} = useSelector((state) => state.tenants)
  const {customers} = useSelector((state) => state.customers)

  const dispatch = useDispatch()

  const [credentialsType, setCredentialsType] = useState(constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN)
  const [assignedTenants, setAssignedTenants] = useState([])
  const [assignedCustomers, setAssignedCustomers] = useState([])
  const [openHeadDomain, setOpenHeadDomain] = useState(false)

  const ruleChainsData = ruleChains.map((rc) => {
    return {
      value: rc.id,
      label: rc.name,
    }
  })

  const tenantsData = tenants.map((t, idx) => {
    return {
      title: t.email,
      value: t.id,
      key: idx,
    }
  })

  const customersData = customers.map((c, idx) => {
    return {
      title: c.email,
      value: c.id,
      key: idx,
    }
  })

  const isTypeAccessToken = credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN
  const isTypeX509 = credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509
  const isTypeMqttBasic = credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC

  const handleCreateDeviceSubmit = async (e) => {
    e.preventDefault()
    const fields = ["name", "label", "ruleChainId", "idleTime", "isHeadCheck", "headDomain", "isGateway"]
    if (isTypeAccessToken) {
      fields.push("accessToken")
    }
    if (isTypeX509) {
      fields.push("RSAPublicKey")
    }
    if (isTypeMqttBasic) {
      fields.push("clientId", "username", "password")
    }

    props.form.validateFields(fields, async (err, values) => {
      if (!err) {
        let credentialsValue = {}
        if (isTypeAccessToken) {
          if (values.accessToken) {
            credentialsValue = {
              accessToken: values.accessToken,
            }
          }
        }

        if (isTypeX509) {
          credentialsValue = {
            RSAPublicKey: values.RSAPublicKey,
          }
        }

        if (isTypeMqttBasic) {
          const {clientId, username, password} = values
          credentialsValue = {
            clientId,
            username,
            password,
          }
        }

        try {
          const {name, label, ruleChainId, idleTime, isHeadCheck, headDomain, isGateway} = values
          const requestBody = {
            name,
            label,
            ruleChainId: ruleChainId ? ruleChainId[0] : undefined,
            credentialsType,
            credentialsValue,
            assignedCustomers,
            assignedTenants,
            idleTime,
            isHeadCheck,
            headDomain,
            isGateway,
          }
          const newDevice = await DeviceService.create(requestBody)
          dispatch(createDevice(newDevice))
        } catch (e) {
          message.error(e.response.data.message)
          return
        }
        message.success("Create device successfully!")
        props.form.resetFields()
        handleOpenCreateDevice(false)
      }
    })
  }

  const handleSelectCredentialsType = (type) => {
    setCredentialsType(type[0])
  }

  const onAssignTenant = (value) => {
    setAssignedTenants(value)
  }

  const onAssignCustomer = (value) => {
    setAssignedCustomers(value)
  }

  //Props for TreeSelect
  const tenantTreeProps = {
    treeData: tenantsData,
    value: assignedTenants,
    onChange: onAssignTenant,
    searchPlaceholder: "Assign tenant to this device",
    style: {
      width: "100%",
    },
    dropdownStyle: {maxHeight: 220, overflow: "auto"},
    allowClear: true,
    multiple: true,
    size: "large",
  }

  const customerTreeProps = {
    treeData: customersData,
    value: assignedCustomers,
    onChange: onAssignCustomer,
    searchPlaceholder: "Assign customer to this device",
    style: {
      width: "100%",
    },
    dropdownStyle: {maxHeight: 220, overflow: "auto"},
    allowClear: true,
    multiple: true,
    size: "large",
  }

  return (
    <Modal
      title={<h2>Create Device</h2>}
      visible={openCreateDevice}
      onOk={handleCreateDeviceSubmit} //submit form here
      okText={"Create"}
      okButtonProps={styleButton}
      onCancel={() => {
        handleOpenCreateDevice(false)
        setOpenHeadDomain(false)
      }}
      cancelButtonProps={styleButton}
      centered={true}
      destroyOnClose={true}
    >
      <Form className="create_device_form" layout="vertical">
        <Tabs defaultActiveKey="1">
          <TabPane tab="1. Device Details" key="1">
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input device name!",
                    whitespace: true,
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Label">{getFieldDecorator("label", {})(<Input />)}</Form.Item>

            <Form.Item label="Rule Chain">
              {getFieldDecorator("ruleChainId", {})(<Cascader options={ruleChainsData} />)}
            </Form.Item>

            <Form.Item label="Idle live time (ms)">
              {getFieldDecorator("idleTime", {
                initialValue: 3000,
              })(<Input />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("isHeadCheck", {
                initialValue: false,
                valuePropName: "checked",
              })(<Checkbox onChange={(e) => setOpenHeadDomain(e.target.checked)}>Use HEAD HTTP Check</Checkbox>)}
            </Form.Item>

            {openHeadDomain && (
              <Form.Item label="HEAD Domain">
                {getFieldDecorator("headDomain", {
                  rules: [
                    {
                      message: "Please input HEAD domain!",
                      whitespace: true,
                    },
                  ],
                  initialValue: "",
                })(<Input />)}
              </Form.Item>
            )}
            <Form.Item>
              {getFieldDecorator("isGateway", {
                initialValue: false,
                valuePropName: "checked",
              })(<Checkbox>Is Gateway</Checkbox>)}
            </Form.Item>
            <Form.Item label="Assigned Tenants">
              <TreeSelect {...tenantTreeProps} />
            </Form.Item>

            <Form.Item label="Assigned Customers">
              <TreeSelect {...customerTreeProps} />
            </Form.Item>
          </TabPane>

          <TabPane tab="2. Device Credentials (optional)" key="2">
            <Form.Item label="Credentials Type">
              {getFieldDecorator("credentialsType", {
                rules: [
                  {
                    required: true,
                    message: "Please select credentials type!",
                  },
                ],
                initialValue: [constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN],
              })(<Cascader options={credentialsTypes} onChange={handleSelectCredentialsType} />)}
            </Form.Item>
            {isTypeAccessToken && (
              <Form.Item
                label={
                  <span>
                    Access token&nbsp;
                    <Tooltip title="Access token will be automatically generated if you don't provide.">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator("accessToken", {})(<Input />)}
              </Form.Item>
            )}
            {isTypeX509 && (
              <Form.Item label="RSA public key">
                {getFieldDecorator("RSAPublicKey", {
                  rules: [
                    {
                      required: true,
                      message: "Please input device RSA public key!",
                    },
                  ],
                })(<TextArea />)}
              </Form.Item>
            )}
            {isTypeMqttBasic && (
              <div>
                <Form.Item label="Client ID">
                  {getFieldDecorator("clientId", {
                    rules: [
                      {
                        required: true,
                        message: "Please input MQTT clientId!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Username">
                  {getFieldDecorator("username", {
                    rules: [
                      {
                        required: true,
                        message: "Please input MQTT Username!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Password">
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Please input MQTT Password!",
                      },
                    ],
                  })(<Input.Password />)}
                </Form.Item>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )
}

export default Form.create({name: "create_device_form"})(CreateDeviceModal)
