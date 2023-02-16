import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { Avatar, Card, IconButton } from 'react-native-paper'
import { openDashboard } from '../../actions/dashboards'

export default function DashboardsScreen({ navigation }) {
  const dispatch = useDispatch()

  const { dashboards } = useSelector((state) => state.dashboards)

  const onSelectDashboard = (dashboard) => {
    navigation.navigate('DashboardLayoutScreen')
    dispatch(
      openDashboard({
        isOpen: true,
        dashboard,
      })
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {dashboards.map((dashboard, i) => (
          <TouchableOpacity onPress={() => onSelectDashboard(dashboard)}>
            <Card.Title
              key={i}
              style={styles.card}
              title={dashboard.title}
              subtitle={dashboard.description}
              left={(props) => (
                <Avatar.Icon {...props} icon="tablet-dashboard" />
              )}
              right={(props) => (
                <IconButton {...props} icon="more" onPress={() => {}} />
              )}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
