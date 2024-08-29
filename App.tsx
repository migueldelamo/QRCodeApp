import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SuccessScreen from './src/components/SuccessScreen';
import FailureScreen from './src/components/FailureScreen';
import QRCodeScannerScreen from './src/components/QRCodeScannerScreen';
import HomeScreen from './src/components/HomeScreen';
import {JornadaProvider} from './src/context/JornadaContext';
import InformationScreen from './src/components/InformationScreen';
const Stack = createStackNavigator();
import {LogBox} from 'react-native';

// Deshabilitar todas las alertas de advertencia visuales
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <JornadaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scanner" component={QRCodeScannerScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="Failure" component={FailureScreen} />
          <Stack.Screen name="Information" component={InformationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </JornadaProvider>
  );
}

export default App;
