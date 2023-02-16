import {Button, Card, Cascader, Divider, Form, Input, message, Modal, Popconfirm, Table, Tooltip} from "antd"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {updateDevice} from "../../actions/devices"

import {DeviceService} from "../../services"
import {isEmpty} from "lodash"

const DeviceAttributes = (props) => {
  const {
    deviceAttributes,
    deviceId,
    form: {getFieldDecorator},
  } = props
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles && userRoles.includes("TENANT")

  const [openCreateAttribute, setOpenCreateAttribute] = useState(false)
  const [attributeType, setAttributeType] = useState("string")
  const [attributeKey, setAttributeKey] = useState("")
  const [attributeValue, setAttributeValue] = useState("")
  const [attributes, setAttributes] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()

  const TYPES = ["String", "Integer", "Double", "Boolean", "JSON"]

  const typeArray = TYPES.map((v) => {
    return {
      value: v.toLowerCase(),
      label: v,
    }
  })

  useEffect(() => {
    const data = JSON.parse(deviceAttributes)
    !isEmpty(data) ? setAttributes(data) : setAttributes([])
  }, [deviceAttributes])

  const confirmDelete = async (key) => {
    const newAttributeList = attributes.filter((a) => a.key !== key)
    setAttributes(newAttributeList)
    try {
      const requestBody = {
        attributes: JSON.stringify(newAttributeList),
      }
      const updatedDevice = await DeviceService.updateAttributes(deviceId, requestBody)
      dispatch(updateDevice(updatedDevice))
    } catch (e) {
      message.error(e.response.data.message)
    }
  }

  const handleChangeType = (type) => {
    setAttributeType(type[0])
  }

  const handleOpenCreateAttribute = () => {
    setAttributeKey("")
    setAttributeValue("")
    setAttributeType("string")
    setIsEdit(false)
    setOpenCreateAttribute(true)
  }

  const handleUpdateAttributeSubmit = (e) => {
    e.preventDefault()
    const fields = ["key", "type", "value"]
    props.form.validateFields(fields, async (err, values) => {
      if (!err) {
        try {
          const {key, type, value} = values
          let newAttributeList = []
          if (!isEdit) {
            const currentAttributeKeys = attributes.map((a) => a.key)
            if (currentAttributeKeys.includes(key)) {
              message.error("Keys within device can not have same value.")
              return
            }
            newAttributeList = [
              ...attributes,
              {
                key,
                type,
                value,
              },
            ]
            setAttributes(newAttributeList)
          } else {
            newAttributeList = attributes.map((a) => {
              if (a.key === attributeKey) {
                return {
                  ...a,
                  value: value,
                  type: type,
                }
              }
              return a
            })
            setAttributes(newAttributeList)
          }
          const requestBody = {
            attributes: JSON.stringify(newAttributeList),
          }
          const updatedDevice = await DeviceService.updateAttributes(deviceId, requestBody)
          dispatch(updateDevice(updatedDevice))
        } catch (e) {
          message.error(e.response.data.message)
          return
        }
        message.success("Update device attributes successfully!")
        props.form.resetFields()
        setOpenCreateAttribute(false)
      }
    })
  }

  let columns = [
    {
      title: "Key",
      dataIndex: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Value",
      dataIndex: "value",
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: "Actions",
      render: (record) => (
        <span>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setAttributeKey(record.key)
                setAttributeType(record.type)
                setAttributeValue(record.value)
                setIsEdit(true)
                setOpenCreateAttribute(true)
              }}
              type="primary"
              shape="circle"
              icon="edit"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure to delete attribute?"
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
  
  const modalTitle = isEdit ? "Edit Attribute" : "Create Attribute"
  
  if (!isTenant) {
    columns = columns.filter((c) => c.title != "Actions")
  }
  
  return (
    <Card
      title={<p>Device Attributes</p>}
      extra={isTenant && <Button type="primary" shape="circle" icon="plus" onClick={() => handleOpenCreateAttribute()} />}
    >
      <Modal
        centered={true}
        destroyOnClose={true}
        okText={"Save"}
        cancelTex={"Cancel"}
        onOk={handleUpdateAttributeSubmit}
        onCancel={() => setOpenCreateAttribute(false)}
        visible={openCreateAttribute}
        title={<h2>{modalTitle}</h2>}
      >
        <Form className="device_attributes_form" layout="vertical">
          {!isEdit && (
            <Form.Item label="Key">
              {getFieldDecorator("key", {
                rules: [
                  {
                    required: true,
                    message: "Please input attribute key",
                  },
                ],
                initialValue: attributeKey,
              })(<Input />)}
            </Form.Item>
          )}
          <Form.Item label="Type">
            {getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "Please input attribute type",
                },
              ],
              initialValue: [attributeType],
            })(<Cascader options={typeArray} onChange={handleChangeType} />)}
          </Form.Item>
          <Form.Item label="Value">
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Please input attribute value",
                },
              ],
              initialValue: attributeValue,
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
      <div className="custom-table">
        <Table columns={columns} dataSource={attributes} />
      </div>
    </Card>
  )
}

export default DeviceAttributes
