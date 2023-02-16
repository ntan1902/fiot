import React, {useState} from "react";
import {Button, Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import {Redirect} from "react-router";
import CreateWidgetsBundleModal from "./CreateWidgetsBundleModal";
import WidgetsBundleListTable from "./WidgetsBundleListTable";

const WidgetsBundles = (props) => {
  const [openCreateWidgetsBundle, setOpenCreateWidgetsBundle] = useState(false);

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority);
  const isAdmin = userRoles.includes("ADMIN");
  const isTenant = userRoles.includes("TENANT");

  const handleOpenCreateWidgetsBundle = (value) => {
    setOpenCreateWidgetsBundle(value);
  };

  return (
    <Row gutter={16}>
      <CreateWidgetsBundleModal
        openCreateWidgetsBundle={openCreateWidgetsBundle}
        handleOpenCreateWidgetsBundle={handleOpenCreateWidgetsBundle}
      />
      <Col span={24}>
        {isAdmin ||
          (isTenant && (
            <Card
              bordered={false}
              title={<p>Widgets Bundle</p>}
              bodyStyle={{ padding: "10px 20px" }}
              extra={
                <Button
                  type="primary"
                  shape="circle"
                  icon="plus"
                  onClick={() => handleOpenCreateWidgetsBundle(true)}
                />
              }
            >
              <WidgetsBundleListTable />
            </Card>
          ))}
      </Col>
    </Row>
  );
};

export default WidgetsBundles;
