import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Share from "react-native-share";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import CustomBarChart from "../Reuseable Components/CustomBarChart";
import moment from "moment";
const SCREEN_WIDTH = Dimensions.get("window").width;

import { api } from "../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../Reuseable Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Summary = ({ navigation, route }) => {
  const [date, setDate] = useState("");
  const [steps, setSteps] = useState("0");
  const [calories, setCalories] = useState("0");
  const [distance, setDistance] = useState("0");
  const [time, setTime] = useState("00:00");
  const [percentage, setPercentage] = useState(0.0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // const data = [
  //   { label: "MON", percentage: "135.75%", value: 5430 },
  //   { label: "TUE", percentage: "155.95%", value: 6238 },
  //   { label: "WED", percentage: "153.20%", value: 6128 },
  //   { label: "THU", percentage: "221.22%", value: 8849 },
  //   { label: "FRI", percentage: "253.25%", value: 10130 },
  //   { label: "SAT", percentage: "223.57%", value: 8943 },
  //   { label: "SUN", percentage: "57.85%", value: 2314 },
  // ];

  useEffect(() => {
    if (route?.params) {
      console.log("route params", route?.params?.data);
      let date = route?.params?.data?.date;
      let calories_burnt = route?.params?.data?.calories_burnt;
      let distancecovered = route?.params?.data?.distancecovered;
      let time_taken = route?.params?.data?.time_taken;
      let steps1 = route?.params?.data?.steps;

      setDate(date);
      setCalories(calories_burnt);
      setDistance(distancecovered);
      setTime(time_taken);
      setSteps(steps1);
      //gettting history of week
      getHistoryOfWeek(route?.params?.data?.date);

      calculateStepsPerrcentage(route?.params?.data?.steps);
    }
  }, [route?.params]);

  const calculateStepsPerrcentage = async (today_steps) => {
    let daily_goal_steps = await getUserDailyGoal();

    today_steps = parseInt(today_steps);
    let daily_goal = parseInt(daily_goal_steps);
    let percentage = (today_steps / daily_goal) * 100;
    setPercentage(percentage?.toFixed(2));
  };

  const getHistoryOfWeek = async (selectedDate) => {
    let week_days_list = await getWeekOfSpecificDate(selectedDate);
    let start_date = week_days_list[0].date;
    let end_date = week_days_list[week_days_list.length - 1].date;
    console.log("start_date: ", start_date);
    console.log("end_date: ", end_date);

    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      user_id: user_id,
      date: end_date,
      sub_date: start_date,
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_btw_two_dates, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result[0]?.error == false || result[0]?.error == "false") {
          let responseList = result[0]?.History ? result[0]?.History : [];

          // let week_days_list = await getWeekDays();
          console.log("date :::::::::::::::::::::");
          let date1 = new Date("2022-12-01");

          console.log("week_days_list :::::::::::::::::::", week_days_list);

          let list = [];
          week_days_list?.forEach((element) => {
            let filter = responseList?.filter(
              (item) => item?.date == element?.date
            );
            // { label: "SUN", percentage: "57.85%", value: 2314 },
            let obj = {
              label: element?.name,
              percentage: "",
              value: filter[0]?.steps ? parseInt(filter[0]?.steps) : 0,
            };
            list.push(obj);
          });
          setData(list);
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

  //getting week of specific date
  const getWeekOfSpecificDate = async (current) => {
    return new Promise(async (resolve, reject) => {
      try {
        let daysList = [];
        current = new Date(current);

        var week = new Array();
        // Starting Monday not Sunday
        current.setDate(current.getDate() - current.getDay());
        // console.log("current :::::", current);
        for (var i = 0; i < 7; i++) {
          week.push(new Date(current));
          current.setDate(current.getDate() + 1);
          let obj = {
            name: moment(current).format("ddd"),
            date: moment(current).format("YYYY-MM-DD"),
          };
          daysList.push(obj);
        }
        console.log("daysList :::: ", daysList);
        resolve(daysList);
      } catch (error) {
        console.log("error  ::: ", error);
        resolve([]);
      }
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

  const handleShare = () => {
    const shareOptions = {
      title: "Share via",
      message: "React Doc Url",
      url: "https://reactjs.org/docs/getting-started.html",
    };

    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return (
    <ScrollView style={styles.container}>
      {loading && <Loader />}

      <View style={styles.headerView}>
        <TouchableOpacity
          style={{ padding: 10, paddingLeft: 0 }}
          onPress={() => navigation?.goBack()}
        >
          <Image
            source={require("../../assets/images/left-arrow.png")}
            style={{ width: 14, height: 22 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare()}>
          <Image
            source={require("../../assets/images/sharing.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Summary</Text>
      <View style={{ flex: 1 }}>
        <View style={styles.rowView}>
          {/* <Text style={styles.text}>Sun Feb 9-Sat Feb 15 ,2022</Text> */}
          <Text style={styles.text}>
            {date && moment(date).format("ddd,MMM DD,YYYY")}
          </Text>
          <Text
            style={{
              ...styles.text,
              color: "#38ACFF",
              fontSize: 15,
              fontFamily: "Rubik-Medium",
            }}
          >
            {/* 16189 Steps */}
            {steps} Steps
          </Text>
        </View>
        {/* google map */}
        {/* <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{height: 250, width: '100%'}}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}></MapView> */}

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <AnimatedCircularProgress
            rotation={360}
            size={150}
            width={6}
            // fill={80}
            fill={percentage}
            tintColor="#38ACFF"
            backgroundColor="#eee"
          >
            {(fill) => (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: "#38acff",
                    fontSize: 16,
                    fontFamily: "PlusJakartaDisplay-Bold",
                  }}
                >
                  {steps}
                </Text>
                <Text
                  style={{
                    color: "#000305",
                    fontSize: 11,
                    fontFamily: "PlusJakartaDisplay-Regular",
                  }}
                >
                  Total amount of steps
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
        <View>
          <View style={styles.SummaryCardView}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>{calories} kcal</Text>
              <View style={styles.rowView1}>
                <Image
                  source={require("../../assets/images/calories.png")}
                  style={{
                    marginRight: 5,
                    width: 11,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Calories</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>{distance} km</Text>

              <View style={styles.rowView1}>
                <Image
                  source={require("../../assets/images/man-walking.png")}
                  style={{
                    marginRight: 5,
                    width: 12,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Distance</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>{time} h</Text>
              <View style={styles.rowView1}>
                <Image
                  source={require("../../assets/images/clock.png")}
                  style={{
                    marginRight: 5,
                    width: 13,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Time</Text>
              </View>
            </View>
          </View>
          {/* <View style={styles.SummaryCardView}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>29293 kcal</Text>
              <View style={styles.rowView1}>
                <Image
                  source={require("../../assets/images/calories.png")}
                  style={{
                    marginRight: 5,
                    width: 11,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Calories</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>102.2 km</Text>

              <View style={styles.rowView1}>
                <Image
                  source={require("../../assets/images/man-walking.png")}
                  style={{
                    marginRight: 5,
                    width: 12,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Distance</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>34:56 h</Text>
              <View style={styles.rowView1}>
                <Image
                  source={require("../../assets/images/clock.png")}
                  style={{
                    marginRight: 5,
                    width: 13,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Time</Text>
              </View>
            </View>
          </View> */}
        </View>
        <View style={{}}>
          <CustomBarChart
            data={data}
            round={100}
            unit=""
            width={SCREEN_WIDTH - 20}
            height={250}
            barWidth={8}
            barRadius={6}
            barColor={"#38ACFF"}
            axisColor={"#838383"}
            paddingBottom={40}
            isMiddleLineVisible={true}
            isPercentageVisible={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Summary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    color: "#000000",
    fontSize: 23,
    marginTop: 10,
    fontFamily: "Rubik-Bold",
    paddingHorizontal: 20,
  },
  rowView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  SummaryCardView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  rowView1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 8,
  },
  textBlue: {
    color: "#38ACFF",
    fontSize: 16,
    fontFamily: "Rubik-Medium",
  },
  rowView1Text: {
    color: "#002138",
    fontSize: 10,
    fontFamily: "Rubik-Regular",
  },
  text: { color: "#000", fontFamily: "Rubik-Regular" },
});

// import React, {Component} from 'react';
// import {StyleSheet, View} from 'react-native';
// import {
//   LineChart,
//   BarChart,
//   AreaChart,
//   XAxis,
//   Grid,
// } from 'react-native-svg-charts';
// import {Svg, G, Line, Rect, Text} from 'react-native-svg';
// // import BarChart from '../Reuseable Components/BarChart';

// export default class Summary extends Component {
//   render() {
//     const data = [
//       {label: 'Jan', value: 500},
//       {label: 'Feb', value: 312},
//       {label: 'Mar', value: 424},
//       {label: 'Apr', value: 745},
//       {label: 'May', value: 89},
//       {label: 'Jun', value: 434},
//       {label: 'Jul', value: 650},
//       {label: 'Aug', value: 980},
//       {label: 'Sep', value: 123},
//       {label: 'Oct', value: 186},
//       {label: 'Nov', value: 689},
//       {label: 'Dec', value: 643},
//     ];
//     const data1 = [50, 10, 40, 95, 4, 24, 85, 91, 35, 53, 24, 50];
//     const data2 = [50, 10, 40, 95, 4, 35, 53, 24, 50];
//     const fill = 'rgb(134, 65, 244)';
//     return (
//       <View
//         style={{
//           // height: 200,
//           padding: 20,
//           flex: 1,
//           backgroundColor: 'pink',
//           justifyContent: 'center',
//         }}>
//         {/* <LineChart
//           style={{flex: 1}}
//           data={data1}
//           gridMin={0}
//           contentInset={{top: 10, bottom: 10}}
//           svg={{stroke: 'rgb(134, 65, 244)'}}>
//           <Grid />
//         </LineChart> */}
//         <BarChart
//           style={{height: 200, width: '100%'}}
//           data={data1}
//           svg={{fill: 'red', rx: 2}}
//           fill={'red'}
//           bandwidth={2}
//           animate={false}
//           cornerRadius={45}
//           spacingInner={0.8}
//           // yAccessor={({item}) => item.value}
//           // xAccessor={({item}) => 'item'}
//           stroke-linecap="round"
//           // contentInset={{top: 30, bottom: 30}}
//         >
//           <Grid />
//         </BarChart>
//         {/* <XAxis
//           // style={{marginHorizontal: -10}}
//           data={data1}
//           formatLabel={(value, index) => index}
//           contentInset={{left: 10, right: 10}}
//           svg={{fontSize: 10, fill: 'black'}}
//         /> */}
//         {/* <XAxis
//           style={{marginHorizontal: -10}}
//           data={data1}
//           formatLabel={(value, index) => index}
//           contentInset={{left: 10, right: 10}}
//           svg={{fontSize: 10, fill: 'black'}}
//         />
//         <XAxis
//           style={{marginHorizontal: -10}}
//           data={data1}
//           formatLabel={(value, index) => index}
//           contentInset={{left: 10, right: 10}}
//           svg={{fontSize: 10, fill: 'black'}}
//         />
//         <XAxis
//           style={{marginHorizontal: -10}}
//           data={data1}
//           formatLabel={(value, index) => index}
//           contentInset={{left: 10, right: 10}}
//           svg={{fontSize: 10, fill: 'black'}}
//         /> */}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
