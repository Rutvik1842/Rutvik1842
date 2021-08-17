import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import edite from './edite';
import details from './details';

// import user from './user';
// import map from './mapScreen';
// import login from './login';
import { FC } from 'react';
import {RootStackParamList} from './RootStackPrams'


const Stack = createStackNavigator<RootStackParamList>();

const App : FC=()=>{ 

  return (
    
    <NavigationContainer>
      <Stack.Navigator>
      {/* <Stack.Screen name="Login" component={login} /> */}
        <Stack.Screen
          name="Edite"
          component={edite}
        />
        <Stack.Screen name="Details" component={details} />
        {/* <Stack.Screen name="User" component={user} />
        <Stack.Screen name="Map" component={map} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

 export default App;
