import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { Avatar, Card, IconButton } from 'react-native-paper'
import DeviceAlarmModal from './DeviceAlarmModal'

export default function DevicesScreen({ navigation }) {
  const { devices } = useSelector((state) => state.devices)
  const [selectDevice, setSelectDevice] = useState(null)
  const [openAlarm, setOpenAlarm] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {devices.map((device, i) => (
          <TouchableOpacity
            onPress={() => {
              setSelectDevice(device)
              setOpenAlarm(true)
            }}
          >
            <Card.Title
              key={i}
              style={styles.card}
              title={device.name}
              subtitle={device.label}
              left={(props) => <Avatar.Icon {...props} icon="devices" />}
              right={(props) =>
                device.isLive ? (
                  <IconButton
                    color="green"
                    {...props}
                    icon="battery-charging-100"
                  />
                ) : (
                  <IconButton color="red" {...props} icon="battery-off" />
                )
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <DeviceAlarmModal
        visible={openAlarm}
        onDismiss={() => setOpenAlarm(false)}
        selectDevice={selectDevice}
      />
    </SafeAreaView>
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

  card: {
    backgroundColor: 'white',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  subtitleView: {
    left: '250px',
    bottom: '35px',
  },
  createdAt: {
    color: 'grey',
  },
})
