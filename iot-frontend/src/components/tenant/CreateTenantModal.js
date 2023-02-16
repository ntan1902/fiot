import React from "react";
import {Form, Icon, Input, message, Modal, Select, Tooltip} from "antd";
import {TenantService} from "../../services";
import {createTenant} from "../../actions/tenants"
import {useDispatch} from "react-redux";

const { Option } = Select;

const CreateTenantModal = (props) => {
  const dispatch = useDispatch();
  const { openCreateTenant, handleOpenCreateTenant } = props;

  const { getFieldDecorator } = props.form;

  const styleButton = {
    style: { borderRadius: "5px" },
    size: "large",
  };

  const prefixSelector = getFieldDecorator("prefix", {
    initialValue: "84",
  })(
    <Select style={{ width: 70 }}>
      <Option value="84">+84</Option>
      <Option value="85">+85</Option>
    </Select>
  );

  const handleCreateTenantSubmit = async (e) => {
    e.preventDefault();
    props.form.validateFields(
      ["email", "firstName", "lastName", "title", "country", "city", "address", "phone"],
      async (err, values) => {
        if (!err) {
          values['authorities'] = ['TENANT']
          console.log("Received values of form: ", values);
          try {
            const newTenant = await TenantService.create(values)
            dispatch(createTenant(newTenant))
          }
          catch (e) {
            message.error(e.response.data.message)
            return
          }
          message.success("Create tenant successfully!")
          props.form.resetFields();
          handleOpenCreateTenant(false);
        }
      }
    );
  };

  return (
    <Modal
      title={<h2>Create Tenant</h2>}
      visible={openCreateTenant}
      onOk={handleCreateTenantSubmit} //submit form here
      okText={"Create"}
      okButtonProps={styleButton}
      onCancel={() => handleOpenCreateTenant(false)}
      cancelButtonProps={styleButton}
      centered={true}
      bodyStyle={{overflowY: 'scroll', height: '600px'}}
      destroyOnClose={true}
    >
      <Form className="create_tenant_form" layout="vertical">
        <Form.Item label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label="Firstname"
        >
          {getFieldDecorator("firstName", {
            rules: [
              {
                required: true,
                message: "Please input your Firstname!",
                whitespace: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label="Lastname"
        >
          {getFieldDecorator("lastName", {
            rules: [
              {
                required: true,
                message: "Please input your Lastname!",
                whitespace: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Title&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator("title", {
            rules: [
              {
                message: "Please input your title!",
                whitespace: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Country">
          {getFieldDecorator("country", {
            rules: [
              {
                message: "Please input your country!",
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="City">
          {getFieldDecorator("city", {
            rules: [
              {
                message: "Please input your city!",
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [
              {
                message: "Please input your address!",
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator("phone", {
            rules: [
              {
                message: "Please input your phone number!",
              },
            ],
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "create_tenant_form" })(CreateTenantModal);
