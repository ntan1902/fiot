import React, {useState, useEffect} from "react"
import {Form, Input, message, Select, Ar} from "antd"

const {Option} = Select

const FirebaseConfiguration = (props) => {
  const {setName, label, setConfig, submitForm, setSubmitForm, setSubmitDone, form, defaultConfig} = props
  const defaultMethod = defaultConfig.firebaseMethod || "get"
  const [method, setMethod] = useState(defaultMethod)

  const {getFieldDecorator} = form

  useEffect(() => {
    if (submitForm) {
      form.validateFields(["name", "firebaseUrl", "childPath", "firebaseMethod", "value"], (err, values) => {
        if (!err) {
          setName(values.name)
          setConfig(
            JSON.stringify({
              firebaseUrl: values.firebaseUrl,
              childPath: values.childPath,
              firebaseMethod: values.firebaseMethod,
              value: values.value || "",
            })
          )

          message.success(`${label ? "Save" : "Create"} rule node successfully!`)
          form.resetFields()

          setSubmitDone(true)
        }
        setSubmitForm(false)
      })
    }
  }, [submitForm])

  return (
    <>
      <Form.Item label="Name">
        {getFieldDecorator("name", {
          initialValue: label,
          rules: [
            {
              required: true,
              message: "Please input rule node name!",
              whitespace: true,
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Firebase URL">
        {getFieldDecorator("firebaseUrl", {
          initialValue: defaultConfig.firebaseUrl,
          rules: [
            {
              required: true,
              message: "Please input Firebase URL!",
              whitespace: true,
            },
          ],
        })(<Input />)}
      </Form.Item>

      <Form.Item label="childPath" className="m-b-10 m-t-15">
        {getFieldDecorator("childPath", {
          initialValue: defaultConfig.childPath,
          rules: [
            {
              required: true,
              message: "Please input Child Path!",
            },
          ],
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Method" className="m-b-10 m-t-15">
        {getFieldDecorator("firebaseMethod", {
          initialValue: defaultConfig.firebaseMethod,
          rules: [
            {
              required: true,
              message: "Please input method!",
            },
          ],
        })(
          <Select onSelect={(value) => setMethod(value)}>
            <Option value="GET">get</Option>
            <Option value="SET">set</Option>
            <Option value="PUSH">push</Option>
            <Option value="UPDATE">update</Option>
            <Option value="REMOVE">remove</Option>
          </Select>
        )}
      </Form.Item>

      {method !== "GET" && (
        <Form.Item label="Value" className="m-b-10 m-t-15">
          {getFieldDecorator("value", {
            initialValue: defaultConfig.value,
            rules: [
              {
                message: "Please input data!",
              },
            ],
          })(<Input.TextArea />)}
        </Form.Item>
      )}
    </>
  )
}

export default FirebaseConfiguration
