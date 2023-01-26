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
import RBSheet from "react-native-raw-bottom-sheet";
import Header from "../../Reuseable Components/Header";

import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment/moment";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";
import { useFocusEffect } from "@react-navigation/native";
import firebaseNotificationApi from "../../constants/firebaseNotificationApi";

const Notification = ({ navigation }) => {
  const bottomSheetRef = useRef();
  const groupRequest_RBSheetRef = useRef();
  const challengeRequest_RBSheetRef = useRef();

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  ///friend
  const [selected_friend_id, setSelected_friend_id] = useState("");
  const [selected_friend_name, setSelected_friend_name] = useState("");
  const [selected_friend_profile, setSelected_friend_profile] = useState("");
  const [selected_request_status, setSelected_request_status] = useState("");

  //challenge
  const [selected_challenge_id, setSelected_challenge_id] = useState("");
  const [selected_challenge_name, setSelected_challenge_name] = useState("");
  const [selected_challenge_status, setSelected_challenge_status] =
    useState("");
  const [selected_challenge_type, setSelected_challenge_type] = useState(""); //group or individual

  //group request
  const [selected_group_id, setSelected_group_id] = useState("");
  const [selected_group_name, setSelected_group_name] = useState("");
  const [selected_group_status, setSelected_group_status] = useState("");

  //notification
  const [selected_noti_id, setSelected_noti_id] = useState("");
  const [selected_noti_type, setSelected_noti_type] = useState("");

  const [isFriendRequestApproved, setIsFriendRequestApproved] = useState(false);
  const [profileImage, setProfileImage] = useState(
    require("../../../assets/images/friend-profile.png")
  );
  const [notificationsList, setNotificationsList] = useState([
    // {
    //   id: 0,
    //   title: 'Boris Findlay',
    //   description: 'wants to be your friend',
    //   avater: require('../../../assets/images/friend-profile.png'),
    //   date: '5 MINS AGO',
    // },
    // {
    //   id: 1,
    //   title: 'Forest Foragers Group',
    //   description: 'Your request to join the group was approved',
    //   avater: require('../../../assets/images/group-profile2.png'),
    //   date: '18 HRS AGO',
    // },
    // {
    //   id: 2,
    //   title: '20km Challenge',
    //   description: 'Your request to join the challenge was approved',
    //   avater: require('../../../assets/images/Challenge.png'),
    //   date: 'YESTERDAY',
    // },
    // {
    //   id: 3,
    //   title: 'Nikel Challenge',
    //   description: 'Barnabas Finley wants to join  the challenge',
    //   avater: require('../../../assets/images/Challenge.png'),
    //   date: 'YESTERDAY',
    // },
  ]);
  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllNotification();
    }, [])
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
              resolve(false);
            });
        } catch (error) {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };
  const getAllNotification = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    var requestOptions = {
      method: "POST",
      body: JSON.stringify({
        to_id: user_id,
      }),
      redirect: "follow",
    };
    fetch(api.get_all_notifications1, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.error == false || result?.error == "false") {
          let notificationList = result?.Notifications
            ? result?.Notifications
            : [];
          let list = [];
          for (const element of notificationList) {
            let user_info = await getUser_Info(element?.from_id);
            let notification_detail = await getNotification_Detail(element?.id);
            if (user_info && notification_detail != false) {
              let obj = {
                ...element,
                user_info: {
                  message: user_info?.message,
                  email: user_info?.email,
                  password: user_info?.password,
                  "profile image": user_info["profile image"]
                    ? BASE_URL_Image + "/" + user_info["profile image"]
                    : "",
                  first_name: user_info?.first_name,
                  phoneno: user_info?.phoneno,
                  last_name: user_info?.last_name,
                  active_watch: user_info?.active_watch,
                },
                notification_detail,
              };
              list?.push(obj);
            }
          }
          // sort list to show latest notifications first
          list = list.sort((a, b) => {
            return b.id - a.id;
          });

          setNotificationsList(list);
          // setNotificationsList(list?.reverse());
        } else {
          setNotificationsList([]);
          Snackbar.show({
            text: result?.Message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        setNotificationsList([]);
        Snackbar.show({
          text: "Something went wrong.Unable to get notifications.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  //getting notification detail
  const getNotification_Detail = async (id) => {
    return new Promise(async (resolve) => {
      if (!id) {
        resolve(false);
      } else {
        try {
          var requestOptions = {
            method: "POST",
            body: JSON.stringify({
              id: id,
            }),
            redirect: "follow",
          };
          fetch(api.get_notification_detail, requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
              if (result != null) {
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
      }
    });
  };

  const getSpecificUserDetail = async (id, type) => {
    setLoading(true);
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
          setSelected_friend_id(id);
          setSelected_friend_name(result[0]?.first_name);
          setSelected_friend_profile(result[0]["profile image"]);
          if (type == "group") {
            groupRequest_RBSheetRef?.current?.open();
          } else if (type == "challenge") {
            challengeRequest_RBSheetRef?.current?.open();
          } else {
            bottomSheetRef?.current?.open();
          }
        } else {
          Snackbar.show({
            text: result?.Message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  const sendPushNotification_TO_User = async (id, type) => {
    let user_info = await AsyncStorage.getItem("user");
    let name = "";
    if (user_info != null) {
      let parse = JSON.parse(user_info);
      name = parse?.first_name;
    }
    let user = await firebaseNotificationApi.getFirebaseUser(id);
    if (!user) {
      user = await firebaseNotificationApi.getFirebaseUser(id);
    }
    if (user) {
      let token = user?.fcmToken;
      let title = "Friend Request";
      let description = `${name} ${type} your friend request`;
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

  const handleApproveFriend = async (friend_id) => {
    bottomSheetRef?.current?.close();

    let user_id = await AsyncStorage.getItem("user_id");

    setLoading(true);
    let obj = {
      noti_type_id: selected_noti_id,
      // this_user_id: friend_id,
      // friend_user_id: user_id,
      this_user_id: user_id,
      friend_user_id: friend_id,
      date: new Date(),
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.approveRequest, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result[0]?.error == "false" || result[0]?.error == false) {
          // console.log('result :: ', result);
          sendPushNotification_TO_User(friend_id, "approved");
          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });

          // getAllNotification();
        } else {
          Snackbar.show({
            text: result?.Message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
    // setIsFriendRequestApproved(!isFriendRequestApproved);
  };

  const handleUnApprove_FriendRequest = async (friend_id, noti_id) => {
    let user_id = await AsyncStorage.getItem("user_id");
    bottomSheetRef?.current?.close();
    setLoading(true);
    let obj = {
      // friend_user_id: user_id,
      // noti_type_id: noti_id,
      // this_user_id: friend_id,

      friend_user_id: friend_id,
      noti_type_id: noti_id,
      this_user_id: user_id,
      date: new Date(),
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.unApproveRequest, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        Snackbar.show({
          text: "Request Canceled successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        sendPushNotification_TO_User(friend_id, "rejected");
        // getAllNotification();
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
    //setIsFriendRequestApproved(!isFriendRequestApproved);
  };

  const hanldeApprove_GroupRequest1 = () => {
    setLoading(true);
    let data = {
      group_id: groupId,
      adminid: adminId,
      user_id: memberList,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.addmembers, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("add memebrs response :::: ", result);
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //handle approve group request
  const hanldeApprove_GroupRequest = (noti_id, group_id) => {
    // alert("handle approve group request");
    groupRequest_RBSheetRef?.current?.close();
    setLoading(true);
    let data = {
      noti_type_id: noti_id,
      // status: "approved",
      status: "membered",
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.update_group_request, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        Snackbar.show({
          text: "Request approved Successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        // getAllNotification();
        // } else {
        //   Snackbar.show({
        //     text: "Something went wrong",
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //handle unapprove group request

  const handleUnApprove_GroupRequest = (noti_id, group_id) => {
    groupRequest_RBSheetRef?.current?.close();

    setLoading(true);
    let data = {
      noti_type_id: noti_id,
      status: "rejected",
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.update_group_request, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        Snackbar.show({
          text: "Request Rejected Successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        // getAllNotification();
        // } else {
        //   Snackbar.show({
        //     text: "Something went wrong",
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //approve challenge join request
  const handleApprove_ChallengeRequest = (notificationId) => {
    challengeRequest_RBSheetRef?.current?.close();
    setLoading(true);
    let obj = {
      // status: "membered",
      status: "approved",
      noti_type_id: notificationId,
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.approve_individual_challenge, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result[0]?.error == false || result[0]?.error == "false") {
          Snackbar.show({
            text: "Request approved successfully",
            duration: Snackbar.LENGTH_SHORT,
          });
          // getAllNotification();
        } else {
          Snackbar.show({
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //reject challenge join request
  const handleIgnore_ChallengeRequest = (notificationId) => {
    setLoading(true);
    challengeRequest_RBSheetRef?.current?.close();
    let obj = {
      status: "rejected",
      noti_type_id: notificationId,
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.approve_individual_challenge, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result[0]?.error == false || result[0]?.error == "false") {
          Snackbar.show({
            text: "Request rejected successfully",
            duration: Snackbar.LENGTH_SHORT,
          });
          // getAllNotification();
        } else {
          Snackbar.show({
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //handle join  group (from group admin) challenge request
  const handle_Join_Challenge_Request = (notificationId) => {
    challengeRequest_RBSheetRef?.current?.close();

    setLoading(true);
    let obj = {
      noti_type_id: notificationId,
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.group_admin_send_request_to_challenge_owner, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        Snackbar.show({
          text: "Request Send to challenge admin successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        // getAllNotification();
        // } else {
        //   Snackbar.show({
        //     text: "Something went wrong",
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //ignore join challenge request
  const handle_Ignore_Join_Challenge_Request = (notificationId) => {
    challengeRequest_RBSheetRef?.current?.close();
  };

  //handle approve group challenge request
  const handleApprove_GroupChallenge_Request = (notificationId) => {
    challengeRequest_RBSheetRef?.current?.close();
    setLoading(true);
    let obj = {
      status: "membered",
      noti_type_id: notificationId,
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.approve_or_reject_groupChallenge_request, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("group request approve response: ", result);
        Snackbar.show({
          text: "Request Approved successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        // getAllNotification();
      })
      .catch((error) => {
        console.log("error in approving group challenge request: ", error);
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //handle reject group challenge request
  const handleReject_GroupChallenge_Request = (notificationId) => {
    challengeRequest_RBSheetRef?.current?.close();
    setLoading(true);
    let obj = {
      status: "unapproved",
      noti_type_id: notificationId,
      date: new Date(),
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(obj),
      redirect: "follow",
    };
    fetch(api.approve_or_reject_groupChallenge_request, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        Snackbar.show({
          text: "Request Rejected successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        // getAllNotification();
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //get specific challenge info
  const getChallengeInfo = (id) => {
    return new Promise((resolve, reject) => {
      try {
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
            console.log("errror in challenge details: ", error);
            resolve(false);
          });
      } catch (error) {
        resolve(false);
      }
    });
  };

  //get specific group info
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

  //mark specific notification as read
  const markAsRead = (id) => {
    var requestOptions = {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
      redirect: "follow",
    };
    fetch(api.mark_notification_as_read, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.error == false || result?.error == "false") {
          const newData = notificationsList?.map((item) => {
            if (id == item.id) {
              return {
                ...item,
                status: "read",
              };
            } else {
              return {
                ...item,
              };
            }
          });
          setNotificationsList(newData);
        } else {
          console.log("something went wrong");
        }
      })
      .catch((error) => {
        console.log("error while marking notification as read", error);
      });
  };

  //mark all notification as read
  const handleMarkAllAsRead = async () => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");
      setLoading(true);
      var requestOptions = {
        method: "POST",
        body: JSON.stringify({
          to_id: user_id,
        }),
        redirect: "follow",
      };
      fetch(api.mark_all_notifications_as_read, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result?.error == false || result?.error == "false") {
            const newData = notificationsList?.map((item) => {
              return {
                ...item,
                status: "read",
              };
            });
            setNotificationsList(newData);
            Snackbar.show({
              text: "Marked all notifications as read successfully",
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            Snackbar.show({
              text: "Something went wrong",
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.Please try again",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      Snackbar.show({
        text: "Something went wrong.Please try again",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const handleNotificationPress = async (item) => {
    console.log("notification press   ::::  ", item);

    let user_id = item.from_id;

    let first_name = item?.user_info?.first_name;
    let last_name = item?.user_info?.last_name;
    let full_name = first_name + " " + last_name;

    let img = item?.user_info["profile image"]
      ? item?.user_info["profile image"]
      : "";
    setSelected_friend_id(user_id);
    setSelected_friend_name(full_name);
    setSelected_friend_profile(img);

    setSelected_noti_id(item?.id);
    setSelected_noti_type(item?.noti_type);

    //change notification status
    markAsRead(item?.id);

    console.log("here.......");
    // setLoading(true);
    let notification_info = await getNotification_Detail(item?.id);
    console.log("notification_info find  .....   ", notification_info);

    if (item?.noti_type == "friends to friends") {
      // getSpecificUserDetail(item?.from_id);
      setSelected_request_status(
        notification_info.staus ? notification_info.staus : "friends"
      );
      setLoading(false);
      bottomSheetRef?.current?.open();
    } else if (
      item?.noti_type == "user to group" ||
      item?.noti_type == "Admin to User For group" ||
      item?.noti_type == "group admin to user"
    ) {
      // getSpecificUserDetail(item?.from_id, "group");
      let group_id = item?.notification_detail?.group_id;
      setLoading(true);
      let group_info = await getGroup_Info(group_id);
      setLoading(false);
      if (group_info) {
        let id = group_info?.id;
        let name = group_info?.name;
        setSelected_group_id(id);
        setSelected_group_name(name);
        // setSelected_group_status(item?.notification_detail?.status);
        setSelected_group_status(notification_info?.status);
        groupRequest_RBSheetRef?.current?.open();
      }
    } else if (
      item?.noti_type == "user to indiviual challenge" ||
      item?.noti_type == "user to join indiviual challenge" ||
      item?.noti_type == "admin to indiviual challenge acception" ||
      item?.noti_type == "user to group admin for challenge joining" ||
      item?.noti_type == "group admin to challenge owner" ||
      item?.noti_type == "group challenge response" ||
      item?.noti_type == "challenge admin to user" ||
      item?.noti_type == "admin to user for challenges" ||
      item?.noti_type == "admin to indiviual challenge"
    ) {
      let challenge_id = item?.notification_detail?.challenge_id;
      setLoading(true);
      let challenge_info = await getChallengeInfo(challenge_id);
      setLoading(false);
      if (challenge_info) {
        let id = challenge_info?.id;
        let name = challenge_info?.name;
        setSelected_challenge_id(id);
        setSelected_challenge_name(name);
        setSelected_challenge_type(challenge_info?.challenge_type);
        // setSelected_challenge_status(item?.notification_detail?.status);
        setSelected_challenge_status(notification_info?.status);
        challengeRequest_RBSheetRef?.current?.open();
      }
    } else {
      console.log("notification not found  ::: ");
      setLoading(false);
    }
  };

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    getAllNotification();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
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
        {/* <Header title={"Notifications"} navigation={navigation} onButtonPress /> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{ padding: 10, paddingLeft: 0 }}
            onPress={() => navigation?.goBack()}
          >
            <Image
              source={require("../../../assets/images/left-arrow.png")}
              style={{ width: 14, height: 22 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: "#000000",
              textAlign: "left",
              flex: 1,
              // backgroundColor: "red",
              marginRight: 14,
              marginLeft: 15,
              fontSize: 23,
              fontFamily: "Rubik-Medium",
            }}
          >
            Notifications
          </Text>
          <TouchableOpacity
            style={{ paddingVertical: 10 }}
            onPress={() => handleMarkAllAsRead()}
          >
            <Text
              style={{
                color: "#000000",
                textAlign: "center",
                fontSize: 11,
                fontFamily: "Rubik-Regular",
              }}
            >
              Mark All as Read
            </Text>
          </TouchableOpacity>
        </View>

        {loading && <Loader />}
        {loading ? null : (
          <View style={{ flex: 1 }}>
            {notificationsList.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../assets/images/bell2.png")}
                  style={{
                    width: 92,
                    height: 113,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                    width: 182,
                    textAlign: "center",
                    marginVertical: 20,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  All your Notifications will appear here
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  marginTop: 15,
                }}
              >
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={notificationsList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          marginVertical: 15,
                          justifyContent: "space-between",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        {item?.item?.noti_type == "friends to friends" ? (
                          //friend notification
                          <>
                            {item?.item?.user_info["profile image"] ? (
                              <Image
                                source={{
                                  uri: item?.item?.user_info["profile image"],
                                }}
                                style={{
                                  height: 60,
                                  width: 60,
                                  borderRadius: 60,
                                  backgroundColor: "#ccc",
                                }}
                              />
                            ) : (
                              <Image
                                source={require("../../../assets/images/friend-profile.png")}
                                style={{
                                  height: 60,
                                  width: 60,
                                }}
                              />
                            )}
                          </>
                        ) : item?.item?.noti_type == "user to group" ||
                          item?.item?.noti_type == "Admin to User For group" ? (
                          //group notification
                          <Image
                            source={require("../../../assets/images/group-profile2.png")}
                            style={{
                              height: 60,
                              width: 60,
                            }}
                          />
                        ) : item?.item?.noti_type ==
                            "user to indiviual challenge" ||
                          item?.item?.noti_type ==
                            "user to join indiviual challenge" ||
                          item?.item?.noti_type ==
                            "admin to indiviual challenge acception" ||
                          item?.item?.noti_type ==
                            "admin to indiviual challenge" ||
                          item?.item?.noti_type ==
                            "admin to user for challenges" ||
                          item?.item?.noti_type ==
                            "group admin to challenge owner" ||
                          item?.item?.noti_type == "group challenge response" ||
                          item?.item?.noti_type ==
                            "user to group admin for challenge joining" ||
                          item?.item?.noti_type == "challenge admin to user" ? (
                          //challenge notification
                          <Image
                            source={require("../../../assets/images/Challenge.png")}
                            style={{
                              height: 60,
                              width: 60,
                            }}
                          />
                        ) : (
                          <Image
                            source={require("../../../assets/images/friend-profile.png")}
                            style={{
                              height: 60,
                              width: 60,
                            }}
                          />
                        )}
                        {/* <Image
                      source={item.item.avater}
                      style={{
                        height: 60,
                        width: 60,
                      }}
                    /> */}
                        <TouchableOpacity
                          onPress={() => {
                            // item.index === 0 && bottomSheetRef?.current?.open();
                            handleNotificationPress(item?.item);
                          }}
                          style={{ flex: 1, marginLeft: 10 }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                color: "#000000",
                                fontSize: 16,
                                fontFamily: "Rubik-Medium",
                              }}
                            >
                              {/* {item.item.title} */}

                              {item?.item?.noti_type == "friends to friends"
                                ? "Friend Request"
                                : item?.item?.noti_type == "user to group" ||
                                  item?.item?.noti_type ==
                                    "Admin to User For group" ||
                                  item?.item?.noti_type == "group admin to user"
                                ? "Group Request"
                                : item?.item?.noti_type ==
                                    "user to indiviual challenge" ||
                                  item?.item?.noti_type ==
                                    "user to join indiviual challenge" ||
                                  item?.item?.noti_type ==
                                    "admin to indiviual challenge acception" ||
                                  item?.item?.noti_type ==
                                    "admin to indiviual challenge" ||
                                  item?.item?.noti_type ==
                                    "admin to user for challenges" ||
                                  item?.item?.noti_type ==
                                    "user to group admin for challenge joining" ||
                                  item?.item?.noti_type ==
                                    "group admin to challenge owner" ||
                                  item?.item?.noti_type ==
                                    "group challenge response" ||
                                  item?.item?.noti_type ==
                                    "challenge admin to user"
                                ? "Challenge Request"
                                : "other"}
                            </Text>
                            <Text
                              style={{
                                color: "#838383",
                                fontFamily: "Rubik-Regular",
                              }}
                            >
                              {/* {item?.item?.date &&
                            moment(item?.item?.date).format("DD-MM-YY")} */}
                              {item?.item?.date &&
                                moment(item?.item?.date).fromNow()}
                            </Text>
                          </View>
                          <Text
                            style={{
                              // color: item.index == 0 ? '#003e6b' : '#000000',
                              color:
                                item?.item?.status == "unread"
                                  ? "#003e6b"
                                  : "#000000",
                              fontFamily: "Rubik-Regular",
                            }}
                          >
                            {/* {item.item.description} */}
                            {/* notification description */}
                            {/* {item?.item?.noti_type} */}

                            {item?.item?.noti_type == "friends to friends" &&
                            item?.item?.notification_detail?.staus == "approved"
                              ? `${item?.item?.user_info?.first_name} approved your friend request`
                              : item?.item?.noti_type == "friends to friends"
                              ? `${item?.item?.user_info?.first_name} wants to be your friend`
                              : item?.item?.noti_type == "user to group"
                              ? `${item?.item?.user_info?.first_name} wants to join your group`
                              : item?.item?.noti_type ==
                                "Admin to User For group"
                              ? `${item?.item?.user_info?.first_name} added you in group`
                              : item?.item?.noti_type == "group admin to user"
                              ? `${item?.item?.user_info?.first_name} ${
                                  item?.item?.notification_detail?.status ==
                                    "membered" ||
                                  item?.item?.notification_detail?.status ==
                                    "approved"
                                    ? "approve"
                                    : "rejected"
                                } your group join request`
                              : item?.item?.noti_type ==
                                  "user to indiviual challenge" ||
                                // item?.item?.noti_type ==
                                //   "user to join indiviual challenge" ||
                                item?.item?.noti_type ==
                                  "admin to user for challenges" ||
                                item?.item?.noti_type ==
                                  "group admin to challenge owner"
                              ? `${
                                  item?.item?.notification_detail?.status ==
                                  "requested"
                                    ? `${item?.item?.user_info?.first_name} wants to join challenge`
                                    : `${item?.item?.user_info?.first_name} added you in challenge`
                                }`
                              : item?.item?.noti_type ==
                                  "admin to indiviual challenge acception" ||
                                item?.item?.noti_type ==
                                  "admin to indiviual challenge"
                              ? `${item?.item?.user_info?.first_name} ${
                                  item?.item?.notification_detail?.status ==
                                    "membered" ||
                                  item?.item?.notification_detail?.status ==
                                    "approved"
                                    ? "Accepted"
                                    : "Rejected"
                                } your challenge join request`
                              : item?.item?.noti_type ==
                                "user to group admin for challenge joining"
                              ? `Your group member ${item?.item?.user_info?.first_name} wants to join challenge`
                              : item?.item?.noti_type ==
                                "group challenge response"
                              ? `${item?.item?.user_info?.first_name} ${
                                  item?.item?.notification_detail?.status ==
                                    "membered" ||
                                  item?.item?.notification_detail?.status ==
                                    "approved"
                                    ? "added you in  group challenge"
                                    : "rejected your challenge join request"
                                }`
                              : item?.item?.noti_type ==
                                "challenge admin to user"
                              ? `${item?.item?.user_info?.first_name} added you in group challenge`
                              : item?.item?.noti_type ==
                                "user to join indiviual challenge"
                              ? ` ${
                                  item?.item?.notification_detail?.status ==
                                  "requested"
                                    ? `${item?.item?.user_info?.first_name} wants to join challenge`
                                    : item?.item?.notification_detail?.status ==
                                      "rejected"
                                    ? `you rejected challenge joined request`
                                    : `${item?.item?.user_info?.first_name} joined your challenge`
                                }`
                              : "other"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        )}

        {/* ---------------------------------------Friend Bottom Sheet------------------------------------------------------- */}
        <RBSheet
          ref={bottomSheetRef}
          height={320}
          openDuration={270}
          closeOnDragDown={true}
          closeOnPressMask={false}
          animationType={"slide"}
          customStyles={{
            container: {
              padding: 5,
              alignItems: "center",
              // height: 530,
              flex: 1.4,
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
            Friend Request
          </Text>
          {selected_friend_profile ? (
            <Image
              source={{ uri: selected_friend_profile }}
              style={{
                marginTop: 20,
                marginBottom: 10,
                width: 110,
                height: 110,
                borderRadius: 110,
                backgroundColor: "#ccc",
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={profileImage}
              style={{
                marginTop: 20,
                marginBottom: 10,
                width: 110,
                height: 110,
                resizeMode: "contain",
              }}
            />
          )}

          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontFamily: "Rubik-Medium",
            }}
          >
            {/* Boris Findlay */}
            {selected_friend_name}
          </Text>
          {/* <Text
          style={{
            color: "#000000",
            fontSize: 16,
            fontFamily: "Rubik-Medium",
          }}
        >
          status : {selected_request_status}
        </Text> */}
          {selected_request_status == "unapproved" ||
          selected_request_status == "rejected" ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...styles.btnText,
                  fontSize: 15,
                  fontFamily: "Rubik-Medium",
                  color: "#38ACFF",
                }}
              >
                You rejected this request
              </Text>
            </View>
          ) : isFriendRequestApproved ||
            selected_request_status == "friends" ||
            selected_request_status == "approved" ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...styles.btnText,
                  fontSize: 15,
                  fontFamily: "Rubik-Medium",
                  color: "#38ACFF",
                }}
              >
                You are now friends
              </Text>
            </View>
          ) : (
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.btnBottomSheet}
                onPress={() =>
                  // setIsFriendRequestApproved(!isFriendRequestApproved)
                  handleApproveFriend(selected_friend_id)
                }
              >
                <Text style={styles.btnText}>Approve Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.btnBottomSheet,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                }}
                onPress={() =>
                  handleUnApprove_FriendRequest(
                    selected_friend_id,
                    selected_noti_id
                  )
                }
                // onPress={() => bottomSheetRef?.current?.close()}
              >
                <Text style={{ ...styles.btnText, color: "#38ACFF" }}>
                  Ignore Request
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={{ ...styles.btnBottomSheet, backgroundColor: "#003e6b" }}
            onPress={() => {
              navigation.navigate("FriendRequest", {
                id: selected_friend_id,
                selected_noti_id: selected_noti_id,
                status: selected_request_status,
              });
              bottomSheetRef?.current?.close();
            }}
          >
            <Text style={styles.btnText}>View Profile</Text>
          </TouchableOpacity>
        </RBSheet>
        {/* ----------------------------------------Group Bottom Sheet--------------------------------------------------------- */}
        <RBSheet
          ref={groupRequest_RBSheetRef}
          height={300}
          openDuration={270}
          closeOnDragDown={true}
          closeOnPressMask={false}
          animationType={"slide"}
          customStyles={{
            container: {
              padding: 5,
              alignItems: "center",
              // height: 530,
              flex: 1.1,
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
            Group Request
          </Text>
          {selected_friend_profile ? (
            <Image
              source={{ uri: selected_friend_profile }}
              style={{
                marginTop: 20,
                marginBottom: 10,
                width: 110,
                height: 110,
                borderRadius: 110,
                backgroundColor: "#ccc",
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={profileImage}
              style={{
                marginTop: 20,
                marginBottom: 10,
                width: 110,
                height: 110,
                resizeMode: "contain",
              }}
            />
          )}
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontFamily: "Rubik-Medium",
            }}
          >
            {selected_friend_name}
          </Text>

          <View
            style={{
              width: "87%",
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
                fontFamily: "Rubik-Medium",
              }}
            >
              Request For :
            </Text>
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
                fontFamily: "Rubik-Medium",
              }}
            >
              {selected_group_name}
            </Text>
          </View>

          {/* <Text
          style={{
            color: "#000000",
            fontSize: 14,
            fontFamily: "Rubik-Medium",
          }}
        >
          status : {selected_group_status}
        </Text> */}
          {selected_group_status == "requested" ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.btnBottomSheet}
                onPress={() => {
                  // handleApproveFriend(selected_friend_id)
                  hanldeApprove_GroupRequest(
                    selected_noti_id,
                    selected_group_id
                  );
                }}
              >
                <Text style={styles.btnText}>Approve Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.btnBottomSheet,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                }}
                // onPress={() => groupRequest_RBSheetRef?.current?.close()}
                onPress={() =>
                  handleUnApprove_GroupRequest(
                    selected_noti_id,
                    selected_group_id
                  )
                }
              >
                <Text style={{ ...styles.btnText, color: "#38ACFF" }}>
                  Ignore Request
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...styles.btnText,
                  fontSize: 15,
                  fontFamily: "Rubik-Medium",
                  color: "#38ACFF",
                }}
              >
                {selected_group_status == "rejected"
                  ? "Request Rejected"
                  : "Request Accepted"}
              </Text>
            </View>
          )}
        </RBSheet>
        {/*------------------------------------------Challenge Bottom Sheet-------------------------------------------------------------- */}
        <RBSheet
          ref={challengeRequest_RBSheetRef}
          height={300}
          openDuration={270}
          closeOnDragDown={true}
          closeOnPressMask={false}
          animationType={"slide"}
          customStyles={{
            container: {
              padding: 5,
              alignItems: "center",
              // height: 530,
              flex: 1.1,
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
            Challenge Request
          </Text>
          {selected_friend_profile ? (
            <Image
              source={{ uri: selected_friend_profile }}
              style={{
                marginTop: 20,
                marginBottom: 10,
                width: 110,
                height: 110,
                borderRadius: 110,
                backgroundColor: "#ccc",
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={profileImage}
              style={{
                marginTop: 20,
                marginBottom: 10,
                width: 110,
                height: 110,
                resizeMode: "contain",
              }}
            />
          )}
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontFamily: "Rubik-Medium",
            }}
          >
            {/* Boris Findlay */}
            {selected_friend_name}
          </Text>
          <View
            style={{
              width: "87%",
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
                fontFamily: "Rubik-Medium",
              }}
            >
              Request For :
            </Text>
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
                fontFamily: "Rubik-Medium",
              }}
            >
              {selected_challenge_name}
            </Text>
          </View>
          {/* <Text
          style={{
            color: "#000000",
            fontSize: 14,
            fontFamily: "Rubik-Medium",
          }}
        >
          status : {selected_challenge_status}
        </Text> */}

          {selected_challenge_status == "requested" ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              {selected_noti_type ==
              "user to group admin for challenge joining" ? (
                <TouchableOpacity
                  style={styles.btnBottomSheet}
                  onPress={() => {
                    handle_Join_Challenge_Request(selected_noti_id);
                  }}
                >
                  <Text style={styles.btnText}>Join Challenge</Text>
                </TouchableOpacity>
              ) : selected_noti_type == "group admin to challenge owner" ? (
                <TouchableOpacity
                  style={styles.btnBottomSheet}
                  onPress={() => {
                    handleApprove_GroupChallenge_Request(selected_noti_id);
                  }}
                >
                  <Text style={styles.btnText}>
                    Approve Group Challenge Request
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btnBottomSheet}
                  onPress={() => {
                    handleApprove_ChallengeRequest(selected_noti_id);
                  }}
                >
                  <Text style={styles.btnText}>Approve Request</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  ...styles.btnBottomSheet,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                }}
                onPress={() => {
                  selected_noti_type ==
                  "user to group admin for challenge joining"
                    ? handle_Ignore_Join_Challenge_Request(selected_noti_id)
                    : selected_noti_type == "group admin to challenge owner"
                    ? handleReject_GroupChallenge_Request(selected_noti_id)
                    : handleIgnore_ChallengeRequest(selected_noti_id);
                }}
              >
                <Text style={{ ...styles.btnText, color: "#38ACFF" }}>
                  Ignore Request
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...styles.btnText,
                  fontSize: 15,
                  fontFamily: "Rubik-Medium",
                  color: "#38ACFF",
                }}
              >
                {selected_noti_type == "challenge admin to user"
                  ? selected_challenge_status == "membered"
                    ? "Added"
                    : selected_challenge_status == "rejected"
                    ? "Request Rejected"
                    : "Request Accepted"
                  : selected_challenge_status == "rejected"
                  ? "Request Rejected"
                  : "Request Accepted"}
              </Text>
            </View>
          )}
        </RBSheet>
      </ScrollView>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  btnText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
  },
  btnBottomSheet: {
    backgroundColor: "#38ACFF",
    borderColor: "#38ACFF",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    width: "85%",
    height: 45,
    marginVertical: 8,
  },
});
