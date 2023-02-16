import React, { useEffect } from 'react'
import { StyleSheet, StatusBar, View, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'
import { loadAlarmsByDeviceId } from '../../actions/alarms'
import {
  loadTelemetryByDeviceId,
  loadLatestTelemetryByDeviceId,
} from '../../actions/telemetry'
import { openDashboard } from '../../actions/dashboards'
import renderComponent from './ComponentRenderer'

export default function DashboardLayoutScreen({ navigation }) {
  const dispatch = useDispatch()
  const { openedDashboard } = useSelector((state) => state.dashboards)
  const widgets = get(openedDashboard, 'dashboard.configuration.widgets', [])

  useEffect(() => {
    loadDevicesTelemetries()

    async function loadDevicesTelemetries() {
      const deviceList = []
      widgets.forEach((w) => {
        const dataSources = get(w, 'dataSources', {})
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(dataSources)) {
          deviceList.push(key)
        }
      })

      const uniqueDeviceIds = [...new Set(deviceList)]
      await Promise.all(
        uniqueDeviceIds.map(async (deviceId) => {
          if (deviceId) {
            dispatch(loadTelemetryByDeviceId(deviceId))
            dispatch(loadLatestTelemetryByDeviceId(deviceId))
            dispatch(loadAlarmsByDeviceId(deviceId))
          }
        })
      )
    }
  }, [openedDashboard])

  const onPressGoBack = () => {
    dispatch(openDashboard({ isOpen: false, dashboard: null }))
    navigation.navigate('MainScreen')
  }

  const layout = widgets.map((widget) => {
    return {
      typeAlias: widget.typeAlias,
      dataSources: get(widget, 'dataSources', {}),
      settings: get(widget, 'settings', {}),
    }
  })

  return (
    <View style={styles.chartWrapper}>
      <View>
        <Button title="x" onPress={onPressGoBack} />
      </View>
      {layout.map((item) => (
        <View>
          {renderComponent(item.typeAlias, item.dataSources, item.settings)}
        </View>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: '#3C99DC',
  },

  chartWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 35,
  },
})
