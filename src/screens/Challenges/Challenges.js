import React, { useState, useEffect, useRef } from "react";
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
  ScrollView,
  Animated,
  RefreshControl,
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";

import { captureScreen } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";
import firebaseNotificationApi from "../../constants/firebaseNotificationApi";
import { STYLE } from "../STYLE";
import { responsiveHeight } from "react-native-responsive-dimensions";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const Challenges = ({
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
  setActiveTab,
}) => {
  const navigation = useNavigation();
  const RBSheet_GroupRef = useRef();

  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([
    // {
    //   id: 0,
    //   group_name: "Summerbody Challenge",
    // },
    // {
    //   id: 1,
    //   group_name: "25km",
    // },
    // {
    //   id: 2,
    //   group_name: "Cyanide",
    // },
    // {
    //   id: 3,
    //   group_name: "Summerbody Challenge",
    // },
    // {
    //   id: 4,
    //   group_name: "25km",
    // },
    // {
    //   id: 5,
    //   group_name: "Cyanide",
    // },
    // {
    //   id: 6,
    //   group_name: "Summerbody Challenge",
    // },
    // {
    //   id: 7,
    //   group_name: "25km",
    // },
    // {
    //   id: 8,
    //   group_name: "Cyanide",
    // },
    // {
    //   id: 9,
    //   group_name: "Summerbody Challenge",
    // },
    // {
    //   id: 10,
    //   group_name: "25km",
    // },
    // {
    //   id: 11,
    //   group_name: "Cyanide",
    // },
    // {
    //   id: 12,
    //   group_name: "Summerbody Challenge",
    // },
  ]);
  const [isSuggestedVisible, setIsSuggestedVisible] = useState(true);
  const [suggestedChallenges, setSuggestedChallenges] = useState([
    // {
    //   id: 0,
    //   group_name: 'Summerbody Challenge',
    //   status: false,
    // },
    // {
    //   id: 1,
    //   group_name: '25km',
    //   status: false,
    // },
    // {
    //   id: 2,
    //   group_name: 'Cyanide',
    //   status: false,
    // },
    // {
    //   id: 3,
    //   group_name: 'Challenge Name',
    //   status: false,
    // },
    // {
    //   id: 4,
    //   group_name: 'Challenge Name',
    //   status: false,
    // },
  ]);
  const [challengesList, setChallengesList] = useState([
    // {
    //   id: 0,
    //   name: "Carnage Coverage",
    // },
    // {
    //   id: 1,
    //   name: "Carnage Coverage",
    // },
    // {
    //   id: 2,
    //   name: "Carnage Coverage",
    // },
    // {
    //   id: 3,
    //   name: "Carnage Coverage",
    // },
    // {
    //   id: 4,
    //   name: "Carnage Coverage",
    // },
    // {
    //   id: 5,
    //   name: "Carnage Coverage",
    // },
    // {
    //   id: 6,
    //   name: "Carnage Coverage",
    // },
  ]);

  const [joinedChallenge, setJoinedChallenge] = useState([]);

  //groups list
  const [groupsList, setGroupsList] = useState([]);
  const [joinedGroupsList, setJoinedGroupsList] = useState([]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSuggestedChallengesList();
      getLogged_in_user_Challenges();
      getUserJoinedChallenges();
      //get groups list of logged in user
      getLogged_in_user_groups();
    }, [])
  );

  const getLogged_in_user_groups = async () => {
    let user_id = await AsyncStorage.getItem("user_id");

    setGroupsList([]);
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
      .then(async (result) => {
        let joinedGroupsList = await getJoinedGroups();
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
          list1 = list1.concat(joinedGroupsList);
          // list1 = [...list1, ...joinedGroupsList];
          //remove duplicate record
          let uniqueList = [];

          for (const element of list1) {
            const found = uniqueList.some((el) => el.id === element?.id);
            if (!found) {
              uniqueList.push(element);
            }
          }
          // setGroupsList(list1);
          setGroupsList(uniqueList);
        } else {
          // setGroupsList([]);
          setGroupsList(joinedGroupsList);
          Snackbar.show({
            // text: result?.Message,
            text: "No Challenge Found",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
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

  //getting logged in user joinned challenges
  //getting login user joined groups list
  const getJoinedGroups = async () => {
    return new Promise(async (resolve) => {
      try {
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
            console.log(
              "groups list :::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",
              result
            );
            if (result?.error == false || result?.error == "false") {
              let list = result?.Group ? result?.Group : [];
              let joinedGroup_List = [];
              let listOfGroups = [];
              if (list?.length > 0) {
                let filter = list?.filter(
                  (item) =>
                    item?.status == "membered" || item?.status == "approved"
                );

                for (const element of filter) {
                  let groupInfo = await getGroup_Info(element?.group_id);
                  const found = listOfGroups.some(
                    (el) => el.id === groupInfo?.id
                  );
                  // if (!found) {
                  if (groupInfo != false) {
                    let obj = {
                      // id: element?.id,
                      // group_id: element?.group_id,
                      // user_id: element?.user_id,
                      // status: element?.status,
                      // created_at: element?.created_at,
                      // group_info: {
                      id: groupInfo?.id,
                      image: groupInfo?.image_link
                        ? BASE_URL_Image + "/" + groupInfo?.image_link
                        : "",
                      name: groupInfo?.name,
                      // adminId: groupInfo?.["Admin id"],
                      created_by_user_id: groupInfo?.["Admin id"],
                      group_privacy: groupInfo?.group_privacy,
                      group_visibility: groupInfo?.group_visibility,
                      created_at: groupInfo?.created_at,
                      type: "joined",
                      // },
                    };
                    listOfGroups.push(obj);
                  }
                  // }
                }
              }
              resolve(listOfGroups);
            } else {
              resolve([]);
            }
          })
          .catch((error) => {
            resolve([]);
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

  const getLogged_in_user_Challenges = async () => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      created_by_user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.get_admin_challenges, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.error == false || result?.error == "false") {
          // console.log("add member list response  ::: ", result);
          let list = result?.Challenges ? result?.Challenges : [];
          let list1 = [];
          for (const element of list) {
            let obj = {
              id: element?.id,
              created_by_user_id: element?.created_by_user_id,
              image: element?.image
                ? BASE_URL_Image + "/" + element?.image
                : "",
              name: element?.name,
              challenge_type: element?.challenge_type,
              challenge_visibility: element?.challenge_visibility,
              challenge_privacy: element?.challenge_privacy,
              start_date: element?.start_date,
              end_date: element?.end_date,
              challenge_metric_no: element?.challenge_metric_no,
              challenge_metric_step_type: element?.challenge_metric_step_type,
            };
            list1.push(obj);
          }
          setChallengesList(list1);
          // let responseList = [];
          // for (const element of list) {
          //   let obj = {
          //     id: element?.id,
          //     created_by_user_id: element?.created_by_user_id,
          //     image: element?.image,
          //     name: element?.name,
          //     challenge_type: element?.challenge_type,
          //     challenge_visibility: element?.challenge_visibility,
          //     challenge_privacy: element?.challenge_privacy,
          //     start_date: element?.start_date,
          //     end_date: element?.end_date,
          //     challenge_metric_no: element?.challenge_metric_no,
          //     challenge_metric_step_type: element?.challenge_metric_step_type,
          //     status: false,
          //   };
          //   responseList.push(obj);
          // }
          // console.log("response list", responseList);
        } else {
          setChallengesList([]);
          console.log("no challeg found for logged in use");
          // Snackbar.show({
          //   text: result?.message ? result?.message : result?.Message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        setChallengesList([]);
        Snackbar.show({
          text: "Something went wrong.Unable to get challenge list",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  //getting requested challenges
  const getRequestedChallengesList = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        console.log("user id to get requested challenges", user_id);
        var requestOptions = {
          method: "POST",
          body: JSON.stringify({
            user_id: user_id,
          }),
          redirect: "follow",
        };
        fetch(api.get_requested_challenges, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            if (result[0]?.error == "true" || result[0]?.error == true) {
              resolve([]);
            } else {
              let responseList = result ? result : [];
              let list = [];
              for (const element of responseList) {
                // let challangeInfo = await getChallengeDetail(
                //   element["Challlenge id"]
                // );
                let challangeInfo = await getChallengeDetail(
                  element?.challenge_id
                );
                if (challangeInfo) {
                  let obj = {
                    id: challangeInfo?.id,
                    name: challangeInfo?.name,
                    privacy: challangeInfo?.challenge_privacy,
                    visibility: challangeInfo?.challenge_visibility,
                    challenge_type: challangeInfo?.challenge_type,
                    admin: challangeInfo?.created_by_user_id,
                    start_date: challangeInfo?.start_date,
                    // status: element?.status,
                    image: challangeInfo?.image
                      ? BASE_URL_Image + "/" + challangeInfo?.image
                      : "",
                    status: true,
                  };
                  list.push(obj);
                }
              }
              resolve(list);
            }
          })
          .catch((error) => {
            console.log("error in getting requested challenges :: ", error);
            resolve([]);
          });
      } catch (error) {
        console.log("error in getting requested challenges :: ", error);
        resolve([]);
      }
    });
  };

  const getSuggestedChallengesList1 = async () => {
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

        fetch(api.getSuggestedChallenges, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            let responseList = [];
            if (result?.length > 0) {
              for (const element of result) {
                let img = await get_Challenge_Image(element["challenge ID"]);
                let challenge_status = await getChallengeStatus(
                  user_id,
                  element["challenge ID"]
                );
                if (
                  challenge_status == "membered" ||
                  challenge_status == "requested"
                ) {
                  //do nothing no need to stored joined or requested challenege
                } else if (user_id != element?.admin) {
                  let obj = {
                    id: element["challenge ID"],
                    name: element["challenge Name"],
                    privacy: element["challenge privacy"],
                    visibility: element["challenge visibility"],
                    challenge_type: element["challenge type"],
                    admin: element?.admin,
                    start_date: element?.start_date,
                    // status: element?.status,
                    image: img ? BASE_URL_Image + "/" + img : "",
                    status: false,
                  };
                  responseList.push(obj);
                }
              }
            }

            // setSuggestedChallenges(responseList);
            resolve(responseList);
          })
          .catch((error) => {
            resolve([]);
          });
      } catch (error) {
        console.log("error :", error);
        resolve([]);
      }
    });
  };

  const getSuggestedChallengesList = async () => {
    let requestedChallenges = await getRequestedChallengesList();
    let suggestedChallenges = await getSuggestedChallengesList1();
    //remove those challenges that are already requestedChallenges
    let myArray = suggestedChallenges.filter(
      (ar) => !requestedChallenges.find((rm) => rm.id === ar.id)
    );

    // let challengesList = requestedChallenges.concat(suggestedChallenges);
    let challengesList = requestedChallenges.concat(myArray);
    setSuggestedChallenges(challengesList);
    setLoading(false);
    setIsRefreshing(false);

    // try {
    //   let user_id = await AsyncStorage.getItem("user_id");
    //   setLoading(true);
    //   // setSuggestedFriends([]);
    //   console.log("url ::: ", api.getSuggestedChallenges);
    //   let data = {
    //     this_user_id: user_id,
    //   };
    //   var requestOptions = {
    //     method: "POST",
    //     body: JSON.stringify(data),
    //     redirect: "follow",
    //   };

    //   fetch(api.getSuggestedChallenges, requestOptions)
    //     .then((response) => response.json())
    //     .then(async (result) => {
    //       let responseList = [];
    //       if (result?.length > 0) {
    //         for (const element of result) {
    //           let img = await get_Challenge_Image(element["challenge ID"]);
    //           let obj = {
    //             id: element["challenge ID"],
    //             name: element["challenge Name"],
    //             privacy: element["challenge privacy"],
    //             visibility: element["challenge visibility"],
    //             challenge_type: element["challenge type"],
    //             admin: element?.admin,
    //             start_date: element?.start_date,
    //             // status: element?.status,
    //             image: img ? BASE_URL_Image + "/" + img : "",
    //             status: false,
    //           };
    //           responseList.push(obj);
    //         }
    //       }

    //       setSuggestedChallenges(responseList);
    //     })
    //     .catch((error) => console.log("error", error))
    //     .finally(() => setLoading(false));
    // } catch (error) {
    //   console.log("error :", error);
    //   setLoading(false);
    // }
  };
  //getting joined challenges list
  const getUserJoinedChallenges = async () => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");

      // setSuggestedFriends([]);

      let data = {
        user_id: user_id,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.get_specific_user_joined_challenges, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result?.error == false || result?.error == "false") {
            let responstList = result?.challenges ? result?.challenges : [];
            let filter = responstList?.filter(
              (item) =>
                item?.status != "requested" && item?.status != "rejected"
            );
            let list = [];
            for (const element of filter) {
              //not store user own created challenges in joined challenges list
              // if (element?.user_id !== user_id) {
              let challengeInfo = await getChallengeDetail(
                element?.challenge_id
              );
              //only store unique challenges
              const found = list.some(
                (el) => el?.challengeInfo?.id === challengeInfo?.id
              );
              if (!found) {
                if (challengeInfo != false) {
                  if (challengeInfo?.created_by_user_id == user_id) {
                    //not added his own created challenges in joined challenges list
                  } else {
                    let obj = {
                      id: element?.id,
                      challenge_id: element?.challenge_id,
                      user_id: element?.user_id,
                      status: element?.status,
                      challengeInfo: {
                        id: challengeInfo?.id,
                        created_by_user_id: challengeInfo?.created_by_user_id,
                        image: challengeInfo?.image
                          ? BASE_URL_Image + "/" + challengeInfo?.image
                          : "",
                        name: challengeInfo?.name,
                        challenge_type: challengeInfo?.challenge_type,
                        challenge_visibility:
                          challengeInfo?.challenge_visibility,
                        challenge_privacy: challengeInfo?.challenge_privacy,
                        start_date: challengeInfo?.start_date,
                        end_date: challengeInfo?.end_date,
                        challenge_metric_no: challengeInfo?.challenge_metric_no,
                        challenge_metric_step_type:
                          challengeInfo?.challenge_metric_step_type,
                      },
                    };
                    list.push(obj);
                  }
                }
                // }
              }
            }
            setJoinedChallenge(list);
          } else {
            setJoinedChallenge([]);
            Snackbar.show({
              text: "You have not joined any challange yet.",
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.Unable to get joined challenges",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } catch (error) {
      console.log("error :", error);
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  const getChallengeDetail = (id) => {
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
  const get_Challenge_Image = (id) => {
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
          let image = result?.Challenge[0]?.image
            ? result?.Challenge[0]?.image
            : "";
          resolve(image);
        })
        .catch((error) => {
          resolve("");
        });
    });
  };
  const handleonJoin = (id, adminId, item, item1) => {
    const newData = suggestedChallenges.map((item) => {
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
    setSuggestedChallenges(newData);
  };
  const updateSearchListStatus = (id) => {
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
  };
  const handleJoin_InSearchList = (id) => {
    console.log("id pass to participate :: ", id);
    const newData = searchResults.map((item) => {
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
    setSearchResults(newData);
  };

  const updateSuggestedChallengStatus = (id) => {
    const newData = suggestedChallenges.map((item) => {
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
    setSuggestedChallenges(newData);
  };

  const handleLeaveChallenge = async (id) => {
    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      user_id: user_id,
      challenge_id: id,
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.leave_challenges, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (
          result?.error == false ||
          result[0]?.error == false ||
          result[0]?.error == "false"
        ) {
          updateSuggestedChallengStatus(id);
          Snackbar.show({
            text: "Challenge Leaved successfully!",
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => console.log("error occur in leave challenge ", error))
      .finally(() => setLoading(false));
  };

  const handleJoinChallenge = async (id, type, admin, item) => {
    setSelectedChallenge(item?.name);
    setSelectedChallengeId(item?.id);
    setSelectedType(type);
    if (item?.challenge_type == "group") {
      // alert("handleGroup join");
      RBSheet_GroupRef?.current?.open();
    } else {
      let user_id = await AsyncStorage.getItem("user_id");
      setLoading(true);
      let data = {
        challenge_id: id,
        user_id: user_id,
        date: new Date(),
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.join_individual_challenge, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (
            result?.error == false ||
            result[0]?.error == false ||
            result[0]?.error == "false"
          ) {
            if (type == "search") {
              updateSearchListStatus(id);
            } else {
              updateSuggestedChallengStatus(id);
            }
            //sending push notification to admin of this challenge
            sendPushNotification(admin, item?.name);
            Snackbar.show({
              text: "Challenge Joined successfully!",
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            Snackbar.show({
              text: result?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        })
        .catch((error) => console.log("error", error))
        .finally(() => setLoading(false));
    }
  };
  const handleOpenDrawer = (navigation) => {
    captureScreen({
      format: "jpg",
    })
      .then((uri) => {
        AsyncStorage.setItem("Screen", uri.toString());
        AsyncStorage.setItem("ScreenName", "Challenges");
        navigation.openDrawer();
      })
      .catch((error) => console.log(error));
  };

  //sending push notification to admin of challenge --> when new user join challenge
  const sendPushNotification = async (id, challange_name) => {
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
    console.log("user find____", user);

    if (user) {
      let token = user?.fcmToken;
      let title = challange_name
        ? challange_name + " Challenge"
        : "Challenge Request";
      let description = `${name} wants to join your challenge...`;
      let data = {
        id: id,
        // user_id: id,
        // to_id: user?.ui
        type: "challenge_request",
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      handleSearch(searchText);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const getChallengeStatus = async (user_id, challenge_id) => {
    return new Promise((resolve, reject) => {
      try {
        let data = {
          user_id: user_id,
          challenge_id: challenge_id,
        };
        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };
        fetch(api.get_challenge_status, requestOptions)
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

  const handleSearch = (searchText) => {
    if (searchText) {
      let data = {
        name: searchText,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.search_challenges, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result[0]?.error == false || result[0]?.error == "false") {
            let responseList = result[0]?.Challenges
              ? result[0]?.Challenges
              : [];
            // setSearchResults(groupsList);
            let list = [];
            if (responseList?.length > 0) {
              let logged_in_user_id = await AsyncStorage.getItem("user_id");

              for (const element of responseList) {
                let challenge_status = await getChallengeStatus(
                  logged_in_user_id,
                  element?.id
                );

                let obj = {
                  id: element?.id,
                  created_by_user_id: element?.created_by_user_id,
                  image: element?.image
                    ? BASE_URL_Image + "/" + element?.image
                    : "",
                  name: element?.name,
                  challenge_type: element?.challenge_type,
                  status: challenge_status,
                  // status:
                  //   logged_in_user_id == element?.created_by_user_id
                  //     ? true
                  //     : false,
                };
                list.push(obj);
              }

              // responseList.forEach((element) => {
              //   let obj = {
              //     id: element?.id,
              //     created_by_user_id: element?.created_by_user_id,
              //     image: element?.image
              //       ? BASE_URL_Image + "/" + element?.image
              //       : "",
              //     name: element?.name,
              //     challenge_type: element?.challenge_type,
              //     status:
              //       logged_in_user_id == element?.created_by_user_id
              //         ? true
              //         : false,
              //   };
              //   list.push(obj);
              // });
            } else {
              // Snackbar.show({
              //   text: "No Record Found",
              //   duration: Snackbar.LENGTH_SHORT,
              // });
            }
            setSearchResults(list);
          } else {
            console.log("else :::", result[0]?.Message);
            setSearchResults([]);
            Snackbar.show({
              text: result[0]?.Message,
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        })
        .catch((error) => console.log("error in searching  group ", error))
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } else {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const EmptyChallengesView = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 400,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../../assets/images/trophy.png")}
          style={{ width: 119, height: 119, resizeMode: "contain" }}
        />

        <Text
          style={{
            width: 206,
            textAlign: "center",
            fontSize: 16,
            color: "#000000",
            marginVertical: 20,
            fontFamily: "Rubik-Regular",
          }}
        >
          Create and compete in Challenges with friend and other groups
        </Text>
        <TouchableOpacity
          style={styles.btnCreateGroup}
          onPress={() => navigation.navigate("CreateChallenges")}
          // onPress={() => RBSheet_GroupRef?.current?.open()}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontFamily: "Rubik-Regular",
            }}
          >
            Create Challenge
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSelectGroup = async (item) => {
    // _______________________________________________________________
    // console.log("handleSelectGroup :::: ", item);
    let admin = item?.created_by_user_id;
    RBSheet_GroupRef?.current?.close();
    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      challenge_id: selectedChallengeId,
      group_id: item?.id, //selected group id
      user_id: user_id,
      date: new Date(),
    };
    console.log("data passs to join challange ::: ", data);
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.send_request_to_group_admin_to_join_challenge, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log("result of joining group challenge    :: ", result);
        if (
          result?.error == false ||
          result[0]?.error == false ||
          result[0]?.error == "false"
        ) {
          if (selectedType == "search") {
            updateSearchListStatus(selectedChallengeId);
          } else {
            updateSuggestedChallengStatus(selectedChallengeId);
          }
          // sendPushNotification(admin, item?.name);
          //user id to send push notification, name1,challenge name2
          if (user_id != admin) {
            sendPushNotification_TO_Group_Admin(admin, "", selectedChallenge);
          } else {
            //send notification to challenge admin
            let challenge_info = await getChallengeDetail(selectedChallengeId);
            if (challenge_info?.created_by_user_id) {
              sendPushNotification_TO_Group_Admin(
                challenge_info?.created_by_user_id,
                "",
                selectedChallenge
              );
            }
          }
          Snackbar.show({
            text: "Request to join challenge successfully sended to admin!",
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => setLoading(false));

    // _______________________________________________________________

    // console.log("handleSelectGroup :::: ", item);
    // let admin = item?.created_by_user_id;
    // console.log("admin  :::: ", admin);
    // console.log("selectedChallengeId  :::: ", selectedChallengeId);

    // RBSheet_GroupRef?.current?.close();
    // let user_id = await AsyncStorage.getItem("user_id");
    // setLoading(true);
    // let data = {
    //   challenge_id: selectedChallengeId,
    //   user_id: user_id,
    // };
    // console.log("data passs to join challange ::: ", data);
    // var requestOptions = {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   redirect: "follow",
    // };
    // fetch(api.join_individual_challenge, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log("result  :: ", result);
    //     if (
    //       result?.error == false ||
    //       result[0]?.error == false ||
    //       result[0]?.error == "false"
    //     ) {
    //       if (selectedType == "search") {
    //         updateSearchListStatus(selectedChallengeId);
    //       } else {
    //         updateSuggestedChallengStatus(selectedChallengeId);
    //       }
    //       // sendPushNotification(admin, item?.name);
    //       //user id to send push notification, name1,challenge name2
    //       sendPushNotification_TO_Group_Admin(admin, "", selectedChallenge);

    //       Snackbar.show({
    //         text: "Challenge Joined successfully!",
    //         duration: Snackbar.LENGTH_SHORT,
    //       });
    //     } else {
    //       Snackbar.show({
    //         text: result?.message,
    //         duration: Snackbar.LENGTH_SHORT,
    //       });
    //     }
    //   })
    //   .catch((error) => console.log("error", error))
    //   .finally(() => setLoading(false));
  };

  const sendPushNotification_TO_Group_Admin = async (id, name1, challenge) => {
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
      let title = "Join Challenge";
      let description = `${name} wants to join  ${challenge} challenge`;
      let data = {
        id: id,
        // user_id: id,
        // to_id: user?.ui
        type: "challenge_request",
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

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    if (searchText?.length) {
      //refreshing  search list
      handleSearch(searchText);
    } else {
      getSuggestedChallengesList();
      getLogged_in_user_Challenges();
      getUserJoinedChallenges();
      //get groups list of logged in user
      getLogged_in_user_groups();
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
          style={{ flex: 1 }}
          contentContainerStyle={{
            //   flex: 1,
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
          <View style={{ height: 40, justifyContent: "center", marginTop: 20 }}>
            {isSearch ? (
              <View style={styles.headerView}>
                <View style={styles.searchView}>
                  <TextInput
                    style={styles.searchTextIntput}
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
                <TouchableOpacity
                  onPress={() => {
                    setIsSearch(!isSearch);
                    setSearchText("");
                    getSuggestedChallengesList();
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
                    setActiveTab("Challenges");
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
                <TouchableOpacity onPress={() => setIsSearch(!isSearch)}>
                  <Image
                    source={require("../../../assets/images/search.png")}
                    style={{ width: 23, height: 23 }}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={styles.title}>Challenges</Text>
          {searchText.length > 0 ? (
            <View style={{ flex: 1 }}>
              {/* ----------------------Search Result List ---------------------------- */}
              {loading ? null : (
                <View
                  style={{
                    marginVertical: 15,
                    paddingBottom: 10,
                    paddingHorizontal: 5,
                  }}
                >
                  <FlatList
                    data={searchResults}
                    numColumns={3}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 300,
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
                          onPress={() =>
                            navigation.navigate("ChallengesDetail", {
                              item: item?.item,
                            })
                          }
                          style={{ ...styles.cardView, width: "28.7%" }}
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
                              source={require("../../../assets/images/Challenge.png")}
                              style={{
                                marginVertical: 8,
                                width: 44,
                                height: 44,
                                borderRadius: 44,
                                backgroundColor: "#ccc",
                              }}
                            />
                          )}
                          <Text style={styles.cardText} numberOfLines={2}>
                            {item?.item?.name}
                          </Text>
                          <View
                            style={{
                              justifyContent: "flex-end",
                              flex: 1,
                            }}
                          >
                            {/* <TouchableOpacity
                              onPress={() =>
                                handleJoin_InSearchList(item?.item?.id)
                              }
                              style={styles.cardButton}
                            >
                              <Text
                                style={{
                                  color: "#ffffff",
                                  fontSize: 11,
                                  fontFamily: "Rubik-Regular",
                                }}
                              >
                                Participate
                              </Text>
                            </TouchableOpacity> */}

                            {item?.item?.status == "membered" ? (
                              <TouchableOpacity
                                // onPress={() => {
                                //   // handleLeaveChallenge(item.item.id)
                                //   console.log(
                                //     "handleJoin_InSearchList",
                                //     item.item.id,
                                //     item?.item?.created_by_user_id
                                //   );
                                // }}
                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: "#d8d8d8",
                                }}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Participant
                                </Text>
                              </TouchableOpacity>
                            ) : item?.item?.status == "requested" ? (
                              <TouchableOpacity
                                style={{
                                  ...styles.cardButton,
                                  backgroundColor: "#d8d8d8",
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
                                  handleJoinChallenge(
                                    item?.item?.id,
                                    "search",
                                    item?.item?.created_by_user_id,
                                    item?.item
                                  );
                                  // handleJoin_InSearchList(item?.item?.id);
                                }}
                                style={styles.cardButton}
                              >
                                <Text
                                  style={{ color: "#ffffff", fontSize: 11 }}
                                >
                                  Participate
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
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
                  Suggested Challenges
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
              {/* ----------------------Suggested Challenges List ---------------------------- */}
              {loading ? (
                <View style={{ paddingVertical: 10 }}></View>
              ) : (
                <View
                  style={{
                    marginVertical: 15,
                    width: SCREEN_WIDTH - 15,
                    // paddingRight: 15,
                    paddingHorizontal: 10,
                  }}
                >
                  {isSuggestedVisible && (
                    <FlatList
                      data={suggestedChallenges}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={(item) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("ChallengesDetail", {
                                item: item?.item,
                              })
                            }
                            style={{
                              ...styles.cardView,
                              width: 101,
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
                                source={require("../../../assets/images/Challenge.png")}
                                style={{
                                  marginVertical: 8,
                                  height: 44,
                                  width: 44,
                                  borderRadius: 44,
                                }}
                              />
                            )}
                            <Text style={styles.cardText} numberOfLines={2}>
                              {item?.item?.name}
                            </Text>
                            <View
                              style={{
                                justifyContent: "flex-end",
                                flex: 1,
                              }}
                            >
                              {item?.item?.status ? (
                                <TouchableOpacity
                                  // onPress={() =>
                                  //   handleLeaveChallenge(item.item.id)
                                  // }
                                  style={{
                                    ...styles.cardButton,
                                    backgroundColor: "#d8d8d8",
                                  }}
                                >
                                  <Text
                                    style={{ color: "#ffffff", fontSize: 11 }}
                                  >
                                    Participant
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    handleJoinChallenge(
                                      item.item.id,
                                      "",
                                      item?.item?.admin,
                                      item?.item
                                    );
                                  }}
                                  style={styles.cardButton}
                                >
                                  <Text
                                    style={{ color: "#ffffff", fontSize: 11 }}
                                  >
                                    Participate
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    Challenges
                  </Text>
                  {challengesList.length > 0 && (
                    <TouchableOpacity
                      style={{
                        ...styles.btnCreateGroup,
                        width: 130,
                        height: 33,
                      }}
                      onPress={() => navigation.navigate("CreateChallenges")}
                      // onPress={() => RBSheet_GroupRef?.current?.open()}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 13,
                          fontFamily: "Rubik-Regular",
                        }}
                      >
                        Create a Challenge
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {loading ? null : (
                  <View>
                    {challengesList.length == 0 ? (
                      <EmptyChallengesView />
                    ) : (
                      <View
                        style={{
                          marginVertical: 15,
                          paddingBottom: 10,
                          paddingHorizontal: 20,
                        }}
                      >
                        <FlatList
                          data={challengesList}
                          numColumns={3}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={(item) => {
                            return (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate("ChallengesDetail", {
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
                                    source={require("../../../assets/images/Challenge.png")}
                                    style={{
                                      marginVertical: 8,
                                      height: 44,
                                      width: 44,
                                    }}
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
              </View>

              {/* -------------------------------------Joinned challenges list _______________________________________________________ */}

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    Joined Challenges
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
                      data={joinedChallenge}
                      numColumns={3}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      ListEmptyComponent={() => {
                        return (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              // padding: 300,
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
                            onPress={() =>
                              navigation.navigate("ChallengesDetail", {
                                item: item?.item?.challengeInfo,
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
                            {item?.item?.challengeInfo?.image ? (
                              <Image
                                source={{
                                  uri: item?.item?.challengeInfo?.image,
                                }}
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
                                source={require("../../../assets/images/Challenge.png")}
                                style={{
                                  marginVertical: 8,
                                  height: 44,
                                  width: 44,
                                }}
                              />
                            )}

                            <Text style={styles.cardText} numberOfLines={2}>
                              {item.item?.challengeInfo?.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                )}
              </View>

              {/* -------------------------------------Joinned challenges list _______________________________________________________ */}
            </View>
          )}

          {/* ------------------------------------------Groups Bottom Sheet--------------------------------------------- */}

          <RBSheet
            ref={RBSheet_GroupRef}
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
              Select Group
            </Text>
            <View
              style={{
                marginVertical: 15,
                paddingHorizontal: 20,
                flex: 1,
              }}
            >
              <FlatList
                data={groupsList}
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
                      onPress={() =>
                        // navigation.navigate("GroupDetail", {
                        //   item: item?.item,
                        // })

                        handleSelectGroup(item?.item)
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

                      <Text style={styles.cardText}>{item.item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </RBSheet>

          {/* ------------------------------------------Groups Bottom Sheet--------------------------------------------- */}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default Challenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // padding: 20,
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    fontFamily: "Rubik-Regular",
  },
  cardButton: {
    backgroundColor: "#38acff",
    // width: 60,
    width: 70,
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
