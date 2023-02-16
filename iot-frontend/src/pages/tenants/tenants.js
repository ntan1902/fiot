import React, {useEffect} from "react"
import Tenants from "../../components/tenant/Tenants"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {useDispatch} from "react-redux"
import {loadTenants} from "../../actions/tenants"

const TenantsPage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadTenants())
    }, [])

    return (
        <LayoutEntity>
            <Tenants />
        </LayoutEntity>
    )
}

export default TenantsPage
