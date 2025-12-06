import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import App from './UI/App';
import App1 from './UI/App1';
import App2 from './UI/App2';
import App3 from './UI/App3';
import App4 from './UI/App4';
import App5 from './UI/App5';
import App6 from './UI/App6';
import App7 from './UI/App7';
import App8 from './UI/App8';
import App9 from './UI/App9';
import App10 from './UI/App10';
import App11 from './UI/App11';
import App12 from './UI/App12';
import App13 from './UI/App13';
import App14 from './UI/App14';
import App15 from './UI/App15';
import App16 from './UI/App16';
import App17 from './UI/App17';
import OnBoard1 from './UI/OnBoard1';

const Stack = createNativeStackNavigator();

export default function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App">
        <Stack.Screen
          name="App"
          component={App}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App1"
          component={App1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App2"
          component={App2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App3"
          component={App3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App4"
          component={App4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App5"
          component={App5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App6"
          component={App6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App7"
          component={App7}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App8"
          component={App8}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App9"
          component={App9}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App10"
          component={App10}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App11"
          component={App11}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App12"
          component={App12}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App13"
          component={App13}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App14"
          component={App14}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App15"
          component={App15}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App16"
          component={App16}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App17"
          component={App17}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OnBoard1"
          component={OnBoard1}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
