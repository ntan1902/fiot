import React, {useState} from "react";
import {Button, Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import {Redirect} from "react-router";
import CreateTenantModal from "./CreateTenantModal";
import TenantListTable from "./TenantListTable";

const Tenants = (props) => {
  const [openCreateTenant, setOpenCreateTenant] = useState(false);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority);
  const isAdmin = userRoles.includes("ADMIN");
  const isTenant = userRoles.includes("TENANT");

  const handleOpenCreateTenant = (value) => {
    setOpenCreateTenant(value);
  };

  return (
    <>
      <Row gutter={16}>
        <CreateTenantModal
          openCreateTenant={openCreateTenant}
          handleOpenCreateTenant={handleOpenCreateTenant}
        />
        <Col span={24}>
          {isAdmin ||
            (isTenant && (
              <Card
                bordered={false}
                title={<p>Tenant</p>}
                bodyStyle={{ padding: "10px 20px" }}
                extra={
                  <Button
                    type="primary"
                    shape="circle"
                    icon="plus"
                    onClick={() => handleOpenCreateTenant(true)}
                  />
                }
              >
                <TenantListTable />
              </Card>
            ))}
        </Col>
      </Row>
    </>
  );
};

export default Tenants;
