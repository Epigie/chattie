import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './screens/Login'
import Register from './screens/Register'
import Chat from './screens/Chat'
import HeaderTitle from './components/HeaderComponents/HeaderTitle'
import ChatContent from './screens/ChatContent'
const Stack = createNativeStackNavigator()

const globalOptions = {
  headerStyle: { backgroundColor: '#1a6553' },
  headerTitleStyle: { color: '#fff' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center'
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='LoginScreen'
        screenOptions={globalOptions}
      >
        <Stack.Screen
          name='LoginScreen'
          component={Login}
          options={{
            headerTitle: 'Login'
          }}
        />
        <Stack.Screen
          name='RegisterScreen'
          component={Register}
          options={{
            headerTitle: 'Register'
          }}
        />
        <Stack.Screen
          name='ChatScreen'
          component={Chat}
          options={{
            headerTitle: (props) => <HeaderTitle {...props} /> // Use your custom header component
          }}
        />
        <Stack.Screen
          name='ChatContent'
          component={ChatContent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
