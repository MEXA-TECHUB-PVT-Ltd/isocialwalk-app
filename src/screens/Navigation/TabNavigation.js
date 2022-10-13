import * as React from 'react';
import {Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../Home';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 70,
          borderTopWidth: 0,
          elevation: 24,
          shadowColor: '#FFF',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../../assets/images/home.png')}
              style={{
                height: 36,
                width: 25,
                position: 'relative',
                top: 5,
              }}
              resizeMode={'stretch'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
