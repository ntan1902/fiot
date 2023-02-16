import React, {useEffect} from "react"
import WidgetsBundles from "../../components/widgets-bundle/WidgetsBundles"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {useDispatch} from "react-redux"
import {loadWidgetTypes} from "../../actions/widgetTypes"
import {loadWidgetsBundles} from "../../actions/widgetsBundles"

const WidgetsBundlesPage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadWidgetsBundles())
        dispatch(loadWidgetTypes())
    }, [])

    return (
        <LayoutEntity>
            <WidgetsBundles />
        </LayoutEntity>
    )
}

export default WidgetsBundlesPage
