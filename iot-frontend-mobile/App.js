import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  MainScreen,
  HomeScreen,
  ProfileScreen,
  DashboardsScreen,
  DashboardLayoutScreen,
} from './src/screens'
import { store } from './src/store'

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen
              name="DashboardsScreen"
              component={DashboardsScreen}
            />
            <Stack.Screen
              name="DashboardLayoutScreen"
              component={DashboardLayoutScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </React.StrictMode>
    </Provider>
  )
}
