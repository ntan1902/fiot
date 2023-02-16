import React, {useEffect, useState} from "react";
import {Form, Icon, Input, message, Modal, Select, Tooltip} from "antd";
import TenantService from "../../services/tenant";
import {find} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {updateTenant} from "../../actions/tenants";

const { Option } = Select;

const InfoTenantModal = (props) => {
  const { openTenantModal, tenantId, setOpenInfoModal } = props;
  const [tenantInfo, setTenantInfo] = useState({});
  const [isInfoChanged, setIsInfoChanged] = useState(false);

  const dispatch = useDispatch();
  const { tenants } = useSelector((state) => state.tenants);

  useEffect(() => {
    const loadTenant = async () => {
      if (tenantId) {
        const tenant = find(tenants, { id: tenantId });
        setTenantInfo(tenant);
      }
    };
    loadTenant();
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

  const handleUpdateTenantSubmit = async (e) => {
    e.preventDefault();
    confirm({
      title: "Are you sure to save tenant profile?",
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
                const updatedTenant = await TenantService.update(
                  tenantId,
                  values
                );
                dispatch(updateTenant(updatedTenant));
              } catch (e) {
                message.error(e.response.data.message)
                return;
              }
              message.success("Update tenant successfully!");
              setOpenInfoModal(false);
            }
          }
        );
      },

      cancelButtonProps: styleButton,
      onCancel() {
      },
    });
  };

  const handleInfoChange = (e) => {
    const values = props.form.getFieldsValue();
    console.log("values", values);
    if (
      values.email !== tenantInfo.email ||
      values.title !== tenantInfo.title ||
      values.country !== tenantInfo.country ||
      values.city !== tenantInfo.city ||
      values.address !== tenantInfo.address ||
      values.phone !== tenantInfo.phone
    ) {
      setIsInfoChanged(true);
    } else {
      setIsInfoChanged(false);
    }
  };

  return (
    <Modal
      title={<h2>Tenant Information</h2>}
      visible={openTenantModal}
      onOk={handleUpdateTenantSubmit}
      okText={"Save"}
      onCancel={() => setOpenInfoModal(false)}
      cancelButtonProps={styleButton}
      centered={true}
      bodyStyle={{ overflowY: "scroll", height: "600px" }}
      okButtonProps={{ disabled: !isInfoChanged, ...styleButton }}
      destroyOnClose={true}
    >
      <Form
        className="info_tenant_form"
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
            initialValue: tenantInfo.email,
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
            initialValue: tenantInfo.title,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Country">
          {getFieldDecorator("country", {
            rules: [
              {
                message: "Please input your country!",
              },
            ],
            initialValue: tenantInfo.country,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="City">
          {getFieldDecorator("city", {
            rules: [
              {
                message: "Please input your city!",
              },
            ],
            initialValue: tenantInfo.city,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [
              {
                message: "Please input your address!",
              },
            ],
            initialValue: tenantInfo.address,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator("phone", {
            rules: [
              {
                message: "Please input your phone number!",
              },
            ],
            initialValue: tenantInfo.phone,
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "info_tenant_form" })(InfoTenantModal);
