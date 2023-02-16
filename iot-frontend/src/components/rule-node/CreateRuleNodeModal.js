import React, {useEffect, useState} from "react";
import {Form, Modal} from "antd";
import {get, isEmpty} from "lodash"
import EmptyConfiguration from "./EmptyConfiguration";
import SaveTsConfiguration from "./SaveTsConfiguration";
import DebugConfiguration from "./DebugConfiguration";
import SendEmailConfiguration from "./SendEmailConfiguration";
import FunctionConfiguration from "./FunctionConfiguration";
import FilterConfiguration from "./FilterConfiguration";
import CreateAlarmConfiguration from "./CreateAlarmConfiguration";
import SendRpcRequestConfiguration from "./SendRpcRequestConfiguration";
import GeofencingFilterConfiguration from "./GeofencingFilterConfiguration";
import SendTelegramConfiguration from "./SendTelegramConfiguration";
import FirebaseConfiguration from "./FirebaseConfiguration";

const CreateRuleNodeModal = (props) => {
  const {openCreateRuleNode, setOpenCreateRuleNode, newNode, setNewNode, ruleNodeDescriptor} = props;

  const [name, setName] = useState(null)
  const [config, setConfig] = useState(null)
  const [submitForm, setSubmitForm] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)

  const styleButton = {
    style: {borderRadius: "5px"},
    size: "large",
  };

  const handleCreateRuleNodeSubmit = (e) => {
    e.preventDefault();

    setSubmitForm(true)
  }

  useEffect(() => {
    if (submitDone) {
      newNode.data = {
        label: name,
        config: config,
        clazz: ruleNodeDescriptor?.clazz,
        configClazz: ruleNodeDescriptor?.configClazz
      }

      setNewNode(newNode);
      setOpenCreateRuleNode(false);

      setSubmitDone(false)
    }
  }, [submitDone])

  const handleRenderConfig = (label) => {
    // const rawClazz = get(ruleNodeDescriptor, 'clazz', '')
    // const clazz = rawClazz.split('.').pop();
    // const clazzName = clazz && clazz.replace('Action', 'Configuration')
    //
    const nodeConfig = get(ruleNodeDescriptor, 'config', null)
    const nodeDefaultConfig = get(ruleNodeDescriptor, 'defaultConfig', null)
    const defaultConfig = JSON.parse(nodeConfig || nodeDefaultConfig)

    const configClazzName = ruleNodeDescriptor?.configClazz.split('.').pop();
    switch (configClazzName) {
        // TODO: Save cases into enum
      case "EmptyConfiguration":
        return <EmptyConfiguration setName={setName}
                                   label={label}
                                   setConfig={setConfig}
                                   submitForm={submitForm}
                                   setSubmitForm={setSubmitForm}
                                   setSubmitDone={setSubmitDone}
                                   form={props.form}/>
      case "SaveTsConfiguration":
        return <SaveTsConfiguration setName={setName}
                                    label={label}
                                    setConfig={setConfig}
                                    submitForm={submitForm}
                                    setSubmitForm={setSubmitForm}
                                    setSubmitDone={setSubmitDone}
                                    defaultConfig={defaultConfig}
                                    form={props.form}/>
      case "DebugConfiguration":
        return <DebugConfiguration setName={setName}
                                   label={label}
                                   setConfig={setConfig}
                                   submitForm={submitForm}
                                   setSubmitForm={setSubmitForm}
                                   setSubmitDone={setSubmitDone}
                                   defaultConfig={defaultConfig}
                                   form={props.form}/>
      case "SendEmailConfiguration":
        return <SendEmailConfiguration setName={setName}
                                       label={label}
                                       setConfig={setConfig}
                                       submitForm={submitForm}
                                       setSubmitForm={setSubmitForm}
                                       setSubmitDone={setSubmitDone}
                                       defaultConfig={defaultConfig}
                                       form={props.form}/>
      case "FunctionConfiguration":
        return <FunctionConfiguration setName={setName}
                                      label={label}
                                      setConfig={setConfig}
                                      submitForm={submitForm}
                                      setSubmitForm={setSubmitForm}
                                      setSubmitDone={setSubmitDone}
                                      defaultConfig={defaultConfig}
                                      form={props.form}/>
      case "FilterConfiguration":
        return <FilterConfiguration setName={setName}
                                    label={label}
                                    setConfig={setConfig}
                                    submitForm={submitForm}
                                    setSubmitForm={setSubmitForm}
                                    setSubmitDone={setSubmitDone}
                                    defaultConfig={defaultConfig}
                                    form={props.form}/>
      case "CreateAlarmConfiguration":
        return <CreateAlarmConfiguration setName={setName}
                                         label={label}
                                         setConfig={setConfig}
                                         submitForm={submitForm}
                                         setSubmitForm={setSubmitForm}
                                         setSubmitDone={setSubmitDone}
                                         defaultConfig={defaultConfig}
                                         form={props.form}/>
      case "SendRpcRequestConfiguration":
        return <SendRpcRequestConfiguration setName={setName}
                                            label={label}
                                            setConfig={setConfig}
                                            submitForm={submitForm}
                                            setSubmitForm={setSubmitForm}
                                            setSubmitDone={setSubmitDone}
                                            defaultConfig={defaultConfig}
                                            form={props.form}/>
      case "GeofencingFilterConfiguration":
        return <GeofencingFilterConfiguration setName={setName}
                                              label={label}
                                              setConfig={setConfig}
                                              submitForm={submitForm}
                                              setSubmitForm={setSubmitForm}
                                              setSubmitDone={setSubmitDone}
                                              defaultConfig={defaultConfig}
                                              form={props.form}/>
      case "SendTelegramConfiguration":
        return <SendTelegramConfiguration setName={setName}
                                          label={label}
                                          setConfig={setConfig}
                                          submitForm={submitForm}
                                          setSubmitForm={setSubmitForm}
                                          setSubmitDone={setSubmitDone}
                                          defaultConfig={defaultConfig}
                                          form={props.form}/>

      case "FirebaseConfiguration":
        return <FirebaseConfiguration setName={setName}
                                      label={label}
                                      setConfig={setConfig}
                                      submitForm={submitForm}
                                      setSubmitForm={setSubmitForm}
                                      setSubmitDone={setSubmitDone}
                                      defaultConfig={defaultConfig}
                                      form={props.form}/>
    }
  }

  const label = get(ruleNodeDescriptor, 'label', '')
  const isEdit = !isEmpty(label)

  const modalTitle = isEdit
      ? `Edit node: ${label}`
      : `Create node: ${ruleNodeDescriptor?.name}`
  const modalOkText = isEdit ? "Save" : "Create"

  return (
      <Modal
          title={<h2>{modalTitle}</h2>}
          visible={openCreateRuleNode}
          onOk={handleCreateRuleNodeSubmit}
          okText={modalOkText}
          okButtonProps={styleButton}
          onCancel={() => setOpenCreateRuleNode(false)}
          cancelButtonProps={styleButton}
          centered={true}
          bodyStyle={{overflowY: "scroll", height: "700px"}}
          width={ruleNodeDescriptor?.configClazz.split('.').pop() === 'GeofencingFilterConfiguration' ? "70vw" : "50vw"}
          destroyOnClose={false}
      >

        <Form className="create_empty_config_node_form" layout="horizontal">
          {
            handleRenderConfig(label)
          }
        </Form>
      </Modal>
  );
};

export default Form.create({name: "create_rule_node_form"})(
    CreateRuleNodeModal
);