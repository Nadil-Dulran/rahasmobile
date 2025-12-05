import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';
import LoginScreen from './src/pages/LoginScreen';
import HomeScreen from './src/pages/HomeScreen';
import ChatScreen from './src/pages/ChatScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GradientBackground from './src/components/GradientBackground';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppStack() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatProvider>
          <GradientBackground>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown:true}}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={AppStack} options={{ headerShown: false }} />
                <Stack.Screen name="Chat" component={ChatScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </GradientBackground>
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}