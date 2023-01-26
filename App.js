import React, { useEffect, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigations from "./src/screens/Navigation/DrawerNavigations";

import Home from "./src/screens/Home";
import LoadingScreen from "./src/screens/LoadingScreen";
import AuthScreen from "./src/screens/AuthScreen";
import Welcome from "./src/screens/Welcome";
import TabNavigation from "./src/screens/Navigation/TabNavigation";

import ChangePassword1 from "./src/screens/Verification/ChangePassword1";

import ChangePassword2 from "./src/screens/ChangePassword2";

//challenges
import CreateChallenges from "./src/screens/Challenges/CreateChallenges";
import ChallengesDetail from "./src/screens/Challenges/ChallengesDetail";

//groups
import CreateGroup from "./src/screens/Groups/CreateGroup";
import GroupDetail from "./src/screens/Groups/GroupDetail";
import JoinGroup from "./src/screens/Groups/JoinGroup";
import EditGroup from "./src/screens/Groups/EditGroup";

import Verification from "./src/screens/Verification/Verification";
import AccountCreated from "./src/screens/Verification/AccountCreated";
import ShareableInvitationLink from "./src/screens/Friends/ShareableInvitationLink";
import Notification from "./src/screens/Notification/Notification";

// friends
import FriendProfile from "./src/screens/Friends/FriendProfile";
import FriendRequest from "./src/screens/Friends/FriendRequest";
import AddFriend from "./src/screens/Friends/AddFriend";

//history
import History from "./src/screens/History/History";

import ChangePassword from "./src/screens/ChangePassword";
import ForgotPassword from "./src/screens/ForgotPassword";

import PrivacyPolicy from "./src/screens/PrivacyPolicy";
import ConnectDevices from "./src/screens/ConnectDevices";
import UpdateGoals from "./src/screens/UpdateGoals";

//profile
import UpdateProfile from "./src/screens/UpdateProfile";
import MyProfile from "./src/screens/MyProfile";

// chat
import Chat from "./src/screens/Chat/Chat";
import Conversations from "./src/screens/Chat/Conversations";
import GroupConversations from "./src/screens/Chat/GroupConversations";

import Summary from "./src/screens/Summary";
import DaySummary from "./src/screens/History/DaySummary";

import DrawerTest from "./src/screens/DrawerTest";

import SplashScreen from "react-native-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Store } from "./src/redux/store";

import { navigationRef } from "./RootNavigation";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Provider } from "react-redux";

import { firebase } from "@react-native-firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAztMILFUlgXAKQZqgbRSjGl30PxPCoYq4",
//   authDomain: "phonic-impact-308908.firebaseapp.com",
//   projectId: "phonic-impact-308908",
//   storageBucket: "phonic-impact-308908.appspot.com",
//   messagingSenderId: "42615399421",
//   appId: "1:42615399421:web:5938518a31f56e83d4ef94",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ7tzg8Zgjch9let2gsZR1orfDf-6npsk",
  authDomain: "isocialwalk-a6d51.firebaseapp.com",
  projectId: "isocialwalk-a6d51",
  storageBucket: "isocialwalk-a6d51.appspot.com",
  messagingSenderId: "520078194496",
  appId: "1:520078194496:web:87a93e30715677047baca5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const storageRef = storage.ref();

function App() {
  const Stack = createNativeStackNavigator();

  const [isLogin, setIsLogin] = useState(false);
  // const getUser = async () => {
  //   global.user = true;
  //   let user = await AsyncStorage.getItem("user");
  //   console.log("user ::::   ", user);
  //   if (user === null) {
  //     setIsLogin(false);
  //     SplashScreen.hide();
  //     // setLoading(false);
  //     // navigation.replace("Welcome");
  //   } else {
  //     setIsLogin(true);
  //     SplashScreen.hide();
  //     global.user = true;
  //     // setLoading(false);
  //     // navigation.replace("DrawerTest");
  //   }
  // };
  // useEffect(() => {
  //   getUser();
  // }, []);

  return (
    <Provider store={Store}>
      <NavigationContainer
        onReady={() => SplashScreen.hide()}
        ref={navigationRef}
      >
        <StatusBar backgroundColor={"#FFF"} barStyle={"dark-content"} />
        <Stack.Navigator
        // initialRouteName={global?.user == true ? "AuthScreen" : "Welcome"}
        >
          <Stack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DrawerTest"
            component={DrawerTest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabNavigation"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateChallenges"
            component={CreateChallenges}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateGroup"
            component={CreateGroup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verification"
            component={Verification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountCreated"
            component={AccountCreated}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ShareableInvitationLink"
            component={ShareableInvitationLink}
            options={{ headerShown: false }}
          />
          {/* groups */}
          <Stack.Screen
            name="GroupDetail"
            component={GroupDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JoinGroup"
            component={JoinGroup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ headerShown: false }}
          />
          {/*  friends  */}
          <Stack.Screen
            name="FriendProfile"
            component={FriendProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FriendRequest"
            component={FriendRequest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddFriend"
            component={AddFriend}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ConnectDevices"
            component={ConnectDevices}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateGoals"
            component={UpdateGoals}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="History"
            component={History}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Conversations"
            component={Conversations}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GroupConversations"
            component={GroupConversations}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Summary"
            component={Summary}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DaySummary"
            component={DaySummary}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChallengesDetail"
            component={ChallengesDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword1"
            component={ChangePassword1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditGroup"
            component={EditGroup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyProfile"
            component={MyProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword2"
            component={ChangePassword2}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
// function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar backgroundColor={'#FFF'} barStyle={'dark-content'} />
//       <DrawerNavigations />
//     </NavigationContainer>
//   );
// }

// export default App;

// import * as React from 'react';
// import {View, Text, StatusBar} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import AuthScreen from './src/screens/AuthScreen';
// import Welcome from './src/screens/Welcome';
// import Home from './src/screens/Home';
// import TabNavigation from './src/screens/Navigation/TabNavigation';

// import CreateChallenges from './src/screens/Challenges/CreateChallenges';
// //groups
// import CreateGroup from './src/screens/Groups/CreateGroup';
// import GroupDetail from './src/screens/Groups/GroupDetail';
// import JoinGroup from './src/screens/Groups/JoinGroup';

// import Verification from './src/screens/Verification/Verification';
// import AccountCreated from './src/screens/Verification/AccountCreated';
// import ShareableInvitationLink from './src/screens/Friends/ShareableInvitationLink';
// import Notification from './src/screens/Notification/Notification';
// // friends
// import FriendProfile from './src/screens/Friends/FriendProfile';
// import FriendRequest from './src/screens/Friends/FriendRequest';

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar backgroundColor={'#FFF'} barStyle={'dark-content'} />
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Welcome"
//           component={Welcome}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="AuthScreen"
//           component={AuthScreen}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="TabNavigation"
//           component={TabNavigation}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="Home"
//           component={Home}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="CreateChallenges"
//           component={CreateChallenges}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="CreateGroup"
//           component={CreateGroup}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="Verification"
//           component={Verification}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="AccountCreated"
//           component={AccountCreated}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="ShareableInvitationLink"
//           component={ShareableInvitationLink}
//           options={{headerShown: false}}
//         />
//         {/* groups */}
//         <Stack.Screen
//           name="GroupDetail"
//           component={GroupDetail}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="JoinGroup"
//           component={JoinGroup}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="Notification"
//           component={Notification}
//           options={{headerShown: false}}
//         />
//         {/*  friends  */}
//         <Stack.Screen
//           name="FriendProfile"
//           component={FriendProfile}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="FriendRequest"
//           component={FriendRequest}
//           options={{headerShown: false}}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
