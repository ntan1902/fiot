import React from "react";
import {Link} from "react-router-dom";
import logo from "../../static/images/logo.png";
import LayoutLogin from "../../components/layout/LayoutLogin";
import {Button, Checkbox, Form, Icon, Input, message} from "antd";
import {useDispatch} from "react-redux";
import {createPassword, login} from "../../actions/auth";
import queryString from "query-string";
import {Redirect} from "react-router";

const CreatePassword = (props) => {
  const dispatch = useDispatch();

  const value = queryString.parse(props.location.search);
  const activateToken = value.activateToken;

  if (activateToken.length <= 0) {
    return <Redirect to="/login" />
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const result = await dispatch(createPassword(activateToken, values.password));
          if (!result) {
            message.error("Create password failed");
            return;
          }
          props.history.push("/");
        } catch (e) {
          e.response.data.message && message.error(e.response.data.message);
        }
      } else {
        message.error(err);
      }
    });
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const {form} = props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const {getFieldDecorator} = props.form;

  return (
      <LayoutLogin title="create password" classname="login">
        <div
            className="d-flex align-items-center justify-content-center flex-column"
            style={{maxWidth: "360px", margin: "auto", height: "100vh"}}
        >
          <div className="text-center">
            <img src={logo} alt={""}/>
            <h1 className="m-b-30 m-t-15">FIoT Create Password</h1>
          </div>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {required: true, message: "Please input your password!"},
                ],
              })(
                  <Input.Password
                      prefix={
                        <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>
                      }
                      type="password"
                      placeholder="Password"
                  />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("confirmPassword", {
                rules: [
                  {
                    required: true,
                    message: "Please input your confirm password!",
                  },
                  {validator: compareToFirstPassword},
                ],
              })(
                  <Input.Password
                      prefix={
                        <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>
                      }
                      type="password"
                      placeholder="Confirm your password"
                  />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-block m-t-15"
                  size="large"
              >
                Register
              </Button>
              <span>
              Already have an account?
              <a className="m-l-5" href="/">
                Log in
              </a>
            </span>
            </Form.Item>
          </Form>
        </div>
      </LayoutLogin>
  );
};

export default Form.create({name: "create_password"})(CreatePassword);
