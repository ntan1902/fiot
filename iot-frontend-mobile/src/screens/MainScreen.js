import * as React from 'react'

import { View, useWindowDimensions } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import ProfileScreen from './Profile'
import DevicesScreen from './Device/DevicesScreen'
import DashboardsScreen from './Dashboard/DashboardsScreen'
import { loadDevices } from '../actions/devices'
import { loadDashboards } from '../actions/dashboards'
import { BASE_URL } from '../config/setting'
import { getItem } from '../async-storage'
import { updateTelemetries } from '../actions/telemetry'
import { updateAlarms } from '../actions/alarms'

export default function Home({ navigation }) {
  const layout = useWindowDimensions()
  const { user, isLoggedIn } = useSelector((state) => state.auth)
  const [index, setIndex] = React.useState(0)

  const [routes] = React.useState([
    // { key: 'home', title: 'Home' },
    { key: 'device', title: 'Device' },
    { key: 'dashboard', title: 'Dashboard' },
    { key: 'profile', title: 'Profile' },
  ])

  const dispatch = useDispatch()
  const stompClient = useRef()
  let connectTimeout = null
  useEffect(() => {
    dispatch(loadDevices())
    dispatch(loadDashboards())

    const connect = async () => {
      const accessToken = await getItem('accessToken')
      const url = `${BASE_URL}/transport/ws?token=${accessToken}`

      const socket = new SockJS(url)
      stompClient.current = Stomp.over(socket)
      stompClient.current.debug = null
      stompClient.current.connect({}, onConnected, onError)
    }

    function onConnected() {
      // Subscribe to the Public Topic
      console.log('Connected to WebSocket')
      stompClient.current.subscribe(
        `/topic/telemetry-${user.id}`,
        onTelemetryReceived
      )
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
      console.log('STOMP: ' + err)
      if (connectTimeout === null) {
        connectTimeout = setTimeout(connect, 10000)
        console.log('STOMP: Reconnecting in 10 seconds')
      }
    }

    if (user) {
      connect()
    }
  }, [])

  const ProfileRoute = () => <ProfileScreen navigation={navigation} />

  const DeviceRoute = () => <DevicesScreen navigation={navigation} />

  const DashboardRoute = () => <DashboardsScreen navigation={navigation} />

  const renderScene = SceneMap({
    device: DeviceRoute,
    dashboard: DashboardRoute,
    profile: ProfileRoute,
  })

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      tabBarPosition="bottom"
    />
  )
}
