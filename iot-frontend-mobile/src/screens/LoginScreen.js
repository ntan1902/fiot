import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { login } from '../actions/auth'
import { loadDevices } from '../actions/devices'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: 'nguyenon@gmail.com', error: '' })
  const [password, setPassword] = useState({ value: '123', error: '' })
  const [errorMsg, setErrorMsg] = useState({ isError: false, value: '' })
  const dispatch = useDispatch()

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)

    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    try {
      const result = await dispatch(login(email.value, password.value))
      if (!result) {
        console.log('Login failed')
        return
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainScreen' }],
      })
    } catch (e) {
      console.log('Error occurred while login: ', e.response)
      if (e.response.data.message) {
        setErrorMsg({ isError: true, value: e.response.data.message })
      }
    }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Login to your account</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      {errorMsg.isError && (
        <View>
          <Text style={styles.errorMsg}>{errorMsg.value}</Text>
        </View>
      )}
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  errorMsg: {
    fontWeight: 'bold',
    color: theme.colors.error,
  },
})
