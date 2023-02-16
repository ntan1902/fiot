import React, {useState} from "react"
import {Breadcrumb, Button, Card, Col, Row} from "antd"
import {useDispatch, useSelector} from "react-redux"
import {openDashboard} from "../../actions/dashboards"
import {Redirect} from "react-router"
import CreateDashboardModal from "./CreateDashboardModal"
import DashboardListTable from "./DashboardListTable"
import DesignLayout from "./DesignLayout"

const Dashboards = (props) => {
  const dispatch = useDispatch()
  const [openCreateDashboard, setOpenCreateDashboard] = useState(false)
  const {user, isLoggedIn} = useSelector((state) => state.auth)
  const {openedDashboard} = useSelector((state) => state.dashboards)
  if (!isLoggedIn) {
    return <Redirect to="/" />
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles.includes("TENANT")

  return openedDashboard.isOpen ? (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <a onClick={() => dispatch(openDashboard({isOpen: false, dashboard: null}))}>Dashboards</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{openedDashboard.dashboard.title}</Breadcrumb.Item>
      </Breadcrumb>
      <DesignLayout />
    </div>
  ) : (
    <Row gutter={16}>
      <CreateDashboardModal openCreateDashboard={openCreateDashboard} setOpenCreateDashboard={setOpenCreateDashboard} />
      <Col span={24}>
        <Card
          bordered={false}
          title={<p>Dashboard</p>}
          bodyStyle={{padding: "10px 20px"}}
          extra={isTenant && <Button type="primary" shape="circle" icon="plus" onClick={() => setOpenCreateDashboard(true)} />}
        >
          <DashboardListTable />
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboards
