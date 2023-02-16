import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import Header from "../../Reuseable Components/Header";
import RBSheet from "react-native-raw-bottom-sheet";
import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebaseNotificationApi from "../../constants/firebaseNotificationApi";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";

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

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import ReportModal from "../../Reuseable Components/ReportModal";

const JoinGroup = ({ navigation, route }) => {
  const bottomSheetRef = useRef();
  const bottomSheetAddMemberRef = useRef();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupPrivacy, setGroupPrivacy] = useState("");
  const [adminId, setAdminId] = useState("");
  const [activeChallegesList, setActiveChallegesList] = useState([]);
  const [groupProfile, setGroupProfile] = useState("");
  const [groupMembersList, setGroupMembersList] = useState([
    // {
    //   id: 0,
    //   name: "Me",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 1,
    //   name: "Nahla",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 2,
    //   name: "Saffa",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 3,
    //   name: "Rui",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 4,
    //   name: "Anum",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 5,
    //   name: "Zaina",
    //   avater: require("../../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 6,
    //   name: 'Noami',
    // avater:require('../../../assets/images/friend-profile.png')
    // },
  ]);
  const [allMembersList, setAllMembersList] = useState([
    {
      id: 0,
      name: "Me",
      avater: require("../../../assets/images/friend-profile.png"),
    },
    {
      id: 1,
      name: "Nahla",
      avater: require("../../../assets/images/friend-profile.png"),
    },
    {
      id: 2,
      name: "Saffa",
      avater: require("../../../assets/images/friend-profile.png"),
    },
    {
      id: 3,
      name: "Rui",
      avater: require("../../../assets/images/friend-profile.png"),
    },
    {
      id: 4,
      name: "Anum",
      avater: require("../../../assets/images/friend-profile.png"),
    },
    {
      id: 5,
      name: "Zaina",
      avater: require("../../../assets/images/friend-profile.png"),
    },
    // {
    //   id: 6,
    //   name: 'Noami',
    // avater:require('../../../assets/images/friend-profile.png')
    // },
  ]);

  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (route?.params) {
      setLoading(true);
      //getting group details
      getSingleGroupInfo(route?.params?.item?.id);
      //getting list of members that is added in this group
      getGroupMembers(route?.params?.item?.id);

      getActiveChallenges(route?.params?.item?.id);
    }
  }, [route?.params]);

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
            console.log("error in getting user detail ::", error);
            resolve(false);
          });
      } catch (error) {
        console.log("error occur in getting user profile detail ::", error);
        resolve(false);
      }
    });
  };

  const getGroupMembers = (id) => {
    setGroupMembersList([]);

    if (id) {
      let data = {
        id: id,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.get_specific_group_members, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result[0]?.error == false || result[0]?.error == false) {
            let membersList = result[0]?.Members ? result[0]?.Members : [];
            let list = [];
            if (membersList?.length > 0) {
              for (const element of membersList) {
                let userInfo = await getUser_Info(element?.user_id);
                if (userInfo != false) {
                  let obj = {
                    id: element?.user_id,
                    user_id: element?.user_id,
                    first_name: userInfo ? userInfo?.first_name : "",
                    last_name: userInfo ? userInfo?.last_name : "",
                    profile: userInfo
                      ? BASE_URL_Image + "/" + userInfo["profile image"]
                      : "",
                    selected: false,
                  };
                  list.push(obj);
                }
              }
              setGroupMembersList(list);
            } else {
              Snackbar.show({
                text: result[0]?.message,
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          } else {
            Snackbar.show({
              text: result[0]?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        })
        .catch((error) => {
          console.log("error in getting groups list ::: ", error);
          Snackbar.show({
            text: "Something went wrong.Unable to get group members.",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    }
  };

  const getSingleGroupInfo = (id) => {
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
        console.log("result ::::::  ", result);

        if (result != null) {
          setGroupId(result[0]?.id);
          setGroupName(result[0]?.name);
          setAdminId(result[0]["Admin id"]);
          setGroupPrivacy(result[0]?.group_privacy);

          let image_link = result[0]?.image_link
            ? BASE_URL_Image + "/" + result[0]?.image_link
            : "";
          setGroupProfile(image_link);
        } else {
          Snackbar.show({
            text: "Group Detail Not found",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        console.log("error in getting group detail ::", error);
        Snackbar.show({
          text: "Something went wrong.Unable to get group detail.",
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };
  const handleJoinGroup = async () => {
    if (groupId) {
      let user_id = await AsyncStorage.getItem("user_id");

      setLoading(true);
      let data = {
        user_id: user_id,
        group_id: groupId,
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
          // sendPushNotification(adminId);
          addMemberToGroup(groupId, adminId);

          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation?.goBack();
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    }
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

    // let group_info = await getGroup_Info(group_id);

    if (groupPrivacy == "public") {
      //handle add member
      const database = getDatabase();
      let group = await findGroup(group_id);
      if (group) {
        let filter = group?.members?.filter(
          (element) => element?.id == user_id
        );

        if (filter?.length > 0) {
          //user already added in this group
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
              },
            ],
          };
          update(ref(database, `groups/${group_id}`), membersObj);
        }
      } else {
        //create group
        createGroupForChat(group_id, groupName, adminId);
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

  //getting specific challenge details
  const getChallengeInfo = (id) => {
    return new Promise((resolve, reject) => {
      let data = {
        challenge_id: id,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.get_challenge_details, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result?.error == false || result?.error == "false") {
            let detail = result?.Challenge[0] ? result?.Challenge[0] : null;
            if (detail == null) {
              resolve(false);
            } else {
              resolve(detail);
            }
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          resolve(false);
        });
    });
  };

  //getting group active challenges list
  const getActiveChallenges = async (id) => {
    let data = {
      group_id: id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_group_active_challenges, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.error == false || result?.error == "false") {
          let responseList = result?.challenges ? result?.challenges : [];
          // console.log("response Lost  :::: ", responseList);
          let list = [];
          for (const element of responseList) {
            let challenge_info = await getChallengeInfo(element?.challenge_id);
            let found = list.some(
              (e) => e?.challenge_info?.id == challenge_info?.id
            );

            if (found) {
              //not storing same challenge twice
            } else {
              let obj = {
                id: element?.id,
                noti_type_id: element?.noti_type_id,
                challenge_id: element?.challenge_id,
                group_id: element?.group_id,
                status: element?.status,
                challenge_info: {
                  id: challenge_info?.id,
                  created_by_user_id: challenge_info?.id,
                  image: challenge_info?.image
                    ? BASE_URL_Image + "/" + challenge_info?.image
                    : "",
                  name: challenge_info?.name,
                  challenge_type: challenge_info?.challenge_type,
                  challenge_visibility: challenge_info?.challenge_visibility,
                  challenge_privacy: challenge_info?.challenge_privacy,
                  start_date: challenge_info?.start_date,
                  end_date: challenge_info?.end_date,
                  challenge_metric_no: challenge_info?.challenge_metric_no,
                  challenge_metric_step_type:
                    challenge_info?.challenge_metric_step_type,
                },
              };
              list.push(obj);
            }
          }
          setActiveChallegesList(list);
        } else {
          setActiveChallegesList([]);
          console.log("else  :::: ");
          // Snackbar.show({
          //   text: result?.message ? result?.message : result?.Message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        console.log(
          "error in getting non added memebers list >>>>>>>>>>>",
          error
        );
        Snackbar.show({
          text: "Something went wrong.Unable to get active challenges",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };
  //send push notification to user
  const sendPushNotification = async (id, message) => {
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
      let title = groupName;
      let description = message;
      // let description = `${fullName} wants to join your Group...`;
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
  const sendPushNotificationChallenge = async (id) => {};

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    //getting group details
    getSingleGroupInfo(route?.params?.item?.id);
    //getting list of members that is added in this group
    getGroupMembers(route?.params?.item?.id);

    getActiveChallenges(route?.params?.item?.id);
  };

  const handleReportGroup = async () => {
    if (comment?.length == 0) {
      Snackbar.show({
        text: "Please Enter comment to submit",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      let user_id = await AsyncStorage.getItem("user_id");
      // setLoading(true);
      let data = {
        report_group: route?.params?.item?.id,
        reported_by: user_id,
        comments: comment,
      };

      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.report_group, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setVisible(false);
          Snackbar.show({
            text: "Group Reported Successfully",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
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
        {loading && <Loader />}

        <View style={{ paddingHorizontal: 20 }}>
          {/* <Header title={"Incorruptibles"} navigation={navigation} /> */}
          <Header title={groupName} navigation={navigation} />
          <TouchableOpacity
            // onPress={() => handleChatPress(userId)}
            onPress={() => setVisible(true)}
            style={{
              position: "absolute",
              right: responsiveWidth(5),
              top: 20,
            }}
          >
            <Image
              source={require("../../../assets/images/report.png")}
              style={{ width: 25, height: 25, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={{ height: 120 }}></View>
        ) : (
          <View
            style={{
              marginVertical: 10,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            {groupProfile ? (
              <Image
                source={{ uri: groupProfile }}
                style={{
                  marginVertical: 10,
                  height: 123,
                  width: 123,
                  borderRadius: 123,
                  backgroundColor: "#ccc",
                }}
              />
            ) : (
              <Image
                source={require("../../../assets/images/group-profile2.png")}
                style={{
                  marginVertical: 10,
                  height: 123,
                  width: 123,
                }}
              />
            )}

            <Text
              style={{
                color: "#000000",
                fontSize: 17,
                fontFamily: "Rubik-Regular",
                marginTop: 5,
              }}
            >
              {/* Incorruptibles */}
              {groupName}
            </Text>
            {
              <>
                {route?.params?.item?.type == "notification" ? null : route
                    ?.params?.item?.status == true ||
                  route?.params?.item?.status == "requested" ? (
                  <TouchableOpacity
                    style={{ ...styles.btn, backgroundColor: "#ccc" }}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 16,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Requested
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => handleJoinGroup()}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 16,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Join Group
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            }
          </View>
        )}

        <View style={{ marginVertical: 10, paddingHorizontal: 20 }}>
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontFamily: "Rubik-Regular",
            }}
          >
            Active Challenges
          </Text>

          {loading ? (
            <View style={{ height: 120 }}></View>
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={activeChallegesList}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      height: 120,
                      justifyContent: "center",
                      alignItems: "center",
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    <Text style={{ color: "#000" }}> No Active Challenges</Text>
                  </View>
                );
              }}
              renderItem={(item) => {
                return (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate("GroupDetail")}
                    onPress={() => {
                      navigation.navigate("ChallengesDetail", {
                        item: item?.item?.challenge_info,
                      });
                    }}
                    style={{
                      ...styles.cardView,
                      justifyContent: "center",
                      height: 110,
                      width: "28.9%",
                    }}
                  >
                    {item?.item?.challenge_info?.image ? (
                      <Image
                        source={{ uri: item?.item?.challenge_info?.image }}
                        style={{
                          marginVertical: 8,
                          width: 44,
                          height: 44,
                          backgroundColor: "#ccc",
                          borderRadius: 44,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/images/Challenge.png")}
                        style={{ marginVertical: 8, width: 44, height: 44 }}
                      />
                    )}

                    <Text style={styles.cardText} numberOfLines={2}>
                      {item?.item?.challenge_info?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
        <View style={{}}>
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              paddingHorizontal: 20,
              fontFamily: "Rubik-Regular",
            }}
          >
            Group Members ({groupMembersList.length})
          </Text>

          <View
            style={{
              marginVertical: 15,
              paddingBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={groupMembersList}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => {
                return (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate("GroupDetail")}
                    onPress={() => {
                      navigation.navigate("FriendProfile", {
                        user: {
                          id: item?.item?.id,
                        },
                      });
                    }}
                    style={{
                      ...styles.cardView,
                      justifyContent: "center",
                      height: 110,
                      width: "28.9%",
                    }}
                  >
                    {item?.item.profile != "" ? (
                      <Image
                        source={{ uri: item?.item?.profile }}
                        style={{
                          marginVertical: 8,
                          width: 44,
                          height: 44,
                          backgroundColor: "#ccc",
                          borderRadius: 44,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/images/friend-profile.png")}
                        style={{ marginVertical: 8, width: 44, height: 44 }}
                      />
                    )}
                    <Text style={styles.cardText}>
                      {item?.item?.first_name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>

      <ReportModal
        title={"Report Group"}
        visible={visible}
        setVisible={setVisible}
        comment={comment}
        setComment={setComment}
        onPress={() => handleReportGroup()}
      />
    </View>
  );
};

export default JoinGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  btn: {
    marginTop: 15,
    width: 120,
    height: 35,
    backgroundColor: "#38ACFF",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  bootSheetCardView: {
    height: 100,
    width: 101,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 6,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
});
