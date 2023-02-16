import React, {useState} from "react";
import {Button, Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import {Redirect} from "react-router";
import CreateCustomerModal from "./CreateCustomerModal";
import CustomerListTable from "./CustomerListTable";

const Customers = (props) => {
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority);
  const isAdmin = userRoles.includes("ADMIN");
  const isTenant = userRoles.includes("TENANT");

  const handleOpenCreateCustomer = (value) => {
    setOpenCreateCustomer(value);
  };
  return (
    <>
      <Row gutter={16}>
        <CreateCustomerModal
          openCreateCustomer={openCreateCustomer}
          handleOpenCreateCustomer={handleOpenCreateCustomer}
        />
        <Col span={24}>
          {isAdmin ||
            (isTenant && (
              <Card
                bordered={false}
                title={<p>Customer</p>}
                bodyStyle={{ padding: "10px 20px" }}
                extra={
                  <Button
                    type="primary"
                    shape="circle"
                    icon="plus"
                    onClick={() => handleOpenCreateCustomer(true)}
                  />
                }
              >
                <CustomerListTable />
              </Card>
            ))}
        </Col>
      </Row>
    </>
  )
};

export default Customers;
