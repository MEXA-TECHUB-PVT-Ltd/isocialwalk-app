import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Pressable,
  Animated,
  RefreshControl,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureScreen } from "react-native-view-shot";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import firebaseNotificationApi from "../../constants/firebaseNotificationApi";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";
import { STYLE } from "../STYLE";

const Friends = ({
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
  setActiveTab,
}) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef();

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([
    // {
    //   id: 0,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 1,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 2,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 3,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 4,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 5,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 6,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 7,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 8,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 9,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 10,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 11,
    //   friend_name: "Username",
    //   selected: false,
    // },
    // {
    //   id: 12,
    //   friend_name: "Username",
    //   selected: false,
    // },
  ]);
  const [isSuggestedVisible, setIsSuggestedVisible] = useState(true);
  const [suggestedFriends, setSuggestedFriends] = useState([
    // {
    //   id: 0,
    //   friend_name: "Username",
    //   status: false,
    // },
    // {
    //   id: 1,
    //   friend_name: "Username",
    //   status: false,
    // },
    // {
    //   id: 2,
    //   friend_name: "Username",
    //   status: false,
    // },
    // {
    //   id: 3,
    //   friend_name: "Username",
    //   status: false,
    // },
    // {
    //   id: 4,
    //   friend_name: "Username",
    //   status: false,
    // },
  ]);

  const [friendsList, setFriendsList] = useState([
    // {
    //   id: 0,
    //   name: "Saffa",
    //   avater: require("../../../assets/images/user1.png"),
    // },
    // {
    //   id: 0,
    //   name: 'Nahla',
    //   avater: require('../../../assets/images/user2.png'),
    // },
    // {
    //   id: 0,
    //   name: 'Naomi',
    //   avater: require('../../../assets/images/friend-profile.png'),
    // },
    // {
    //   id: 0,
    //   name: 'Rui',
    //   avater: require('../../../assets/images/user3.png'),
    // },
    // {
    //   id: 0,
    //   name: 'Anum',
    //   avater: require('../../../assets/images/friend-profile.png'),
    // },
    // {
    //   id: 0,
    //   name: 'Zaina',
    //   avater: require('../../../assets/images/friend-profile.png'),
    // },
  ]);

  const handleonAdd = async (id, type) => {
    // const newData = suggestedFriends.map(item => {
    //   if (id == item.id) {
    //     return {
    //       ...item,
    //       status: !item.status,
    //     };
    //   } else {
    //     return {
    //       ...item,
    //     };
    //   }
    // });
    // setSuggestedFriends(newData);

    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      user_id: user_id,
      to_id: id,
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.addfriends, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.error == false) {
          if (type == "search") {
            //update search result list
            handleAddSearchedFriend(id);
          } else {
            const newData = suggestedFriends.map((item) => {
              if (id == item.id) {
                return {
                  ...item,
                  status: !item.status,
                };
              } else {
                return {
                  ...item,
                };
              }
            });
            setSuggestedFriends(newData);
          }

          //send push notification
          sendPushNotification(id);
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
        // let responseList = [];
        // if (result[0]?.profile == 'No Friends') {
        //   console.log('no friend found');
        // } else if (result[0]?.profile?.length > 0) {
        //   setFriendsList(result[0]?.profile);
        // }
      })
      .catch((error) => console.log("error", error))
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const handleAddSearchedFriend = (id) => {
    const newData = searchResults.map((element) => {
      if (id == element?.id) {
        return {
          ...element,
          status: "requested",
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setSearchResults(newData);
  };

  //send push notification to user
  const sendPushNotification = async (id) => {
    let user = await firebaseNotificationApi.getFirebaseUser(id);
    if (!user) {
      user = await firebaseNotificationApi.getFirebaseUser(id);
    }

    if (user) {
      //getting logged in user profile
      let user_info = await AsyncStorage.getItem("user");
      let name = "";
      if (user_info != null) {
        let parse = JSON.parse(user_info);
        name = parse?.first_name;
      }

      let token = user?.fcmToken;
      let title = "Friend Request";
      let description = `${name} wants to be your friend...`;
      let data = {
        id: id,
        // user_id: id,
        // to_id: user?.ui
        type: "friend_request",
      };
      await firebaseNotificationApi
        .sendPushNotification(token, title, description, data)
        .then((res) => console.log("notification response.....", res))
        .catch((err) => console.log(err));
      console.log("notification sent.......");
    } else {
      console.log("user not found");
    }
  };
  const handleonSearchItemPress = (id) => {
    const newData = searchResults.map((item) => {
      if (id == item.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setSearchResults(newData);
  };

  const handleOpenDrawer = (navigation) => {
    captureScreen({
      format: "jpg",
    })
      .then((uri) => {
        AsyncStorage.setItem("Screen", uri.toString());
        AsyncStorage.setItem("ScreenName", "Friends");
        navigation.openDrawer();
      })
      .catch((error) => console.log(error));
  };
  // useEffect(() => {
  //   getSuggestedFriendsList();
  //   getFriendsList();
  // }, []);
  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSuggestedFriendsList();
      getFriendsList();
    }, [])
  );

  const getRequestStatus = async (friendId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!friendId) {
          resolve(false);
          return;
        } else {
          let user_id = await AsyncStorage.getItem("user_id");
          var requestOptions = {
            method: "POST",
            body: JSON.stringify({
              this_user_id: user_id,
              friend_user_id: friendId,
            }),
            redirect: "follow",
          };
          fetch(api.get_friend_status, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              let response = result[0]?.status ? result[0]?.status : false;
              if (response == false) {
                resolve(false);
              } else if (response == "requested") {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((error) => {
              resolve(false);
            });
        }
      } catch (error) {
        resolve(false);
      }
    });
  };

  //getting user detail
  const getUser_Info = (id) => {
    return new Promise((resolve, reject) => {
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
            resolve(false);
          });
      } catch (error) {
        resolve(false);
      }
    });
  };

  //getting requested friends list
  const getRequestFriendList = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        var requestOptions = {
          method: "POST",
          body: JSON.stringify({
            this_user_id: user_id,
          }),
          redirect: "follow",
        };
        fetch(api.get_requested_friends, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            if (result[0]?.error == "true" || result[0]?.error == true) {
              resolve([]);
            } else {
              let responseList = result ? result : [];
              let list = [];
              for (const element of responseList) {
                let user_info = await getUser_Info(element?.friend_user_id);
                if (user_info) {
                  let obj = {
                    // id: element?.id,
                    // this_user_id: element?.id,
                    // friend_user_id: element?.id,
                    // status: element?.id,
                    id: element?.friend_user_id,
                    firstName: user_info?.first_name,
                    lastname: user_info?.last_name,
                    full_name:
                      user_info?.first_name + " " + user_info?.last_name,
                    status: true,
                    image: element["profile image"]
                      ? BASE_URL_Image + "/" + element["profile image"]
                      : "",
                    active_watch: user_info?.active_watch,
                  };
                  list.push(obj);
                }
              }
              resolve(list);
            }
          })
          .catch((error) => {
            resolve([]);
          });
      } catch (error) {
        resolve([]);
      }
    });
  };

  const getSuggestedFriendsList1 = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        let requestedFriendList = await getRequestFriendList();
        let data = {
          this_user_id: user_id,
        };
        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };

        fetch(api.getfriendsuggestions, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            let responseList = [];
            if (result?.length > 0) {
              for (const element of result) {
                // let isRequested = await getRequestStatus(element["Friend ID"]);
                if (user_id != element["Friend ID"]) {
                  let obj = {
                    id: element["Friend ID"],
                    firstName: element["First Name"],
                    lastname: element["lastname"],
                    full_name:
                      element["First Name"] + " " + element["lastname"],
                    // status: element?.status,
                    status: false,
                    // status: isRequested,
                    image: element?.image
                      ? BASE_URL_Image + "/" + element?.image
                      : "",
                    active_watch: element["active watch"],
                  };
                  responseList.push(obj);
                }
              }
            }

            // setSuggestedFriends(responseList);
            resolve(responseList);
          })
          .catch((error) => {
            console.log(
              "error in getting suggested friends :::___________ ",
              error
            );

            resolve([]);
          });
      } catch (error) {
        console.log("error in getting suggested friends ::: ", error);
        resolve([]);
      }
    });
  };

  const getSuggestedFriendsList = async () => {
    console.log("getting suggested friends list...");
    let requestedFriendList = await getRequestFriendList();
    let suggestedFriendsList = await getSuggestedFriendsList1();
    let friendsList = requestedFriendList.concat(suggestedFriendsList);
    setSuggestedFriends(friendsList);
    setLoading(false);
    setIsRefreshing(false);
  };

  const getFriendsList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      this_user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.getallfriends, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        let responseList = [];
        if (result[0]?.profile == "No Friends") {
          // Snackbar.show({
          //   text: "No Friend Found",
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        } else if (result[0]?.profile?.length > 0) {
          // setFriendsList(result[0]?.profile);
          let list = result[0]?.profile ? result[0]?.profile : [];

          for (const element of list) {
            const found = responseList.some((el) => el.id === element?.id);
            if (!found) {
              let obj = {
                id: element?.id,
                first_name: element?.first_name,
                last_name: element?.last_name,
                image: element?.profile_image
                  ? BASE_URL_Image + "/" + element?.profile_image
                  : "",
                active_watch: element?.active_watch,
                phoneno: element?.phoneno,
                createdat: element?.createdat,
              };
              responseList.push(obj);
            }
          }
        }
        setFriendsList(responseList);
      })
      .catch((error) => {
        setFriendsList([]);
        Snackbar.show({
          text: "Something went wrong.Unable to get friend list.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let searchText1 = searchText?.trimEnd() ? searchText?.trimEnd() : "";
      setLoading(true);
      handleSearch(searchText1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSearch = async (searchText) => {
    let user_id = await AsyncStorage.getItem("user_id");

    if (searchText) {
      let data = {
        this_user_id: user_id,
        name: searchText,
      };
      console.log("data pass to search  : ", data);
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.search_friend, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result[0]?.error == true || result[0]?.error == "true") {
            setSearchResults([]);
            Snackbar.show({
              text: "No Search Result Found.",
              // text: result[0]?.Message
              //   ? result[0]?.Message
              //   : result[0]?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            let list = [];
            for (const element of result) {
              let obj = {
                id: element?.f_id,
                first_name: element?.first_name,
                last_name: element?.last_name,
                image: element?.profile_image
                  ? BASE_URL_Image + "/" + element?.profile_image
                  : "",
                status: element?.status,
                selected: false,
              };
              list.push(obj);
            }
            setSearchResults(list);
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.Please try again.",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } else {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const handleSearchCardPress = (item) => {
    if (item?.status == "Not Friends") {
      navigation.navigate("AddFriend", {
        id: item?.id,
        user: item,
      });
      setSearchText("");
    } else if (item?.status == "friends") {
      navigation.navigate("FriendProfile", {
        user: item,
      });
      setSearchText("");
    } else {
      navigation.navigate("AddFriend", {
        id: item?.id,
        user: item,
      });
      setSearchText("");
    }
  };

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    if (searchText?.length) {
      //refreshing  search list
      console.log("searchText .....", searchText);
      handleSearch(searchText);
    } else {
      getSuggestedFriendsList();
      getFriendsList();
    }
  };
  return (
    <Animated.View
      style={{
        zIndex: 999,
        flex: 1,
        backgroundColor: "white",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: showMenu ? 15 : 0,
        // transform: [{scale: scale}, {translateX: moveToRight}],
      }}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={["#38acff"]}
            />
          }
        >
          {loading && <Loader />}
          <View style={styles.headerView}>
            {/* <Pressable onPress={() => handleOpenDrawer(navigation)}> */}
            <Pressable
              onPress={() => {
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
                setActiveTab("Friends");
                setShowMenu(!showMenu);
              }}
            >
              {/* <Image source={require('../../../assets/images/Line1.png')} />
              <Image
                source={require('../../../assets/images/Line2.png')}
                style={{marginTop: 5}}
              /> */}
              <Image
                source={require("../../../assets/images/menu1.png")}
                style={STYLE.menuIcon}
              />
            </Pressable>
            <Text style={styles.headerTitle}>Friends</Text>
            <TouchableOpacity onPress={() => bottomSheetRef?.current?.open()}>
              <Image
                source={require("../../../assets/images/addFriend1.png")}
                style={{
                  width: responsiveWidth(7),
                  height: responsiveHeight(4.5),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={{ ...styles.searchView, marginHorizontal: 20 }}>
            <TextInput
              style={styles.searchTextInput}
              placeholder={"Search"}
              value={searchText}
              onChangeText={(txt) => setSearchText(txt)}
            />
            <Image
              source={require("../../../assets/images/search.png")}
              style={{ width: 23, height: 23 }}
              resizeMode="stretch"
            />
          </View>
          {searchText.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
              <Text
                style={{
                  color: "#000000",
                  fontSize: 16,
                }}
              >
                Search Results
              </Text>
              {/* ----------------------Search Result List ---------------------------- */}
              {loading ? null : (
                <View
                  style={{
                    marginVertical: 15,
                    paddingBottom: 10,
                    flex: 1,
                  }}
                >
                  <FlatList
                    numColumns={3}
                    key={"_"}
                    data={searchResults}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => "_" + index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            flex: 1,
                            height: SCREEN_HEIGHT * 0.7,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#000000",
                              fontSize: 16,
                            }}
                          >
                            No Record Found
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={(item) => {
                      return (
                        <View
                          style={{
                            ...styles.cardView,
                            height: 128,
                            width: "28.9%",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 10,
                              paddingTop: 20,
                            }}
                            onPress={() => handleSearchCardPress(item?.item)}
                          >
                            {item?.item?.image ? (
                              <Image
                                source={{ uri: item?.item?.image }}
                                style={{
                                  marginVertical: 8,
                                  width: 44,
                                  height: 44,
                                  borderRadius: 44,
                                  backgroundColor: "#ccc",
                                }}
                              />
                            ) : (
                              <Image
                                source={require("../../../assets/images/friend-profile.png")}
                                style={{
                                  marginVertical: 8,
                                  width: 44,
                                  height: 44,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                ...styles.friend_name,
                                // width: "20%",
                                width: SCREEN_WIDTH / 4.4,
                              }}
                              numberOfLines={1}
                            >
                              {item?.item?.first_name}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              justifyContent: "flex-end",
                              flex: 1,
                            }}
                          >
                            {item.item.status == "Not Friends" ? (
                              <TouchableOpacity
                                onPress={() =>
                                  handleonAdd(item?.item?.id, "search")
                                }
                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: item.item.selected
                                    ? "#ccc"
                                    : "#38acff",
                                  width: item.item.selected ? 70 : 60,
                                }}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Add
                                </Text>
                              </TouchableOpacity>
                            ) : item?.item?.status == "friends" ? (
                              <TouchableOpacity
                                disabled={true}
                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: "#ccc",
                                  width: 70,
                                }}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Added
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                disabled
                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: "#ccc",
                                  width: 70,
                                }}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Requested
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                  }}
                >
                  Suggested Friends
                </Text>

                <TouchableOpacity
                  style={styles.btnArrow}
                  onPress={() => setIsSuggestedVisible(!isSuggestedVisible)}
                >
                  {isSuggestedVisible ? (
                    <Image
                      source={require("../../../assets/images/arrow-up1.png")}
                      style={{ height: 9, width: 15 }}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/images/arrow-down1.png")}
                      style={{ height: 9, width: 15, tintColor: "#000" }}
                    />
                  )}
                </TouchableOpacity>
              </View>
              {/* ----------------------Suggested Friends List ---------------------------- */}

              {loading ? (
                <View style={{ height: 120 }}></View>
              ) : (
                <View
                  style={{
                    marginVertical: 15,
                    paddingHorizontal: 10,
                  }}
                >
                  {isSuggestedVisible && (
                    <FlatList
                      data={suggestedFriends}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={(item) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              // item.index == 0
                              //   ? navigation.navigate("FriendRequest")
                              // : navigation.navigate("AddFriend");

                              navigation.navigate("AddFriend", {
                                id: item?.item?.id,
                                user: item?.item,
                              });
                            }}
                            style={{
                              ...styles.cardView,
                              width: 101,
                              height: 137,
                            }}
                          >
                            {item?.item?.image ? (
                              <Image
                                source={{ uri: item?.item?.image }}
                                style={{
                                  marginVertical: 8,
                                  width: 44,
                                  height: 44,
                                  borderRadius: 44,
                                  backgroundColor: "#ccc",
                                }}
                              />
                            ) : (
                              <Image
                                source={require("../../../assets/images/friend-profile.png")}
                                style={{
                                  marginVertical: 8,
                                  width: 44,
                                  height: 44,
                                }}
                              />
                            )}

                            <Text style={styles.friend_name} numberOfLines={1}>
                              {/* {item.item.friend_name} */}
                              {item?.item?.firstName}
                            </Text>
                            <View
                              style={{
                                justifyContent: "flex-end",
                                // flex: 1,
                              }}
                            >
                              {item.item.status == true ? (
                                <TouchableOpacity
                                  // onPress={() => handleonAdd(item.item.id)}
                                  style={styles.cardButton}
                                >
                                  <Text
                                    style={{ color: "#ffffff", fontSize: 11 }}
                                  >
                                    Requested
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => handleonAdd(item.item.id)}
                                  style={{
                                    ...styles.cardButton,
                                    backgroundColor: "#38acff",
                                    width: 60,
                                  }}
                                >
                                  <Text
                                    style={{ color: "#ffffff", fontSize: 11 }}
                                  >
                                    Add
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  )}
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                    paddingHorizontal: 20,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  Friends
                </Text>
                {loading ? null : (
                  <View style={{ flex: 1 }}>
                    {friendsList.length == 0 ? ( //no friends exist
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 20,
                        }}
                      >
                        <Image
                          source={require("../../../assets/images/friend1.png")}
                          style={{
                            backgroundColor: "#FFFF",
                            resizeMode: "contain",
                          }}
                        />
                        <Text
                          style={{
                            width: 159,
                            textAlign: "center",
                            fontSize: 16,
                            color: "#000000",
                            marginVertical: 20,
                            fontFamily: "Rubik-Regular",
                          }}
                        >
                          Added friends would appear here
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          marginVertical: 15,
                          paddingBottom: 10,
                          paddingHorizontal: 20,
                        }}
                      >
                        <FlatList
                          data={friendsList}
                          numColumns={3}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={(item) => {
                            return (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate("FriendProfile", {
                                    user: item?.item,
                                  })
                                }
                                style={{
                                  ...styles.cardView,
                                  justifyContent: "center",
                                  height: 110,
                                  width: "28.9%",
                                }}
                              >
                                {/* <Image
                              source={item.item.avater}
                              style={{marginVertical: 8, width: 55, height: 55}}
                            /> */}

                                {item?.item?.image ? (
                                  <Image
                                    source={{ uri: item?.item?.image }}
                                    style={{
                                      marginVertical: 8,
                                      width: 55,
                                      height: 55,
                                      borderRadius: 55,
                                      backgroundColor: "#ccc",
                                    }}
                                  />
                                ) : (
                                  <Image
                                    source={require("../../../assets/images/friend-profile.png")}
                                    style={{
                                      marginVertical: 8,
                                      width: 55,
                                      height: 55,
                                    }}
                                  />
                                )}
                                <Text style={styles.cardText}>
                                  {/* {item.item.name} */}
                                  {item?.item?.first_name}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          <RBSheet
            ref={bottomSheetRef}
            height={300}
            openDuration={250}
            closeOnDragDown={true}
            closeOnPressMask={false}
            animationType={"slide"}
            customStyles={{
              container: {
                padding: 5,
                alignItems: "center",
                height: 530,
                flex: 1,
                backgroundColor: "#ffffff",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              },
              draggableIcon: {
                backgroundColor: "#003e6b",
              },
            }}
          >
            <Text
              style={{
                color: "#003e6b",
                fontSize: 18,
                fontFamily: "Rubik-Regular",
                marginTop: 5,
              }}
            >
              Invite Friends
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ShareableInvitationLink");
                bottomSheetRef?.current?.close();
              }}
              style={{
                flexDirection: "row",
                marginTop: 30,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/share-link.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  color: "#000000",
                  fontSize: 16,
                  marginLeft: 10,
                  fontFamily: "Rubik-Regular",
                }}
              >
                Shareable invitation Link
              </Text>
            </TouchableOpacity>
          </RBSheet>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#000000", fontSize: 25, fontFamily: "Rubik-Regular" },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  searchTextInput: {
    flex: 1,
    borderColor: "#FFFFFF",
    paddingVertical: 8,
    color: "#000000",
  },
  cardView: {
    height: 137,
    width: 92,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 5,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 10,
    overflow: "hidden",
  },
  cardButton: {
    backgroundColor: "#d8d8d8",
    width: 70,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    alignSelf: "flex-end",
    padding: 5,
  },
  cardText: {
    color: "#040103",
    textAlign: "center",
    fontSize: 15,
    width: 75,
    fontFamily: "Rubik-Regular",
  },
  friend_name: {
    color: "#040103",
    textAlign: "center",
    fontSize: 13,
    width: 75,
    marginVertical: 5,
    fontFamily: "Rubik-Regular",
  },
  btnArrow: {
    height: 20,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
