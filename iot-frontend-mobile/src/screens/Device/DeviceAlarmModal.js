import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native'
import { Avatar, Card, Modal } from 'react-native-paper'
import { loadAlarmsByDeviceId } from '../../actions/alarms'
import { useDispatch } from 'react-redux'
import moment from 'moment'

const containerStyle = { backgroundColor: 'white', padding: 10 }

const colorSeverity = {
  CRITICAL: 'red',
  MAJOR: 'volcano',
  MINOR: 'orange',
  WARNING: 'gold',
  INDETERMINATE: '#f50',
}

export default function DeviceAlarmModal(props) {
  const dispatch = useDispatch()
  const { selectDevice, visible, onDismiss } = props
  const { alarms } = useSelector((state) => state.alarms)

  useEffect(() => {
    visible && selectDevice && dispatch(loadAlarmsByDeviceId(selectDevice.id))
  }, [selectDevice])

  const dataArray =
    !visible || !selectDevice
      ? []
      : alarms[selectDevice.id]?.map((alarm, index) => {
          return {
            key: index,
            createdAt: alarm.createdAt,
            name: alarm.name,
            severity: alarm.severity,
            detail: alarm.detail,
          }
        })

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>{selectDevice?.name + "'s alarms"}</Text>
      {dataArray?.map((alarm, i) => (
        <Card.Title
          key={i}
          style={styles.card}
          title={alarm.name}
          subtitle={moment(alarm.createdAt).calendar()}
          left={(props) => (
            <Avatar.Icon
              theme={{ colors: { background: 'red' } }}
              {...props}
              color="red"
              icon="alarm-light"
            />
          )}
          right={(props) => (
            <Text
              {...props}
              style={{
                color: colorSeverity[alarm.severity],
                marginRight: 10,
              }}
            >
              {alarm.severity}
            </Text>
          )}
        />
      ))}
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'red',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  container: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 10,
  },

  card: {
    backgroundColor: 'white',
    marginBottom: 5,
    marginTop: 5,
    marginHorizontal: 6,
    borderRadius: 4,
    borderWidth: 5,
  },

  subtitleView: {
    left: '250px',
    bottom: '35px',
  },
  createdAt: {
    color: 'grey',
  },
})
