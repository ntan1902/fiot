import React, {useEffect} from "react";
import {Checkbox, Form, Input, message} from "antd";

const SendEmailConfiguration = (props) => {
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
                    "smtpHost",
                    "smtpPort",
                    "username",
                    "password",

                    "connectionTimeout",
                    "timeout",
                    "writeTimeout",

                    "enableTls",

                    "fromTemplate",
                    "toTemplate",
                    "ccTemplate",
                    "bccTemplate",
                    "subjectTemplate",
                    "bodyTemplate",
                    "isHtmlTemplate"
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig(
                            JSON.stringify({
                                smtpHost: values.smtpHost,
                                smtpPort: values.smtpPort,
                                username: values.username,
                                password: values.password,

                                connectionTimeout: values.connectionTimeout,
                                timeout: values.timeout,
                                writeTimeout: values.writeTimeout,

                                enableTls: values.enableTls,

                                fromTemplate: values.fromTemplate,
                                toTemplate: values.toTemplate,
                                ccTemplate: values.ccTemplate,
                                bccTemplate: values.bccTemplate,
                                subjectTemplate: values.subjectTemplate,
                                bodyTemplate: values.bodyTemplate,
                                isHtmlTemplate: values.isHtmlTemplate,
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

            <Form.Item label="SMTP host" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("smtpHost", {
                        initialValue: defaultConfig.smtpHost,
                        rules: [
                            {
                                required: true,
                                message: "Please input SMTP host!",
                            },
                        ],
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="SMTP port" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("smtpPort", {
                        initialValue: defaultConfig.smtpPort,
                        rules: [
                            {
                                required: true,
                                message: "Please input SMTP port!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="username" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("username", {
                        initialValue: defaultConfig.username,
                        rules: [
                            {
                                required: true,
                                message: "Please input username!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="password" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("password", {
                        initialValue: defaultConfig.password,
                        rules: [
                            {
                                required: true,
                                message: "Please input password!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Connection timeout ms" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("connectionTimeout", {
                        initialValue: defaultConfig.connectionTimeout,
                        rules: [
                            {
                                required: true,
                                message: "Please input connectionTimeout!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Timeout ms" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("timeout", {
                        initialValue: defaultConfig.timeout,
                        rules: [
                            {
                                required: true,
                                message: "Please input timeout!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Write timeout ms" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("writeTimeout", {
                        initialValue: defaultConfig.writeTimeout,
                        rules: [
                            {
                                required: true,
                                message: "Please input writeTimeout!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item className="m-b-10 m-t-15">
                {
                    getFieldDecorator("enableTls", {
                        initialValue: defaultConfig.enableTls,
                        valuePropName: 'checked',
                    })(
                        <Checkbox>Enable TLS</Checkbox>
                    )
                }
            </Form.Item>

            <Form.Item label="From" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("fromTemplate", {
                        initialValue: defaultConfig.fromTemplate,
                        rules: [
                            {
                                required: true,
                                message: "Please input fromTemplate!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="To" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("toTemplate", {
                        initialValue: defaultConfig.toTemplate,
                        rules: [
                            {
                                required: true,
                                message: "Please input toTemplate!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Cc" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("ccTemplate", {
                        initialValue: defaultConfig.ccTemplate,
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Bcc" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("bccTemplate", {
                        initialValue: defaultConfig.bccTemplate,
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Subject" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("subjectTemplate", {
                        initialValue: defaultConfig.subjectTemplate,
                        rules: [
                            {
                                required: true,
                                message: "Please input subject!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Body" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("bodyTemplate", {
                        initialValue: defaultConfig.bodyTemplate,
                        rules: [
                            {
                                required: true,
                                message: "Please input bodyTemplate!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item className="m-b-10 m-t-15">
                {
                    getFieldDecorator("isHtmlTemplate", {
                        initialValue: defaultConfig.isHtmlTemplate,
                        valuePropName: 'unchecked',
                    })(
                        <Checkbox>HTML Template</Checkbox>
                    )
                }
            </Form.Item>
        </>

    );
};

export default SendEmailConfiguration

