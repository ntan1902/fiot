import React from "react";
import {Form, Input, message, Modal} from "antd";
import {DashboardService} from "../../services";
import {createDashboard} from "../../actions/dashboards";
import {useDispatch} from "react-redux";

const CreateDashboardModal = (props) => {
  const dispatch = useDispatch();
  const { openCreateDashboard, setOpenCreateDashboard } = props;

  const { getFieldDecorator } = props.form;

  const styleButton = {
    style: { borderRadius: "5px" },
    size: "large",
  };

  const handleCreateDashboardSubmit = async (e) => {
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
            const newDashboard = await DashboardService.create(values);
            dispatch(createDashboard(newDashboard));
          } catch (e) {
            message.error(e.response.data.message);
            return;
          }
          message.success("Create dashboard successfully!");
          props.form.resetFields();
          setOpenCreateDashboard(false);
        }
      }
    );
  };

  return (
    <Modal
      title={<h2>Create Dashboard</h2>}
      visible={openCreateDashboard}
      onOk={handleCreateDashboardSubmit} //submit form here
      okText={"Create"}
      okButtonProps={styleButton}
      onCancel={() => setOpenCreateDashboard(false)}
      cancelButtonProps={styleButton}
      centered={true}
      bodyStyle={{ overflowY: "scroll", height: "600px" }}
    >
      <Form className="create_dashboard_form" layout="horizontal">
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

export default Form.create({ name: "create_dashboard_form" })(
  CreateDashboardModal
);
