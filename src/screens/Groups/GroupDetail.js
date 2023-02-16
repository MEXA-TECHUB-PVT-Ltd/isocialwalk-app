import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import Header from "../../Reuseable Components/Header";
import RBSheet from "react-native-raw-bottom-sheet";

import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";

import moment from "moment/moment";

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
import { useDispatch, useSelector } from "react-redux";
import {
  setLoginUserDetail,
  setGroupForChat,
  setUserForChat,
} from "../../redux/actions";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import ReportModal from "../../Reuseable Components/ReportModal";

const GroupDetail = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const bottomSheetAddMemberRef = useRef();

  //
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [profile, setProfile] = useState("");
  const [group_name, setGroup_name] = useState("");

  const [logged_in_user_id, setLogged_in_user_id] = useState("");

  const [groupMembersList, setGroupMembersList] = useState([]);

  const [allMembersList, setAllMembersList] = useState([
    {
      id: 0,
      name: "Me",
      avater: require("../../../assets/images/friend-profile.png"),
      selected: false,
    },
    {
      id: 1,
      name: "Nahla",
      avater: require("../../../assets/images/friend-profile.png"),
      selected: false,
    },
    {
      id: 2,
      name: "Saffa",
      avater: require("../../../assets/images/friend-profile.png"),
      selected: false,
    },
    {
      id: 3,
      name: "Rui",
      avater: require("../../../assets/images/friend-profile.png"),
      selected: false,
    },
    {
      id: 4,
      name: "Anum",
      avater: require("../../../assets/images/friend-profile.png"),
      selected: false,
    },
    {
      id: 5,
      name: "Zaina",
      avater: require("../../../assets/images/friend-profile.png"),
      selected: false,
    },
    // {
    //   id: 6,
    //   name: 'Noami',
    // avater:require('../../../assets/images/friend-profile.png')
    // selected: false,
    // },
  ]);

  const [addMembersList, setAddMembersList] = useState([]);

  const [activeChallegesList, setActiveChallegesList] = useState([]);

  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");

  const getLoggedInUser = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    setLogged_in_user_id(user_id);
  };

  useEffect(() => {
    getLoggedInUser();

    if (route?.params) {
      setLoading(true);
      setGroupId(route?.params?.item?.id);

      getGroupDetail(route?.params?.item?.id);

      //getting list of members that is added in this group
      getGroupMembers(route?.params?.item?.id);

      getActiveChallenges(route?.params?.item?.id);

      getAddMembersList(route?.params?.item?.id);
    }
  }, [route?.params]);

  const getGroupDetail = (id) => {
    let data = {
      id: id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_group_detail, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result == null) {
          Snackbar.show({
            text: "Group Detail Not Found",
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          let name = result[0]?.name ? result[0]?.name : "";
          let group_privacy = result[0]?.group_privacy
            ? result[0]?.group_privacy
            : "public";
          let group_visibility = result[0]?.group_visibility
            ? result[0]?.group_visibility
            : "public";
          let image_link = result[0]?.image_link
            ? BASE_URL_Image + "/" + result[0]?.image_link
            : "";

          setGroupId(result[0]?.id);
          setGroup_name(name);
          setAdminId(result[0]["Admin id"]);
          //image
          setProfile(image_link);
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };
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
      .catch((error) => console.log("error in getting groups list ::: ", error))
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  //getting thoses memebres list that is added in this group yet..
  const getAddMembersList = async (groupId) => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      this_user_id: user_id,
      group_id: groupId,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.showmembers, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result[0]?.error == false || result[0]?.error == false) {
          // console.log("add member list response  ::: ", result);
          let list = result[0]["array of Members"]
            ? result[0]["array of Members"]
            : [];

          let responseList = [];
          for (const element of list) {
            let user_info = await getUser_Info(element);

            if (user_info == false) {
              console.log("user detail not found ....");
            } else {
              let obj = {
                id: element, //userid
                user_id: element, //userid
                first_name: user_info?.first_name,
                profile: user_info["profile image"]
                  ? BASE_URL_Image + "/" + user_info["profile image"]
                  : "",
                status: false,
              };
              responseList.push(obj);
            }
          }
          setAddMembersList(responseList);
        } else {
          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) =>
        console.log("error in getting non added memebers list  >>>>>>>", error)
      )
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
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
          // Snackbar.show({
          //   text: result?.message ? result?.message : result?.Message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        console.log(
          "error in getting non added memebers list ::::::::::::  ",
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

  const handleAddMemberSelect = (id) => {
    const newData = addMembersList.map((item) => {
      if (id === item.user_id) {
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
    setAddMembersList(newData);
  };

  const handleRemoveMemberSelect = (id) => {
    if (id) {
      const newData = groupMembersList.map((item) => {
        if (id === item?.user_id) {
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
      setGroupMembersList(newData);
    }
  };
  const removeMember = (memberId, groupId) => {
    let data = {
      user_id: memberId,
      group_id: groupId,
    };
    console.log("data passed to removed ::: ", data);
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.removemember, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("result of remove member ", result);
        if (result[0]?.error == false || result[0]?.error == "false") {
          const newData = groupMembersList.filter(
            (item) => item?.user_id !== memberId
          );
          console.log("new Data ::: ", newData);
          setGroupMembersList(newData);
          Snackbar.show({
            text: "Member removed from group successfully",
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
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };
  const handleRemoveFromGroup = () => {
    let memberList = groupMembersList
      ?.filter((item) => item?.selected == true)
      ?.map((element) => element?.user_id);

    if (memberList?.length > 0) {
      setLoading(true);

      for (const element of memberList) {
        removeMember(element, groupId);
      }

      //also remove members from firebase group members list
      removeGroupMembers(groupId, memberList);

      setLoading(false);
      // const newData = groupMembersList.filter((item) => item?.selected === false);
      // setGroupMembersList(newData);
      bottomSheetRef?.current?.close();
    } else {
      Snackbar.show({
        text: "Please Select Members to remove.",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const handleAddMemberToGroup = () => {
    // const newData = allMembersList.filter((item) => item.selected === true);
    // setGroupMembersList(groupMembersList.concat(newData));
    // const newData1 = allMembersList.filter((item) => item.selected === false);
    // setAllMembersList(newData1);
    // bottomSheetAddMemberRef?.current?.close();
    let memberList = addMembersList
      ?.filter((item) => item?.selected == true)
      ?.map((element) => element?.user_id);

    if (memberList?.length == 0) {
      Snackbar.show({
        text: "Please Select memeberes to add in group.",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (groupId != "" && adminId != "") {
      console.log("memberList::::: ", memberList);

      setLoading(true);
      bottomSheetAddMemberRef?.current?.close();

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
          if (result[0]?.error == false || result[0]?.error == "false") {
            Snackbar.show({
              text: "Successfully Added All Members in Group",
              duration: Snackbar.LENGTH_SHORT,
            });

            addMemberToGroup(groupId, memberList); //also adding member to firebase for group chat

            //TODO: getting selected memberes to add in group
            const newData = addMembersList.filter(
              (item) => item?.selected === true
            );
            let newData11 = newData?.map((item) => {
              return {
                ...item,
                selected: false,
              };
            });
            if (newData11) {
              setGroupMembersList(groupMembersList.concat(newData11));
            } else {
              setGroupMembersList(groupMembersList.concat(newData));
            }
            //TODO: also remove selected memebers from addedmembers list
            const newData1 = addMembersList.filter(
              (item) => item.selected !== true
            );
            setAddMembersList(newData1);
          } else {
            Snackbar.show({
              text: result[0]?.message,
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
    }
  };
  const handleExitGroup = async () => {
    if (groupId != "") {
      setLoading(true);
      let user_id = await AsyncStorage.getItem("user_id");
      let data = {
        user_id: user_id,
        group_id: groupId,
      };
      console.log("data passed to removed ::: ", data);
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.removemember, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result of remove member ", result);
          if (result[0]?.error == false || result[0]?.error == "false") {
            navigation.goBack();
            existGroup(groupId); //handle exist group in firebase
            Snackbar.show({
              text: "Member removed from group successfully",
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
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    } else {
      Snackbar.show({
        text: "Group id not found.",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  //handle delete group
  const handleDeleteGroup = async () => {
    if (groupId) {
      let user_id = await AsyncStorage.getItem("user_id");
      let data = {
        group_id: groupId,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.deletegroups, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("delete group response ::::  ", result);
          if (result[0]?.error == false || result[0]?.error == "false") {
            navigation.goBack();
            handleDeleteGroupByAdmin(groupId); //also mark this group group as deleted in firebase
            Snackbar.show({
              text: "Group Deleted successfully",
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
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        });
    } else {
      Snackbar.show({
        text: "Group Id not found.",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  //edit group
  const handleEditPress = (groupId) => {
    navigation?.navigate("EditGroup", { id: groupId });
  };

  // ------------------------------------------------handle group chat -----------------------------------------------------
  const handleGroupChatPress = () => {
    if (groupId) {
      onAddGroup(groupId);
    } else {
      Snackbar.show({
        text: "Something went wrong.Group id Not found",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  // -------------------------------
  // adding data to firebase for chatting
  const createGroup = async (id, name, admin) => {
    return new Promise((resolve, reject) => {
      try {
        const database = getDatabase();
        //first check if the user registered before

        //create chat room
        const newChatroomRef = push(ref(database, "group_chatroom"), {
          messages: [],
          id: id,
        });
        const newChatroomId = newChatroomRef?.key;

        const newGroupObj = {
          id: id ? id : "",
          name: name ? name : "",
          chatroomId: newChatroomId ? newChatroomId : "",
          isPinned: false,
          type: "group",
          admin: admin,
        };
        set(ref(database, `groups/${id}`), newGroupObj);
        resolve(true);
      } catch (error) {
        console.log("error while creating new user", error);
        resolve(false);
      }
    });
  };
  const onAddGroup = async (selected_group_id) => {
    if (!adminId) {
      Snackbar.show({
        text: "Group Details not found.",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      try {
        // navigation?.navigate("GroupConversations");
        setLoading(true);
        let user_id = await AsyncStorage.getItem("user_id");
        let logged_in_user_detail = await AsyncStorage.getItem("user");
        logged_in_user_detail =
          logged_in_user_detail == null
            ? null
            : JSON.parse(logged_in_user_detail);
        // setLoading(true);
        const database = getDatabase();

        let group = await findGroup(selected_group_id);
        if (group == null) {
          let result = await createGroup(
            selected_group_id,
            group_name,
            adminId
          );
          group = await findGroup(selected_group_id);
        }

        //add group member to group if it does not exist
        if (group) {
          //check member is added in this group or not
          let filter = group?.members?.filter(
            (element) => element?.id == user_id
          );

          if (filter?.length > 0) {
            console.log("this user already in this group");
            dispatch(setGroupForChat(group));
            dispatch(setLoginUserDetail(logged_in_user_detail));
            navigation?.navigate("GroupConversations");
            setLoading(false);
          } else {
            //add this member to group
            const groupMembers = group?.members || [];
            let clicked_user_Obj = {
              // id: user?.id,
              // name: user?.name,
              // email: user?.email,
              members: [
                ...groupMembers,
                {
                  id: user_id,
                  name: logged_in_user_detail?.first_name,
                  // chatroomId: newChatroomId,
                  isPinned: false,
                  created_at: new Date(),
                  deleted_at: new Date(),
                  remove_by_admin: false,
                  leave_group: false,
                  unread_count: 0,
                  // created_at: moment(new Date()).add(1, "M"),
                },
              ],
            };
            update(ref(database, `groups/${group?.id}`), clicked_user_Obj);
            dispatch(setGroupForChat(group));
            dispatch(setLoginUserDetail(logged_in_user_detail));
            navigation?.navigate("GroupConversations");
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(
          'moment(new Date()).add(1, "M") :::  ',
          moment(new Date()).add(1, "M")
        );
        console.log("error  :::  ", error);
        setLoading(false);
      }
    }
  };
  const findGroup = async (id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `groups/${id}`));
    return mySnapshot.val();
  };

  const findUser = async (id) => {
    console.log("find user name...", id);
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `users/${id}`));
    return mySnapshot.val();
  };

  const removeGroupMembers = async (groupId, membersList = []) => {
    try {
      let group = await findGroup(groupId);
      if (group) {
        let list = group?.members ? group?.members : [];
        // let filter = list.filter(
        //   (member) => !membersList.find((m) => m == member.id)
        // );

        if (membersList?.length > 0) {
          let newData = [];
          for (const item of membersList) {
            newData = list.map((element) => {
              if (element?.id == item) {
                return {
                  ...element,
                  // deleted_at: new Date(),
                  remove_at: new Date(),
                  remove_by_admin: true,
                };
              } else {
                return {
                  ...element,
                };
              }
            });
          }
          const database = getDatabase();
          let membersObj = {
            members: newData,
          };
          update(ref(database, `groups/${groupId}`), membersObj);
        }
      } else {
        console.log("group not stored in firebase database");
      }
    } catch (error) {
      console.log("error :: ", error);
    }
  };

  const addMemberToGroup = async (group_id, membersList) => {
    let group = await findGroup(group_id);
    if (group) {
      let list = group?.members ? group?.members : [];
      if (membersList?.length > 0) {
        let newData = [];
        for (const item of membersList) {
          const filter = list?.filter((element) => element?.id == item);
          if (filter?.length > 0) {
            //already exist --> so update it
            list = list.map((element) => {
              if (element?.id == item) {
                return {
                  ...element,
                  created_at: new Date(),
                  deleted_at: new Date(),
                  // remove_at: new Date(),
                  remove_by_admin: false,
                  leave_group: false,
                };
              } else {
                return {
                  ...element,
                };
              }
            });
          } else {
            let user_info = await getUser_Info(item);
            //create new user
            let obj = {
              id: item,
              name: user_info?.first_name ? user_info?.first_name : "", //TODO: change with name letter on...
              isPinned: false,
              created_at: new Date(),
              deleted_at: new Date(),
              unread_count: 0,
            };
            list.push(obj);
          }
        }
        const database = getDatabase();
        let membersObj = {
          members: list,
        };
        update(ref(database, `groups/${groupId}`), membersObj);
      }

      // let filter = group?.members?.filter((element) => element?.id == user_id);
      // if (filter?.length > 0) {
      //   //user already added in this group
      // } else {
      //   const groupMembers = group?.members || [];
      //   let membersObj = {
      //     members: [
      //       ...groupMembers,
      //       {
      //         id: user_id,
      //         name: user_name,
      //         isPinned: false,
      //         created_at: new Date(),
      //         deleted_at: new Date(),
      //         unread_count: 0,
      //       },
      //     ],
      //   };
      //   update(ref(database, `groups/${group_id}`), membersObj);
      // }
    }
  };

  const existGroup = async (groupId) => {
    let user_id = await AsyncStorage.getItem("user_id");
    let group = await findGroup(groupId);
    if (group) {
      let membersList = group?.members ? group?.members : [];
      membersList = membersList?.map((element) => {
        if (element?.id == user_id) {
          return {
            ...element,
            leave_at: new Date(),
            leave_group: true,
          };
        } else {
          return { ...element };
        }
      });
      let newObj = {
        members: membersList,
      };
      const database = getDatabase();
      update(ref(database, `groups/${groupId}`), newObj);
    }
  };

  // change status of group that admin deleted this group
  const handleDeleteGroupByAdmin = async (groupId) => {
    let group = await findGroup(groupId);
    if (group) {
      console.log(group?.admin);
      let obj = {
        ...group,
        deleted_by_admin: true,
      };
      const database = getDatabase();
      update(ref(database, `groups/${groupId}`), obj);
    }
  };

  // ------------------------------------------------handle group chat -----------------------------------------------------

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);

    getGroupDetail(route?.params?.item?.id);

    //getting list of members that is added in this group
    getGroupMembers(route?.params?.item?.id);

    getActiveChallenges(route?.params?.item?.id);

    getAddMembersList(route?.params?.item?.id);
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
          {/* <Header title={"Carnage Coverage"} navigation={navigation} /> */}
          <Header
            title={group_name}
            titleStyle={{ flex: 0.9 }}
            numberOfLines={1}
            navigation={navigation}
          />

          {logged_in_user_id == adminId ? (
            <TouchableOpacity
              onPress={() => handleEditPress(groupId)}
              style={{
                position: "absolute",
                right: 20,
                top: 15,
                padding: 10,
              }}
            >
              <Icon name="edit" color={"#38ACFF"} size={25} />
            </TouchableOpacity>
          ) : (
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
          )}
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
            {profile != "" ? (
              <Image
                source={{ uri: profile }}
                style={{
                  marginVertical: 12,
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
                  marginVertical: 12,
                  height: 123,
                  width: 123,
                }}
              />
            )}
            <View style={{}}>
              <Text
                style={{
                  color: "#000000",
                  fontSize: 17,
                  fontFamily: "Rubik-Regular",
                }}
              >
                {/* Cyanide */}
                {group_name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleGroupChatPress()}
              style={{
                padding: 10,
                height: 50,
                width: 50,
                marginBottom: -10,
                marginTop: -40,
                alignSelf: "flex-end",
              }}
            >
              <Image
                source={require("../../../assets/images/chat1.png")}
                style={{
                  height: 32,
                  width: 32,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                width: "90%",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              {logged_in_user_id == adminId && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => bottomSheetAddMemberRef?.current?.open()}
                >
                  <Text style={{ color: "#FFF", fontSize: 16 }}>
                    Add Members
                  </Text>
                </TouchableOpacity>
              )}

              {route?.params?.type == "joined" ? (
                <TouchableOpacity
                  onPress={() => handleExitGroup()}
                  style={{
                    ...styles.btn,
                    backgroundColor: "transparent",
                    borderColor: "#38ACFF",
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: "#38ACFF", fontSize: 14 }}>
                    Exit Group
                  </Text>
                </TouchableOpacity>
              ) : (
                logged_in_user_id == adminId && (
                  <TouchableOpacity
                    onPress={() => handleDeleteGroup()}
                    style={{
                      ...styles.btn,
                      backgroundColor: "transparent",
                      borderColor: "#38ACFF",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ color: "#38ACFF", fontSize: 14 }}>
                      Delete Group
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
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

                    <Text style={styles.cardText}>
                      {item?.item?.challenge_info?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
        <View style={{}}>
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
              Group Members ({groupMembersList.length})
            </Text>
            {loading ? null : (
              <>
                {logged_in_user_id == adminId && (
                  <TouchableOpacity
                    onPress={() => bottomSheetRef?.current?.open()}
                  >
                    <Text
                      style={{
                        color: "#6f92c9",
                        fontSize: 16,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Remove Member
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
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
                data={groupMembersList}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) => {
                  return (
                    <TouchableOpacity
                      // onPress={() => navigation.navigate("GroupDetail")}
                      onPress={() => {
                        // console.log("item  ::: ", item?.item?.user_id);
                        navigation.navigate("FriendProfile", {
                          user: {
                            id: item?.item?.user_id,
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
          )}
        </View>
        {/* ------------------------------------------Remove Member Bottom Sheet---------------------------------------------- */}
        <RBSheet
          ref={bottomSheetRef}
          //   height={500}
          openDuration={250}
          closeOnDragDown={true}
          closeOnPressMask={false}
          animationType={"slide"}
          customStyles={{
            container: {
              padding: 5,
              height: 460,
              backgroundColor: "#ffffff",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
            draggableIcon: {
              backgroundColor: "#003e6b",
            },
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                color: "#003e6b",
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Rubik-Regular",
                marginTop: 5,
              }}
            >
              Remove Member
            </Text>
            <View
              style={{
                marginVertical: 15,
                paddingHorizontal: 20,
                flex: 1,
                // backgroundColor: 'red',
                width: "100%",
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
                      onPress={() =>
                        handleRemoveMemberSelect(item?.item?.user_id)
                      }
                      style={{
                        ...styles.bootSheetCardView,
                        width: "28.9%",
                        marginVertical: 5,
                        marginHorizontal: 7,
                        borderWidth: item.item.selected ? 1 : 0,
                        borderColor: item.item.selected
                          ? "#38ACFF"
                          : "transparent",
                      }}
                    >
                      {item?.item?.profile != "" ? (
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
                      <Text
                        style={{
                          color: "#040103",
                          fontFamily: "Rubik-Regular",
                        }}
                      >
                        {item?.item?.first_name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveFromGroup()}
              style={{
                backgroundColor: "#38ACFF",
                marginBottom: 10,
                height: 50,
                width: "92%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                fontFamily: "Rubik-Regular",
              }}
            >
              <Text style={{ color: "#FFF", fontSize: 16 }}>
                Remove from group
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/* ------------------------------------------Add Member Bottom Sheet-------------------------------------------- */}
        <RBSheet
          ref={bottomSheetAddMemberRef}
          openDuration={250}
          closeOnDragDown={true}
          closeOnPressMask={false}
          dragFromTopOnly
          animationType={"slide"}
          customStyles={{
            container: {
              padding: 5,
              height: 460,
              backgroundColor: "#ffffff",
              borderRadius: 30,
            },
            draggableIcon: {
              backgroundColor: "#003e6b",
            },
          }}
        >
          <View
            style={{
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "#003e6b",
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Rubik-Regular",
                marginTop: 5,
              }}
            >
              Add Members
            </Text>
            <View
              style={{
                marginVertical: 15,
                paddingHorizontal: 20,
                flex: 1,
                width: "100%",
              }}
            >
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={addMembersList}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        height: 300,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "#000" }}>
                        No Record Found
                      </Text>
                    </View>
                  );
                }}
                renderItem={(item) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleAddMemberSelect(item.item.user_id)}
                      style={{
                        ...styles.bootSheetCardView,
                        width: "28.9%",
                        marginVertical: 5,
                        marginHorizontal: 7,
                        borderWidth: item.item.selected ? 1 : 0,
                        borderColor: item.item.selected
                          ? "#38ACFF"
                          : "transparent",
                      }}
                    >
                      {item?.item?.profile ? (
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

                      <Text
                        numberOfLines={2}
                        style={{
                          color: "#040103",
                          fontFamily: "Rubik-Regular",
                        }}
                      >
                        {item?.item?.first_name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleAddMemberToGroup()}
              style={{
                backgroundColor: "#38ACFF",
                marginBottom: 10,
                height: 50,
                width: "92%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 16,
                  fontFamily: "Rubik-Regular",
                }}
              >
                Add to group
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
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

export default GroupDetail;

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
    flex: 1,
    backgroundColor: "#38ACFF",
    marginHorizontal: 10,
    height: 35,
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
