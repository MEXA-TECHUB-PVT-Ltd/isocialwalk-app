import * as React from "react";
import { Text, View, Image, Animated } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Home from "../Home";
import Groups from "../Groups/Groups";
import Friends from "../Friends/Friends";
import Challenges from "../Challenges/Challenges";
import Chat from "../Chat/Chat";

const Tab = createBottomTabNavigator();

const TabNavigation = ({
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
  activeTab,
  setActiveTab,
}) => {
  const navigation = useNavigation();

  return (
    <Animated.View
      collapsable={false}
      style={{
        flex: 1,
        backgroundColor: "transparent",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: showMenu ? 15 : 0,
        transform: [{ scale: scale }, { translateX: moveToRight }],
      }}
    >
      <Tab.Navigator
        // initialRouteName="Chat"

        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: 70,
            borderTopWidth: 0,
            elevation: 24,
            shadowColor: "blue",
          },
        }}
        // tabBar={navigation => console.log(navigation.state.index)}
      >
        <Tab.Screen
          name="Home"
          // component={Home}
          children={(props) => (
            <Home
              {...props}
              scale={scale}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              moveToRight={moveToRight}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          options={{
            headerShown: false,
            tabBarLabel: "",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/home-inactive1.png")}
                    style={{
                      // height: 25,
                      // width: 29,
                      height: hp(3),
                      width: wp(8),
                      tintColor: "#38ACFF",
                      resizeMode: "contain",
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/Line3.png")}
                    style={{
                      position: "absolute",
                      top: 30,
                      height: 4,
                      width: 8,
                    }}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../../assets/images/home-inactive1.png")}
                  style={{
                    height: hp(3),
                    width: wp(6),
                    // height: 25,
                    // width: 25,
                    position: "relative",
                    top: 5,
                  }}
                  resizeMode={"stretch"}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Friends"
          // component={Friends}
          children={(props) => (
            <Friends
              {...props}
              scale={scale}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              moveToRight={moveToRight}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          options={{
            headerShown: false,
            tabBarLabel: "",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/friends-dark.png")}
                    style={{
                      // height: 25,
                      // width: 29,
                      height: hp(3),
                      width: wp(10),
                      tintColor: "#38ACFF",
                      resizeMode: "contain",
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/Line3.png")}
                    style={{
                      position: "absolute",
                      top: 30,
                      height: 4,
                      width: 8,
                    }}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../../assets/images/friends-dark.png")}
                  style={{
                    // height: 25,
                    // width: 29,
                    height: hp(3),
                    width: wp(6),
                    position: "relative",
                    top: 5,
                  }}
                  resizeMode={"stretch"}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Chat"
          // component={Chat}
          children={() => (
            <Chat
              scale={scale}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              moveToRight={moveToRight}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          options={{
            headerShown: false,
            tabBarLabel: "",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/chat-inactive.png")}
                    style={{
                      // height: 25,
                      // width: 29,
                      height: hp(3),
                      width: wp(8),
                      tintColor: "#38ACFF",
                      resizeMode: "contain",
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/Line3.png")}
                    style={{
                      position: "absolute",
                      top: 30,
                      height: 4,
                      width: 8,
                    }}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../../assets/images/chat-inactive.png")}
                  style={{
                    // height: 25,
                    // width: 29,
                    height: wp(7),
                    width: wp(7),
                    position: "relative",
                    top: 5,
                  }}
                  resizeMode={"stretch"}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Groups"
          // component={Groups}
          children={(props) => (
            <Groups
              {...props}
              scale={scale}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              moveToRight={moveToRight}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          options={{
            headerShown: false,
            tabBarLabel: "",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/group-dark.png")}
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: "#38ACFF",
                      resizeMode: "contain",
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/Line3.png")}
                    style={{
                      position: "absolute",
                      top: 30,
                      height: 4,
                      width: 8,
                    }}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../../assets/images/group-dark.png")}
                  style={{
                    height: wp(7),
                    width: wp(7),
                    position: "relative",
                    top: 5,
                  }}
                  resizeMode={"stretch"}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Challenges"
          // component={Challenges}
          children={(props) => (
            <Challenges
              {...props}
              scale={scale}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              moveToRight={moveToRight}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          options={{
            headerShown: false,
            tabBarLabel: "",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/trophy-dark.png")}
                    style={{
                      // height: 25,
                      // width: 29,
                      height: hp(3),
                      width: wp(8),
                      tintColor: "#38ACFF",
                      resizeMode: "contain",
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/Line3.png")}
                    style={{
                      position: "absolute",
                      top: 30,
                      height: 4,
                      width: 8,
                    }}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../../assets/images/trophy-dark.png")}
                  style={{
                    // height: 25,
                    // width: 29,
                    height: hp(3),
                    width: wp(7),
                    position: "relative",
                    top: 5,
                  }}
                  resizeMode={"contain"}
                />
              ),
          }}
        />
      </Tab.Navigator>
    </Animated.View>
  );
};

export default TabNavigation;

// import * as React from 'react';
// import {Text, View, Image} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// import Home from '../Home';
// import Groups from '../Groups/Groups';
// import Friends from '../Friends/Friends';
// import Challenges from '../Challenges/Challenges';
// import Chat from '../Chat/Chat';

// const Tab = createBottomTabNavigator();

// const TabNavigation = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           height: 70,
//           borderTopWidth: 0,
//           elevation: 24,
//           shadowColor: 'blue',
//         },
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           headerShown: false,
//           tabBarLabel: '',
//           tabBarIcon: ({focused}) =>
//             focused ? (
//               <Image
//                 source={require('../../../assets/images/home.png')}
//                 style={{
//                   height: 36,
//                   width: 25,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ) : (
//               <Image
//                 source={require('../../../assets/images/home-inactive1.png')}
//                 style={{
//                   height: 25,
//                   width: 25,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ),
//         }}
//       />

//       <Tab.Screen
//         name="Friends"
//         component={Friends}
//         options={{
//           headerShown: false,
//           tabBarLabel: '',
//           tabBarIcon: ({focused}) =>
//             focused ? (
//               <Image
//                 source={require('../../../assets/images/friend-active.png')}
//                 style={{
//                   height: 36,
//                   width: 29,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ) : (
//               <Image
//                 source={require('../../../assets/images/friends-dark.png')}
//                 style={{
//                   height: 25,
//                   width: 29,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ),
//         }}
//       />

//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           headerShown: false,
//           tabBarLabel: '',
//           tabBarIcon: ({focused}) =>
//             focused ? (
//               <View
//                 style={{
//                   alignItems: 'center',
//                   height: 32,
//                   justifyContent: 'space-between',
//                 }}>
//                 <Image
//                   source={require('../../../assets/images/chat-inactive.png')}
//                   style={{
//                     height: 25,
//                     width: 25,
//                     tintColor: '#38ACFF',
//                   }}
//                 />
//                 <Image
//                   source={require('../../../assets/images/Line3.png')}
//                   style={{
//                     height: 4,
//                     width: 8,
//                   }}
//                 />
//               </View>
//             ) : (
//               <Image
//                 source={require('../../../assets/images/chat-inactive.png')}
//                 style={{
//                   height: 25,
//                   width: 29,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ),
//         }}
//       />

//       <Tab.Screen
//         name="Groups"
//         component={Groups}
//         options={{
//           headerShown: false,
//           tabBarLabel: '',
//           tabBarIcon: ({focused}) =>
//             focused ? (
//               <Image
//                 source={require('../../../assets/images/group.png')}
//                 style={{
//                   height: 36,
//                   width: 29,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ) : (
//               <Image
//                 source={require('../../../assets/images/group-dark.png')}
//                 style={{
//                   height: 25,
//                   width: 29,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ),
//         }}
//       />

//       <Tab.Screen
//         name="Challenges"
//         component={Challenges}
//         options={{
//           headerShown: false,
//           tabBarLabel: '',
//           tabBarIcon: ({focused}) =>
//             focused ? (
//               <View
//                 style={{
//                   alignItems: 'center',
//                   height: 32,
//                   // backgroundColor: 'red',
//                   justifyContent: 'space-between',
//                 }}>
//                 <Image
//                   source={require('../../../assets/images/trophy-light.png')}
//                   style={{
//                     height: 25,
//                     width: 25,
//                   }}
//                   // resizeMode={'contain'}
//                 />
//                 <Image
//                   source={require('../../../assets/images/Line3.png')}
//                   style={{
//                     height: 4,
//                     width: 8,
//                   }}
//                   // resizeMode={'contain'}
//                 />
//               </View>
//             ) : (
//               <Image
//                 source={require('../../../assets/images/trophy-dark.png')}
//                 style={{
//                   height: 25,
//                   width: 29,
//                   position: 'relative',
//                   top: 5,
//                 }}
//                 resizeMode={'stretch'}
//               />
//             ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TabNavigation;
