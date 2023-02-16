import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Home from "../../components/home/Home"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {loadDevices} from "../../actions/devices"
import {loadCustomers} from "../../actions/customers"
import {loadDashboards} from "../../actions/dashboards"

const HomePage = () => {
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles && userRoles.includes("TENANT")

  useEffect(() => {
    dispatch(loadDevices())
    dispatch(loadDashboards())
    isTenant && dispatch(loadCustomers())
  }, [])

  return (
    <LayoutEntity>
      <Home />
    </LayoutEntity>
  )
}

export default HomePage
