import React, {useEffect, useState} from "react";
import {Form, Icon, Input, message, Modal, Select, Tooltip} from "antd";
import CustomerService from "../../services/customer";
import {find} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {updateCustomer} from "../../actions/customers";

const { Option } = Select;

const InfoCustomerModal = (props) => {
  const { openInfoModal, customerId, setOpenInfoModal } = props;
  const [customerInfo, setCustomerInfo] = useState({});
  const [isInfoChanged, setIsInfoChanged] = useState(false);

  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);

  useEffect(() => {
    const loadCustomer = async () => {
      if (customerId) {
        const customer = find(customers, { id: customerId });
        setCustomerInfo(customer);
      }
    };
    loadCustomer();
  }, []);
  const { getFieldDecorator } = props.form;
  const { confirm } = Modal;
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

  const handleUpdateCustomerSubmit = async (e) => {
    e.preventDefault();
    confirm({
      title: "Are you sure to save customer profile?",
      centered: true,

      okText: "Yes",
      okButtonProps: {
        ...styleButton,
        icon: "check",
      },
      onOk() {
        props.form.validateFields(
          [
            "email",
            "title",
            "country",
            "city",
            "address",
            "phone",
          ],
          async (err, values) => {
            if (!err) {
              console.log("Received values of form: ", values);
              try {
                const updatedCustomer = await CustomerService.update(
                  customerId,
                  values
                );
                dispatch(updateCustomer(updatedCustomer));
              } catch (e) {
                message.error("Update customer failed!");
                return;
              }
              message.success("Update customer successfully!");
              setOpenInfoModal(false);
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
      values.email !== customerInfo.email ||
      values.title !== customerInfo.title ||
      values.country !== customerInfo.country ||
      values.city !== customerInfo.city ||
      values.address !== customerInfo.address ||
      values.phone !== customerInfo.phone
    ) {
      setIsInfoChanged(true);
    } else {
      setIsInfoChanged(false);
    }
  };

  return (
    <Modal
      title={<h2>Customer Information</h2>}
      visible={openInfoModal}
      onOk={handleUpdateCustomerSubmit}
      okText={"Save"}
      onCancel={() => setOpenInfoModal(false)}
      cancelButtonProps={styleButton}
      centered={true}
      bodyStyle={{ overflowY: "scroll", height: "600px" }}
      okButtonProps={{ disabled: !isInfoChanged, ...styleButton }}
      destroyOnClose={true}
    >
      <Form
        className="info_customer_form"
        layout="vertical"
        onChange={handleInfoChange}
      >
        <Form.Item label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                message: "Please input your E-mail!",
              },
            ],
            initialValue: customerInfo.email,
          })(<Input disabled />)}
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
            initialValue: customerInfo.title,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Country">
          {getFieldDecorator("country", {
            rules: [
              {
                message: "Please input your country!",
              },
            ],
            initialValue: customerInfo.country,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="City">
          {getFieldDecorator("city", {
            rules: [
              {
                message: "Please input your city!",
              },
            ],
            initialValue: customerInfo.city,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [
              {
                message: "Please input your address!",
              },
            ],
            initialValue: customerInfo.address,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator("phone", {
            rules: [
              {
                message: "Please input your phone number!",
              },
            ],
            initialValue: customerInfo.phone,
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "info_customer_form" })(InfoCustomerModal);
