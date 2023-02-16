import React from "react";
import FIoT from "../../static/images/fiot.png";

import avatar from "../../static/images/flat-avatar.png";

import {Link} from "react-router-dom";
import {logout} from "../../actions/auth";
import {useDispatch, useSelector} from "react-redux";

import {Avatar, Menu} from "antd";

const SubMenu = Menu.SubMenu;

const HeaderDiv = (props) => {

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Menu
      mode="horizontal"
      theme="light"
      className="d-flex align-items-center custom-navigation"
    >
      <Menu.Item key="brand-logo" className="brand-logo">
        <Link to="/">
          <img src={FIoT} className="m-r-5" alt=""/>
          {/*<span>FIoT</span>*/}
        </Link>
      </Menu.Item>

      <SubMenu
        key="profile"
        title={
          <span>
            <Avatar size={24} src={avatar} />
            <span style={{marginLeft: "8px"}}>{user.email}</span>
          </span>
        }
        className="auto"
      >
        <Menu.Item key="profile-view">
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout}>
          <Link to="/login">Logout</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default HeaderDiv;
