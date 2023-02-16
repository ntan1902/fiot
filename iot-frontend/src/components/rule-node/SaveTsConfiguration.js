import React, {useEffect} from "react";
import {Checkbox, Form, Input, message} from "antd";

const SaveTsConfiguration = (props) => {
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
                    "defaultTTL",
                    "skipLatestPersistence",
                    "useServerTs"
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig(
                            JSON.stringify({
                                defaultTTL: values.defaultTTL,
                                skipLatestPersistence: values.skipLatestPersistence,
                                useServerTs: values.useServerTs
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

            <Form.Item label="Default TTL in seconds" className="m-b-10 m-t-15">
                {
                    getFieldDecorator("defaultTTL", {
                        initialValue: defaultConfig.defaultTTL
                    })(<Input/>)
                }
            </Form.Item>

            <Form.Item className="m-b-10 m-t-15">
                {
                    getFieldDecorator("skipLatestPersistence", {
                        initialValue: defaultConfig.skipLatestPersistence,
                        valuePropName: 'checked',
                    })(
                        <Checkbox>Skip latest persistence</Checkbox>
                    )
                }
            </Form.Item>

            <Form.Item className="m-b-10 m-t-15">
                {
                    getFieldDecorator("useServerTs", {
                        initialValue: defaultConfig.useServerTs,
                        valuePropName: 'checked',
                    })(
                        <Checkbox>Use server ts</Checkbox>
                    )
                }
            </Form.Item>

        </>
    );
};

export default SaveTsConfiguration

