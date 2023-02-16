import React from "react"
import router from "../../static/images/icon-router.png"
import active from "../../static/images/icon-active.png"
import inactive from "../../static/images/icon-inactive.png"
import visitor from "../../static/images/icon-visitor.png"
import dashboard from "../../static/images/icon-dashboard.png"

import Stats from "../home/Stats"
import {Typography, Card, Col, Row} from "antd"
import {useSelector} from "react-redux"
import {Redirect} from "react-router"
import {get} from "lodash"

import homePageIcon from "../../static/images/homepage-icon.svg"
import demoDashboard from "../../static/images/demo-dashboard.png"
import demoRulechain from "../../static/images/demo-rulechain.png"

const {Title, Paragraph, Text} = Typography

const Home = (props) => {
  const {user, isLoggedIn} = useSelector((state) => state.auth)
  const {devices} = useSelector((state) => state.devices)
  const {customers} = useSelector((state) => state.customers)
  const {dashboards} = useSelector((state) => state.dashboards)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles && userRoles.includes("TENANT")

  const username = get(user, "lastName", "") + " " + get(user, "firstName", "")

  const totalDevices = devices?.length || 0
  const activeDevices = devices?.filter((device) => device.isLive).length || 0
  const inactiveDevices = devices?.filter((device) => !device.isLive).length || 0

  const activeDevicesPercent = activeDevices !== 0 ? Math.round((activeDevices / devices?.length) * 100.0) : 0

  const inactiveDevicesPercent = inactiveDevices !== 0 ? Math.round((inactiveDevices / devices?.length) * 100.0) : 0

  if (!isLoggedIn) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6} className="custom-statcards">
          <Card bordered={false} className="sale" bodyStyle={{padding: "20px"}}>
            <Stats icon={router} text="Total devices" number={totalDevices} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} className="custom-statcards">
          <Card bordered={false} className="active" bodyStyle={{padding: "20px"}}>
            <Stats icon={active} text={`Active devices: ${activeDevices}`} number={activeDevicesPercent + "%"} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} className="custom-statcards">
          <Card bordered={false} bodyStyle={{padding: "20px"}} className="inactive">
            <Stats
              icon={inactive}
              text={`Inactive devices: ${inactiveDevices}`}
              number={inactiveDevicesPercent + "%"}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} className="custom-statcards">
          <Card bordered={false} bodyStyle={{padding: "20px"}} className="visitor">
            {isTenant ? (
              <Stats icon={visitor} text="Customers" number={customers?.length || 0} />
            ) : (
              <Stats icon={dashboard} text="Assigned Dashboards" number={dashboards?.length || 0} />
            )}
          </Card>
        </Col>
      </Row>

      <Row className="m-t-15" style={{marginLeft: "1px"}}>
        <Card bodyStyle={{padding: "16px"}}>
          <Typography style={{fontSize: "20px"}}>
            <Title className="intro">
              <img src={homePageIcon} alt="content" />
              <span style={{marginLeft: "10px", color: "#5077D7"}}>Getting start with FIoT</span>
            </Title>
            <Paragraph strong>Hi, {username}!</Paragraph>
            <Paragraph strong>
              Thank you for your interest in the <a>FIoT</a> open-source IoT Platform. At the moment you are browsing at
              a special dashboard called "Home". We have prepared this dashboard to demonstrate several use cases listed
              below. On the top of the dashboard, you may find some cards with device related information. You could
              always change your personal profile through <a href="/profile">here</a>.
            </Paragraph>
            <Paragraph strong>Below this session is a list of functionalities that our platform provide.</Paragraph>
          </Typography>
        </Card>
      </Row>

      <Row>
        <Card bodyStyle={{padding: "16px"}}>
          <Title level={2}>Data visualization</Title>
          <Row>
            <Col span={9}>
              <div>
                <Typography style={{fontSize: "20px"}}>
                  <Paragraph strong>
                    The FIoT platform provide user the ability to view the device's data on your own way. User can
                    design their own dashboard by dragging the pre-defined widgets and moving them around.
                  </Paragraph>
                  <Paragraph strong>
                    Please go to the following <a href="/dashboards">page</a> to perform this action.
                  </Paragraph>
                </Typography>
              </div>
            </Col>
            <Col span={15}>
              <div style={{height: "auto", marginLeft:"5px"}}>
                <img width="100%" height="auto" src={demoDashboard} alt="content" />
              </div>
            </Col>
          </Row>
        </Card>
      </Row>

      <Row>
        <Card bodyStyle={{padding: "16px"}}>
          <Title level={2}>Device's Rule-chain Implementation</Title>
          <Row>
            <Col span={9}>
              <div>
                <Typography style={{fontSize: "20px"}}>
                  <Paragraph strong>
                    The FIoT platform provide user the ability to implement the Rule-chain that apply user's logic onto
                    the devices. User can implement their own rule chain by drag and drop more than 10 pre-defined
                    functional rule node.
                  </Paragraph>
                  <Paragraph strong>
                    Please go to the following <a href="/rule-chains">page</a> to perform this action.
                  </Paragraph>
                </Typography>
              </div>
            </Col>
            <Col span={15}>
              <div style={{height: "auto", width: "auto"}}>
                <img width="100%" height="auto" src={demoRulechain} alt="content" />
              </div>
            </Col>
          </Row>
        </Card>
      </Row>
    </>
  )
}

export default Home
