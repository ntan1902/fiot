import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {find} from "lodash";
import {openRuleNodes} from "../../actions/ruleChains";

const InfoRuleChainModal = (props) => {
    const {openRuleChainModal, ruleChainId, handleOpenModal} = props;
    const [ruleChain, setRuleChain] = useState({});
    const [isInfoChanged, setIsInfoChanged] = useState(false);

    const dispatch = useDispatch();
    const {ruleChains} = useSelector((state) => state.ruleChains);

    useEffect(() => {
        const loadRuleChain = async () => {
            if (ruleChainId) {
                const data = find(ruleChains, {id: ruleChainId});
                setRuleChain(data);
            }
        };
        loadRuleChain();
    }, []);
    const {getFieldDecorator} = props.form;
    const {confirm} = Modal;
    const styleButton = {
        style: {borderRadius: "5px"},
        size: "large",
    };

    const handleOpenRuleNodesPage = (e) => {
        dispatch(openRuleNodes({isOpen: true, ruleChain}))
    }

    const handleUpdateRuleChainSubmit = async (e) => {
        e.preventDefault();
        confirm({
            title: "Are you sure to save rule chain information?",
            centered: true,

            okText: "Yes",
            okButtonProps: {
                ...styleButton,
                icon: "check",
            },
            onOk() {
                props.form.validateFields(
                    [
                        "name",
                    ],
                    async (err, values) => {
                        if (!err) {
                            console.log("Received values of form: ", values);
                            try {
                                // const updatedWidgetsBundle = await WidgetsBundleService.update(
                                //     widgetsBundleId,
                                //     values
                                // );
                                // dispatch(updateWidgetsBundle(updatedWidgetsBundle));
                            } catch (e) {
                                message.error("Update rule chain failed!");
                                return;
                            }
                            message.success("Update rule chain successfully!");
                            handleOpenModal(false);
                        }
                    }
                );
            },

            cancelButtonProps: styleButton,
        });
    };

    const handleInfoChange = (e) => {
        const values = props.form.getFieldsValue();
        if (
            values.name !== ruleChain.name
        ) {
            setIsInfoChanged(true);
        } else {
            setIsInfoChanged(false);
        }
    };

    return (
        <Modal
            title={<h2>Rule Chain Information</h2>}
            visible={openRuleChainModal}
            onOk={handleUpdateRuleChainSubmit}
            okText={"Save"}
            onCancel={() => handleOpenModal(false)}
            cancelButtonProps={styleButton}
            centered={true}
            okButtonProps={{disabled: !isInfoChanged, ...styleButton}}
            destroyOnClose={true}
        >
            <Button
                icon="share-alt"
                type="primary"
                onClick={() => handleOpenRuleNodesPage(true)}
            >
                Open Rule Chain
            </Button>
            <br />
            <Form
                className="m-t-10"
                layout="vertical"
                onChange={handleInfoChange}
            >
                <Form.Item label="Name">
                    {getFieldDecorator("name", {
                        rules: [
                            {
                                required: true,
                                message: "Please input rule chain name!",
                                whitespace: true,
                            },
                        ],
                        initialValue: ruleChain.name,
                    })(<Input/>)}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Form.create({name: "info_rule_chain_form"})(InfoRuleChainModal);
