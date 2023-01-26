import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  RefreshControl,
} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import RBSheet from "react-native-raw-bottom-sheet";
import { captureScreen } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomBarChart from "../Reuseable Components/CustomBarChart";
import Loader from "../Reuseable Components/Loader";
import { api } from "../constants/api";
import Snackbar from "react-native-snackbar";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import { BASE_URL_Image } from "../constants/Base_URL_Image";

import moment from "moment";
import { STYLE } from "./STYLE";

const SCREEN_WIDTH = Dimensions.get("window").width;
const Home = ({ scale, showMenu, setShowMenu, moveToRight, setActiveTab }) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [index, setIndex] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentHour, setCurrentHour] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [myImage, setMyImage] = useState("");

  const [kcal, setKcal] = useState("0");
  const [distance, setDistance] = useState("0");
  const [time, setTime] = useState("0");
  const [todaySteps, setTodaySteps] = useState(0);
  const [todaySteps_Percentage, setTodaySteps_Percentage] = useState(0.0);
  const [chartData, setChartData] = useState([
    // { label: "MON", percentage: "135.75%", value: 5430 },
    // { label: "TUE", percentage: "155.95%", value: 6238 },
    // { label: "WED", percentage: "153.20%", value: 6128 },
    // { label: "THU", percentage: "221.22%", value: 8849 },
    // { label: "FRI", percentage: "253.25%", value: 10130 },
    // { label: "SAT", percentage: "223.57%", value: 8943 },
    // { label: "SUN", percentage: "57.85%", value: 2314 },
  ]);
  const [todayRankingList, setTodayRankingList] = useState([
    // {
    //   id: 0,
    //   name: "Me",
    //   steps: 9000,
    //   flag: "3k",
    //   avater: require("../../assets/images/user1.png"),
    // },
    // {
    //   id: 1,
    //   name: "Nahla",
    //   steps: 8000,
    //   flag: "4k",
    //   avater: require("../../assets/images/user2.png"),
    // },
    // {
    //   id: 2,
    //   name: "Saffa",
    //   steps: 7000,
    //   flag: "1k",
    //   avater: require("../../assets/images/user3.png"),
    // },
    // {
    //   id: 3,
    //   name: "Rui",
    //   steps: 6000,
    //   flag: "2k",
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 4,
    //   name: "Anum",
    //   steps: 5000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 5,
    //   name: "Zaina",
    //   steps: 4000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 6,
    //   name: "Noami",
    //   steps: 3000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 7,
    //   name: "Noami",
    //   steps: 2000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 8,
    //   name: "Noami",
    //   steps: 1000,
    //   flag: "1k",
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 9,
    //   name: "Noami",
    //   steps: 500,
    //   flag: "1k",
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
  ]);
  const [weekRankingList, setWeekRankingList] = useState([
    // {
    //   id: 0,
    //   name: "Me",
    //   steps: 9000,
    //   flag: "3k",
    //   avater: require("../../assets/images/user1.png"),
    // },
    // {
    //   id: 1,
    //   name: "Nahla",
    //   steps: 8000,
    //   flag: "4k",
    //   avater: require("../../assets/images/user2.png"),
    // },
    // {
    //   id: 2,
    //   name: "Saffa",
    //   steps: 7000,
    //   flag: "1k",
    //   avater: require("../../assets/images/user3.png"),
    // },
    // {
    //   id: 3,
    //   name: "Rui",
    //   steps: 6000,
    //   flag: "2k",
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 4,
    //   name: "Anum",
    //   steps: 5000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 5,
    //   name: "Zaina",
    //   steps: 4000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 6,
    //   name: "Noami",
    //   steps: 3000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 7,
    //   name: "Noami",
    //   steps: 2000,
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 8,
    //   name: "Noami",
    //   steps: 1000,
    //   flag: "1k",
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
    // {
    //   id: 9,
    //   name: "Noami",
    //   steps: 500,
    //   flag: "1k",
    //   avater: require("../../assets/images/friend-profile.png"),
    // },
  ]);

  const [myDailyGoal, setMyDailyGoal] = useState("1200");
  const [myWeeklyGoals, setMyWeeklyGoals] = useState("1200");

  const [weeklySteps, setWeeklySteps] = useState(0);
  const [weeklySteps_Percentage, setWeeklySteps_Percentage] = useState(0.0);

  const getUser = async () => {
    let user_info = await AsyncStorage.getItem("user");
    if (user_info != null) {
      let parse = JSON.parse(user_info);
      setFirstName(parse?.first_name);
      setLastName(parse?.last_name);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUser();
      greeting();
      // getRanking();
      let todayDate = moment(new Date()).format("YYYY-MM-DD");
      getHistoryOfSpecificDate(todayDate);
      getUserGoals();
    }, [])
  );

  useEffect(() => {
    setLoading(true);
    getHistoryOfWeek();
    getDailyRanking();
    getWeeklyRanking();
    getLoggedInUserDetail();
    getUserDailAndWeeklyGoals();
  }, []);

  const getUserDailAndWeeklyGoals = async () => {
    let data = await getUserGoals();
    setMyDailyGoal(data?.daily);
    setMyWeeklyGoals(data?.weekly);
  };

  const getUserGoals = async () => {
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
        fetch(api.get_user_goals, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // setMyDailyGoal(result[0]["daily goals"]);
            // setMyWeeklyGoals(result[0]["weekly goals"]);
            let obj = {
              daily: result[0]["daily goals"],
              weekly: result[0]["weekly goals"],
            };
            resolve(obj);
          })
          .catch((error) => {
            let obj = {
              daily: "1200",
              weekly: "1200",
            };
            resolve(obj);
          });
      } catch (error) {
        let obj = {
          daily: "1200",
          weekly: "1200",
        };
        resolve(obj);
      }
    });
  };

  //getting logged in user info
  const getLoggedInUserDetail = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    let userInfo = await getUser_Info(user_id);
    if (userInfo == false) {
      //do nothing
    } else {
      let img = userInfo["profile image"]
        ? BASE_URL_Image + "/" + userInfo["profile image"]
        : "";
      setMyImage(img);
    }
  };
  //gettting user daily goal info...
  const getUserDailyGoal = () => {
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
        fetch(api.get_user_daily_goal, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result[0]?.error == false || result[0]?.error == "false") {
              let steps = result[0]["Daily Goal Steps"]
                ? result[0]["Daily Goal Steps"]
                : "0";

              resolve(steps);
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
  const getHistoryOfSpecificDate = async (date) => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      user_id: user_id,
      date: date,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_of_specific_date, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result[0]?.error == false || result[0]?.error == "false") {
          let responseList = result[0]?.History ? result[0]?.History : [];
          let list = [];
          if (responseList?.length > 0) {
            // let obj = {
            //   id: responseList[0]?.id,
            //   user_id: responseList[0]?.user_id,
            //   calories_burnt: responseList[0]?.calories_burnt,
            //   distancecovered: responseList[0]?.distancecovered,
            //   time_taken: responseList[0]?.time_taken,
            //   avg_speed: responseList[0]?.avg_speed,
            //   avg_pace: responseList[0]?.avg_pace,
            //   date: responseList[0]?.date,
            //   steps: responseList[0]?.steps,
            //   weekly_steps_id: responseList[0]?.weekly_steps_id,
            // };
            setKcal(responseList[0]?.calories_burnt);
            setDistance(responseList[0]?.distancecovered);
            setTime(responseList[0]?.time_taken);
            let daily_goal_steps = await getUserDailyGoal();
            let today_steps = parseInt(responseList[0]?.steps);
            let daily_goal = parseInt(daily_goal_steps);

            setTodaySteps(today_steps);
            let percentage = (today_steps / daily_goal) * 100;
            setTodaySteps_Percentage(percentage?.toFixed(2));
          } else {
            // Snackbar.show({
            //   text: "No Record Found.",
            //   duration: Snackbar.LENGTH_SHORT,
            // });
          }
          // setHistoryList(list);
        } else {
          // Snackbar.show({
          //   text: result[0]?.message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        console.log("error in getting history of specific date", error);

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

  const getHistoryOfWeek = async () => {
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
        if (result[0]?.error == false || result[0]?.error == "false") {
          let responseList = result[0]?.History ? result[0]?.History : [];

          let weekly_steps_count = 0;

          let week_days_list = await getWeekDays();
          let list = [];
          week_days_list?.forEach((element) => {
            let filter = responseList?.filter(
              (item) => item?.date == element?.date
            );
            // { label: "SUN", percentage: "57.85%", value: 2314 },
            let steps = filter[0]?.steps ? parseInt(filter[0]?.steps) : 0;
            weekly_steps_count = weekly_steps_count + steps;

            let obj = {
              label: element?.name,
              percentage: "",
              value: steps,
            };
            list.push(obj);
          });

          let goalsData = await getUserGoals();
          let weeklygoals_set = goalsData?.weekly;

          let percentage = (weekly_steps_count / weeklygoals_set) * 100;

          setWeeklySteps_Percentage(percentage?.toFixed(2));

          setWeeklySteps(weekly_steps_count);
          setChartData(list);
        } else {
          // Snackbar.show({
          //   text: result[0]?.message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
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

  //get daily ranking
  const getDailyRanking = async () => {
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

      fetch(api.get_user_ranking, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result == null) {
            //no record found
          } else {
            let list = [];
            for (const element of result) {
              let friend_id = element.user_id;
              if (friend_id) {
                let user_info = await getUser_Info(friend_id);
                let friend_status = await getRequestStatus(friend_id);

                if (friend_status != "requested") {
                  let obj = {
                    //  daily_step_record_id: element["Daily Steps Records id"],
                    friend_user_id: friend_id,
                    friend_user_name: user_info?.first_name,
                    date: element?.date,
                    calories_burnt: element?.calories_burnt,
                    avg_pace: element?.avg_pace,
                    avg_speed: element?.avg_speed,
                    steps: element?.steps,
                    distance_covered: element?.distancecovered,
                    time_taken: element?.time_taken,
                    user_info: user_info,
                    image: user_info?.["profile image"]
                      ? BASE_URL_Image + "/" + user_info?.["profile image"]
                      : "",
                  };
                  list.push(obj);
                }
              }

              // if (element?.error == false || element?.error == "false") {
              //   let friend_id = element["friend user id"];
              //   let user_info = await getUser_Info(friend_id);
              //   let obj = {
              //     daily_step_record_id: element["Daily Steps Records id"],
              //     friend_user_id: friend_id,
              //     friend_user_name: element["Friend user name"],
              //     date: element?.Date,
              //     calories_burnt: element?.calories_burnt,
              //     avg_pace: element?.avg_pace,
              //     avg_speed: element?.avg_speed,
              //     steps: element?.steps,
              //     distance_covered: element?.distance_covered,
              //     time_taken: element?.["Time Taken"],
              //     user_info: user_info,
              //     image: user_info?.["profile image"]
              //       ? BASE_URL_Image + "/" + user_info?.["profile image"]
              //       : "",
              //   };
              //   list.push(obj);
              // } else {
              //   //no ranking found for today
              // }
            }
            list.sort(function (a, b) {
              return b?.steps - a?.steps;
            });
            if (list.length > 0) {
              let largest_step = list[0]?.steps;
              let newData = list?.map((item, index) => {
                let percentage = (item?.steps / largest_step) * 100;
                return {
                  ...item,
                  percentage: percentage.toFixed(2),
                };
              });

              let chkOnlyIsRecord = newData.filter(
                (item) => item?.friend_user_id != user_id
              );
              if (chkOnlyIsRecord?.length == 0) {
                setTodayRankingList([]);
              } else {
                setTodayRankingList(newData);
              }
            } else {
              setTodayRankingList([]);
            }
          }
        })
        .catch((error) => console.log("error in getting ranking ::: ", error))
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } catch (error) {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  //get weekly ranking
  const getWeeklyRanking = async () => {
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

      fetch(api.get_user_weekly_ranking, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result == null) {
            //no record found
          } else {
            let list = [];
            let count = 0;
            for (const element of result) {
              let friend_id = element?.user_id;
              if (friend_id) {
                let user_info = await getUser_Info(friend_id);
                let friend_status = await getRequestStatus(friend_id);

                if (friend_status != "requested") {
                  let obj = {
                    id: element?.id,
                    friend_user_id: friend_id,
                    steps: element?.steps,
                    user_info: user_info,
                    image: user_info?.["profile image"]
                      ? BASE_URL_Image + "/" + user_info?.["profile image"]
                      : "",
                  };
                  list.push(obj);
                }
              }
              // let friend_id = element["user id"];
              // if (friend_id === null) {
              //   //do nothing
              // } else if (element?.error == false || element?.error == "false") {
              //   let user_info = await getUser_Info(friend_id);
              //   let obj = {
              //     id: element?.id,
              //     friend_user_id: friend_id,
              //     steps: element?.steps,
              //     user_info: user_info,
              //     image: user_info?.["profile image"]
              //       ? BASE_URL_Image + "/" + user_info?.["profile image"]
              //       : "",
              //   };

              //   list.push(obj);
              // } else {
              //   //no ranking found for today
              // }
            }
            if (list?.length > 0) {
              list.sort(function (a, b) {
                return b?.steps - a?.steps;
              });

              let largest_step = list[0]?.steps;
              let newData = list.map((item, index) => {
                let percentage = (item?.steps / largest_step) * 100;
                return {
                  ...item,
                  percentage: percentage.toFixed(2),
                };
              });
              let chkOnlyIsRecord = newData.filter(
                (item) => item?.friend_user_id != user_id
              );
              if (chkOnlyIsRecord?.length == 0) {
                setWeekRankingList([]);
              } else {
                setWeekRankingList(newData);
              }
            } else {
              setWeekRankingList([]);
            }
          }
        })
        .catch((error) => console.log("error in getting ranking ::: ", error))
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    } catch (error) {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  //getting specific  user info
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

  const getRanking = async () => {
    try {
      let user_id = await AsyncStorage.getItem("user_id");

      // setSuggestedGroups([]);
      let data = {
        this_user_id: user_id,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.get_user_ranking, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          let responseList = [];
          console.log("user ranking ::: ", result);
        })
        .catch((error) => console.log("error in getting ranking ::: ", error))
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

  const greeting = () => {
    let d = new Date();
    let time = d.getHours();
    setCurrentHour(time);
  };
  const handleonTabChange = () => {
    setIndex(index == 0 ? 1 : 0);
  };
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };
  const handleOpenDrawer = (navigation) => {
    captureScreen({
      format: "jpg",
    })
      .then((uri) => {
        AsyncStorage.setItem("Screen", uri.toString());
        AsyncStorage.setItem("ScreenName", "Home");
        navigation.openDrawer();
      })
      .catch((error) => console.log(error));
  };

  const [tabList, setTabList] = useState([
    {
      title: "Home",
      icon: require("../../assets/images/home1.png"),
    },
    {
      title: "History",
      icon: require("../../assets/images/history.png"),
    },
    {
      title: "Change Password",
      icon: require("../../assets/images/lock.png"),
    },
  ]);

  const EmptyTodayRankingView = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={styles.cardView}>
          <View
            style={{
              backgroundColor: "#D8D8D8",
              height: 50,
              width: 50,
              marginVertical: 5,
              borderRadius: 50,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {myImage ? (
              <Image
                source={{ uri: myImage }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 46,
                  backgroundColor: "#ccc",
                }}
              />
            ) : (
              <Image source={require("../../assets/images/profile.png")} />
            )}
          </View>
          <Text
            style={{
              color: "#040103",
              fontSize: 12,
              fontFamily: "PlusJakartaDisplay-Medium",
            }}
          >
            Me
          </Text>
          <Text
            style={{
              color: "#38acff",
              fontSize: 16,
              fontFamily: "PlusJakartaDisplay-Bold",
            }}
          >
            {/* 0 */}
            {todaySteps}
          </Text>
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/flag.png")}
              style={{ marginRight: 3, height: 15, width: 15 }}
            />
            <Text style={{ color: "#a9a9a9" }}>3k</Text>
          </View> */}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Friends")}
          style={{
            height: 137,
            width: 101,
            borderRadius: 5,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 5,
          }}
        >
          <Image
            source={require("../../assets/images/add-friend1.png")}
            style={{
              width: 33,
              height: 24,
            }}
          />
          <Text
            style={{
              color: "#002138",
              marginTop: 8,
              fontSize: 14,
              fontFamily: "Rubik-Regular",
            }}
          >
            Add a Friend
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const EmptyWeekRankingView = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={styles.cardView}>
          <View
            style={{
              backgroundColor: "#D8D8D8",
              height: 50,
              width: 50,
              marginVertical: 5,
              borderRadius: 50,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {myImage ? (
              <Image
                source={{ uri: myImage }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 46,
                  backgroundColor: "#ccc",
                }}
              />
            ) : (
              <Image source={require("../../assets/images/profile.png")} />
            )}
          </View>
          <Text
            style={{
              color: "#040103",
              fontSize: 12,
              fontFamily: "PlusJakartaDisplay-Medium",
            }}
          >
            Me
          </Text>
          <Text
            style={{
              color: "#38acff",
              fontSize: 16,
              fontFamily: "PlusJakartaDisplay-Bold",
            }}
          >
            {/* 0 */}
            {todaySteps}
          </Text>
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/flag.png")}
              style={{ marginRight: 3, height: 15, width: 15 }}
            />
            <Text style={{ color: "#a9a9a9" }}>3k</Text>
          </View> */}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Friends")}
          style={{
            height: 137,
            width: 101,
            borderRadius: 5,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 5,
          }}
        >
          <Image
            source={require("../../assets/images/add-friend1.png")}
            style={{
              width: 33,
              height: 24,
            }}
          />
          <Text
            style={{
              color: "#002138",
              marginTop: 8,
              fontSize: 14,
              fontFamily: "Rubik-Regular",
            }}
          >
            Add a Friend
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
              resolve(response);
            })
            .catch((error) => {
              console.log("error  ::: ", error);
              resolve(false);
            });
        }
      } catch (error) {
        resolve(false);
      }
    });
  };

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    let todayDate = moment(new Date()).format("YYYY-MM-DD");
    getHistoryOfSpecificDate(todayDate);
    getHistoryOfWeek();
    getDailyRanking();
    getWeeklyRanking();
    getLoggedInUserDetail();
    getUserDailAndWeeklyGoals();
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
          {loading && <Loader />}
          <View style={{ ...styles.headerView }}>
            {/* <Pressable onPress={() => handleOpenDrawer(navigation)}> */}
            <Pressable
              onPress={() => {
                console.log("home scale", scale, moveToRight);
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
              }}
              style={{
                paddingBottom: responsiveHeight(2.5),
                paddingRight: responsiveHeight(2.5),
              }}
            >
              <Image
                source={require("../../assets/images/menu1.png")}
                style={STYLE.menuIcon}
              />
            </Pressable>
            <TouchableOpacity
              style={{
                paddingBottom: responsiveHeight(2.5),
              }}
              onPress={() => navigation.navigate("Notification")}
            >
              <Image
                source={require("../../assets/images/bell1.png")}
                style={{
                  width: responsiveWidth(4.4),
                  height: responsiveHeight(2.8),
                  resizeMode: "stretch",
                }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: "#000000",
              // marginTop: 8,
              fontFamily: "Rubik-Regular",
            }}
          >
            Good{" "}
            {currentHour < 12
              ? "Morning"
              : currentHour <= 18 && currentHour >= 12
              ? "Evening"
              : "Night"}
          </Text>
          <Text
            style={{
              color: "#000305",
              fontSize: 24,
              fontFamily: "PlusJakartaDisplay-Regular",
            }}
          >
            {/* Jonathan */}
            {firstName} {lastName}
          </Text>
          <View style={styles.tabView}>
            <TouchableOpacity
              // onPress={() => handleonTabChange()}
              onPress={() => {
                setIndex(0);
              }}
              style={{
                ...styles.btn,
                backgroundColor: index == 0 ? "#FFF" : "transparent",
                elevation: index == 0 ? 23 : 0,
              }}
            >
              <Text style={styles.btnText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => handleonTabChange()}
              onPress={() => setIndex(1)}
              style={{
                ...styles.btn,
                backgroundColor: index == 1 ? "#FFF" : "transparent",
                elevation: index == 1 ? 23 : 0,
              }}
            >
              <Text style={styles.btnText}>This Week</Text>
            </TouchableOpacity>
          </View>
          {/* <CircularProgress value={58} /> */}

          {index == 0 ? (
            <View>
              {loading ? (
                <View style={{ height: 120 }}></View>
              ) : (
                <View style={{ alignItems: "center", marginVertical: 30 }}>
                  <AnimatedCircularProgress
                    size={200}
                    width={10}
                    // fill={0}
                    fill={todaySteps_Percentage}
                    tintColor="#38ACFF"
                    backgroundColor="#E2E2E2"
                    rotation={360}
                  >
                    {(fill) => (
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            color: "#38acff",
                            fontSize: 36,
                            textAlign: "center",
                            // fontFamily: 'Rubik-Regular',
                          }}
                        >
                          {/* {fill} */}
                          {todaySteps}
                        </Text>
                        <Text
                          style={{
                            color: "#000305",
                            fontSize: 14.5,
                            fontFamily: "PlusJakartaDisplay-Regular",
                            textAlign: "center",
                          }}
                        >
                          Total Amount of Steps
                        </Text>

                        <Text
                          style={{
                            color: "#38acff",
                            fontSize: 22,
                            textAlign: "center",
                            // fontFamily: 'Rubik-Regular',
                          }}
                        >
                          {/* {fill} */}
                          {myDailyGoal?.trim()}
                        </Text>
                        <Text
                          style={{
                            color: "#000305",
                            fontSize: 14.5,
                            fontFamily: "PlusJakartaDisplay-Regular",
                            textAlign: "center",
                          }}
                        >
                          Daily Goals
                        </Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#38ACFF",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {/* 0 kcal */}
                    {kcal} kcal
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/calories.png")}
                      style={{
                        marginRight: 5,
                        width: 11,
                        height: 15,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#002138",
                        fontSize: 13,
                        fontSize: 13,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Calories
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#38ACFF",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {distance} km
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/man-walking.png")}
                      style={{
                        marginRight: 5,
                        width: 12,
                        height: 15,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#002138",
                        fontSize: 13,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Distance
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#38ACFF",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {/* 0:01 h */}
                    {time} h
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/clock.png")}
                      style={{
                        marginRight: 5,
                        width: 13,
                        height: 15,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#002138",
                        fontSize: 13,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Time
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 25,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  Today's Ranking
                </Text>
                <TouchableOpacity
                  style={{ height: 30, width: 60 }}
                  onPress={() => bottomSheetRef?.current?.open()}
                >
                  <Text
                    style={{
                      color: "#38acff",
                      fontSize: 14,
                      textAlign: "right",
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {loading ? null : (
                <View>
                  {todayRankingList.length === 0 ? (
                    <EmptyTodayRankingView />
                  ) : (
                    <View>
                      <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={todayRankingList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item) => {
                          let itemColor = generateColor();
                          return (
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {
                                navigation.navigate("FriendProfile", {
                                  user: {
                                    id: item?.item?.friend_user_id,
                                  },
                                });
                              }}
                              style={{
                                ...styles.cardView,
                                justifyContent: "center",
                                marginRight: 10,
                                marginVertical: 2,
                                elevation: 3,
                              }}
                            >
                              <View style={{ height: 18, width: 18 }}>
                                {item.index < 1 && (
                                  <Image
                                    source={require("../../assets/images/crown.png")}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      resizeMode: "contain",
                                    }}
                                  />
                                )}
                              </View>
                              <View style={{ marginBottom: 3 }}>
                                <AnimatedCircularProgress
                                  rotation={360}
                                  size={55}
                                  width={2.5}
                                  // fill={80}
                                  fill={parseInt(item?.item?.percentage)}
                                  // tintColor="#38ACFF"
                                  tintColor={itemColor}
                                  backgroundColor="#eee"
                                >
                                  {(fill) => (
                                    <>
                                      {item?.item?.image ? (
                                        <Image
                                          // source={item.item.avater}
                                          source={{ uri: item.item.image }}
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
                                          // source={item.item.avater}
                                          source={require("../../assets/images/friend-profile.png")}
                                          style={{
                                            marginVertical: 8,
                                            width: 44,
                                            height: 44,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </AnimatedCircularProgress>
                              </View>
                              <Text style={styles.cardText}>
                                {item.item.friend_user_name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.cardText,
                                  color: itemColor,
                                  fontFamily: "Rubik-Medium",
                                }}
                              >
                                {item.item.steps}
                              </Text>
                              {/* <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={require("../../assets/images/flag1.png")}
                                style={{
                                  width: 12,
                                  height: 12,
                                  marginRight: 3,
                                  tintColor: itemColor,
                                }}
                              />
                              <Text
                                style={{
                                  color: itemColor,
                                  fontFamily: "Rubik-Medium",
                                }}
                              >
                                {item.item.flag}
                              </Text>
                            </View> */}
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View>
              {loading ? (
                <View style={{ height: 120 }}></View>
              ) : (
                <View
                  style={{
                    marginVertical: 30,
                    marginBottom: 10,
                    width: "100%",
                  }}
                >
                  {/* tab1  */}
                  <SwiperFlatList
                    showPagination
                    style={{ paddingBottom: 30 }}
                    paginationDefaultColor={"#7cb9e6"}
                    paginationActiveColor={"#003e6b"}
                    paginationStyleItemInactive={{
                      marginHorizontal: 6,
                    }}
                    paginationStyleItemActive={{
                      marginHorizontal: 6,
                    }}
                    paginationStyleItem={{
                      height: 9,
                      width: 9,
                    }}
                  >
                    <View
                      style={{
                        width: SCREEN_WIDTH * 0.9,
                        alignItems: "center",
                        height: 210,
                      }}
                    >
                      <AnimatedCircularProgress
                        size={200}
                        width={10}
                        // fill={0}
                        fill={weeklySteps_Percentage}
                        tintColor="#38ACFF"
                        backgroundColor="#E2E2E2"
                        rotation={360}
                      >
                        {(fill) => (
                          <View style={{ alignItems: "center" }}>
                            <Text
                              style={{
                                color: "#38acff",
                                fontSize: 36,
                                textAlign: "center",
                                // fontFamily: 'Rubik-Regular',
                              }}
                            >
                              {/* {fill} */}
                              {weeklySteps}
                            </Text>
                            <Text
                              style={{
                                color: "#000305",
                                fontSize: 14.5,
                                fontFamily: "PlusJakartaDisplay-Regular",
                                textAlign: "center",
                              }}
                            >
                              Total Amount of Steps
                            </Text>

                            <Text
                              style={{
                                color: "#38acff",
                                fontSize: 22,
                                textAlign: "center",
                                // fontFamily: 'Rubik-Regular',
                              }}
                            >
                              {myWeeklyGoals?.trim()}
                            </Text>
                            <Text
                              style={{
                                color: "#000305",
                                fontSize: 14.5,
                                fontFamily: "PlusJakartaDisplay-Regular",
                                textAlign: "center",
                              }}
                            >
                              Weekly Goals
                            </Text>
                          </View>
                        )}
                      </AnimatedCircularProgress>
                    </View>
                    <View
                      style={{
                        width: SCREEN_WIDTH * 0.9,
                        alignItems: "center",
                      }}
                    >
                      <View style={{}}>
                        <CustomBarChart
                          data={
                            chartData?.length == 0
                              ? [
                                  {
                                    label: "MON",
                                    percentage: "",
                                    value: 0,
                                  },
                                  {
                                    label: "TUE",
                                    percentage: "",
                                    value: 0,
                                  },
                                  {
                                    label: "WED",
                                    percentage: "",
                                    value: 0,
                                  },
                                  {
                                    label: "THU",
                                    percentage: "",
                                    value: 0,
                                  },
                                  {
                                    label: "FRI",
                                    percentage: "",
                                    value: 0,
                                  },
                                  {
                                    label: "SAT",
                                    percentage: "",
                                    value: 0,
                                  },
                                  {
                                    label: "SUN",
                                    percentage: "",
                                    value: 0,
                                  },
                                ]
                              : chartData
                          }
                          round={100}
                          unit="k"
                          width={SCREEN_WIDTH - 20}
                          height={180}
                          barWidth={8}
                          barRadius={6}
                          barColor={"#38ACFF"}
                          axisColor={"#838383"}
                          paddingBottom={10}
                          isMiddleLineVisible={false}
                          isPercentageVisible={false}
                        />
                      </View>
                    </View>
                  </SwiperFlatList>
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#38ACFF",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {/* 0 kcal */}
                    {kcal} kcal
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/calories.png")}
                      style={{
                        marginRight: 5,
                        width: 11,
                        height: 15,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#002138",
                        fontSize: 13,
                        fontSize: 13,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Calories
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#38ACFF",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {/* 0 km */}
                    {distance} km
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/man-walking.png")}
                      style={{
                        marginRight: 5,
                        width: 12,
                        height: 15,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#002138",
                        fontSize: 13,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Distance
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#38ACFF",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {/* 0:01 h */}
                    {time}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/clock.png")}
                      style={{
                        marginRight: 5,
                        width: 13,
                        height: 15,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#002138",
                        fontSize: 13,
                        fontFamily: "Rubik-Regular",
                      }}
                    >
                      Time
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 25,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  Week's Ranking
                </Text>
                <TouchableOpacity
                  style={{ height: 30, width: 60 }}
                  onPress={() => bottomSheetRef?.current?.open()}
                >
                  <Text
                    style={{
                      color: "#38acff",
                      fontSize: 14,
                      textAlign: "right",
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {loading ? null : (
                <View>
                  {weekRankingList.length === 0 ? (
                    <EmptyWeekRankingView />
                  ) : (
                    <View>
                      <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={weekRankingList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item) => {
                          let itemColor = generateColor();
                          return (
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {
                                navigation.navigate("FriendProfile", {
                                  user: {
                                    id: item?.item?.friend_user_id,
                                  },
                                });
                              }}
                              style={{
                                ...styles.cardView,
                                justifyContent: "center",
                                marginRight: 10,
                                marginVertical: 2,
                                elevation: 3,
                              }}
                            >
                              <View style={{ height: 18, width: 18 }}>
                                {item.index < 1 && (
                                  <Image
                                    source={require("../../assets/images/crown.png")}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      resizeMode: "contain",
                                    }}
                                  />
                                )}
                              </View>
                              <View style={{ marginBottom: 3 }}>
                                <AnimatedCircularProgress
                                  rotation={360}
                                  size={55}
                                  width={2.5}
                                  // fill={80}

                                  fill={parseInt(item?.item?.percentage)}
                                  // tintColor="#38ACFF"
                                  tintColor={itemColor}
                                  backgroundColor="#eee"
                                >
                                  {(fill) => (
                                    <>
                                      {item?.item?.image ? (
                                        <Image
                                          // source={item.item.avater}
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
                                          source={require("../../assets/images/friend-profile.png")}
                                          style={{
                                            marginVertical: 8,
                                            width: 44,
                                            height: 44,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </AnimatedCircularProgress>
                              </View>
                              <Text style={styles.cardText}>
                                {item?.item?.user_info?.first_name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.cardText,
                                  color: itemColor,
                                  fontFamily: "Rubik-Medium",
                                }}
                              >
                                {item.item.steps}
                              </Text>
                              {/* <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={require("../../assets/images/flag1.png")}
                                style={{
                                  width: 12,
                                  height: 12,
                                  marginRight: 3,
                                  tintColor: itemColor,
                                }}
                              />
                              <Text
                                style={{
                                  color: itemColor,
                                  fontFamily: "Rubik-Medium",
                                }}
                              >
                                {item.item.flag}
                              </Text>
                            </View> */}
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          <RBSheet
            ref={bottomSheetRef}
            height={350}
            openDuration={250}
            closeOnDragDown={true}
            closeOnPressMask={false}
            animationType={"slide"}
            customStyles={{
              container: {
                padding: 5,
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
            {index == 0 ? (
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#003e6b",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Today's Ranking
                </Text>
                <View style={{ padding: 10, marginTop: 10, flex: 1 }}>
                  {todayRankingList.length == 0 ? (
                    <View style={styles.bootSheetCardView}>
                      {myImage ? (
                        <Image
                          source={{ uri: myImage }}
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
                          source={require("../../assets/images/friend-profile.png")}
                          style={{ marginVertical: 8, width: 44, height: 44 }}
                        />
                      )}

                      <Text
                        style={{
                          color: "#040103",
                          fontSize: 12,
                          fontFamily: "PlusJakartaDisplay-Medium",
                        }}
                      >
                        Me
                      </Text>
                      <Text
                        style={{
                          color: "#38acff",
                          fontSize: 16,
                          fontFamily: "PlusJakartaDisplay-Bold",
                        }}
                      >
                        {/* 0 */}
                        {todaySteps}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginVertical: 15,
                      }}
                    >
                      <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={todayRankingList}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item) => {
                          let itemColor = generateColor();
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                // navigation.navigate("FriendProfile");
                                bottomSheetRef?.current?.close();
                                navigation.navigate("FriendProfile", {
                                  user: {
                                    id: item?.item?.friend_user_id,
                                  },
                                });
                              }}
                              style={{
                                ...styles.cardView,
                                justifyContent: "center",
                                marginRight: 10,
                                marginVertical: 2,
                                elevation: 3,
                                height: 120,
                                width: "28.9%",
                                marginBottom: 10,
                              }}
                            >
                              <View style={{ height: 18, width: 18 }}>
                                {item.index < 1 && (
                                  <Image
                                    source={require("../../assets/images/crown.png")}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      resizeMode: "contain",
                                    }}
                                  />
                                )}
                              </View>
                              <View style={{ marginBottom: 3 }}>
                                <AnimatedCircularProgress
                                  rotation={360}
                                  size={55}
                                  width={2.5}
                                  // fill={80}
                                  fill={parseInt(item?.item?.percentage)}
                                  // tintColor="#38ACFF"
                                  tintColor={itemColor}
                                  backgroundColor="#eee"
                                >
                                  {(fill) => (
                                    <>
                                      {item?.item?.image ? (
                                        <Image
                                          // source={item.item.avater}
                                          source={{ uri: item.item.image }}
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
                                          // source={item.item.avater}
                                          source={require("../../assets/images/friend-profile.png")}
                                          style={{
                                            marginVertical: 8,
                                            width: 44,
                                            height: 44,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </AnimatedCircularProgress>
                              </View>
                              <Text style={styles.cardText}>
                                {item.item.friend_user_name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.cardText,
                                  color: itemColor,
                                  fontFamily: "Rubik-Medium",
                                }}
                              >
                                {item.item.steps}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#003e6b",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Week's Ranking
                </Text>
                <View style={{ padding: 10, marginTop: 10, flex: 1 }}>
                  {weekRankingList.length == 0 ? (
                    <View style={styles.bootSheetCardView}>
                      <>
                        {myImage ? (
                          <Image
                            // source={item.item.avater}
                            source={{ uri: myImage }}
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
                            source={require("../../assets/images/friend-profile.png")}
                            style={{
                              marginVertical: 8,
                              width: 44,
                              height: 44,
                            }}
                          />
                        )}
                      </>
                      <Text
                        style={{
                          color: "#040103",
                          fontSize: 12,
                          fontFamily: "PlusJakartaDisplay-Medium",
                        }}
                      >
                        Me
                      </Text>
                      <Text
                        style={{
                          color: "#38acff",
                          fontSize: 16,
                          fontFamily: "PlusJakartaDisplay-Bold",
                        }}
                      >
                        {/* 0 */}
                        {todaySteps}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginVertical: 15,
                      }}
                    >
                      <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={weekRankingList}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item) => {
                          let itemColor = generateColor();
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                // navigation.navigate("FriendProfile");
                                bottomSheetRef?.current?.close();
                                navigation.navigate("FriendProfile", {
                                  user: {
                                    id: item?.item?.friend_user_id,
                                  },
                                });
                              }}
                              style={{
                                ...styles.cardView,
                                justifyContent: "center",
                                marginRight: 10,
                                marginVertical: 2,
                                elevation: 3,
                                height: 120,
                                width: "28.9%",
                                marginBottom: 10,
                              }}
                            >
                              <View style={{ height: 18, width: 18 }}>
                                {item.index < 1 && (
                                  <Image
                                    source={require("../../assets/images/crown.png")}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      resizeMode: "contain",
                                    }}
                                  />
                                )}
                              </View>
                              <View style={{ marginBottom: 3 }}>
                                <AnimatedCircularProgress
                                  rotation={360}
                                  size={55}
                                  width={2.5}
                                  // fill={80}
                                  fill={parseInt(item?.item?.percentage)}
                                  // tintColor="#38ACFF"
                                  tintColor={itemColor}
                                  backgroundColor="#eee"
                                >
                                  {(fill) => (
                                    <>
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
                                          source={require("../../assets/images/friend-profile.png")}
                                          style={{
                                            marginVertical: 8,
                                            width: 44,
                                            height: 44,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </AnimatedCircularProgress>
                              </View>
                              <Text style={styles.cardText}>
                                {item.item?.user_info?.first_name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.cardText,
                                  color: itemColor,
                                  fontFamily: "Rubik-Medium",
                                }}
                              >
                                {item.item.steps}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
          </RBSheet>
        </ScrollView>
      </View>
      {/* footer menu----------------------------- */}
      {/* <View
        style={{
          width: '100%',
          height: 60,
          backgroundColor: '#cdcdcd',
          elevation: 30,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {tabList.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Chat', {
                  scale,
                  // showMenu,
                  // setShowMenu,
                  moveToRight,
                })
              }
              key={index}
              style={{
                flex: 1,
                marginHorizontal: 5,
              }}>
              <Image
                source={item.icon}
                style={{
                  height: 30,
                  width: 30,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View> */}
    </Animated.View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    // paddingBottom: 10,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },
  tabView: {
    height: 48,
    marginTop: 25,
    width: "100%",
    backgroundColor: "#d1ecff",
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: "row",
    marginVertical: 5,
  },
  btn: {
    backgroundColor: "#FFF",
    flex: 1,
    height: 30,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    shadowColor: "#cdcdcd",
  },
  btnText: {
    color: "#002138",
    fontSize: 14,
    fontFamily: "PlusJakartaDisplay-Regular",
  },
  cardView: {
    height: 137,
    width: 101,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "blue",
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.0,
    shadowRadius: 0.1,
  },
  cardText: {
    color: "#040103",
    textAlign: "center",
    fontSize: 13,
    width: 75,
    fontFamily: "Rubik-Regular",
  },
  bootSheetCardView: {
    height: 126,
    width: 101,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 6,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
});
