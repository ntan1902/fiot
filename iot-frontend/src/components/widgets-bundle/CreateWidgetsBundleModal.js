import React from "react";
import {Form, Input, message, Modal} from "antd";
import {WidgetsBundleService} from "../../services";
import {createWidgetsBundle} from "../../actions/widgetsBundles";
import {useDispatch} from "react-redux";

const CreateWidgetsBundleModal = (props) => {
  const dispatch = useDispatch();
  const { openCreateWidgetsBundle, handleOpenCreateWidgetsBundle } = props;

  const { getFieldDecorator } = props.form;

  const styleButton = {
    style: { borderRadius: "5px" },
    size: "large",
  };

  const handleCreateWidgetsBundleSubmit = async (e) => {
    e.preventDefault();
    props.form.validateFields(
      [
        "title",
        "description"
      ],
      async (err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          try {
            const newWidgetsBundle = await WidgetsBundleService.create(values);
            dispatch(createWidgetsBundle(newWidgetsBundle));
          } catch (e) {
            message.error(e.response.data.message);
            return;
          }
          message.success("Create widgets bundle successfully!");
          props.form.resetFields();
          handleOpenCreateWidgetsBundle(false);
        }
      }
    );
  };

  return (
    <Modal
      title={<h2>Create WidgetsBundle</h2>}
      visible={openCreateWidgetsBundle}
      onOk={handleCreateWidgetsBundleSubmit} //submit form here
      okText={"Create"}
      okButtonProps={styleButton}
      onCancel={() => handleOpenCreateWidgetsBundle(false)}
      cancelButtonProps={styleButton}
      centered={true}
      bodyStyle={{ overflowY: "scroll", height: "600px" }}
    >
      <Form className="create_widgets_bundle_form" layout="horizontal">
        <Form.Item label="Title">
          {getFieldDecorator("title", {
            rules: [
              {
                required: true,
                message: "Please input your title!",
                whitespace: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator("description", {
            rules: [
              {
                whitespace: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "create_widgets_bundle_form" })(
  CreateWidgetsBundleModal
);
