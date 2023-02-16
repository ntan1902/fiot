import React, {useEffect, useState} from "react";
import {Cascader, Form, Icon, Input, message, Modal, Tooltip,} from "antd";
import constant from "../../helpers/constants";
import {DeviceService} from "../../services";
import {get} from "lodash";

const { TextArea } = Input;

const credentialsTypes = [
  {
    value: constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN,
    label: "Access token",
  },
  {
    value: constant.DEVICE_CREDENTIALS_TYPE_X_509,
    label: "X.509",
  },
  {
    value: constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC,
    label: "MQTT Basic",
  },
];

const ManageCredentialsModal = (props) => {
  const { openManageCredentialsModal, setOpenManageCredentialsModal, deviceId } =
    props;
  const { getFieldDecorator } = props.form;
  const [credentialsType, setCredentialsType] = useState(
    constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN
  );

  const [deviceCredentials, setDeviceCredentials] = useState({});

  const styleButton = {
    style: { borderRadius: "5px" },
    size: "large",
  };

  useEffect(() => {
    const loadCredentials = async () => {
      if (deviceId) {
        const deviceCredentials = await DeviceService.getCredentialsById(deviceId);
        setDeviceCredentials(deviceCredentials);
        const credentialsType = get(
          deviceCredentials,
          "deviceCredentials.credentialsType"
        );
        setCredentialsType(credentialsType);
      }
    };
    loadCredentials();
  }, [openManageCredentialsModal]);

  const handleCreateDeviceSubmit = async (e) => {
    e.preventDefault();
    const fields = [];
    if (isTypeAccessToken) {
      fields.push("accessToken");
    }
    if (isTypeX509) {
      fields.push("RSAPublicKey");
    }
    if (isTypeMqttBasic) {
      fields.push("clientId", "username", "password");
    }

    props.form.validateFields(fields, async (err, values) => {
      if (!err) {
        let credentialsValue = {};
        if (isTypeAccessToken) {
          if (values.accessToken) {
            credentialsValue = {
              accessToken: values.accessToken,
            };
          }
        }

        if (isTypeX509) {
          credentialsValue = {
            RSAPublicKey: values.RSAPublicKey,
          };
        }

        if (isTypeMqttBasic) {
          const { clientId, username, password } = values;
          credentialsValue = {
            clientId,
            username,
            password,
          };
        }

        try {
          const requestBody = {
            credentialsType,
            credentialsValue,
          };
          console.log("requestBody", requestBody);
          await DeviceService.updateCredentials(deviceId, requestBody);
        } catch (e) {
          message.error(e.response.data.message);
          return;
        }
        message.success("Update device credentials successfully!");
        props.form.resetFields();
        setOpenManageCredentialsModal(false);
      }
    });
  };

  const handleSelectCredentialsType = (type) => {
    setCredentialsType(type[0]);
  };

  const _credentialsType = get(deviceCredentials, "deviceCredentials.credentialsType");
  const _credentialsId = get(deviceCredentials, "deviceCredentials.credentialsId");
  const _credentialsValue = get(
    deviceCredentials,
    "deviceCredentials.credentialsValue"
  );

  let _accessToken, _RSAPublicKey, _clientId, _username, _password;
  if (_credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
    _accessToken = _credentialsId;
  }

  if (_credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509) {
    _RSAPublicKey = _credentialsValue;
  }

  if (_credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
    const parseValue = JSON.parse(_credentialsValue);
    _clientId = parseValue.clientId;
    _username = parseValue.username;
    _password = parseValue.password;
  }

  const isTypeAccessToken =
    credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN;
  const isTypeX509 = credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509;
  const isTypeMqttBasic =
    credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC;

  return (
    <Modal
      title={<h2>Device Credentials</h2>}
      visible={openManageCredentialsModal}
      onOk={handleCreateDeviceSubmit} //submit form here
      okText={"Save"}
      okButtonProps={styleButton}
      onCancel={() => setOpenManageCredentialsModal(false)}
      cancelButtonProps={styleButton}
      centered={true}
      width={300}
    >
      <Form className="manage_credentials_form" layout="vertical">
        <Form.Item label="Credentials Type">
          {getFieldDecorator("credentialsType", {
            rules: [
              {
                required: true,
                message: "Please select credentials type!",
              },
            ],
            initialValue: [_credentialsType],
          })(
            <Cascader
              options={credentialsTypes}
              onChange={handleSelectCredentialsType}
            />
          )}
        </Form.Item>
        {isTypeAccessToken && (
          <Form.Item
            label={
              <span>
                Access token&nbsp;
                <Tooltip title="Access token will be automatically generated if you don't provide.">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator("accessToken", {
              initialValue: _accessToken,
            })(<Input />)}
          </Form.Item>
        )}
        {isTypeX509 && (
          <Form.Item label="RSA public key">
            {getFieldDecorator("RSAPublicKey", {
              rules: [
                {
                  required: true,
                  message: "Please input device RSA public key!",
                },
              ],
              initialValue: _RSAPublicKey,
            })(<TextArea />)}
          </Form.Item>
        )}
        {isTypeMqttBasic && (
          <div>
            <Form.Item label="Client ID">
              {getFieldDecorator("clientId", {
                rules: [
                  {
                    required: true,
                    message: "Please input MQTT clientId!",
                  },
                ],
                initialValue: _clientId,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Username">
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "Please input MQTT Username!",
                  },
                ],
                initialValue: _username,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Password">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input MQTT Password!",
                  },
                ],
                initialValue: _password,
              })(<Input.Password />)}
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "manage_credentials_form" })(
  ManageCredentialsModal
);
