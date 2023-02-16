import React, { useEffect, useState } from 'react'
import { Switch, View, StyleSheet } from 'react-native'
import { get } from 'lodash'
import { DeviceApi } from '../../../api'

let checkStatusInterval = null
const DeviceSwitchSelector = (props) => {
  // settings: {"getMethod": "getTemperature", "setMethod": "setTemperature", "deviceId": "deviceId", }
  const { settings } = props
  const [checked, setChecked] = useState(true)
  const deviceId = settings && settings.deviceId

  useEffect(() => {
    const rpcRequestInterval = get(settings, 'rpcRequestInterval', 5000)
    checkStatusInterval = setInterval(async () => {
      if (deviceId) {
        const value = await DeviceApi.rpcRequest(deviceId, {
          method: settings.getMethod,
          params: {},
        })
        setChecked(!!value)
      }
    }, rpcRequestInterval)

    return () => {
      if (checkStatusInterval) {
        clearInterval(checkStatusInterval)
      }
    }
  }, [])

  const handleChange = (value) => {
    setChecked(value)

    DeviceApi.rpcRequest(deviceId, {
      method: settings.setMethod,
      params: value,
    })
  }

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={checked ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={handleChange}
        value={checked}
        width={80}
        height={42}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default DeviceSwitchSelector
