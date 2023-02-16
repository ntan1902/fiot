import React, {useState} from "react"
import {Button, Card, Col, Row, Breadcrumb} from "antd"
import {useSelector, useDispatch} from "react-redux"
import {Redirect} from "react-router"
import CreateRuleChainModal from "./CreateRuleChainModal"
import RuleChainListTable from "./RuleChainListTable"
import RuleNodes from "../rule-node/RuleNodes"
import {openRuleNodes as openDesignRuleNodes} from "../../actions/ruleChains"

const RuleChains = (props) => {
  const dispatch = useDispatch()
  const [openCreateRuleChain, setOpenCreateRuleChain] = useState(false)

  const {user, isLoggedIn} = useSelector((state) => state.auth)
  const {openRuleNodes} = useSelector((state) => state.ruleChains)

  if (!isLoggedIn) {
    return <Redirect to="/" />
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isAdmin = userRoles.includes("ADMIN")
  const isTenant = userRoles.includes("TENANT")

  const handleOpenCreateRuleChain = (value) => {
    setOpenCreateRuleChain(value)
  }

  return openRuleNodes.isOpen ? (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <a onClick={() => dispatch(openDesignRuleNodes({isOpen: false}))}>Rule Chains</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{openRuleNodes.ruleChain.name}</Breadcrumb.Item>
      </Breadcrumb>
      <RuleNodes />
    </div>
  ) : (
    <Row gutter={16}>
      <div>
        <CreateRuleChainModal
          openCreateRuleChain={openCreateRuleChain}
          handleOpenCreateRuleChain={handleOpenCreateRuleChain}
        />
        <Col span={24}>
          {isAdmin ||
            (isTenant && (
              <Card
                bordered={false}
                title={<p>Rule Chains</p>}
                bodyStyle={{padding: "10px 20px"}}
                extra={
                  <Button type="primary" shape="circle" icon="plus" onClick={() => handleOpenCreateRuleChain(true)} />
                }
              >
                <RuleChainListTable />
              </Card>
            ))}
        </Col>
      </div>
    </Row>
  )
}

export default RuleChains
