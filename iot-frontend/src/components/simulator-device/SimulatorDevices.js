import React, {useState} from "react";
import {Button, Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import {Redirect} from "react-router";
import CreateSimulatorDeviceModal from "./CreateSimulatorDeviceModal";
import SimulatorDeviceListTable from "./SimulatorDeviceListTable";

const SimulatorDevices = (props) => {
  const [openCreateSimulatorDevice, setOpenCreateSimulatorDevice] = useState(false);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority);
  const isAdmin = userRoles.includes("ADMIN");
  const isTenant = userRoles.includes("TENANT");

  return (
    <>
      <Row gutter={16}>
        <CreateSimulatorDeviceModal
          openCreateSimulatorDevice={openCreateSimulatorDevice}
          setOpenCreateSimulatorDevice={setOpenCreateSimulatorDevice}
        />
        <Col span={24}>
          <Card
            bordered={false}
            title={<p>Device</p>}
            bodyStyle={{ padding: "10px 20px" }}
            extra={
              isAdmin ||
              (isTenant && (
                <Button
                  type="primary"
                  shape="circle"
                  icon="plus"
                  onClick={() => setOpenCreateSimulatorDevice(true)}
                />
              ))
            }
          >
            <SimulatorDeviceListTable />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SimulatorDevices;
