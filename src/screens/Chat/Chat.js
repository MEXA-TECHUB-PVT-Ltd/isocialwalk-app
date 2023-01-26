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
import { captureScreen } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
  off,
  remove,
} from "firebase/database";

import { useDispatch, useSelector } from "react-redux";
import {
  setLoginUserDetail,
  setUserForChat,
  setGroupForChat,
} from "../../redux/actions";
import moment from "moment/moment";
import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import { firebase } from "@react-native-firebase/storage";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";
import { async } from "@firebase/util";
import { STYLE } from "../STYLE";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import { Modal } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const Chat = ({
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
  activeTab,
  setActiveTab,
}) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const friendsBottomSheetRef = useRef();

  const dispatch = useDispatch();
  let { userDetail, routeUserType } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userId, setUserId] = useState("");

  const [swipeListRightOpenValue, setSwipeListRightOpenValue] = useState(-110);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([
    {
      id: 0,
      friend_name: "Username",
    },
    {
      id: 1,
      friend_name: "Username",
    },
    {
      id: 2,
      friend_name: "Username",
    },
    {
      id: 3,
      friend_name: "Username",
    },
    {
      id: 4,
      friend_name: "Username",
    },
    {
      id: 5,
      friend_name: "Username",
    },
    {
      id: 6,
      friend_name: "Username",
    },
    {
      id: 7,
      friend_name: "Username",
    },
    {
      id: 8,
      friend_name: "Username",
    },
    {
      id: 9,
      friend_name: "Username",
    },
    {
      id: 10,
      friend_name: "Username",
    },
    {
      id: 11,
      friend_name: "Username",
    },
    {
      id: 12,
      friend_name: "Username",
    },
  ]);
  const [isSuggestedVisible, setIsSuggestedVisible] = useState(true);
  const [suggestedFriends, setSuggestedFriends] = useState([
    // {
    //   id: 0,
    //   name: 'Saffa',
    //   avater: require('../../../assets/images/user1.png'),
    //   status: false,
    // },
    // {
    //   id: 1,
    //   name: 'Nahla',
    //   avater: require('../../../assets/images/user2.png'),
    //   status: false,
    // },
    // {
    //   id: 2,
    //   name: 'Naomi',
    //   avater: require('../../../assets/images/friend-profile.png'),
    //   status: false,
    // },
    // {
    //   id: 3,
    //   name: 'Rui',
    //   avater: require('../../../assets/images/user3.png'),
    //   status: false,
    // },
    // {
    //   id: 4,
    //   name: 'Anum',
    //   avater: require('../../../assets/images/friend-profile.png'),
    //   status: false,
    // },
    // {
    //   id: 5,
    //   name: 'Zaina',
    //   avater: require('../../../assets/images/friend-profile.png'),
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
    //   name: "Nahla",
    //   avater: require("../../../assets/images/user2.png"),
    // },
    // {
    //   id: 0,
    //   name: "Naomi",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 0,
    //   name: "Rui",
    //   avater: require("../../../assets/images/user3.png"),
    // },
    // {
    //   id: 0,
    //   name: "Anum",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 0,
    //   name: "Zaina",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
  ]);

  const [chatList, setChatList] = useState([
    // {
    //   id: 0,
    //   name: 'Boris Findlay',
    //   message: 'This is dummy message',
    //   avater: require('../../../assets/images/user1.png'),
    //   createdAt: '5 MIN AGO',
    //   count: 2,
    //   isPinned: false,
    // },
    // {
    //   id: 1,
    //   name: 'Saffa',
    //   message: 'we break down where the money went',
    //   avater: require('../../../assets/images/user2.png'),
    //   createdAt: '10 MIN AGO',
    //   count: 2,
    //   isPinned: false,
    // },
    // {
    //   id: 2,
    //   name: 'Saffa',
    //   message: 'This is dummy message',
    //   avater: require('../../../assets/images/user3.png'),
    //   createdAt: '15 MIN AGO',
    //   count: 1,
    //   isPinned: false,
    // },
    // {
    //   id: 3,
    //   name: 'Saffa',
    //   message: 'This is dummy message',
    //   avater: require('../../../assets/images/friend-profile.png'),
    //   createdAt: '15 MIN AGO',
    //   count: 1,
    //   isPinned: false,
    // },
    // {
    //   id: 4,
    //   name: 'Saffa',
    //   message: 'This is dummy message',
    //   avater: require('../../../assets/images/friend-profile.png'),
    //   createdAt: '15 MIN AGO',
    //   count: 1,
    //   isPinned: false,
    // },
    // {
    //   id: 5,
    //   name: 'Saffa',
    //   message: 'This is dummy message',
    //   avater: require('../../../assets/images/friend-profile.png'),
    //   createdAt: '15 MIN AGO',
    //   count: 1,
    //   isPinned: false,
    // },
  ]);

  const [chatListCopy, setChatListCopy] = useState("");

  const [groupsList, setGroupsList] = useState([]);
  // useEffect(() => {
  //   //gettig group chat list
  //   getGroupsList();
  // }, []);

  //----------------------------------------------------------------------
  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSuggestedFriendsList();
      getFriendsList();
    }, [])
  );

  const getUser_ID = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setUserId(user_id);
    return user_id;
  };
  useFocusEffect(
    React.useCallback(() => {
      let myUserRef = null;
      let user_id = getUser_ID(); //logged in user id
      const database = getDatabase();
      myUserRef = ref(database, `users/${userId}`);
      const loadData = async () => {
        const user_info_firebase = await findUser(userId);
        let data = await getChatingList(myUserRef);
        //filter user that if user deleted all messages then no need to show it in chat list
        // data = data?.filter(item=>item?.isDeleted==false)

        //TODO: short list base on pinned chat --> to show pinned chat on top of chat list
        data.sort(function (a, b) {
          return b.isPinned - a.isPinned;
        });
        // setChatList(data);
        //getting group chat list
        let groupsChat = await getGroupsList();
        // setGroupsList(groupsChat);

        //merge friend chat and group chat list
        let arr = [...data, ...groupsChat];
        // b.isPinned - a.isPinned &&
        arr.sort(function (a, b) {
          return (
            b.isPinned - a.isPinned ||
            new Date(b.createdAt) - new Date(a.createdAt)
          );
        });

        setChatList(arr);
        setChatListCopy(arr);
        setLoading(false);
        setIsRefreshing(false);
      };
      loadData();

      // set chatroom change listener

      const groupChatroomRef = ref(database, `group_chatroom`);
      onValue(groupChatroomRef, async (snapshot) => {
        console.log("new message aya ha...");
        loadData();
      });

      // onValue(myUserRef, async (snapshot) => {
      //   console.log("friend ny  new messageg kya ha..");
      // });

      return () => {
        //remove chatroom listener
        off(myUserRef);
        off(groupChatroomRef);
      };
    }, [userId, isRefreshing])
  );
  const getChatingList = (myUserRef) => {
    return new Promise(async (resolve, reject) => {
      try {
        onValue(myUserRef, async (snapshot) => {
          const data = snapshot.val();
          let usersList = [];
          if (data) {
            let listofUsers = data?.friends ? data?.friends : [];
            for (const item of listofUsers) {
              let lastMessage_info = await getLatestMessage(item?.chatroomId);
              let isDeleted = false;
              if (lastMessage_info?.isFirstUser) {
                if (lastMessage_info?.deletedBy1 == userId) {
                  isDeleted = true;
                }
              } else {
                if (lastMessage_info?.deletedBy2 == userId) {
                  isDeleted = true;
                }
              }
              if (!isDeleted) {
                let user_info = await getUser_Info(item?.id);
                let obj = {
                  id: item?.id,
                  name: item?.name,
                  isPinned: item?.isPinned,
                  createdAt:
                    lastMessage_info != "" ? lastMessage_info?.createdAt : "",
                  unReadCount:
                    lastMessage_info != "" ? lastMessage_info?.unReadCount : "",
                  read: lastMessage_info != "" ? lastMessage_info?.read : "",
                  chatroomId: item?.chatroomId,
                  message:
                    lastMessage_info != "" ? lastMessage_info?.message : "",
                  image: lastMessage_info != "" ? lastMessage_info?.image : "",
                  // message: "message",
                  profile:
                    user_info != false && user_info["profile image"]
                      ? BASE_URL_Image + "/" + user_info["profile image"]
                      : "",
                  isDeleted: isDeleted,
                };
                usersList.push(obj);
              }
            }
          }
          dispatch(setLoginUserDetail(data));
          resolve(usersList);
        });
      } catch (error) {
        resolve([]);
      }
    });
  };
  const getLatestMessage = (chatroomId) => {
    return new Promise((resolve, reject) => {
      try {
        if (chatroomId) {
          const database = getDatabase();
          const chatroomRef = ref(database, `chatrooms/${chatroomId}`);
          onValue(chatroomRef, (snapshot) => {
            const data = snapshot.val();
            let messagesList = data?.messages ? data.messages : [];

            let isFirstUser = data?.firstUserId == userId ? true : false;

            const unreadMessages = messagesList?.filter(
              (item) => item?.read == false && item?.user?._id != userId
            );
            let lastitem = messagesList?.pop();
            let lastMessage = lastitem?.text;
            let obj = {
              createdAt: lastitem?.createdAt,
              message: lastitem?.text,
              image: lastitem?.image,
              read: lastitem?.read,
              unReadCount: unreadMessages?.length,
              isFirstUser: isFirstUser,
              deletedBy1: lastitem?.deletedBy1,
              deletedBy2: lastitem?.deletedBy2,
            };
            resolve(obj);
          });
        } else {
          resolve("");
        }
      } catch (error) {
        resolve("");
      }
    });
  };
  const getUsersList = async () => {
    try {
      //getting list of chating of loggedin user
      let username = userDetail?.name;
      const database = getDatabase();
      //first check if the user registered before

      const user = await findUser(username);

      //create a new user if not registered
      if (user) {
        // set loggedin user details
        dispatch(setLoginUserDetail(user));
      } else {
        // create new user
        const newUserObj = {
          username: username,
          avatar: "https://i.pravatar.cc/150?u=" + Date.now(),
        };

        set(ref(database, `users/${username}`), newUserObj);
        dispatch(setLoginUserDetail(newUserObj));
      }

      // set friends list change listener
      const myUserRef = ref(database, `users/${username}`);
      setList([]);
      onValue(myUserRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          data.friends?.map((item, index) => {
            setList([
              // ...list,
              {
                id: index,
                name: item.name,
                type: "",
              },
            ]);
          });
        }
        dispatch(setLoginUserDetail(data));
        setLoddedInuserData((prevData) => ({
          ...prevData,
          data: data,
          friends: data.friends,
        }));
      });
    } catch (error) {
      console.error(error);
    }
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

  //getting specific group info
  const getGroup_Info = (id) => {
    return new Promise((resolve, reject) => {
      try {
        var requestOptions = {
          method: "POST",
          body: JSON.stringify({
            id: id,
          }),
          redirect: "follow",
        };
        fetch(api.get_group_detail, requestOptions)
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

  const findUser = async (name) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `users/${name}`));
    return mySnapshot.val();
  };

  const findChatroom = async (chatroom_id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `chatrooms/${chatroom_id}`));
    return mySnapshot.val();
  };

  const handlePress = async (selectedUser1) => {
    let user = await findUser(userDetail?.id);
    let filter = user?.friends?.filter(
      (element) => element?.id == selectedUser1?.id
    );
    dispatch(setUserForChat(filter[0]));
    navigation.navigate("Conversations");
  };
  const handleGroupChatItemPress = async (selectedGroup) => {
    dispatch(setGroupForChat(selectedGroup));
    navigation.navigate("GroupConversations");
  };
  //----------------------------------------------------------------------

  //getting logged in user friend list
  const getFriendsList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    setFriendsList([]);
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
          Snackbar.show({
            text: "No Friend Found",
            duration: Snackbar.LENGTH_SHORT,
          });
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
        Snackbar.show({
          text: "Something went wrong.Unable to get friend list.",
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };

  const findGroupInfo = async (id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `groups/${id}`));
    return mySnapshot.val();
  };

  //getting logged in user groups list --> where he is added or chat with
  const getGroupsList = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        const database = getDatabase();
        const groupsRef = ref(database, `groups`);
        const mySnapshot = await get(ref(database, `groups`));
        let data = mySnapshot?.val();
        let allGroupsList = data ? data : [];
        // var result = Object.keys(allGroupsList).map((key) => [
        //   Number(key),
        //   allGroupsList[key],
        // ]);
        var result = Object.keys(allGroupsList).map((key) => {
          return {
            id: Number(key),
            data: allGroupsList[key],
          };
        });
        let myGroups = [];

        for (const element of result) {
          //filter to check user exist in this group or not
          let filter = element?.data?.members?.filter(
            (item) => item?.id == user_id
          );

          if (filter?.length > 0) {
            //getting logged in user detail from group memebers list
            const groupDetail = await findGroupInfo(element?.id);
            const groupMembers = groupDetail?.members
              ? groupDetail?.members
              : [];
            const my_memberDetail = groupMembers?.filter(
              (item) => item?.id == user_id
            );
            //get my joining time --> when i joined this group
            const joined_at = my_memberDetail[0]?.created_at;
            const deleted_at = my_memberDetail[0]?.deleted_at;

            let lastMessage_info = await getGroup_LatestMessage(
              element?.data?.chatroomId,
              joined_at,
              deleted_at
            );
            if (lastMessage_info) {
              let group_info = await getGroup_Info(element?.id);
              let obj = {
                // group: element,
                id: element?.id,
                name: element?.data?.name,
                admin: element?.data?.admin,
                type: element?.data?.type,
                // isPinned: element?.data?.isPinned,
                isPinned: filter[0]?.isPinned,
                chatroomId: element?.data?.chatroomId,
                createdAt:
                  lastMessage_info != "" ? lastMessage_info?.createdAt : "",
                // unReadCount:
                //   lastMessage_info != "" ? lastMessage_info?.unReadCount : "",
                unReadCount: my_memberDetail[0]?.unread_count
                  ? my_memberDetail[0]?.unread_count
                  : "",
                // read: lastMessage_info != "" ? lastMessage_info?.read : "",
                read: my_memberDetail[0]?.unread_count ? true : "",
                message:
                  lastMessage_info != "" ? lastMessage_info?.message : "",
                image: lastMessage_info != "" ? lastMessage_info?.image : "",
                profile: group_info?.image_link
                  ? BASE_URL_Image + "/" + group_info?.image_link
                  : "",
              };
              myGroups.push(obj);
            }
          }
        }
        myGroups.sort(function (a, b) {
          return b.isPinned - a.isPinned;
        });
        resolve(myGroups);
        // setGroupsList(myGroups);
      } catch (error) {
        resolve([]);
      }
    });
  };

  //getting group last message detail
  const getGroup_LatestMessage = (chatroomId, joined_at, deleted_at) => {
    return new Promise((resolve, reject) => {
      try {
        if (chatroomId) {
          const database = getDatabase();
          const chatroomRef = ref(database, `group_chatroom/${chatroomId}`);
          onValue(chatroomRef, (snapshot) => {
            const data = snapshot.val();
            let messagesList = data?.messages ? data.messages : [];
            //only show messages after he joined this group

            // if (joined_at) {
            //   messagesList = messagesList?.filter(
            //     (item) => item?.createdAt >= joined_at
            //   );
            // }
            if (deleted_at) {
              messagesList = messagesList?.filter(
                (item) => new Date(item?.createdAt) >= new Date(deleted_at)
              );
            }
            if (messagesList?.length == 0) {
              resolve(false);
            } else {
              const unreadMessages = messagesList?.filter(
                (item) => item?.read == false && item?.user?._id != userId
              );
              let lastitem = messagesList?.pop();

              let lastMessage = lastitem?.text;
              let obj = {
                createdAt: lastitem?.createdAt,
                message: lastitem?.text,
                image: lastitem?.image,
                read: lastitem?.read,
                unReadCount: unreadMessages?.length,
              };
              resolve(obj);
            }
          });
        } else {
          resolve("");
        }
      } catch (error) {
        resolve("");
      }
    });
  };

  const getSuggestedFriendsList = async () => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");

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
        .then((result) => {
          let responseList = [];
          if (result?.length > 0) {
            result.forEach((element) => {
              let obj = {
                id: element["Friend ID"],
                firstName: element["First Name"],
                lastname: element["lastname"],
                full_name: element["First Name"] + " " + element["lastname"],
                // status: element?.status,
                status: false,
                image: element?.image
                  ? BASE_URL_Image + "/" + element?.image
                  : "",
                active_watch: element["active watch"],
              };
              responseList.push(obj);
            });
          }

          setSuggestedFriends(responseList);
          setLoading(false);
          setIsRefreshing(false);
        })
        .catch((error) => {
          setSuggestedFriends([]);
          setLoading(false);
          setIsRefreshing(false);
        });
    } catch (error) {
      setLoading(false);
      setIsRefreshing(false);
      setSuggestedFriends([]);
    }
  };

  const handleonAdd = (id) => {
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
  };

  const BottomSheetComponent = () => {
    return (
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
            //   alignItems: 'center',
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
            textAlign: "center",
            marginTop: 5,
            fontFamily: "Rubik-Regular",
          }}
        >
          Friend's List
        </Text>

        <View
          style={{
            marginVertical: 15,
            paddingHorizontal: 20,
            flex: 1,
          }}
        >
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={friendsList}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 16,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    No Results Found
                  </Text>
                </View>
              );
            }}
            renderItem={(item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigate("FriendProfile", {
                    //   user: item?.item,
                    // }),
                    //   bottomSheetRef?.current.close();
                    handleChatPress(item?.item?.id);
                  }}
                  style={{
                    ...styles.bootSheetCardView,
                    width: "28.9%",
                    marginVertical: 5,
                    marginHorizontal: 7,
                    borderWidth: item.item.selected ? 1 : 0,
                    borderColor: item.item.selected ? "#38ACFF" : "transparent",
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
                      style={{ marginVertical: 8, width: 44, height: 44 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "#040103",
                      fontSize: 13,
                      fontFamily: "Rubik-Regular",
                    }}
                    numberOfLines={2}
                  >
                    {item.item?.first_name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Friends')}
          style={{
            height: 137,
            width: 101,
            borderRadius: 5,
            padding: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5,
          }}>
          <Image source={require('../../../assets/images/addFriend.png')} />
          <Text style={{color: '#002138', marginTop: 8, fontSize: 14}}>
            Add a Friend
          </Text>
        </TouchableOpacity> */}
      </RBSheet>
    );
  };

  const handleOpenDrawer = (navigation) => {
    captureScreen({
      format: "jpg",
    })
      .then((uri) => {
        AsyncStorage.setItem("Screen", uri.toString());
        AsyncStorage.setItem("ScreenName", "Chat");
        navigation.openDrawer();
      })
      .catch((error) => console.log(error));
  };

  const EmptyChatView = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={require("../../../assets/images/chat2.png")}
          style={{ height: 114, width: 114 }}
        />

        <View
          style={{
            width: 200,
            marginVertical: 20,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 16,
                color: "#000000",
                fontFamily: "Rubik-Regular",
              }}
            >
              Tap
            </Text>
            <Image
              source={require("../../../assets/images/chat1.png")}
              style={{ width: 19, height: 19, marginHorizontal: 5 }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#000000",
              }}
            >
              this at the top right to
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: "#000000",
              fontFamily: "Rubik-Regular",
            }}
          >
            start a conversation
          </Text>
        </View>
      </View>
    );
  };

  //delete friend chat
  const deleteItem = async (id, item) => {
    try {
      setLoading(true);
      let user_id = await AsyncStorage.getItem("user_id");

      const myDetail = await findUser(user_id);
      const selectedUserDetail = await findUser(id);

      const database = getDatabase();
      const myChatRoom = await findChatroom(item?.chatroomId);

      let isFirstUser = myChatRoom?.firstUserId == user_id ? true : false;
      let newData = [];
      if (isFirstUser) {
        newData = myChatRoom?.messages.map((element) => {
          return {
            ...element,
            deletedBy1: user_id,
          };
        });
      } else {
        newData = myChatRoom?.messages.map((element) => {
          return {
            ...element,
            deletedBy2: user_id,
          };
        });
      }
      let obj = {};
      if (isFirstUser) {
        obj = {
          firstUserDeleted: true,
          first_deleted_at: new Date(),
          first_isNewMessage: false,
          messages: newData,
        };
      } else {
        obj = {
          secondUserDeleted: true,
          second_deleted_at: new Date(),
          second_isNewMessage: false,
          messages: newData,
        };
      }

      update(ref(database, `chatrooms/${item?.chatroomId}`), obj);
      const newData1 = chatList.filter((item) => item.id != id);
      setChatList(newData1);

      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const pinItem = async (id) => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");

      const myDetail = await findUser(user_id);
      let myFriends = myDetail?.friends ? myDetail?.friends : [];

      //change pin status in firebase
      const newData = myFriends.map((item) => {
        if (id === item.id) {
          return {
            ...item,
            isPinned: !item.isPinned,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      let newObj = {
        ...myDetail,
        friends: newData,
      };
      const database = getDatabase();
      update(ref(database, `users/${userId}`), newObj);
      //also update local storage
      await AsyncStorage.setItem(
        "LoggedInUserFirebaseDetail",
        JSON.stringify(newObj)
      );

      //also update chatlist state value to show pinned chat on top of list
      const newData1 = chatList.map((item) => {
        if (id === item.id) {
          return {
            ...item,
            isPinned: !item.isPinned,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      newData1.sort(function (a, b) {
        return (
          b.isPinned - a.isPinned ||
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
      setChatList(newData1);

      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.log("error occur in pin item   :: ", error);
    }
  };

  //pin group chat
  const handlePinGroupChat = async (groupId) => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");
      const myDetail = await findGroup(groupId);
      let groupMembers = myDetail?.members ? myDetail?.members : [];
      //change pin status in firebase
      const newData = groupMembers.map((item) => {
        if (user_id === item.id) {
          return {
            ...item,
            isPinned: !item.isPinned,
          };
        } else {
          return {
            ...item,
          };
        }
      });

      let newObj = {
        ...myDetail,
        members: newData,
      };

      const database = getDatabase();
      update(ref(database, `groups/${groupId}`), newObj);

      //also update chatlist state value to show pinned chat on top of list
      const newData1 = chatList.map((item) => {
        if (groupId === item.id) {
          return {
            ...item,
            isPinned: !item.isPinned,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      newData1.sort(function (a, b) {
        return b.isPinned - a.isPinned;
      });
      // setGroupsList(newData1);
      setChatList(newData1);

      // setLoading(false);
    } catch (error) {
      console.log("error occur in pin item   :: ", error);
    }
  };

  //delete group chat
  const handleDeleteGroup = async (groupId, item) => {
    let user_id = await AsyncStorage.getItem("user_id");
    try {
      const groupDetail = await findGroup(groupId);
      const database = getDatabase();

      //remove current group_memeber from this group
      const members = groupDetail?.members ? groupDetail?.members : [];

      let memberDetail = members.find((item) => item?.id == user_id);

      let member_index = members.findIndex((item) => item?.id == user_id);
      if (memberDetail && member_index != -1) {
        let newObj = {
          ...memberDetail,
          deleted_at: new Date(),
          unread_count: 0,
        };
        update(
          ref(database, `groups/${groupId}/members/${member_index}`),
          newObj
        );
        const newData = chatList.filter((item) => item.id != groupId);
        setChatList(newData);
      } else {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      }

      //remove this member from group
      // const filter = members?.filter((item) => item?.id != user_id);
      // let obj = {
      //   ...groupDetail,
      //   members: filter,
      // };
      // update(ref(database, `groups/${groupId}`), obj);
      // const newData = chatList.filter((item) => item.id != groupId);
      // setChatList(newData);
    } catch (error) {
      Snackbar.show({
        text: "Something went wrong.",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const findGroup = async (id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `groups/${id}`));
    return mySnapshot.val();
  };

  const ChatListComponent = () => {
    return (
      <SwipeListView
        data={chatList}
        renderItem={(data, rowMap) => (
          <Pressable
            onPress={() =>
              // navigation.navigate('Conversations', {
              //   user: data.item,
              // })
              data?.item?.type == "group"
                ? handleGroupChatItemPress(data?.item)
                : handlePress(data?.item)
            }
            style={{ ...styles.chatCardView }}
          >
            {data?.item?.isPinned && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 20,
                  top: -10,
                }}
              >
                <Image
                  source={require("../../../assets/images/pin.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            )}

            {data?.item?.type == "group" ? (
              <>
                {data?.item?.profile ? (
                  <Image
                    source={{ uri: data?.item?.profile }}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      backgroundColor: "#ccc",
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/group-profile2.png")}
                    style={{ width: 45, height: 45 }}
                  />
                )}
              </>
            ) : (
              <>
                {data?.item?.profile ? (
                  <Image
                    source={{ uri: data?.item?.profile }}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      backgroundColor: "#ccc",
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/friend-profile.png")}
                    style={{ width: 45, height: 45 }}
                  />
                )}
              </>
            )}

            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.userName}>{data.item.name}</Text>
              {/* <Text style={styles.userName}>{data?.item?.unReadCount}</Text> */}
              {data?.item?.unReadCount > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {data?.item?.profile ? (
                    <Image
                      source={{ uri: data?.item?.profile }}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        backgroundColor: "#ccc",
                        resizeMode: "contain",
                        marginRight: 4,
                      }}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/images/friend-profile.png")}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: "contain",
                        marginRight: 4,
                      }}
                    />
                  )}
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.messageText,
                      color: data?.item?.type == "group" ? "#000" : "#003E6B",
                    }}
                  >
                    {typeof data?.item?.image == "undefined" &&
                    typeof data.item.message == "undefined"
                      ? ""
                      : data?.item?.image != ""
                      ? "photo"
                      : data.item.message}
                  </Text>
                </View>
              ) : (
                <Text numberOfLines={1} style={styles.messageText}>
                  {typeof data?.item?.image == "undefined" &&
                  typeof data.item.message == "undefined"
                    ? ""
                    : data?.item?.image != ""
                    ? "photo"
                    : data.item.message}
                </Text>
              )}
            </View>
            <View style={{ marginLeft: 15, alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "#838383",
                  fontSize: 12,
                }}
              >
                {/* {data.item.createdAt} */}
                {data?.item?.createdAt &&
                  moment(data?.item?.createdAt).fromNow()}
              </Text>

              {/* {data?.item?.type !== "group" && data?.item?.unReadCount > 0 && ( */}
              {data?.item?.unReadCount > 0 && (
                <View
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 15,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                    }}
                  >
                    {/* {data.item.count} */}
                    {data?.item?.unReadCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
        // disableLeftSwipe={true}

        disableRightSwipe={true}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              // onPress={() => deleteItem(data.item.id, data?.item)}
              onPress={() => {
                data?.item?.type === "group"
                  ? handleDeleteGroup(data?.item?.id, data?.item)
                  : deleteItem(data.item.id, data?.item);
              }}
              style={[styles.backRightBtn, styles.backRightBtnRight]}
            >
              <Image
                source={require("../../../assets/images/delete.png")}
                style={{ height: 40, width: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => pinItem(data.item.id)}
              onPress={() => {
                data?.item?.type == "group"
                  ? handlePinGroupChat(data?.item?.id)
                  : pinItem(data.item.id);
              }}
              style={[styles.backRightBtn, { right: 50 }]}
            >
              <Image
                source={require("../../../assets/images/pin.png")}
                style={{ height: 40, width: 40 }}
              />
            </TouchableOpacity>
          </View>
        )}
        // leftOpenValue={175}
        rightOpenValue={-115}
      />
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchText);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSearch = (searchText) => {
    try {
      if (searchText) {
        setLoading(true);
        const filter = chatList?.filter((item) =>
          item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
        );
        if (filter?.length == 0) {
          Snackbar.show({
            text: "No Record Found",
            duration: Snackbar.LENGTH_SHORT,
          });
          setSearchResults([]);
        } else {
          setSearchResults(filter);
        }
        setLoading(false);
        setIsRefreshing(false);
      } else {
        setIsRefreshing(false);
        setLoading(false);
      }
    } catch (error) {
      setIsRefreshing(false);
      setLoading(false);
      console.log("error  ::: ", error);
    }
  };

  // ___________________________________________________________________CHAT USING FIREBASE__________________________________________________________
  const handleChatPress = async (user_id) => {
    if (user_id) {
      onAddFriend(user_id);
      bottomSheetRef?.current.close();
    } else {
      Snackbar.show({
        text: "Something went wrong.User Not found",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const createUser = async (id, name, email) => {
    return new Promise((resolve, reject) => {
      try {
        const database = getDatabase();
        //first check if the user registered before
        const newUserObj = {
          id: id ? id : "",
          name: name ? name : "",
          email: email ? email : "",
        };
        set(ref(database, `users/${id}`), newUserObj);
        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  };
  const onAddFriend = async (selected_user_id) => {
    try {
      setLoading(true);
      //find user and add it to my friends and also add me to his friends
      let loggedinFirebaseuser = await AsyncStorage.getItem(
        "LoggedInUserFirebaseDetail"
      );
      if (loggedinFirebaseuser != null) {
        loggedinFirebaseuser = JSON.parse(loggedinFirebaseuser);
      }

      let isLoggedInUserExist = await findUser(loggedinFirebaseuser?.id);

      //TODO: if loggged in user record not exist in firebase then create it
      if (isLoggedInUserExist == null) {
        let result = await createUser(
          loggedinFirebaseuser?.id,
          loggedinFirebaseuser?.name,
          loggedinFirebaseuser?.email
        );
        loggedinFirebaseuser = await findUser(loggedinFirebaseuser?.id);
      }

      const database = getDatabase();

      let user = await findUser(selected_user_id);
      if (user == null) {
        let result = await createUser(selected_user_id, firstName, "");
        user = await findUser(selected_user_id);
      }

      if (user) {
        if (user?.id === loggedinFirebaseuser?.id) {
          // don't let user add himself
          ///-------------------------------------------------
          let loggedin_user = await findUser(loggedinFirebaseuser?.id);
          let filter = loggedin_user?.friends?.filter(
            (element) => element?.id == selected_user_id
          );
          if (filter.length > 0) {
            dispatch(setUserForChat(filter[0]));
            dispatch(setLoginUserDetail(loggedin_user));
            navigation.navigate("Conversations");
          } else {
            let obj = {
              chatroomId: "",
              name: "",
              id: 0,
            };
            dispatch(setUserForChat(obj));
            dispatch(setLoginUserDetail(loggedin_user));
            navigation.navigate("Conversations");
          }
          setLoading(false);
          setIsRefreshing(false);
          return;
          //--------------------------------------------
        }

        if (
          loggedinFirebaseuser?.friends &&
          loggedinFirebaseuser?.friends.findIndex((f) => f?.id === user?.id) >=
            0
        ) {
          // don't let user add a user twice

          ///-------------------------------------------------
          let loggedin_user = await findUser(loggedinFirebaseuser?.id);
          let filter = loggedin_user?.friends?.filter(
            (element) => element?.id == selected_user_id
          );

          if (filter.length > 0) {
            dispatch(setUserForChat(filter[0]));
            dispatch(setLoginUserDetail(loggedin_user));
            navigation.navigate("Conversations");
          } else {
            let obj = {
              chatroomId: "",
              name: "",
              id: 0,
            };
            dispatch(setUserForChat(obj));
            dispatch(setLoginUserDetail(loggedin_user));
            navigation.navigate("Conversations");
          }
          setLoading(false);
          setIsRefreshing(false);
          return;
          //-----------------------------------
        }
        // create a chatroom and store the chatroom id

        const newChatroomRef = push(ref(database, "chatrooms"), {
          firstUser: loggedinFirebaseuser?.name,
          secondUser: user?.name,
          firstUserId: loggedinFirebaseuser?.id,
          secondUserId: user?.id,
          messages: [],
        });

        const newChatroomId = newChatroomRef?.key;

        const userFriends = user?.friends || [];
        let clicked_user_Obj = {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          friends: [
            ...userFriends,
            {
              id: loggedinFirebaseuser?.id,
              name: loggedinFirebaseuser?.name,
              chatroomId: newChatroomId,
              isPinned: false,
            },
          ],
        };

        update(ref(database, `users/${user?.id}`), clicked_user_Obj);

        const myFriends = loggedinFirebaseuser?.friends || [];
        //add this user to my friend list
        let loggedin_user_Obj = {
          id: loggedinFirebaseuser?.id,
          name: loggedinFirebaseuser?.name,
          email: loggedinFirebaseuser?.email,
          friends: [
            ...myFriends,
            {
              id: user?.id,
              name: user?.name,
              chatroomId: newChatroomId,
              isPinned: false,
            },
          ],
        };
        //update loggedin user in async storage
        await AsyncStorage.setItem(
          "LoggedInUserFirebaseDetail",
          JSON.stringify(loggedin_user_Obj)
        );
        update(
          ref(database, `users/${loggedinFirebaseuser?.id}`),
          loggedin_user_Obj
        );
        ///-------------------------------------------------
        let loggedin_user = await findUser(loggedinFirebaseuser?.id);
        let filter = loggedin_user?.friends?.filter(
          (element) => element?.id == selected_user_id
        );
        if (filter.length > 0) {
          dispatch(setUserForChat(filter[0]));
          dispatch(setLoginUserDetail(loggedin_user));
          navigation.navigate("Conversations");
        } else {
          let obj = {
            chatroomId: "",
            name: "",
            id: 0,
          };
          dispatch(setUserForChat(obj));
          dispatch(setLoginUserDetail(loggedin_user));
          navigation.navigate("Conversations");
        }
        setLoading(false);
        setIsRefreshing(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      setIsRefreshing(false);
      console.error(error);
    }
  };

  // ___________________________________________________________________CHAT USING FIREBASE__________________________________________________________

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    if (searchText?.length) {
      //refreshing  search list
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
        // transform:
        //   typeof scale != 'undefined'
        //     ? [{scale: scale}, {translateX: moveToRight}]
        //     : [{scale: 1}],
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
                setActiveTab("Chat");
                setShowMenu(!showMenu);
              }}
              style={{
                paddingRight: responsiveHeight(2.5),
              }}
            >
              <Image
                source={require("../../../assets/images/menu1.png")}
                style={STYLE.menuIcon}
              />
            </Pressable>
            <Text style={styles.headerTitle}>Chat</Text>
            <TouchableOpacity
              style={{
                paddingLeft: responsiveHeight(2.5),
              }}
              onPress={() => bottomSheetRef?.current?.open()}
            >
              <Image
                source={require("../../../assets/images/chat1.png")}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveHeight(3),
                  resizeMode: "stretch",
                }}
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
                  fontFamily: "Rubik-Regular",
                  marginBottom: 10,
                }}
              >
                Search Results
              </Text>
              {searchResults?.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/search3.png")}
                    style={{ height: 99, width: 99 }}
                  />
                  <Text
                    style={{
                      color: "#000000",
                      marginTop: 15,
                      width: 175,
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    No conversation match your search
                  </Text>
                </View>
              ) : (
                <SwipeListView
                  data={searchResults}
                  renderItem={(data, rowMap) => (
                    <Pressable
                      onPress={() => {
                        data?.item?.type == "group"
                          ? handleGroupChatItemPress(data?.item)
                          : handlePress(data?.item);

                        setSearchText("");
                      }}
                      style={{ ...styles.chatCardView, paddingHorizontal: 0 }}
                    >
                      {data?.item?.type == "group" ? (
                        <>
                          {data?.item?.profile ? (
                            <Image
                              source={{ uri: data?.item?.profile }}
                              style={{
                                width: 45,
                                height: 45,
                                borderRadius: 45,
                                backgroundColor: "#ccc",
                              }}
                            />
                          ) : (
                            <Image
                              source={require("../../../assets/images/group-profile2.png")}
                              style={{ width: 45, height: 45 }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {data?.item?.profile ? (
                            <Image
                              source={{ uri: data?.item?.profile }}
                              style={{
                                width: 45,
                                height: 45,
                                borderRadius: 45,
                                backgroundColor: "#ccc",
                              }}
                            />
                          ) : (
                            <Image
                              source={require("../../../assets/images/friend-profile.png")}
                              style={{ width: 45, height: 45 }}
                            />
                          )}
                        </>
                      )}

                      <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text style={styles.userName}>{data?.item?.name}</Text>
                        {/* <Text style={styles.userName}>{data?.item?.unReadCount}</Text> */}
                        {data?.item?.unReadCount > 0 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {data?.item?.profile ? (
                              <Image
                                source={{ uri: data?.item?.profile }}
                                style={{
                                  width: 15,
                                  height: 15,
                                  borderRadius: 15,
                                  backgroundColor: "#ccc",
                                  resizeMode: "contain",
                                  marginRight: 4,
                                }}
                              />
                            ) : (
                              <Image
                                source={require("../../../assets/images/friend-profile.png")}
                                style={{
                                  width: 15,
                                  height: 15,
                                  resizeMode: "contain",
                                  marginRight: 4,
                                }}
                              />
                            )}

                            <Text
                              numberOfLines={1}
                              style={{
                                ...styles.messageText,
                                color: "#003E6B",
                              }}
                            >
                              {typeof data?.item?.image == "undefined" &&
                              typeof data.item.message == "undefined"
                                ? ""
                                : data?.item?.image != ""
                                ? "photo"
                                : data.item.message}
                            </Text>
                          </View>
                        ) : (
                          <Text numberOfLines={1} style={styles.messageText}>
                            {typeof data?.item?.image == "undefined" &&
                            typeof data.item.message == "undefined"
                              ? ""
                              : data?.item?.image != ""
                              ? "photo"
                              : data.item.message}
                          </Text>
                        )}
                      </View>
                      <View style={{ marginLeft: 15, alignItems: "flex-end" }}>
                        <Text
                          style={{
                            color: "#838383",
                            fontSize: 12,
                          }}
                        >
                          {/* {data.item.createdAt} */}
                          {data?.item?.createdAt &&
                            moment(data?.item?.createdAt).fromNow()}
                        </Text>

                        {data?.item?.type !== "group" &&
                          data?.item?.unReadCount > 0 && (
                            <View
                              style={{
                                height: 15,
                                width: 15,
                                borderRadius: 15,
                                backgroundColor: "red",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 3,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#fff",
                                  fontSize: 10,
                                }}
                              >
                                {/* {data.item.count} */}
                                {data?.item?.unReadCount}
                              </Text>
                            </View>
                          )}
                      </View>
                    </Pressable>
                  )}
                  // disableLeftSwipe={true}

                  disableRightSwipe={true}
                  renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                      <TouchableOpacity
                        // onPress={() => deleteItem(data.item.id, data?.item)}
                        onPress={() => {
                          data?.item?.type === "group"
                            ? handleDeleteGroup(data?.item?.id, data?.item)
                            : deleteItem(data.item.id, data?.item);
                        }}
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                      >
                        <Image
                          source={require("../../../assets/images/delete.png")}
                          style={{ height: 40, width: 40 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        // onPress={() => pinItem(data.item.id)}
                        onPress={() => {
                          data?.item?.type == "group"
                            ? handlePinGroupChat(data?.item?.id)
                            : pinItem(data.item.id);
                        }}
                        style={[styles.backRightBtn, { right: 50 }]}
                      >
                        <Image
                          source={require("../../../assets/images/pin.png")}
                          style={{ height: 40, width: 40 }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  // leftOpenValue={175}
                  rightOpenValue={-115}
                />
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
                    fontFamily: "Rubik-Regular",
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
                      keyboardShouldPersistTaps="handled"
                      data={suggestedFriends}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={(item) => {
                        return (
                          <TouchableOpacity
                            // onPress={() => navigation.navigate('FriendRequest')}
                            onPress={() => {
                              // navigation.navigate("FriendProfile", {
                              //   user: item?.item,
                              // })

                              navigation.navigate("AddFriend", {
                                id: item?.item?.id,
                                user: item?.item,
                              });
                            }}
                            style={{
                              ...styles.cardView,
                              width: 101,
                              height: 110,
                              justifyContent: "center",
                            }}
                          >
                            {/* <Image
                              source={item.item.avater}
                              style={{marginVertical: 8, width: 44, height: 44}}
                            /> */}

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

                            <Text style={styles.friend_name}>
                              {/* {item.item.name} */}
                              {item?.item?.firstName}
                            </Text>
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
                    marginBottom: 20,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  Chats
                </Text>
                {loading ? null : (
                  <View style={{ flex: 1 }}>
                    {chatList.length == 0 ? (
                      <EmptyChatView />
                    ) : (
                      <ChatListComponent />
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          <BottomSheetComponent />
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  },
  friend_name: {
    color: "#040103",
    textAlign: "center",
    fontSize: 13,
    width: 75,
    fontFamily: "Rubik-Regular",
  },
  btnArrow: {
    height: 20,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  chatCardView: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  userName: {
    color: "#040103",
    fontSize: 16,
    fontFamily: "Rubik-Medium",
  },
  messageText: {
    color: "#040103",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
  },

  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    backgroundColor: "#fff",
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  bootSheetCardView: {
    height: 100,
    width: 101,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 2,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
});
