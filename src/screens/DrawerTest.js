import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import Home from "./Home";
import Chat from "./Chat/Chat";
import History from "./History/History";
import ChangePassword from "./ChangePassword";
import ConnectDevices from "./ConnectDevices";
import PrivacyPolicy from "./PrivacyPolicy";
import UpdateGoals from "./UpdateGoals";
import UpdateProfile from "./UpdateProfile";
import MyProfile from "./MyProfile";

import CustomTab from "./CustomTab";
import TabNavigation from "./Navigation/TabNavigation";
import {
  useFocusEffect,
  useIsFocused,
  useNavigationState,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_Image } from "../constants/Base_URL_Image";
import { api } from "../constants/api";

const DrawerTest = ({ navigation, route }) => {
  const [showMenu, setShowMenu] = useState(false);
  const moveToRight = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [activeTab, setActiveTab] = useState("Home");
  const homeIcon = require("../../assets/images/home-inactive1.png");
  const friendIcon = require("../../assets/images/friends-dark.png");
  const chatIcon = require("../../assets/images/chat-inactive.png");
  const groupsIcon = require("../../assets/images/group-dark.png");
  const challengesIcon = require("../../assets/images/trophy-light.png");

  const [firstName, setFirstName] = useState("");
  const [profile, setProfile] = useState("");

  const [menuList, setMenuList] = useState([
    {
      title: "Home",
      icon: require("../../assets/images/home1.png"),
      width: 90, //for clickable areas
    },
    {
      title: "History",
      icon: require("../../assets/images/history.png"),
      width: 90,
    },
    {
      title: "Change Password",
      icon: require("../../assets/images/lock.png"),
      width: 135,
    },
    {
      title: "ConnectDevices",
      icon: require("../../assets/images/connectedDevices.png"),
      width: 135,
    },
    {
      title: "Privacy Policy",
      icon: require("../../assets/images/privacy.png"),
      width: 135,
    },

    {
      title: "Updated Goals",
      icon: require("../../assets/images/goals.png"),
      width: 135,
    },
  ]);

  const handleLogout = (props) =>
    Alert.alert(
      "Log out",
      `Are you sure you want to logout from isocialWalk?`,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace("AuthScreen");
            Animated.timing(scale, {
              toValue: showMenu ? 1 : 0.8,
              duration: 300,
              useNativeDriver: true,
            }).start();
            Animated.timing(moveToRight, {
              toValue: showMenu ? 0 : 230,
              duration: 300,
              useNativeDriver: true,
            }).start();
            setActiveTab("Home");
            setShowMenu(!showMenu);
          },
        },
      ]
    );

  const getUser_Info = (id) => {
    return new Promise((resolve, reject) => {
      if (id) {
        try {
          var requestOptions = {
            method: "POST",
            body: JSON.stringify({
              user_id: id,
            }),
            redirect: "follow",
          };
          fetch(api.get_specific_user, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result?.length > 0) {
                resolve(result[0]);
              } else {
                resolve(false);
              }
            })
            .catch((error) => {
              console.log("error in getting user detail ::", error);
              resolve(false);
            });
        } catch (error) {
          console.log("error occur in getting user profile detail ::", error);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };

  const getUser = async () => {
    let user_info = await AsyncStorage.getItem("user");
    let user_id = await AsyncStorage.getItem("user_id");
    if (user_id) {
      let user_info = await getUser_Info(user_id);
      if (user_info) {
        setFirstName(user_info.first_name);
        let image = user_info["profile image"]
          ? BASE_URL_Image + "/" + user_info["profile image"]
          : "";
        setProfile(image);
      }
    }
    // if (user_info != null) {
    //   let parse = JSON.parse(user_info);
    //   setFirstName(parse?.first_name);
    //   let image = parse?.profile_image
    //     ? BASE_URL_Image + "/" + parse?.profile_image
    //     : "";
    //   setProfile(image);

    // }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getUser();
  //   }, [])
  // );

  useEffect(() => {
    setTimeout(() => {
      StatusBar.setBackgroundColor(showMenu ? "#38ACFF" : "#fff");
    }, 200);
    getUser();
  }, [showMenu]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "green",
      }}
    >
      {/* <StatusBar backgroundColor={showMenu ? '#38ACFF' : '#fff'} /> */}
      {/* menu */}
      <View style={{ flex: 1, backgroundColor: "#38ACFF" }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedMenuItem(-1);
            Animated.timing(scale, {
              // toValue: 1,
              toValue: showMenu ? 1 : 0.8,
              duration: 300,
              useNativeDriver: true,
            }).start();
            Animated.timing(moveToRight, {
              toValue: showMenu ? 0 : 230,
              duration: 300,
              useNativeDriver: true,
            }).start();
            setShowMenu(!showMenu);
          }}
          style={{
            flexDirection: "row",
            marginLeft: 10,
            alignItems: "center",
            marginBottom: 15,
            marginTop: 120,
            // marginTop: ,
            width: "40%",
          }}
        >
          {profile != "" ? (
            <Image
              source={{ uri: profile }}
              style={{
                width: 55,
                height: 55,
                borderRadius: 55,
                resizeMode: "contain",
                marginLeft: 8,
                backgroundColor: "#ccc",
              }}
            />
          ) : (
            <Image
              source={require("../../assets/images/friend-profile.png")}
              style={{
                width: 55,
                height: 55,
                borderRadius: 55,
                resizeMode: "contain",
                marginLeft: 8,
              }}
            />
          )}

          <Text
            numberOfLines={1}
            style={{ color: "#002138", marginLeft: 10, fontSize: 16 }}
          >
            {/* Jonathan */}
            {firstName}
          </Text>
        </TouchableOpacity>
        <View style={{ paddingBottom: 220 }}>
          <FlatList
            data={menuList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMenuItem(item.index);
                    Animated.timing(scale, {
                      // toValue: 1,
                      toValue: showMenu ? 1 : 0.8,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(moveToRight, {
                      toValue: showMenu ? 0 : 230,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
                    setShowMenu(!showMenu);
                  }}
                  style={{
                    ...styles.drawerItemView,
                    width: item?.item?.width,
                  }}
                >
                  {item.index == 0 ? (
                    <Image
                      source={
                        activeTab === "Home"
                          ? homeIcon
                          : activeTab === "Friends"
                          ? friendIcon
                          : activeTab === "Chat"
                          ? chatIcon
                          : activeTab === "Groups"
                          ? groupsIcon
                          : activeTab === "Challenges"
                          ? challengesIcon
                          : homeIcon
                      }
                      style={{
                        ...styles.drawerIcon,
                        tintColor:
                          selectedMenuItem == item.index ? "#002138" : "#fff",
                      }}
                    />
                  ) : (
                    <Image
                      source={item.item.icon}
                      style={{
                        ...styles.drawerIcon,
                        tintColor:
                          selectedMenuItem == item.index ? "#002138" : "#fff",
                      }}
                    />
                  )}
                  <Text
                    style={{
                      color:
                        selectedMenuItem == item.index ? "#002138" : "#fff",
                    }}
                  >
                    {item.index == 0 ? activeTab : item.item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={() => {
              return (
                <TouchableOpacity
                  onPress={() => handleLogout()}
                  style={{ ...styles.drawerItemView, width: 85 }}
                >
                  <Image
                    source={require("../../assets/images/logout1.png")}
                    style={styles.drawerIcon}
                  />
                  <Text style={styles.drawerItemText}>Logout</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/*  screens */}

      {selectedMenuItem === -1 ? (
        <MyProfile
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      ) : selectedMenuItem === 0 ? (
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      ) : selectedMenuItem === 1 ? (
        <History
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      ) : selectedMenuItem === 2 ? (
        <ChangePassword
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      ) : selectedMenuItem === 3 ? (
        <ConnectDevices
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      ) : selectedMenuItem === 4 ? (
        <PrivacyPolicy
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      ) : (
        <UpdateGoals
          scale={scale}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          moveToRight={moveToRight}
        />
      )}
    </View>
  );
};

export default DrawerTest;

const styles = StyleSheet.create({
  drawerItemView: {
    // width: 140,
    padding: 10,
    marginLeft: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  drawerIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  drawerItemText: {
    color: "#fff",
  },
});
