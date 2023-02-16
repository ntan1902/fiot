import {combineReducers} from "redux";
import auth from "./auth";
import devices from "./devices"
import telemetries from "./telemetries";
import customers from "./customers"
import tenants from "./tenants"
import widgetsBundles from "./widgetsBundles";
import widgetTypes from "./widgetTypes";
import ruleChains from "./ruleChains";
import dashboards from "./dashboards";
import alarms from "./alarms";
import simulatorDevices from "./simulator-devices";
import users from "./users";

import {LOGOUT} from "../actions/types";

const appReducer = combineReducers({
    auth,
    devices,
    telemetries,
    customers,
    tenants,
    widgetsBundles,
    widgetTypes,
    ruleChains,
    dashboards,
    alarms,
    simulatorDevices,
    users
})

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer