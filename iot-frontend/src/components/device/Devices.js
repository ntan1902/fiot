import React, {useState} from "react"
import {Button, Card, Col, Row} from "antd"
import {useSelector} from "react-redux"
import {Redirect} from "react-router"
import CreateDeviceModal from "./CreateDeviceModal"
import DeviceListTable from "./DeviceListTable"

const Devices = (props) => {
  const [openCreateDevice, setOpenCreateDevice] = useState(false)
  const {user, isLoggedIn} = useSelector((state) => state.auth)
  if (!isLoggedIn) {
    return <Redirect to="/" />
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles.includes("TENANT")

  const handleOpenCreateDevice = (value) => {
    setOpenCreateDevice(value)
  }

  return (
    <>
      <Row gutter={16}>
        <CreateDeviceModal openCreateDevice={openCreateDevice} handleOpenCreateDevice={handleOpenCreateDevice} />
        <Col span={24}>
          <Card
            bordered={false}
            title={<p>Device</p>}
            bodyStyle={{padding: "10px 20px"}}
            extra={
              isTenant && (
                <Button type="primary" shape="circle" icon="plus" onClick={() => handleOpenCreateDevice(true)} />
              )
            }
          >
            <DeviceListTable />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Devices
