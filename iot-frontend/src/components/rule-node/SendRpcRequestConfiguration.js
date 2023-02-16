import React, {useEffect, useState} from "react";
import {Form, Input, message} from "antd";

const SaveRpcRequestConfiguration = (props) => {
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
                    "timeout",
                    "deviceId"
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig(
                            JSON.stringify({
                                timeout: values.timeout,
                                deviceId: values.deviceId
                            })
                        );

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
                    initialValue:label,
                    rules: [
                        {
                            required: true,
                            message: "Please input rule node name!",
                            whitespace: true,
                        },
                    ],
                })(<Input/>)}
            </Form.Item>
            <Form.Item label="Timeout (ms)">
                {getFieldDecorator("timeout", {
                    initialValue: defaultConfig.timeout,
                    rules: [
                        {
                            required: true,
                            message: "Please input rule node timeout!",
                        },
                    ],
                })(<Input/>)}
            </Form.Item>

            <Form.Item label="Device Id">
                {getFieldDecorator("deviceId", {
                    initialValue: defaultConfig.deviceId,
                    rules: [
                        {
                            required: true,
                            message: "Please input device id!",
                            whitespace: true,
                        },
                    ],
                })(<Input/>)}
            </Form.Item>
        </>
    );
};

export default SaveRpcRequestConfiguration

