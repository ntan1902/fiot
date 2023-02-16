import React from "react";
import {Form, Input, message, Modal} from "antd";
import {useDispatch} from "react-redux";
import {createRuleChain} from "../../actions/ruleChains";

const CreateRuleChainModal = (props) => {
    const dispatch = useDispatch();
    const {openCreateRuleChain, handleOpenCreateRuleChain} = props;

    const {getFieldDecorator} = props.form;

    const styleButton = {
        style: {borderRadius: "5px"},
        size: "large",
    };

    const handleCreateRuleChainSubmit = async (e) => {
        e.preventDefault();
        props.form.validateFields(
            [
                "name",
            ],
            async (err, values) => {
                if (!err) {
                    console.log("Received values of form: ", values);
                    try {
                        await dispatch(createRuleChain(values));
                    } catch (e) {
                        message.error(e.response.data.message);
                        return;
                    }
                    message.success("Create rule chain successfully!");
                    props.form.resetFields();
                    handleOpenCreateRuleChain(false);
                }
            }
        );
    };

    return (
        <Modal
            title={<h2>Create Rule Chain</h2>}
            visible={openCreateRuleChain}
            onOk={handleCreateRuleChainSubmit} //submit form here
            okText={"Create"}
            okButtonProps={styleButton}
            onCancel={() => handleOpenCreateRuleChain(false)}
            cancelButtonProps={styleButton}
            centered={true}
            bodyStyle={{overflowY: "scroll", height: "150px"}}
        >
            <Form className="create_rule_chain_form" layout="horizontal">
                <Form.Item label="Name">
                    {getFieldDecorator("name", {
                        rules: [
                            {
                                required: true,
                                message: "Please input rule chain name!",
                                whitespace: true,
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Form.create({name: "create_rule_chain_form"})(
    CreateRuleChainModal
);
