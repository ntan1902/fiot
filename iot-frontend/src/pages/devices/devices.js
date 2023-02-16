import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import Devices from "../../components/device/Devices"
import LayoutEntity from "../../components/layout/LayoutEntity"

import {loadDevices} from "../../actions/devices"
import {loadCustomers} from "../../actions/customers"
import {loadTenants} from "../../actions/tenants"
import {loadRuleChains, loadRuleNodeDescriptors} from "../../actions/ruleChains"

const DevicesPage = () => {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const userRoles = user && user.authorities.map((auth) => auth.authority)
    const isTenant = userRoles && userRoles.includes("TENANT")

    useEffect(() => {
        isTenant && dispatch(loadCustomers())
        isTenant && dispatch(loadTenants())
        dispatch(loadDevices())
        isTenant && dispatch(loadRuleChains())
        isTenant && dispatch(loadRuleNodeDescriptors())
    }, [])

    return (
        <LayoutEntity>
            <Devices />
        </LayoutEntity>
    )
}

export default DevicesPage
