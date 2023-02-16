import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal} from "antd";
import WidgetsBundleService from "../../services/widgetsBundle";
import {find} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {updateWidgetsBundle} from "../../actions/widgetsBundles";

const InfoWidgetsBundleModal = (props) => {
  const { openWidgetsBundleModal, widgetsBundleId, handleOpenModal } = props;
  const [widgetsBundleInfo, setWidgetsBundleInfo] = useState({});
  const [isInfoChanged, setIsInfoChanged] = useState(false);

  const dispatch = useDispatch();
  const { widgetsBundles } = useSelector((state) => state.widgetsBundles);

  useEffect(() => {
    const loadWidgetsBundle = async () => {
      if (widgetsBundleId) {
        const widgetsBundle = find(widgetsBundles, { id: widgetsBundleId });
        setWidgetsBundleInfo(widgetsBundle);
      }
    };
    loadWidgetsBundle();
  }, []);
  const { getFieldDecorator } = props.form;
  const { confirm } = Modal;
  const styleButton = {
    style: { borderRadius: "5px" },
    size: "large",
  };


  const handleUpdateWidgetsBundleSubmit = async (e) => {
    e.preventDefault();
    confirm({
      title: "Are you sure to save Widgets Bundle information?",
      centered: true,

      okText: "Yes",
      okButtonProps: {
        ...styleButton,
        icon: "check",
      },
      onOk() {
        props.form.validateFields(
          [
            "title",
            "description"
          ],
          async (err, values) => {
            if (!err) {
              console.log("Received values of form: ", values);
              try {
                const updatedWidgetsBundle = await WidgetsBundleService.update(
                  widgetsBundleId,
                  values
                );
                dispatch(updateWidgetsBundle(updatedWidgetsBundle));
              } catch (e) {
                message.error("Update widgetsBundle failed!");
                return;
              }
              message.success("Update widgetsBundle successfully!");
              handleOpenModal(false);
            }
          }
        );
      },

      cancelButtonProps: styleButton,
      onCancel() {},
    });
  };

  const handleInfoChange = (e) => {
    const values = props.form.getFieldsValue();
    console.log("values", values);
    if (
      values.title !== widgetsBundleInfo.title ||
      values.description !== widgetsBundleInfo.description
    ) {
      setIsInfoChanged(true);
    } else {
      setIsInfoChanged(false);
    }
  };

  return (
    <Modal
      title={<h2>WidgetsBundle Information</h2>}
      visible={openWidgetsBundleModal}
      onOk={handleUpdateWidgetsBundleSubmit}
      okText={"Save"}
      onCancel={() => handleOpenModal(false)}
      cancelButtonProps={styleButton}
      centered={true}
      okButtonProps={{ disabled: !isInfoChanged, ...styleButton }}
      destroyOnClose={true}
    >
      <Form
        className="info_widgets_bundle_form"
        layout="vertical"
        onChange={handleInfoChange}
      >
        <Form.Item label="Title">
          {getFieldDecorator("title", {
            rules: [
              {
                required: true,
                message: "Please input your title!",
                whitespace: true,
              },
            ],
            initialValue: widgetsBundleInfo.title,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator("description", {
            rules: [
              {
                whitespace: true,
              },
            ],
            initialValue: widgetsBundleInfo.description,
          })(<Input />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "info_widgets_bundle_form" })(InfoWidgetsBundleModal);
