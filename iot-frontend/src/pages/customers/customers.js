import React, {useEffect} from "react"
import Customers from "../../components/customer/Customers"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {useDispatch} from "react-redux"
import {loadCustomers} from "../../actions/customers"

const CustomersPage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadCustomers())
    }, [])

    return (
        <LayoutEntity>
            <Customers />
        </LayoutEntity>
    )
}

export default CustomersPage
