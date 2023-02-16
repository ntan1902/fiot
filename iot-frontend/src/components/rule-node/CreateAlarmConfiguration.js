import React, {useEffect} from "react";
import {Form, Input, message, Select} from "antd";

const {Option} = Select;

const CreateAlarmConfiguration = (props) => {
    const {
        setName,
        label,
        setConfig,
        submitForm,
        setSubmitForm,
        setSubmitDone,
        form,
        defaultConfig
    } = props;

    const {getFieldDecorator} = form;
    useEffect(() => {
        if (submitForm) {
            form.validateFields(
                [
                    "name",
                    "alarmName",
                    "severity",
                    "detail"
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig(
                            JSON.stringify({
                                alarmName: values.alarmName,
                                severity: values.severity,
                                detail: values.detail,
                            }))

                        message.success(`${label ? "Save" : "Create"} rule node successfully!`);
                        form.resetFields();

                        setSubmitDone(true)
                    }
                    setSubmitForm(false)
                }
            );
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
                })(<Input/>)}
            </Form.Item>

            <Form.Item label="Alarm Name" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("alarmName", {
                        initialValue: defaultConfig.alarmName,
                        rules: [
                            {
                                required: true,
                                message: "Please input alarm name!",
                            },
                        ],
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Severity" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("severity", {
                        initialValue: defaultConfig.severity,
                        rules: [
                            {
                                required: true,
                                message: "Please input severity!",
                            },
                        ]
                    })(
                        <Select>
                            <Option value="CRITICAL">Critical</Option>
                            <Option value="MAJOR">Major</Option>
                            <Option value="MINOR">Minor</Option>
                            <Option value="WARNING">Warning</Option>
                            <Option value="INDETERMINATE">Indeterminate</Option>
                        </Select>
                    )
                }
            </Form.Item>

            <Form.Item label="Detail" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("detail", {
                        initialValue: defaultConfig.detail,
                        rules: [
                            {
                                required: true,
                                message: "Please input detail alarm!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

        </>

    );
};

export default CreateAlarmConfiguration

