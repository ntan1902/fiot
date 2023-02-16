import AsyncStorage from '@react-native-async-storage/async-storage'

// eslint-disable-next-line consistent-return
export async function getItem(key) {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (error) {
    console.log('Error occurred when get item from storage')
    return null
  }
  return null
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    // Error saving data
    console.log('Error occurred when set item into storage')
  }
}

export function removeItem(key) {
  try {
    AsyncStorage.removeItem(key)
  } catch (error) {
    // Error saving data
    console.log('Error occurred when remove item from storage')
  }
}
