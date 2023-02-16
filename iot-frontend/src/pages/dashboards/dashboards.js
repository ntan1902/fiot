import React, {useEffect} from "react"
import Dashboards from "../../components/dashboard/Dashboards"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {useDispatch, useSelector} from "react-redux"
import {loadDashboards, openDashboard} from "../../actions/dashboards"
import {loadWidgetTypes} from "../../actions/widgetTypes"
import {loadWidgetsBundles} from "../../actions/widgetsBundles"
import {loadDevices} from "../../actions/devices";
import {loadCustomers} from "../../actions/customers"

const DashboardsPage = () => {
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles.includes("TENANT")
    const dispatch = useDispatch()
    useEffect(() => {
        isTenant && dispatch(loadWidgetsBundles())
        isTenant && dispatch(loadWidgetTypes())
        dispatch(loadDashboards())
        dispatch(loadDevices())
        isTenant && dispatch(loadCustomers())

        dispatch(openDashboard({isOpen: false, dashboard: null}))
    }, [])

    return (
        <LayoutEntity>
            <Dashboards />
        </LayoutEntity>
    )
}

export default DashboardsPage
