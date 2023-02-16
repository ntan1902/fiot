import React, {useEffect, useRef} from "react"
import {Card, Col, Row} from "antd"
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {Redirect} from "react-router"
import "../src/styles/global.scss"

import SockJS from "sockjs-client"
import Stomp from "stompjs"
import {BASE_URL} from "./config/setting"
import {getItem} from "./local-storage"

import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/home/home"
import Users from "./pages/users/users"
import ProfilePage from "./pages/profile/ProfilePage"
import CustomersPage from "./pages/customers/customers"
import TenantsPage from "./pages/tenants/tenants"
import DevicesPage from "./pages/devices/devices"
import DashboardsPage from "./pages/dashboards/dashboards"
import RuleChainsPage from "./pages/rule-chains/rule-chains"
import WidgetsBundlesPage from "./pages/widgets-bundles/widgets-bundles"
import SimulatorDevicesPage from "./pages/simulator-devices/simulator-devices"

import {updateTelemetries} from "./actions/telemetry"
import {updateAlarms} from "./actions/alarms"
import CreatePassword from "./pages/login/CreatePassword"
import {loadSimulatorDevices} from "./actions/simulatorDevices"
import {loadDevices} from "./actions/devices"
import {TransportService} from "./services"
import {get} from "lodash"

const postTelemetryIntervals = []

function App() {
  const dispatch = useDispatch()
  const {user, isLoggedIn} = useSelector((state) => state.auth)
  const {simulatorDevices} = useSelector((state) => state.simulatorDevices)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles && userRoles.includes("TENANT")
  const isAdmin = userRoles && userRoles.includes("ADMIN")

  const NoMatchPage = () => {
    return (
      <Row style={{marginTop: "20%"}}>
        <Col xs={{span: 12, offset: 6}}>
          <Card>
            <div className="card-body">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <h2>Page not found</h2>
                <Link to="/">back to dashboard</Link>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    )
  }

  const handleRedirect = (component, canAccess = true) => {
    if (!isLoggedIn) {
      return <Redirect to="/login" />
    }
    if (!canAccess) {
      return <Redirect to="*" />
    }
    return component
  }

  const stompClient = useRef()
  let connectTimeout = null

  useEffect(() => {
    if (user && isLoggedIn) {
      isTenant && dispatch(loadSimulatorDevices())
      dispatch(loadDevices())
    }
  }, [])

  useEffect(() => {
    if (user && isLoggedIn && isTenant) {
      const intervalId = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER)
      for (let i = 1; i < intervalId; i++) {
        window.clearInterval(i)
      }
      if (simulatorDevices && simulatorDevices.length > 0) {
        simulatorDevices.forEach((d) => {
          const simulatorDeviceId = get(d, "id")
          const requestInterval = get(d, "requestInterval", 5000)
          const deviceToken = get(d, "deviceToken")
          const dataSources = JSON.parse(get(d, "dataSources", "{}"))
          const isAlive = get(d, "isAlive", false)

          if (isAlive) {
            postTelemetryIntervals[simulatorDeviceId] = setInterval(() => {
              const requestBody = TransportService.generateTelemetryData(deviceToken, dataSources)
              console.log("Post telemetry", JSON.stringify(requestBody))
              try {
                TransportService.postTelemetry(requestBody)
              } catch (e) {
                console.log("Error occur while post telemetry", e.message)
              }
            }, requestInterval)
          }
        })
      }
    }
  }, [simulatorDevices])

  useEffect(() => {
    const connect = () => {
      const url = `${BASE_URL}/transport/ws?token=${getItem("accessToken")}`

      const socket = new SockJS(url)
      stompClient.current = Stomp.over(socket)
      stompClient.current.debug = null
      stompClient.current.connect({}, onConnected, onError)
    }

    function onConnected() {
      // Subscribe to the Public Topic
      console.log("Connected to WebSocket")
      stompClient.current.subscribe(`/topic/telemetry-${user.id}`, onTelemetryReceived)
      stompClient.current.subscribe(`/topic/debug-${user.id}`, onDebugReceived)
      stompClient.current.subscribe(`/topic/alarm-${user.id}`, onAlarmReceived)
      stompClient.current.reconnect_relay = 10000

      if (connectTimeout) {
        clearTimeout(connectTimeout)
        connectTimeout = null
      }
    }

    const onTelemetryReceived = (payload) => {
      const message = JSON.parse(payload.body)
      const newTelemetries = message.kvs.map((kv) => {
        return {
          entityId: message.entityId,
          ...kv,
        }
      })
      dispatch(updateTelemetries(newTelemetries))
    }

    const onDebugReceived = (payload) => {
      console.log(payload.body)
    }

    const onAlarmReceived = (payload) => {
      const newAlarm = JSON.parse(payload.body)
      dispatch(updateAlarms(newAlarm))
    }

    const onError = (err) => {
      console.log("STOMP: " + err)
      if (connectTimeout === null) {
        connectTimeout = setTimeout(connect, 10000)
        console.log("STOMP: Reconnecting in 10 seconds")
      }
    }

    if (user && isLoggedIn && !isAdmin) {
      connect()
    }
  }, [isLoggedIn])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/login/create-password" component={CreatePassword} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/" render={() => handleRedirect(<Home />)} />
          <Route exact path="/users" render={() => handleRedirect(<Users />, isAdmin)} />
          <Route exact path="/profile" render={() => handleRedirect(<ProfilePage />)} />
          <Route exact path="/devices" render={() => handleRedirect(<DevicesPage />)} />
          <Route exact path="/tenants" render={() => handleRedirect(<TenantsPage />, (!isAdmin && isTenant))} />
          <Route exact path="/customers" render={() => handleRedirect(<CustomersPage />, (!isAdmin && isTenant))} />
          <Route exact path="/widgets-bundles" render={() => handleRedirect(<WidgetsBundlesPage />, (!isAdmin && isTenant))} />
          <Route exact path="/dashboards" render={() => handleRedirect(<DashboardsPage />)} />
          <Route exact path="/rule-chains" render={() => handleRedirect(<RuleChainsPage />, (!isAdmin && isTenant))} />
          <Route exact path="/simulator-devices" render={() => handleRedirect(<SimulatorDevicesPage />, (!isAdmin && isTenant))} />

          <Route path="*" component={NoMatchPage} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
