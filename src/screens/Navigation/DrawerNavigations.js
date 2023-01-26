import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
// import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Animated, {set} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../../screens/Home';
import SplashScreen from '../LoadingScreen';
import AuthScreen from '../AuthScreen';
import Welcome from '../Welcome';
import TabNavigation from './TabNavigation';

import CreateChallenges from '../Challenges/CreateChallenges';
import ChallengesDetail from '../Challenges/ChallengesDetail';
//groups
import CreateGroup from '../Groups/CreateGroup';
import GroupDetail from '../Groups/GroupDetail';
import JoinGroup from '../Groups/JoinGroup';

import Verification from '../Verification/Verification';
import AccountCreated from '../Verification/AccountCreated';
import ShareableInvitationLink from '../Friends/ShareableInvitationLink';
import Notification from '../Notification/Notification';

// friends
import FriendProfile from '../Friends/FriendProfile';
import FriendRequest from '../Friends/FriendRequest';
import AddFriend from '../Friends/AddFriend';

//history
import History from '../History/History';

import ChangePassword from '../ChangePassword';
import ForgotPassword from '../ForgotPassword';

import PrivacyPolicy from '../PrivacyPolicy';
import ConnectDevices from '../ConnectDevices';
import UpdateGoals from '../UpdateGoals';

// chat
import Chat from '../Chat/Chat';
import Conversations from '../Chat/Conversations';

import Summary from '../Summary';
import DaySummary from '../History/DaySummary';

import DrawerTest from '../DrawerTest';

import {useRoute} from '@react-navigation/native';

const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

const SCREEN_HEIGHT = Dimensions.get('screen').height;

const handleLogout = props =>
  Alert.alert('Log out', `Are you sure you want to logout from isocialWalk?`, [
    {
      text: 'No',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Yes', onPress: () => props.navigation.navigate('AuthScreen')},
  ]);

const Screens = ({navigation, style}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitle: null,
      }}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DrawerTest"
        component={DrawerTest}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateChallenges"
        component={CreateChallenges}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AccountCreated"
        component={AccountCreated}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShareableInvitationLink"
        component={ShareableInvitationLink}
        options={{headerShown: false}}
      />
      {/* groups */}
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JoinGroup"
        component={JoinGroup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      {/*  friends  */}
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConnectDevices"
        component={ConnectDevices}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UpdateGoals"
        component={UpdateGoals}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Conversations"
        component={Conversations}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Summary"
        component={Summary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DaySummary"
        component={DaySummary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChallengesDetail"
        component={ChallengesDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const DrawerContent = props => {
  const [activeScreen, setActiveScreen] = useState('');
  const [screenName, setScreenName] = useState('');
  AsyncStorage.getItem('Screen').then(res => {
    setActiveScreen(res);
  });
  AsyncStorage.getItem('ScreenName').then(res => {
    // setActiveScreen(res);
    res != null && setScreenName(res);
  });
  return (
    <DrawerContentScrollView {...props} scrollEnabled={false} style={{flex: 1}}>
      <View
        style={{
          paddingLeft: 10,
          height: SCREEN_HEIGHT,
        }}>
        {activeScreen !== '' && (
          <Image
            source={{
              uri: activeScreen,
            }}
            style={{
              zIndex: 999,
              height: '75%',
              width: '70%',
              resizeMode: 'contain',
              position: 'absolute',
              right: -85,
              top: 75,
              //   backgroundColor: 'red',
            }}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 150,
          }}>
          <Image
            source={require('../../../assets/images/friend-profile.png')}
            style={{width: 60, height: 60, borderRadius: 70}}
          />
          <Text style={{color: '#002138', marginLeft: 10, fontSize: 16}}>
            Jonathan
          </Text>
        </View>
        {screenName != '' ? (
          <DrawerItem
            label={screenName}
            labelStyle={{
              ...styles.drawerLblStyle,
              color: props.focused ? '#fff' : '#002138',
            }}
            onPress={() =>
              props.navigation.navigate('TabNavigation', {
                screen: {screenName},
              })
            }
            icon={() => (
              <Image
                source={
                  screenName == 'Chat'
                    ? require('../../../assets/images/chat-inactive.png')
                    : screenName == 'Friends'
                    ? require('../../../assets/images/friends-dark.png')
                    : screenName == 'Groups'
                    ? require('../../../assets/images/group-dark.png')
                    : screenName == 'Challenges'
                    ? require('../../../assets/images/trophy-dark.png')
                    : require('../../../assets/images/home1.png')
                }
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#002138',
                }}
              />
            )}
          />
        ) : (
          <DrawerItem
            label="Home"
            labelStyle={{
              ...styles.drawerLblStyle,
              color: props.focused ? '#fff' : '#002138',
            }}
            //   onPress={() => props.navigation.navigate('Home')}
            onPress={() =>
              props.navigation.navigate('TabNavigation', {
                screen: 'Home',
              })
            }
            icon={() => (
              <Image
                source={require('../../../assets/images/home1.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#002138',
                }}
              />
            )}
          />
        )}

        <DrawerItem
          label="History"
          labelStyle={styles.drawerLblStyle}
          onPress={() => props.navigation.navigate('History')}
          icon={() => (
            <Image
              source={require('../../../assets/images/history.png')}
              style={{
                width: 16,
                height: 19,
                resizeMode: 'contain',
                tintColor: '#002138',
              }}
            />
          )}
        />
        <DrawerItem
          label="Change Password"
          labelStyle={styles.drawerLblStyle}
          onPress={() => props.navigation.navigate('ChangePassword')}
          icon={() => (
            <Image
              source={require('../../../assets/images/lock.png')}
              style={{
                width: 16,
                height: 19,
                resizeMode: 'contain',
                tintColor: '#002138',
              }}
            />
          )}
        />
        <DrawerItem
          label="Connect Devices"
          activeTintColor="red"
          labelStyle={{
            ...styles.drawerLblStyle,
            color: props.focused ? '#fff' : '#002138',
          }}
          onPress={() => props.navigation.navigate('ConnectDevices')}
          icon={() => (
            <Image
              source={require('../../../assets/images/connectedDevices.png')}
              style={{
                width: 16,
                height: 19,
                resizeMode: 'contain',
                tintColor: '#002138',
              }}
            />
          )}
        />

        <DrawerItem
          label="Privacy Policy"
          labelStyle={{
            ...styles.drawerLblStyle,
            color: props.focused ? '#fff' : '#002138',
          }}
          onPress={() => props.navigation.navigate('PrivacyPolicy')}
          icon={() => (
            <Image
              source={require('../../../assets/images/privacy.png')}
              style={{
                width: 16,
                height: 19,
                tintColor: '#002138',
              }}
            />
          )}
        />

        <DrawerItem
          label="UpdateGoals"
          labelStyle={{
            ...styles.drawerLblStyle,
            color: props.focused ? '#fff' : '#002138',
          }}
          onPress={() => props.navigation.navigate('UpdateGoals')}
          icon={() => (
            <Image
              source={require('../../../assets/images/goals.png')}
              style={{
                width: 16,
                height: 19,
                tintColor: '#002138',
              }}
            />
          )}
        />

        <TouchableOpacity
          onPress={() => handleLogout(props)}
          style={{marginLeft: 18, marginTop: 10, flexDirection: 'row'}}>
          <Image
            source={require('../../../assets/images/logout.png')}
            style={{
              width: 16,
              height: 19,
              tintColor: '#002138',
            }}
          />
          <Text style={{...styles.drawerLblStyle, marginLeft: 15}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default () => {
  return (
    <Drawer.Navigator
      backBehavior="none"
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        // headerTransparent: true,
        //   drawerType: 'slide',
        // drawerType: 'slide',
        overlayColor: 'transparent',
        drawerStyle: {
          flex: 1,
          width: '100%',
          //   backgroundColor: 'transparent',
          backgroundColor: '#38ACFF',
        },
        drawerContentContainerStyle: {
          // flex: 1,
          width: 150,
          backgroundColor: 'red',
        },
        sceneContainerStyle: styles.scene,
        //   drawerActiveBackgroundColor: 'yellow',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#000',
      }}
      drawerContent={props => {
        return <DrawerContent {...props} />;
      }}>
      {/* <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: 'orange',
            },
            headerTintColor: 'black',
            headerLeft: false,
            headerRight: () => (
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
            ),
          }}
        /> */}

      <Drawer.Screen name="Screens">
        {props => <Screens {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  scene: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    backgroundColor: 'transparent',
  },
  stack: {
    flex: 1,
    height: 200,
    // backgroundColor: 'red',
  },
  drawerStyles: {flex: 1, width: '50%', backgroundColor: 'transparent'},
  menu: {
    width: 38,
    height: 38,
    margin: 20,
  },
  drawerLblStyle: {
    color: '#002138',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: -20,
    // backgroundColor: 'red',
    // width: 140,
  },
});
