import React, {useEffect} from "react"
import Users from "../../components/user/Users"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {useDispatch, useSelector} from "react-redux"
import {loadUsers} from "../../actions/users"

const UsersPage = () => {
    const {user} = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(async () => {
      await dispatch(loadUsers(user.id))
    }, [])

    return (
        <LayoutEntity>
            <Users />
        </LayoutEntity>
    )
}

export default UsersPage
