import React, {useState} from "react"
import {Button, Card, Col, Row} from "antd"
import {useSelector} from "react-redux"
import {Redirect} from "react-router"
import UserListTable from "./UserListTable"

const Customers = (props) => {
  const {user, isLoggedIn} = useSelector((state) => state.auth)
  if (!isLoggedIn) {
    return <Redirect to="/" />
  }

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isAdmin = userRoles.includes("ADMIN")

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          {isAdmin && (
            <Card bordered={false} title={<p>User</p>} bodyStyle={{padding: "10px 20px"}}>
              <UserListTable />
            </Card>
          )}
        </Col>
      </Row>
    </>
  )
}

export default Customers
