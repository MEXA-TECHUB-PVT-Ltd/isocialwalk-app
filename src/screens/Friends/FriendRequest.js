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
import DropDownPicker from "react-native-dropdown-picker";

import { LineChart } from "react-native-chart-kit";
import { api } from "../../constants/api";
import Loader from "../../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import ReportModal from "../../Reuseable Components/ReportModal";

const FriendRequest = ({ navigation, route }) => {
  const bottomSheetRef = useRef();

  const scrollViewRef = useRef();

  const [isFriendRequestApproved, setIsFriendRequestApproved] = useState(false);
  // const [profileImage, setProfileImage] = useState(
  //   require("../../../assets/images/friend-profile.png")
  // );
  const [commonGroupsList, setCommonGroupsList] = useState([
    {
      id: 0,
      name: "Carnage Coverage",
      avatar: require("../../../assets/images/friend-profile.png"),
    },
    {
      id: 1,
      name: "GhostRunners",
      avatar: require("../../../assets/images/friend-profile.png"),
    },
  ]);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [performanceTypes, setPerformanceTypes] = useState([
    { label: "This Day", value: "Day" },
    { label: "This Week", value: "Week" },
    { label: "This Month", value: "Month" },
  ]);
  const [selectedType, setSelectedType] = useState(performanceTypes[0]?.value);

  // to store user details
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [dailySteps, setDailySteps] = useState("0");

  //logged in user
  const [myImage, setMyImage] = useState("");

  //chart
  const [labels, setLabels] = useState([]);
  //my history
  const [myTotalSteps, setMyTotalSteps] = useState("0");
  const [myHistory, setMyHistory] = useState([]);
  //friend history
  const [friendTotalSteps, setFriendTotalSteps] = useState("0");
  const [friendHistory, setFriendHistory] = useState([]);

  const [isRequested, setIsRequested] = useState(false);

  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (route?.params) {
      setUserId(route?.params?.id);
      getUserDailyGoal(route?.params?.id);

      let todayDay = moment(new Date()).format("ddd");
      getMyWeeklyRanking(todayDay);
      getFriendWeeklyRanking(route?.params?.id, todayDay);

      getUser_Info(route?.params?.id);

      //getting common groups between logged in user and selected friend
      getCommonGroups(route?.params?.id);

      getLoggedInUserDetail();
    }
  }, [route?.params]);

  //getting logged in user info
  const getLoggedInUserDetail = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    let userInfo = await getUser_Info1(user_id);
    if (userInfo == false) {
      //do nothing
    } else {
      let img = userInfo["profile image"]
        ? BASE_URL_Image + "/" + userInfo["profile image"]
        : "";
      setMyImage(img);
    }
  };

  //getting specific  user info
  const getUser_Info1 = (id) => {
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

  //getting user common groups list
  const getCommonGroups = async (id) => {
    let user_id = await AsyncStorage.getItem("user_id");

    var requestOptions = {
      method: "POST",
      body: JSON.stringify({
        user_id: user_id,
        friend_user_id: id,
      }),
      redirect: "follow",
    };
    fetch(api.get_common_groups, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        let list = [];
        if (result == null) {
          // Snackbar.show({
          //   text: "No common group found",
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        } else {
          result?.forEach((element) => {
            let obj = {
              id: element["Group Id"],
              name: element["Group Name"],
              privacy: element["Group privacy"],
              image: element["Group Image"]
                ? BASE_URL_Image + "/" + element["Group Image"]
                : "",
              admin: element["Created By User Id"],
            };
            list.push(obj);
          });
        }
        setCommonGroupsList(list);
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const hanldeOnPerformaceTypeChange = (value) => {
    if (value == "Month") {
      //getting month history
      getMyMonthlyHistory();
      getFriendMonthlyHistory(userId);
    } else if (value == "Week") {
      //getting week history
      getMyWeeklyRanking();
      getFriendWeeklyRanking(userId);
    } else {
      //getting day history

      let todayDay = moment(new Date()).format("ddd");

      getMyWeeklyRanking(todayDay);
      getFriendWeeklyRanking(userId, todayDay);
    }
  };
  const getUser_Info = (id) => {
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
          if (result[0]?.error == false || result[0]?.error == "false") {
            // resolve(result[0]);
            let fullName = result[0]?.first_name + " " + result[0]?.last_name;
            setFullName(fullName);
            setFirstName(result[0]?.first_name);
            setLastName(result[0]?.last_name);
            let img = result[0]["profile image"]
              ? BASE_URL_Image + "/" + result[0]["profile image"]
              : "";
            setProfileImage(img);
          } else {
            //user not found
            Snackbar.show({
              text: "User Detail not found",
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
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } catch (error) {
      Snackbar.show({
        text: "Something went wrong",
        duration: Snackbar.LENGTH_SHORT,
      });
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  //get user daily goals steps
  const getUserDailyGoal = async (id) => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");
      let data = {
        // this_user_id: user_id,
        this_user_id: id,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.get_user_daily_goal, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result[0]?.error == false || result[0]?.error == "false") {
            let steps = result[0]["Daily Goal Steps"]
              ? result[0]["Daily Goal Steps"]
              : "0";
            setDailySteps(steps);
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong",
            duration: Snackbar.LENGTH_SHORT,
          });
        });
    } catch (error) {
      Snackbar.show({
        text: "Something went wrong",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  //get logged in user weekly ranking
  const getMyWeeklyRanking = async (todayDay) => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_of_week, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        let responseList = result[0]?.History ? result[0]?.History : [];
        let week_days_list = await getWeekDays();
        let dayNameList = [];
        let dayStepsList = [];
        let total_steps = 0;
        week_days_list?.forEach((element) => {
          let filter = responseList?.filter(
            (item) => item?.date == element?.date
          );
          dayNameList.push(element?.name);
          let steps = filter[0]?.steps ? parseInt(filter[0]?.steps) : 0;
          if (!todayDay) {
            total_steps += steps;
          } else {
            if (todayDay == element?.name) {
              total_steps += steps;
            }
          }
          dayStepsList.push(steps);
        });

        setLabels(dayNameList);
        setMyTotalSteps(total_steps);
        setMyHistory(dayStepsList);

        scrollViewRef?.current?.scrollTo({
          y: 0,
          animated: false,
        });

        setLoading(false);
        setIsRefreshing(false);
        // } else {
        //   Snackbar.show({
        //     text: result[0]?.message,
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
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

  //get friend/selected   user weekly ranking
  const getFriendWeeklyRanking = async (friendid, todayDay) => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      user_id: friendid,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_of_week, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        let responseList = result[0]?.History ? result[0]?.History : [];
        let week_days_list = await getWeekDays();
        let dayNameList = [];
        let dayStepsList = [];
        let total_steps = 0;
        week_days_list?.forEach((element) => {
          let filter = responseList?.filter(
            (item) => item?.date == element?.date
          );
          dayNameList.push(element?.name);
          let steps = filter[0]?.steps ? parseInt(filter[0]?.steps) : 0;
          dayStepsList.push(steps);
          if (!todayDay) {
            total_steps += steps;
          } else {
            if (todayDay == element?.name) {
              total_steps += steps;
            }
          }
        });
        setLabels(dayNameList);
        setFriendHistory(dayStepsList);
        setFriendTotalSteps(total_steps);
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

  //get friend/selected   user current month history
  const getFriendMonthlyHistory = async (friendid) => {
    let thisMonthDaysList = await daysInThisMonth();
    let monthStartDate = thisMonthDaysList[0]?.date;
    let monthEndDate = thisMonthDaysList[thisMonthDaysList?.length - 1]?.date;
    setLoading(true);
    let data = {
      user_id: friendid,
      date: monthEndDate,
      sub_date: monthStartDate,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_btw_two_dates, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        let responseList = result[0]?.History ? result[0]?.History : [];
        let list = [];
        // if (responseList?.length > 0) {
        // let list = [];
        let dayNameList = [];
        let dayStepsList = [];
        let total_steps = 0;
        thisMonthDaysList?.forEach((element) => {
          let filter = responseList?.filter(
            (item) => item?.date == element?.date
          );
          dayNameList.push(element?.date);
          let steps = filter[0]?.steps ? parseInt(filter[0]?.steps) : 0;
          dayStepsList.push(steps);
          total_steps += steps;
        });
        setLabels(dayNameList);
        setFriendTotalSteps(total_steps);
        setFriendHistory(dayStepsList);
        // } else {
        //   Snackbar.show({
        //     text: "No Record Found.",
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
        // } else {
        //   Snackbar.show({
        //     text: result[0]?.message,
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  const getMyMonthlyHistory = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    let todayDate = moment(new Date()).format("YYYY-MM-DD");

    let thisMonthDaysList = await daysInThisMonth();
    let monthStartDate = thisMonthDaysList[0]?.date;
    let monthEndDate = thisMonthDaysList[thisMonthDaysList?.length - 1]?.date;
    setLoading(true);
    let data = {
      user_id: user_id,
      date: monthEndDate,
      sub_date: monthStartDate,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_btw_two_dates, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // if (result[0]?.error == false || result[0]?.error == "false") {
        let responseList = result[0]?.History ? result[0]?.History : [];
        // let list = [];
        // if (responseList?.length > 0) {
        let list = [];
        let dayNameList = [];
        let dayStepsList = [];
        let total_steps = 0;
        thisMonthDaysList?.forEach((element) => {
          let filter = responseList?.filter(
            (item) => item?.date == element?.date
          );
          dayNameList.push(element?.date);
          let steps = filter[0]?.steps ? parseInt(filter[0]?.steps) : 0;
          dayStepsList.push(steps);
          total_steps += steps;
        });
        setLabels(dayNameList);
        setMyTotalSteps(total_steps);
        setMyHistory(dayStepsList);
        // } else {
        //   Snackbar.show({
        //     text: "No Record Found.",
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
        // } else {
        //   Snackbar.show({
        //     text: result[0]?.message,
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  //get current week day name and date (MON to SUN)
  const getWeekDays = () => {
    return new Promise((resolve, reject) => {
      let daysList = [];
      Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + idx);
        let obj = {
          name: moment(d).format("ddd"),
          date: moment(d).format("YYYY-MM-DD"),
        };
        daysList.push(obj);
        resolve(daysList);
      });
    });
  };

  //getting current month date and day name
  const daysInThisMonth = () => {
    return new Promise((resolve, reject) => {
      try {
        var now = new Date();
        var daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();
        let monthDaysList = [];
        for (let i = 1; i <= daysInMonth; i++) {
          var d = new Date(now.getFullYear(), now.getMonth(), i);
          let obj = {
            name: moment(d).format("ddd"),
            date: moment(d).format("YYYY-MM-DD"),
          };
          monthDaysList.push(obj);
        }
        resolve(monthDaysList);
      } catch (error) {
        resolve([]);
      }
    });
  };

  // useEffect(() => {
  //   getUser_Info(route?.params?.id);
  // }, [route?.params]);

  // const getUser_Info = (id) => {
  //   try {
  //     setLoading(true);
  //     var requestOptions = {
  //       method: "POST",
  //       body: JSON.stringify({
  //         user_id: id,
  //       }),
  //       redirect: "follow",
  //     };
  //     fetch(api.get_specific_user, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         if (result[0]?.error == false || result[0]?.error == "false") {
  //           let user_info = result[0] ? result[0] : false;
  //           if (user_info) {
  //             setUserId(id);
  //             setFirstName(user_info?.first_name);
  //             setLastName(user_info?.last_name);
  //             setProfile(user_info["profile image"]);
  //           }
  //         } else {
  //           Snackbar.show({
  //             text: result[0]?.message,
  //             duration: Snackbar.LENGTH_SHORT,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         Snackbar.show({
  //           text: "Something went wrong.Unable to get user detail.",
  //           duration: Snackbar.LENGTH_SHORT,
  //         });
  //       })
  //       .finally(() => setLoading(false));
  //   } catch (error) {
  //     setLoading(false);
  //
  //     Snackbar.show({
  //       text: "Something went wrong.Unable to get user detail.",
  //       duration: Snackbar.LENGTH_SHORT,
  //     });
  //   }
  // };
  // handle approve friend request
  const handleApproveFriend = async (friend_id) => {
    if (friend_id && route?.params?.selected_noti_id) {
      let user_id = await AsyncStorage.getItem("user_id");
      setLoading(true);
      let obj = {
        noti_type_id: route?.params?.selected_noti_id,
        this_user_id: friend_id,
        friend_user_id: user_id,
        date: new Date(),
        // this_user_id: user_id,
        // friend_user_id: friend_id,
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
            Snackbar.show({
              text: result[0]?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
            navigation?.goBack();
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
    } else {
      Snackbar.show({
        text: "User not found",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  //handle reject friend request
  const handleUnApprove_FriendRequest = async (friend_id) => {
    if (friend_id && route?.params?.selected_noti_id) {
      let user_id = await AsyncStorage.getItem("user_id");

      setLoading(true);
      let obj = {
        friend_user_id: friend_id,
        this_user_id: user_id,
        noti_type_id: route?.params?.selected_noti_id,
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
          navigation?.goBack();
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
        text: "User not found",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    getUserDailyGoal(route?.params?.id);
    let todayDay = moment(new Date()).format("ddd");
    getMyWeeklyRanking(todayDay);
    getFriendWeeklyRanking(route?.params?.id, todayDay);
    getUser_Info(route?.params?.id);
    //getting common groups between logged in user and selected friend
    getCommonGroups(route?.params?.id);
    getLoggedInUserDetail();
  };

  const handleReportUser = async () => {
    if (comment?.length == 0) {
      Snackbar.show({
        text: "Please Enter comment to submit",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      let user_id = await AsyncStorage.getItem("user_id");
      // setLoading(true);
      let data = {
        reported_by: user_id,
        report_user: route?.params?.id,
        comments: comment,
      };

      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.report_user, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setVisible(false);
          Snackbar.show({
            text: "User Reported Successfully",
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
        <Header
          // title={"Boris"}
          title={firstName}
          navigation={navigation}
          titleStyle={{
            marginLeft: -30,
            zIndex: -1,
          }}
        />

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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            // paddingLeft: 30,
          }}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 110,
                height: 110,
                borderRadius: 110,
                backgroundColor: "#ccc",
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={require("../../../assets/images/friend-profile.png")}
              style={{ width: 110, height: 110, resizeMode: "contain" }}
            />
          )}
          <Text
            style={{
              color: "#000000",
              fontSize: 18,
              marginVertical: 10,
              fontWeight: "700",
            }}
          >
            {/* Boris Findlay */}
            {firstName} {lastName}
          </Text>
          {route?.params?.status == "requested" && (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={styles.btn}
                // onPress={() => bottomSheetRef?.current?.open()}
                onPress={() => handleApproveFriend(route?.params?.id)}
              >
                <Text style={styles.btnText}>Approve Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // bottomSheetRef?.current?.open();
                  // navigation.goBack();
                  handleUnApprove_FriendRequest(route?.params?.id);
                }}
                style={{
                  ...styles.btn,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                }}
              >
                <Text style={{ ...styles.btnText, color: "#38ACFF" }}>
                  Ignore Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontSize: 18,
            }}
          >
            {selectedType} Performance
          </Text>
          <DropDownPicker
            zIndex={999}
            open={isTypeOpen}
            value={selectedType}
            items={performanceTypes}
            setOpen={setIsTypeOpen}
            setValue={setSelectedType}
            setItems={setPerformanceTypes}
            onChangeValue={(item) => hanldeOnPerformaceTypeChange(item)}
            // arrowIconStyle={{
            //   tintColor: 'white',
            // }}
            // containerStyle={{
            //   width: '38%',
            // }}
            // dropDownContainerStyle={{
            //   padding: 0,
            //   alignSelf: 'center',
            //   borderWidth: 1,
            //   borderColor: '#ccc',
            //   borderRadius: 4,
            //   zIndex: 999,
            // }}
            // showTickIcon={false}
            // iconContainerStyle={{
            //   color: '#fff',
            // }}
            // selectedItemContainerStyle={{
            //   backgroundColor: '#0496ff',
            //   marginHorizontal: 5,
            // }}
            // selectedItemLabelStyle={{
            //   color: '#FFF',
            // }}
            // scrollViewProps={{
            //   showsVerticalScrollIndicator: false,
            //   showsHorizontalScrollIndicator: false,
            // }}
            // labelStyle={{
            //   fontSize: 14,
            //   textAlign: 'left',
            //   paddingLeft: 5,
            //   color: '#fff',
            // }}
            // style={{
            //   height: 35,
            //   paddingHorizontal: 10,
            //   borderRadius: 5,
            //   backgroundColor: '#003E6B',
            //   flexDirection: 'row',
            //   alignItems: 'center',
            //   justifyContent: 'center',
            // }}
            arrowIconStyle={{
              tintColor: "white",
            }}
            containerStyle={{
              width: "37%",
            }}
            dropDownContainerStyle={{
              padding: 0,
              alignSelf: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 4,
              zIndex: 999,
            }}
            showTickIcon={false}
            iconContainerStyle={{
              color: "#fff",
            }}
            selectedItemContainerStyle={{
              backgroundColor: "#0496ff",
              marginHorizontal: 5,
            }}
            selectedItemLabelStyle={{
              color: "#FFF",
              fontFamily: "Rubik-Regular",
            }}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
              showsHorizontalScrollIndicator: false,
            }}
            labelStyle={{
              fontSize: 14,
              textAlign: "left",
              color: "#fff",
              fontFamily: "Rubik-Regular",
            }}
            props={{
              style: {
                height: 36,
                // width: 90,
                paddingHorizontal: 8,
                borderRadius: 5,
                backgroundColor: "#003E6B",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
        </View>
        {/* -------------------------Performace Graph------------------------------------ */}
        <View style={styles.performanceCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                height: 80,
              }}
            >
              <View>
                {myTotalSteps >= friendTotalSteps && (
                  <Image
                    source={require("../../../assets/images/crown.png")}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                  />
                )}

                {myImage ? (
                  <Image
                    source={{ uri: myImage }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60,
                      backgroundColor: "#ccc",
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/friend-profile.png")}
                    style={{ width: 60, height: 60 }}
                  />
                )}
              </View>
              <View
                style={{
                  marginLeft: 5,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    color: "#38ACFF",
                    fontSize: 16,
                    fontFamily: "Rubik-Medium",
                  }}
                >
                  {/* 39,283 */}
                  {myTotalSteps}
                </Text>
                <Text
                  style={{
                    color: "#38ACFF",
                    fontSize: 14,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  Me
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
                fontFamily: "Rubik-Regular",
              }}
            >
              vs
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                height: 80,
              }}
            >
              <View style={{ marginRight: 5, marginBottom: 10 }}>
                <Text
                  style={{
                    color: "#003E6B",
                    fontSize: 16,
                    fontFamily: "Rubik-Medium",
                  }}
                >
                  {friendTotalSteps}
                  {/* 94,434 */}
                </Text>
                <Text
                  style={{
                    color: "#003E6B",
                    fontSize: 14,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {/* Saffa */}
                  {firstName}
                </Text>
              </View>
              <View>
                {friendTotalSteps >= myTotalSteps && (
                  <Image
                    source={require("../../../assets/images/crown.png")}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                  />
                )}

                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "#ccc",
                      borderRadius: 60,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/friend-profile.png")}
                    style={{ width: 60, height: 60 }}
                  />
                )}
              </View>
            </View>
          </View>

          {/* ------------------------------------graph------------------------------------------- */}

          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            contentOffset={{ x: 10000, y: 0 }} // i needed the scrolling to start from the end not the start
            style={{}}
          >
            <LineChart
              data={{
                // labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
                // labels: weekLabels,
                labels: labels,
                datasets: [
                  {
                    // data: [10, 20, 5, 15, 45, 30, 20, 9],
                    // data: weeklyHistory, //logged in user history
                    data: myHistory, //logged in user history
                    color: (opacity = 1) => `#38ACFF`, // optional
                    strokeWidth: 2,
                  },
                  {
                    // data: [15, 10, 20, 8, 30, 3, 50, 25],
                    // data: weeklyFriendHistory, //friend history
                    data: friendHistory, //friend history
                    color: (opacity = 1) => `#003E6B`, // optional
                    strokeWidth: 2,
                  },
                ],
              }}
              verticalLabelRotation={-40}
              // width={Dimensions.get("window").width - 80} // from react-native
              width={(labels?.length * Dimensions.get("window").width) / 8} // from react-native
              // xLabelsOffset={10}
              height={160}
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={false}
              withShadow={false}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                labelColor: (opacity = 1) => `#878484`,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                  backgroundColor: "red",
                  padding: 10,
                },
              }}
              // bezier
              style={{
                paddingRight: 13,
                paddingLeft: 15,
                marginTop: 15,
              }}
            />
          </ScrollView>
          {/* ------------------------------------graph------------------------------------------- */}
        </View>
        {/* -----------------------------Common Groups------------------------------------------ */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#000000",
              fontSize: 18,
            }}
          >
            Groups in Common
          </Text>
          {commonGroupsList.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 14,
                }}
              >
                No Groups in common
              </Text>
            </View>
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              key={"_"}
              data={commonGroupsList}
              numColumns={3}
              keyExtractor={(item, index) => "_" + index.toString()}
              renderItem={(item, index) => {
                return (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate("GroupDetail")}
                    style={{
                      ...styles.cardView,
                      justifyContent: "center",
                      height: 125,
                      width: "28.9%",
                    }}
                  >
                    {item?.item?.image ? (
                      <Image
                        source={{ uri: item?.item?.image }}
                        style={{
                          marginVertical: 8,
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          backgroundColor: "#ccc",
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/images/friend-profile.png")}
                        style={{ marginVertical: 8, width: 50, height: 50 }}
                      />
                    )}
                    <Text style={styles.cardText}>{item.item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        <RBSheet
          ref={bottomSheetRef}
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
              // borderRadius: 30,
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
          <Image
            source={require("../../../assets/images/friend-profile.png")}
            style={{
              marginTop: 20,
              marginBottom: 10,
              width: 110,
              height: 110,
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontFamily: "Rubik-Medium",
            }}
          >
            Boris Findlay
          </Text>
          {isFriendRequestApproved ? (
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
                You and Boris are now friends
              </Text>
            </View>
          ) : (
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.btnBottomSheet}
                onPress={() =>
                  setIsFriendRequestApproved(!isFriendRequestApproved)
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
                onPress={() => {
                  bottomSheetRef?.current?.close();
                  navigation.goBack();
                }}
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
              navigation.navigate("FriendProfile");
              bottomSheetRef?.current?.close();
            }}
          >
            <Text style={styles.btnText}>View Profile</Text>
          </TouchableOpacity>
        </RBSheet>
      </ScrollView>

      <ReportModal
        title={"Report User"}
        visible={visible}
        setVisible={setVisible}
        comment={comment}
        setComment={setComment}
        onPress={() => handleReportUser()}
      />
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    color: "#000000",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    width: 85,
  },
  performanceCard: {
    zIndex: -1,
    height: 288,
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 5,
    marginHorizontal: 4,
    marginVertical: 20,
    overflow: "hidden",
  },
  btn: {
    marginVertical: 10,
    width: 135,
    // paddingHorizontal: 10,
    height: 35,
    backgroundColor: "#38ACFF",
    borderColor: "#38ACFF",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  btnText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
  },
  btnBottomSheet: {
    marginVertical: 7,
    height: 35,
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
