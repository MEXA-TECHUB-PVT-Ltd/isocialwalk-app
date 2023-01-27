import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import RadioButtonRN from "radio-buttons-react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import AntDesign from "react-native-vector-icons/AntDesign";
import MenuHeader from "../../Reuseable Components/MenuHeader";

import { api } from "../../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../../Reuseable Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const History = ({ scale, showMenu, setShowMenu, moveToRight }) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPress, setIsPress] = useState(false); //to avoid calling api when bottom sheet open

  const handleOpenCustomDrawer = () => {
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
    setShowMenu(!showMenu);
  };
  const data = [
    {
      id: 1,
      label: "Last 1 Day",
      value: "1",
    },
    {
      id: 2,
      label: "Last 7 Days",
      value: "7",
    },
    {
      id: 3,
      label: "Last 14 Days",
      value: "14",
    },
    {
      id: 4,
      label: "Last 30 Days",
      value: "30",
    },
    {
      id: 5,
      label: "Last 60 Days",
      value: "60",
    },
    {
      id: 6,
      label: "Last 90 Days",
      value: "90",
    },
  ];
  const [historyList, setHistoryList] = useState([
    // {
    //   id: 0,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 1,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 2,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 3,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 4,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 5,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 6,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 6,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
    // {
    //   id: 7,
    //   date: "Sun,Feb 9 ,2020",
    //   calories: "738kcal",
    //   distance: "12.2km",
    //   time: "5:20h",
    // },
  ]);
  useEffect(() => {
    let lastDay_date = moment().subtract("1", "days").format("YYYY-MM-DD");
    setLoading(true);
    getHistoryOfSpecificDate(lastDay_date);
  }, []);

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
      .then((result) => {
        console.log("history  list :::: ", result);
        if (result[0]?.error == false || result[0]?.error == "false") {
          let responseList = result[0]?.History ? result[0]?.History : [];
          let list = [];
          if (responseList?.length > 0) {
            responseList.forEach((element) => {
              let obj = {
                id: element?.id,
                user_id: element?.user_id,
                calories_burnt: element?.calories_burnt,
                distancecovered: element?.distancecovered,
                time_taken: element?.time_taken,
                avg_speed: element?.avg_speed,
                avg_pace: element?.avg_pace,
                date: element?.date,
                steps: element?.steps,
                weekly_steps_id: element?.weekly_steps_id,
              };
              list.push(obj);
            });
          } else {
            // Snackbar.show({
            //   text: "No Record Found.",
            //   duration: Snackbar.LENGTH_SHORT,
            // });
          }
          setHistoryList(list);
        } else {
          // Snackbar.show({
          //   text: result[0]?.message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        console.log("error  ::: ", error);
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

  const getHistoryBetweenTwoSpecificDate = async (startDate, endDate) => {
    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      user_id: user_id,
      date: endDate,
      sub_date: startDate,
    };
    console.log("data pass  :: ", data);
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.get_history_btw_two_dates, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("history  list :::: ", result);
        if (result[0]?.error == false || result[0]?.error == "false") {
          let responseList = result[0]?.History ? result[0]?.History : [];
          let list = [];
          if (responseList?.length > 0) {
            responseList.forEach((element) => {
              let obj = {
                id: element?.id,
                user_id: element?.user_id,
                calories_burnt: element?.calories_burnt,
                distancecovered: element?.distancecovered,
                time_taken: element?.time_taken,
                avg_speed: element?.avg_speed,
                avg_pace: element?.avg_pace,
                date: element?.date,
                steps: element?.steps,
                weekly_steps_id: element?.weekly_steps_id,
              };
              list.push(obj);
            });
          } else {
            // Snackbar.show({
            //   text: "No Record Found.",
            //   duration: Snackbar.LENGTH_SHORT,
            // });
          }
          setHistoryList(list);
        } else {
          // Snackbar.show({
          //   text: result[0]?.message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
        }
      })
      .catch((error) => {
        console.log("error  ::: ", error);
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

  const EmptyHistoryView = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image source={require("../../../assets/images/history1.png")} />
        <Text
          style={{
            width: 189,
            textAlign: "center",
            fontSize: 16,
            color: "#000000",
            marginVertical: 20,
          }}
        >
          All your Historical Records will appear here
        </Text>
      </View>
    );
  };

  const handleRadioButtonSelect = (e) => {
    setIsPress(false);
    if (!isPress) {
      // isPress is false when user pressed on any bottom to get history i.e, last 7 days etc
      setSelectedDay(e.value);
      setSelectedDayIndex(e.id);
      bottomSheetRef?.current?.close();
      let previousDate = moment()
        .subtract(e.value, "days")
        .format("YYYY-MM-DD");
      let todayDate = moment(new Date()).format("YYYY-MM-DD");
      if (e.value == "1") {
        //getting last one day history
        //handle last 1 day selection
        let lastDay_date = moment().subtract("1", "days").format("YYYY-MM-DD");
        getHistoryOfSpecificDate(lastDay_date);
      } else {
        //handle last 7,14,30,60 and 9 days selection with this method
        getHistoryBetweenTwoSpecificDate(previousDate, todayDate);
      }
    }
  };

  const handlePullRefresh = () => {
    setIsRefreshing(!isRefreshing);
    setLoading(false);

    let lastDay_date = moment().subtract("1", "days").format("YYYY-MM-DD");

    getHistoryOfSpecificDate(lastDay_date);
  };
  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "white",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: showMenu ? 15 : 0,
        transform: [{ scale: scale }, { translateX: moveToRight }],
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
          <MenuHeader
            title={"History"}
            navigation={navigation}
            onPress={() => handleOpenCustomDrawer()}
          />
          {loading && <Loader />}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 16,
              }}
            >
              {selectedDay} Days History
            </Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef?.current?.open();
                setIsPress(true);
              }}
              style={{
                backgroundColor: "#002138",
                padding: 5,
                paddingVertical: 10,
                borderRadius: 4,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 14 }}>
                Last {selectedDay} Days{" "}
              </Text>
              <AntDesign name="down" size={15} color={"#fff"} />
            </TouchableOpacity>
          </View>
          {loading ? null : (
            <View style={{ flex: 1 }}>
              {historyList.length === 0 ? (
                <EmptyHistoryView />
              ) : (
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={historyList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item) => {
                    return (
                      <TouchableOpacity
                        // onPress={() => {
                        //   selectedDay == "1"
                        //     ? navigation.navigate("DaySummary")
                        //     : navigation.navigate("Summary");
                        // }}
                        onPress={() =>
                          navigation.navigate("Summary", {
                            data: item?.item,
                          })
                        }
                        style={styles.cardView}
                      >
                        <Text style={{ ...styles.cardText, color: "#38ACFF" }}>
                          {/* {item.item.date} */}

                          {/* "Sun,Feb 9 ,2020" */}

                          {item?.item?.date &&
                            moment(item?.item?.date).format("ddd,MMM DD,YYYY")}
                        </Text>
                        {/* <Text style={styles.cardText}>{item.item.calories}</Text>
                      <Text style={styles.cardText}>{item.item.distance}</Text>
                      <Text style={styles.cardText}>{item.item.time}</Text> */}
                        <Text style={styles.cardText}>
                          {item?.item?.calories_burnt}kcal
                        </Text>
                        <Text style={styles.cardText}>
                          {item?.item?.distancecovered}km
                        </Text>
                        <Text style={styles.cardText}>
                          {item?.item?.time_taken} h
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
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
                    // height: 530,
                    height: 780,
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
                  History Period
                </Text>
                <ScrollView style={{ flex: 1, width: 400 }}>
                  <RadioButtonRN
                    data={data}
                    selectedBtn={(e) => {
                      console.log("e__________________", e);
                      handleRadioButtonSelect(e);
                    }}
                    initial={selectedDayIndex}
                    style={{ width: "80%", marginLeft: 60, marginTop: 10 }}
                    circleSize={12}
                    // deactiveColor={'#ccc'}
                    // boxDeactiveBgColor={'red'}
                    boxStyle={{
                      marginBottom: -10,
                      backgroundColor: "tranparent",
                      borderWidth: 0,
                    }}
                  />
                </ScrollView>
              </RBSheet>
            </View>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  cardView: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    shadowColor: "blue",
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.48,
    shadowRadius: 0.5,
    elevation: 3,
    padding: 10,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cardText: {
    color: "#000",
  },
});
