import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Animated,
  RefreshControl,
} from "react-native";
import { captureScreen } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import firebaseNotificationApi from "../../constants/firebaseNotificationApi";

import { BASE_URL_Image } from "../../constants/Base_URL_Image";
import { STYLE } from "../STYLE";
import { responsiveHeight } from "react-native-responsive-dimensions";

import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
  off,
} from "firebase/database";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const Groups = ({
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
  setActiveTab,
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [isSuggestedVisible, setIsSuggestedVisible] = useState(true);
  const [suggestedGroups, setSuggestedGroups] = useState([]);

  const [groupList, setGroupList] = useState([]);

  const [joinedGroupsList, setJoinedGroupsList] = useState([]);

  const handleonJoin = async (id, adminId, type, item) => {
    console.log({ id, adminId, type });

    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      user_id: user_id,
      group_id: id,
      date: new Date(),
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.join_group, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result[0]?.error == false || result[0]?.error == "false") {
          if (type == "search") {
            const newData = searchResults.map((item) => {
              if (id == item.id) {
                return {
                  ...item,
                  status: "requested",
                  // status: !item.status,
                };
              } else {
                return {
                  ...item,
                };
              }
            });
            setSearchResults(newData);
          } else {
            const newData = suggestedGroups.map((item) => {
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
            setSuggestedGroups(newData);
          }
          addMemberToGroup(id, adminId); //also adding member to firebase for group chat
          // sendPushNotification(adminId);
          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //______________________________________firebase______________________________________________________

  //adding this to to group in firebase for group chat
  const addMemberToGroup = async (group_id, adminId) => {
    let user_id = await AsyncStorage.getItem("user_id");
    let user = await AsyncStorage.getItem("user");
    let user_name = "";
    if (user) {
      user_name = JSON.parse(user)?.first_name;
    }

    let group_info = await getGroup_Info(group_id);

    if (group_info.group_privacy == "public") {
      //handle add member
      const database = getDatabase();
      let group = await findGroup(group_id);
      if (group) {
        let filter = group?.members?.filter(
          (element) => element?.id == user_id
        );

        if (filter?.length > 0) {
          //user already added in this group
          const groupMembers = group?.members || [];
          const updatedData = groupMembers?.map((element) => {
            if (element.id == user_id) {
              return {
                ...element,
                remove_by_admin: false,
                leave_group: false,
                deleted_at: new Date(),
              };
            } else {
              return {
                ...element,
              };
            }
          });
          if (updatedData) {
            let membersObj = {
              members: updatedData,
            };
            update(ref(database, `groups/${group_id}`), membersObj);
          }
        } else {
          const groupMembers = group?.members || [];
          let membersObj = {
            members: [
              ...groupMembers,
              {
                id: user_id,
                name: user_name,
                isPinned: false,
                created_at: new Date(),
                deleted_at: new Date(),
                unread_count: 0,
                remove_by_admin: false,
                leave_group: false,
              },
            ],
          };
          update(ref(database, `groups/${group_id}`), membersObj);
        }
      } else {
        //create group
        console.log("creating new group....");
        if (group_info) {
          createGroupForChat(
            group_info?.id,
            group_info?.name,
            group_info["Admin id"]
          );
        }
      }
      let message = user_name + " joined your group";
      sendPushNotification(adminId, message);
    } else {
      //do nothing --> member will added when group admin approved group join request
      console.log(
        "group is private --> member is only added when group admin approved group join request"
      );
      let message = user_name + " wants to join your group";
      sendPushNotification(adminId, message);
    }
  };

  const createGroupForChat = async (id, name, admin) => {
    return new Promise(async (resolve, reject) => {
      try {
        //logged in user detail
        let user_id = await AsyncStorage.getItem("user_id");
        let user = await AsyncStorage.getItem("user");
        let this_user_name = "";
        if (user != null) {
          this_user_name = JSON.parse(user)?.first_name;
        }
        const database = getDatabase();
        // create chat room
        const newChatroomRef = push(ref(database, "group_chatroom"), {
          messages: [],
          id: id,
        });
        const newChatroomId = newChatroomRef?.key;

        //create new group
        const newGroupObj = {
          id: id ? id : "",
          name: name ? name : "",
          chatroomId: newChatroomId ? newChatroomId : "",
          isPinned: false,
          type: "group",
          admin: admin,
        };

        set(ref(database, `groups/${id}`), newGroupObj);

        //add members to group
        let group_members = [];
        //adding admin to this group members list
        let obj = {
          id: "admin",
          name: "admin",
          isPinned: false,
          created_at: new Date(),
          deleted_at: new Date(),
          unread_count: 0,
        };
        group_members.push(obj);

        //adding current user(group admin) to this group members list
        obj = {
          id: user_id,
          name: this_user_name,
          isPinned: false,
          created_at: new Date(),
          deleted_at: new Date(),
          unread_count: 0,
        };
        group_members.push(obj);
        let new_obj = {
          members: group_members,
        };
        update(ref(database, `groups/${id}`), new_obj);
        resolve(true);
      } catch (error) {
        console.log("error while creating new group", error);
        resolve(false);
      }
    });
  };

  const findGroup = async (id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `groups/${id}`));
    return mySnapshot.val();
  };
  //______________________________________firebase______________________________________________________

  //send push notification to user
  const sendPushNotification = async (id, message) => {
    console.log({ id, message });
    let logged_in_user = await AsyncStorage.getItem("user");
    let fullName = "";
    if (logged_in_user != null) {
      logged_in_user = JSON.parse(logged_in_user);
      fullName = logged_in_user?.first_name + " " + logged_in_user?.last_name;
    }

    let user = await firebaseNotificationApi.getFirebaseUser(id);
    if (!user) {
      user = await firebaseNotificationApi.getFirebaseUser(id);
    }

    if (user) {
      let token = user?.fcmToken;
      console.log("token_____", token);
      let title = "Group Request";
      // let description = `${fullName} wants to join your Group...`;
      let description = message;
      let data = {
        id: id,
        // user_id: id,
        // to_id: user?.ui
        type: "group_request",
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
  const handleOpenDrawer = (navigation) => {
    captureScreen({
      format: "jpg",
    })
      .then((uri) => {
        AsyncStorage.setItem("Screen", uri.toString());
        AsyncStorage.setItem("ScreenName", "Groups");
        navigation.openDrawer();
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    setLoading(true);
    // setSuggestedGroups([]);
    // getSuggestedGroupsList();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getSuggestedGroupsList();
      getLogged_in_user_groups();
      getMembersList();
      getJoinedGroups();
      getLoggedIn_user();
    }, [])
  );

  const getLoggedIn_user = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
  };

  const getRequestedGroupsList = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        var requestOptions = {
          method: "POST",
          body: JSON.stringify({
            user_id: user_id,
          }),
          redirect: "follow",
        };
        fetch(api.get_requested_groups, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            if (result[0]?.error == "true" || result[0]?.error == true) {
              resolve([]);
            } else {
              let responseList = result ? result : [];

              let list = [];
              for (const element of responseList) {
                // let groupInfo = await getGroup_Info(element["Group id"]);
                let groupInfo = await getGroup_Info(element?.group_id);
                if (groupInfo) {
                  if (user_id != groupInfo["Admin id"]) {
                    //not storing logged user own group list
                    let obj = {
                      // id: element["Group id"],
                      id: element?.group_id,
                      group_name: groupInfo.name,
                      adminId: groupInfo["Admin id"],
                      // status: element?.status,
                      image:
                        groupInfo !== false && groupInfo?.image_link
                          ? BASE_URL_Image + "/" + groupInfo?.image_link
                          : "",
                      status: true,
                    };
                    list.push(obj);
                  } else {
                    console.log("logged user own group");
                  }
                } else {
                  console.log(
                    "group info not found :::: ",
                    element["Group id"]
                  );
                }
              }
              resolve(list);
            }
          })
          .catch((error) => {
            console.log("error in getting requested groups", error);
            resolve([]);
          });
      } catch (error) {
        console.log("error in getting requested groups :::: ", error);
        resolve([]);
      }
    });
  };

  const getSuggestedGroupsList1 = async () => {
    return new Promise(async (resolve, reject) => {
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
        fetch(api.groupsuggestions, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            let responseList = [];
            if (result?.length > 0) {
              // setSuggestedGroups(result);
              for (const element of result) {
                let groupInfo = await getGroup_Info(element["Group ID"]);
                if (user_id != element?.admin) {
                  //not storing logged in user created groups in suggested groups list
                  let obj = {
                    id: element["Group ID"],
                    group_name: element["Group Name"],
                    // adminId: element?.admin,
                    adminId: element["Admin id"],
                    // status: element?.status,
                    image:
                      groupInfo !== false && groupInfo?.image_link
                        ? BASE_URL_Image + "/" + groupInfo?.image_link
                        : "",
                    status: false,
                  };
                  responseList.push(obj);
                }
              }
            }
            // setSuggestedGroups(responseList);
            resolve(responseList);
          })
          .catch((error) => {
            resolve([]);
          });
      } catch (error) {
        resolve([]);
      }
    });
  };

  const getSuggestedGroupsList = async () => {
    let requestedGroupsList = await getRequestedGroupsList();
    let suggestedGroupsList = await getSuggestedGroupsList1();
    let groupsList = requestedGroupsList.concat(suggestedGroupsList);
    setSuggestedGroups(groupsList);
    setLoading(false);
    setIsRefreshing(false);
  };

  // const getSuggestedGroupsList = async () => {
  //   try {
  //     let user_id = await AsyncStorage.getItem("user_id");
  //     let data = {
  //       this_user_id: user_id,
  //     };
  //     var requestOptions = {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //       redirect: "follow",
  //     };

  //     fetch(api.groupsuggestions, requestOptions)
  //       .then((response) => response.json())
  //       .then(async (result) => {
  //         let responseList = [];
  //         if (result?.length > 0) {
  //           // setSuggestedGroups(result);

  //           for (const element of result) {
  //             let groupInfo = await getGroup_Info(element["Group ID"]);
  //             let obj = {
  //               id: element["Group ID"],
  //               group_name: element["Group Name"],
  //               adminId: element?.admin,
  //               // status: element?.status,
  //               image:
  //                 groupInfo !== false && groupInfo?.image_link
  //                   ? BASE_URL_Image + "/" + groupInfo?.image_link
  //                   : "",
  //               status: false,
  //             };
  //             responseList.push(obj);
  //           }
  //         }
  //         setSuggestedGroups(responseList);
  //       })
  //       .catch((error) => console.log("error", error))
  //       .finally(() => setLoading(false));
  //   } catch (error) {
  //     console.log("error :", error);
  //     setLoading(false);
  //   }
  // };
  const getLogged_in_user_groups = async () => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      created_by_user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.search_group_by_specific_admin, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.error == false || result?.error == "false") {
          let list = result?.Groups ? result?.Groups : [];
          // setGroupList(list);
          let list1 = [];
          for (const element of list) {
            let obj = {
              id: element?.id,
              created_by_user_id: element?.created_by_user_id,
              image: element?.image
                ? BASE_URL_Image + "/" + element?.image
                : "",
              name: element?.name,
              group_privacy: element?.group_privacy,
              group_visibility: element?.group_visibility,
              created_at: element?.created_at,
            };
            list1.push(obj);
          }
          setGroupList(list1);
        } else {
          setGroupList([]);
          // Snackbar.show({
          //   text: result?.Message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        setGroupList([]);
        Snackbar.show({
          text: "Something went wrong.Unable to get groups.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  //getting login user joined groups list
  const getJoinedGroups = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    let data = {
      user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_user_joined_groups, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // console.log("groups list ::: ", result);
        if (result?.error == false || result?.error == "false") {
          let list = result?.Group ? result?.Group : [];

          let joinedGroup_List = [];
          let listOfGroups = [];
          if (list?.length > 0) {
            let filter = list?.filter(
              (item) => item?.status == "membered" || item?.status == "approved"
            );
            for (const element of filter) {
              let groupInfo = await getGroup_Info(element?.group_id);
              const found = listOfGroups.some(
                (el) => el.group_info.id === groupInfo?.id
              );
              if (!found) {
                if (groupInfo != false) {
                  if (groupInfo?.["Admin id"] == user_id) {
                    //not added is own created groups in joined group list
                  } else {
                    let obj = {
                      id: element?.id,
                      group_id: element?.group_id,
                      user_id: element?.user_id,
                      status: element?.status,
                      created_at: element?.created_at,
                      group_info: {
                        id: groupInfo?.id,
                        image: groupInfo?.image_link
                          ? BASE_URL_Image + "/" + groupInfo?.image_link
                          : "",
                        name: groupInfo?.name,
                        adminId: groupInfo?.["Admin id"],
                        group_privacy: groupInfo?.group_privacy,
                        group_visibility: groupInfo?.group_visibility,
                        created_at: groupInfo?.created_at,
                      },
                    };

                    listOfGroups.push(obj);
                  }
                }
              }
            }
          }
          setJoinedGroupsList(listOfGroups);
        } else {
          setJoinedGroupsList([]);
          // Snackbar.show({
          //   text: result?.Message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        console.log("error  :::::::  ", error);
        Snackbar.show({
          text: "Something went wrong.Unable to get groups.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const getjoin_group = () => {
    try {
    } catch (error) {
      console.log("error  :: ", error);
    }
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

  //TODO: latter on change with this spscifc user groups list
  // const getMyGroups = async () => {
  //   let user_id = await AsyncStorage.getItem("user_id");
  //   setLoading(true);
  //   setGroupList([]);
  //   let data = {
  //     created_by_user_id: "9",
  //   };
  //   var requestOptions = {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     redirect: "follow",
  //   };
  //   fetch(api.search_group_by_specific_admin, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result?.error == false || result?.error == "false") {
  //         let list = result?.Groups ? result?.Groups : [];
  //         setGroupList(list);
  //       } else {
  //         Snackbar.show({
  //           text: result?.Message,
  //           duration: Snackbar.LENGTH_SHORT,
  //         });
  //       }
  //       // let responseList = [];
  //       // if (result[0]?.profile == 'No Friends') {
  //       //   console.log('no friend found');
  //       // } else if (result[0]?.profile?.length > 0) {
  //       //   setFriendsList(result[0]?.profile);
  //       // }
  //     })
  //     .catch((error) =>
  //       console.log("error in getting my  groups list ::: ", error)
  //     )
  //     .finally(() => setLoading(false));
  // };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     console.log('seearchy  text :::: ', searchText);
  //     // Send Axios request here
  //     searchGroup(searchText);
  //   }, 2500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchText]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      handleSearch(searchText);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const getGroupStatus = async (user_id, group_id) => {
    return new Promise((resolve, reject) => {
      try {
        let data = {
          user_id: user_id,
          group_id: group_id,
        };
        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };
        fetch(api.get_group_status, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            if (result[0]?.status) {
              resolve(result[0]?.status);
            } else {
              resolve(false);
            }
          })
          .catch((error) => resolve(false));
      } catch (error) {
        resolve(false);
      }
    });
  };

  const handleSearch = async (searchText) => {
    if (searchText) {
      let user_id = await AsyncStorage.getItem("user_id");
      let data = {
        name: searchText,
        userid: user_id,
      };

      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.search_group, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("search result  ...........", result);
          let logged_in_user_id = await AsyncStorage.getItem("user_id");
          if (result == null) {
            setSearchResults([]);
            Snackbar.show({
              text: "No Record Found",
              duration: Snackbar.LENGTH_SHORT,
            });
          } else if (
            result[0]?.message == "No Record found" ||
            result == null
          ) {
            // let groupsList = result[0]?.groups ? result[0]?.groups : [];
            setSearchResults([]);
            Snackbar.show({
              text: "No Record Found",
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            let groupsList = result ? result : [];
            let list = [];
            if (groupsList?.length > 0) {
              for (const element of groupsList) {
                let group_status = await getGroupStatus(
                  logged_in_user_id,
                  element?.id
                );
                let obj = {
                  id: element?.id,
                  // created_by_user_id: element?.created_by_user_id,
                  created_by_user_id: element["Admin id"],
                  adminId: element["Admin id"],
                  image: element?.image_link
                    ? BASE_URL_Image + "/" + element?.image_link
                    : "",
                  name: element?.name,
                  status: group_status,
                  // status: false,
                };
                list.push(obj);
              }
            }
            setSearchResults(list);
          }
        })
        .catch((error) => console.log("error in searching  group ", error))
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } else {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const getMembersList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      this_user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.showmembers, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("show members list   ::: ", result);
        // let responseList = [];
        if (result[0]?.error == false) {
          let arr = result[0]?.["array of Members"]
            ? result[0]?.["array of Members"]
            : [];
          for (const element of arr) {
            console.log("element :  ", element);
          }
        } else if (result[0]?.profile?.length > 0) {
          setFriendsList(result[0]?.profile);
        }
      })
      .catch((error) => console.log("error in getting groups list ::: ", error))
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    if (searchText?.length) {
      //refreshing  search list
      handleSearch(searchText);
    } else {
      getSuggestedGroupsList();
      getLogged_in_user_groups();
      getMembersList();
      getJoinedGroups();
      getLoggedIn_user();
    }
  };

  const handleSearchCardPress = async (item) => {
    let user_id = await AsyncStorage.getItem("user_id");
    if (item?.status == "membered") {
      if (item?.adminId != user_id) {
        navigation.navigate("GroupDetail", {
          item: item,
          type: "joined",
        });
        setSearchText("");
        setIsRefreshing(false);
        setLoading(false);
      } else {
        navigation.navigate("GroupDetail", {
          item: item,
        });
        setSearchText("");
        setIsRefreshing(false);
        setLoading(false);
      }
    } else if (item?.status == "requested") {
      navigation.navigate("JoinGroup", {
        item: item,
        status: "requested",
      });
      setSearchText("");
      setIsRefreshing(false);
      setLoading(false);
    } else {
      navigation.navigate("JoinGroup", {
        item: item,
      });
      setSearchText("");
      setIsRefreshing(false);
      setLoading(false);
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
        {loading && <Loader />}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            // paddingHorizontal: 20,
          }}
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
          <View
            style={{
              height: 40,
              justifyContent: "center",
              marginTop: 20,
              paddingHorizontal: 20,
            }}
          >
            {isSearch ? (
              <View style={styles.headerView}>
                <View style={styles.searchView}>
                  <TextInput
                    style={styles.searchTextIntput}
                    placeholder={"Search"}
                    value={searchText}
                    // onChangeText={txt => setSearchText(txt)}
                    onChangeText={(txt) => {
                      setSearchText(txt);
                      // handleSearch(txt);
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/search.png")}
                    style={{ width: 23, height: 23 }}
                    resizeMode="stretch"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIsSearch(!isSearch);
                    setSearchText("");
                    setIsRefreshing(false);
                    setLoading(false);
                    getSuggestedGroupsList();
                  }}
                  style={styles.btnCancel}
                >
                  <Text style={styles.btnCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
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
                    setActiveTab("Groups");
                    setShowMenu(!showMenu);
                  }}
                  style={{
                    paddingRight: responsiveHeight(2.5),
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
                <TouchableOpacity
                  style={{
                    paddingLeft: responsiveHeight(2.5),
                  }}
                  onPress={() => setIsSearch(!isSearch)}
                >
                  <Image
                    source={require("../../../assets/images/search.png")}
                    style={{ width: 23, height: 23 }}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={{ ...styles.title, paddingHorizontal: 20 }}>Groups</Text>
          {searchText.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
              {/* ----------------------Search Result List ---------------------------- */}
              {loading ? null : (
                <View style={{ marginVertical: 15, paddingBottom: 10 }}>
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={searchResults}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
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
                        <View style={{ ...styles.cardView, width: "28.9%" }}>
                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
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
                                source={require("../../../assets/images/group-profile.png")}
                                style={{ marginVertical: 8 }}
                              />
                            )}

                            <Text style={styles.cardText} numberOfLines={2}>
                              {/* {item.item.group_name} */}
                              {item?.item?.name}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              justifyContent: "flex-end",
                              flex: 1,
                            }}
                          >
                            {item?.item?.status == "membered" ? (
                              <TouchableOpacity
                                // onPress={() => handleonJoin(item.item.id)}

                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: "#d8d8d8",
                                  width: 70,
                                }}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  membered
                                </Text>
                              </TouchableOpacity>
                            ) : item?.item?.status == "requested" ? (
                              <TouchableOpacity
                                // onPress={() => handleonJoin(item.item.id)}
                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: "#d8d8d8",
                                  width: 70,
                                }}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Requested
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  handleonJoin(
                                    item.item.id,
                                    item?.item?.adminId,
                                    "search"
                                  );
                                }}
                                style={styles.cardButton}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Join
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
                  marginTop: 10,
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
                  Suggested Groups
                </Text>

                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 30,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
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
              {/* ----------------------Suggested Groups List ---------------------------- */}
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
                      data={suggestedGroups}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={(item) => {
                        return (
                          <View style={{ ...styles.cardView, width: 101 }}>
                            <TouchableOpacity
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() =>
                                navigation.navigate("JoinGroup", {
                                  item: item?.item,
                                })
                              }
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
                                  source={require("../../../assets/images/group-profile.png")}
                                  style={{ marginVertical: 8 }}
                                />
                              )}
                              <Text style={styles.cardText} numberOfLines={2}>
                                {item.item.group_name}
                              </Text>
                            </TouchableOpacity>
                            <View
                              style={{
                                justifyContent: "flex-end",
                                flex: 1,
                              }}
                            >
                              {item.item.status ? (
                                <TouchableOpacity
                                  // onPress={() => handleonJoin(item.item.id)}
                                  //onPress={() => console.log("item :: ", item)}
                                  style={{
                                    ...styles.cardButton,
                                    backgroundColor: "#d8d8d8",
                                    width: 70,
                                  }}
                                >
                                  <Text
                                    style={{ color: "#ffffff", fontSize: 11 }}
                                  >
                                    Requested
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    handleonJoin(
                                      item.item.id,
                                      item?.item?.adminId
                                    );
                                  }}
                                  style={styles.cardButton}
                                >
                                  <Text
                                    style={{ color: "#ffffff", fontSize: 11 }}
                                  >
                                    Join
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 16 }}>Groups</Text>
                {groupList.length > 0 && (
                  <TouchableOpacity
                    style={{ ...styles.btnCreateGroup, width: 115, height: 33 }}
                    onPress={() => navigation.navigate("CreateGroup")}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 13 }}>
                      Create a Group
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {loading ? (
                <View style={{ height: 50 }}></View>
              ) : (
                <View style={{ flex: 1 }}>
                  {groupList.length == 0 ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/group1.png")}
                        style={{
                          backgroundColor: "#FFFF",
                          resizeMode: "contain",
                        }}
                      />

                      <Text
                        style={{
                          width: 206,
                          textAlign: "center",
                          fontSize: 16,
                          color: "#000000",
                          marginVertical: 20,
                        }}
                      >
                        Create or join a group and compete in challenges with
                        other groups
                      </Text>
                      <TouchableOpacity
                        style={styles.btnCreateGroup}
                        onPress={() => navigation.navigate("CreateGroup")}
                      >
                        <Text style={{ color: "#FFFFFF", fontSize: 13 }}>
                          Create a Group
                        </Text>
                      </TouchableOpacity>
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
                        keyboardShouldPersistTaps="handled"
                        data={groupList}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("GroupDetail", {
                                  item: item?.item,
                                })
                              }
                              style={{
                                ...styles.cardView,
                                justifyContent: "center",
                                height: 110,
                                width: "28.9%",
                              }}
                            >
                              {item?.item?.image ? (
                                <Image
                                  source={{ uri: item?.item?.image }}
                                  style={{
                                    marginVertical: 8,
                                    height: 44,
                                    width: 44,
                                    borderRadius: 44,
                                    backgroundColor: "#ccc",
                                  }}
                                />
                              ) : (
                                <Image
                                  source={require("../../../assets/images/group-profile.png")}
                                  style={{ marginVertical: 8 }}
                                />
                              )}

                              <Text style={styles.cardText} numberOfLines={2}>
                                {item.item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 16 }}>
                  Joined Groups
                </Text>
              </View>

              {loading ? null : (
                <View
                  style={{
                    marginVertical: 15,
                    paddingBottom: 10,
                    paddingHorizontal: 20,
                  }}
                >
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={joinedGroupsList}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            flex: 1,
                            height: 200,
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
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("GroupDetail", {
                              item: item?.item?.group_info,
                              type: "joined",
                            })
                          }
                          style={{
                            ...styles.cardView,
                            justifyContent: "center",
                            height: 110,
                            width: "28.9%",
                          }}
                        >
                          {item?.item?.group_info?.image ? (
                            <Image
                              source={{ uri: item?.item?.group_info?.image }}
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
                              source={require("../../../assets/images/group-profile.png")}
                              style={{ marginVertical: 8 }}
                            />
                          )}

                          <Text style={styles.cardText} numberOfLines={2}>
                            {item?.item?.group_info?.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default Groups;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 10,
  },
  searchTextIntput: {
    flex: 1,
    borderColor: "#FFFFFF",
    padding: 8,
    color: "#000000",
  },
  btnCancel: {
    flex: 0.25,
    height: "100%",
    justifyContent: "center",
  },
  btnCancelText: {
    textAlign: "right",
    color: "#4e4e4e",
    fontSize: 16,
  },
  title: {
    color: "#000000",
    fontSize: 30,
    marginTop: 12,
    fontFamily: "Rubik-Regular",
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
  cardText: {
    color: "#040103",
    textAlign: "center",
    fontSize: 13,
    width: 75,
    fontFamily: "Rubik-Regular",
  },
  cardButton: {
    backgroundColor: "#38acff",
    width: 60,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    alignSelf: "flex-end",
    padding: 5,
  },
  btnCreateGroup: {
    width: 144,
    height: 40,
    backgroundColor: "#38acff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
