import React, {useEffect, useState} from "react";
import {Form, Input, message} from "antd";
import CodeEditor from "../code-editor/CodeEditor";

const FilterConfiguration = (props) => {
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

    const [script, setScript] = useState(defaultConfig.script)

    const {getFieldDecorator} = form;

    useEffect(() => {
      setScript(defaultConfig.script)
    }, [defaultConfig])

    useEffect(() => {
        if (submitForm) {
            form.validateFields(
                [
                    "name"
                ],
                (err, values) => {
                    if (!err) {
                        setName(values.name);
                        setConfig(
                            JSON.stringify({
                                script: script
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
            <h4>function filter(msg, metaData, msgType) {`{`}</h4>
            <CodeEditor script={script} setScript={setScript}/>
            <h4>{"}"}</h4>
        </>
    );
};

export default FilterConfiguration

