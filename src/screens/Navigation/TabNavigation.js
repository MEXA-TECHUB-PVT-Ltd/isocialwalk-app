import * as React from 'react';
import {Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../Home';
import Groups from '../Groups';
import Friends from '../Friends';

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
          shadowColor: 'blue',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({focused}) =>
            focused ? (
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
            ) : (
              <Image
                source={require('../../../assets/images/home-inactive.png')}
                style={{
                  height: 25,
                  width: 25,
                  position: 'relative',
                  top: 5,
                }}
                resizeMode={'stretch'}
              />
            ),
        }}
      />

      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image
                source={require('../../../assets/images/friend-active.png')}
                style={{
                  height: 36,
                  width: 29,
                  position: 'relative',
                  top: 5,
                }}
                resizeMode={'stretch'}
              />
            ) : (
              <Image
                source={require('../../../assets/images/friend-inactive.png')}
                style={{
                  height: 25,
                  width: 29,
                  position: 'relative',
                  top: 5,
                }}
                resizeMode={'stretch'}
              />
            ),
        }}
      />

      <Tab.Screen
        name="Groups"
        component={Groups}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image
                source={require('../../../assets/images/group.png')}
                style={{
                  height: 36,
                  width: 29,
                  position: 'relative',
                  top: 5,
                }}
                resizeMode={'stretch'}
              />
            ) : (
              <Image
                source={require('../../../assets/images/group-inactive.png')}
                style={{
                  height: 25,
                  width: 29,
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
