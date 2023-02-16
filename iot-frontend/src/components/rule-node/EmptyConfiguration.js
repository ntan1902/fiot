import React, {useEffect} from "react";
import {Form, Input, message} from "antd";

const EmptyConfiguration = (props) => {
    const {setName, label, setConfig, submitForm, setSubmitForm, setSubmitDone, form} = props;

    const {getFieldDecorator} = form;
    useEffect(() => {
        if (submitForm) {
            form.validateFields(
                [
                    "name",
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig("");

                        message.success(`${label ? "Save" : "Create"} rule node successfully!`);
                        form.resetFields()

                        setSubmitDone(true)
                    }
                    setSubmitForm(false)
                }
            );
        }
    }, [submitForm])

    return (
        <Form.Item label="Name">
            {
                getFieldDecorator("name", {
                    initialValue: label,
                    rules: [
                        {
                            required: true,
                            message: "Please input rule node name!",
                            whitespace: true,
                        },
                    ],
                })(<Input/>)
            }
        </Form.Item>
    );
};

export default EmptyConfiguration

