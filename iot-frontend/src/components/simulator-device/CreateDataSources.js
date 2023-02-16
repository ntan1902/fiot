import {message, Modal, Cascader, Form, Input, Checkbox} from "antd"
import React, {useEffect, useState} from "react"
import {get} from "lodash"

const CreateDataSources = (props) => {
  const {
    openCreateDataSources,
    setOpenCreateDataSources,
    curDataSource,
    isEdit,
    dataSources,
    setDataSources,
    form: {getFieldDecorator},
  } = props
  const [dataSourceType, setDataSourceType] = useState("number")
  const [dataSourceKey, setDataSourceKey] = useState("")
  const [dataSourceValue, setDataSourceValue] = useState("")
  const [isAutoGenerate, setIsAutoGenerate] = useState(false)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    if (isEdit) {
      setDataSourceKey(get(curDataSource, "key", ""))
      setDataSourceType(get(curDataSource, "type", ""))
      setDataSourceValue(get(curDataSource, "value", ""))
      setIsAutoGenerate(get(curDataSource, "autoGenerate"))
      setMinValue(get(curDataSource, "minValue", 0))
      setMaxValue(get(curDataSource, "maxValue", 0))
    } else {
      setDataSourceKey("")
      setDataSourceType("number")
      setDataSourceValue("")
      setIsAutoGenerate(false)
      setMinValue(0)
      setMaxValue(0)
    }
  }, [openCreateDataSources])

  const TYPES = ["NUMBER", "BOOLEAN"]

  const typeArray = TYPES.map((v) => {
    return {
      value: v.toLowerCase(),
      label: v,
    }
  })

  const booleanData = [
    {
      value: true,
      label: "True",
    },
    {
      value: false,
      label: "False",
    },
  ]

  const handleChangeType = (type) => {
    setDataSourceValue("")
    setDataSourceType(type[0])
  }

  const handleUpdateDataSourceSubmit = (e) => {
    e.preventDefault()
    const fields = ["type", "autoGenerate"]
    !isEdit && fields.push("key")
    props.form.validateFields(fields, async (err, values) => {
      if (!err) {
        try {
          const {key, type, autoGenerate} = values
          let newDataSourceList = []
          if (!isEdit) {
            const currentDataSourceKeys = dataSources.map((a) => a.key)
            if (currentDataSourceKeys.includes(key)) {
              message.error("Keys within device can not have same value.")
              return
            }
            newDataSourceList = [
              ...dataSources,
              {
                key,
                type: type[0],
                value: dataSourceValue,
                autoGenerate: !!autoGenerate,
                maxValue,
                minValue,
              },
            ]
            setDataSources(newDataSourceList)
          } else {
            newDataSourceList = dataSources.map((a) => {
              if (a.key === dataSourceKey) {
                const updatedDataSource = {
                  ...a,
                  value: dataSourceValue,
                  type: type[0],
                  autoGenerate: !!autoGenerate,
                  maxValue,
                  minValue,
                }
                return updatedDataSource
              }
              return a
            })
            setDataSources(newDataSourceList)
          }
        } catch (e) {
          message.error(e.response.data.message)
          return
        }
        setOpenCreateDataSources(false)
      }
    })
  }
  const modalTitle = isEdit ? `Edit DataSource: "${dataSourceKey}"` : "Create DataSource"
  return (
    <Modal
      centered={true}
      destroyOnClose={true}
      okText={"Save"}
      cancelTex={"Cancel"}
      onOk={handleUpdateDataSourceSubmit}
      onCancel={() => setOpenCreateDataSources(false)}
      visible={openCreateDataSources}
      title={<h2>{modalTitle}</h2>}
    >
      <Form className="device_dataSources_form" layout="vertical">
        {!isEdit && (
          <Form.Item label="Key">
            {getFieldDecorator("key", {
              rules: [
                {
                  required: true,
                  message: "Please input dataSource key",
                },
              ],
              initialValue: dataSourceKey,
            })(<Input onChange={(e) => setDataSourceKey(e.target.value)} />)}
          </Form.Item>
        )}
        <Form.Item label="Type">
          {getFieldDecorator("type", {
            rules: [
              {
                required: true,
                message: "Please input dataSource type",
              },
            ],
            initialValue: [dataSourceType],
          })(<Cascader options={typeArray} onChange={handleChangeType} />)}
        </Form.Item>
        {!isAutoGenerate && dataSourceType === "number" && (
          <Form.Item label="Value">
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Please input dataSource value",
                },
              ],
              initialValue: dataSourceValue,
            })(<Input onChange={(e) => setDataSourceValue(e.target.value)} />)}
          </Form.Item>
        )}
        {!isAutoGenerate && dataSourceType === "boolean" && (
          <Form.Item label="Value">
            {getFieldDecorator("value", {initialValue: [dataSourceValue]})(
              <Cascader onChange={(value, selectedOptions) => setDataSourceValue(value[0])} options={booleanData} />
            )}
          </Form.Item>
        )}
        <Form.Item label="Auto generate">
          {getFieldDecorator("autoGenerate", {
            initialValue: isAutoGenerate,
            valuePropName: "checked",
          })(
            <Checkbox
              onChange={(e) => {
                setIsAutoGenerate(e.target.checked)
                setDataSourceValue("")
              }}
            >
              Auto generate
            </Checkbox>
          )}
        </Form.Item>
        {dataSourceType === "number" && isAutoGenerate && (
          <>
            <Form.Item label="MAX value">
              {getFieldDecorator("maxValue", {
                initialValue: maxValue,
              })(<Input onChange={(e) => setMaxValue(e.target.value)} />)}
            </Form.Item>

            <Form.Item label="MIN value">
              {getFieldDecorator("minValue", {
                initialValue: minValue,
              })(<Input onChange={(e) => setMinValue(e.target.value)} />)}
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default CreateDataSources
