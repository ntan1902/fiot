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
                    "token",
                    "chatIds",
                    "messageTemplate"
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig(
                            JSON.stringify({
                                token: values.token,
                                chatIds: values.chatIds,
                                messageTemplate: values.messageTemplate
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

            <Form.Item label="Bot token" help="Enter the bot token from @BotFather here" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("token", {
                        initialValue: defaultConfig.token,
                        rules: [
                            {
                                required: true,
                                message: "Please input your bot token!",
                            },
                        ],
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Chat ids" help="Enter chat ids of your bot, e.g: 1234567,7899465" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("chatIds", {
                        initialValue: defaultConfig.chatIds,
                        rules: [
                            {
                                required: true,
                                message: "Please input chat id!",
                            },
                        ]
                    })(
                        <Input/>
                    )
                }
            </Form.Item>

            <Form.Item label="Message" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("messageTemplate", {
                        initialValue: defaultConfig.messageTemplate,
                        rules: [
                            {
                                required: true,
                                message: "Please input message to send!",
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

export default SendEmailConfiguration

