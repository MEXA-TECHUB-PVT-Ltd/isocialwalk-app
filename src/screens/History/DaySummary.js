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
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import CustomBarChart from "../../Reuseable Components/CustomBarChart";

const SCREEN_WIDTH = Dimensions.get("window").width;

const DaySummary = ({ navigation, route }) => {
  const data = [
    { label: "MON", percentage: "135.75%", value: 5430 },
    { label: "TUE", percentage: "155.95%", value: 6238 },
    { label: "WED", percentage: "153.20%", value: 6128 },
    { label: "THU", percentage: "221.22%", value: 8849 },
    { label: "FRI", percentage: "253.25%", value: 10130 },
    { label: "SAT", percentage: "223.57%", value: 8943 },
    { label: "SUN", percentage: "57.85%", value: 2314 },
  ];

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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerView}>
        <TouchableOpacity
          style={{ padding: 10, paddingLeft: 0 }}
          onPress={() => navigation?.goBack()}
        >
          <Image
            source={require("../../../assets/images/left-arrow.png")}
            style={{ width: 14, height: 22 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare()}>
          <Image
            source={require("../../../assets/images/sharing.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Summary</Text>
      <View style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <Text style={styles.text}>Sunday, Feb 9,2022</Text>
          <Text
            style={{
              ...styles.text,
              color: "#38ACFF",
              fontSize: 15,
              fontFamily: "Rubik-Medium",
            }}
          >
            16189 Steps
          </Text>
        </View>
        {/* google map */}
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ height: 230, width: "100%" }}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Polyline
            coordinates={[
              { latitude: 37.8025259, longitude: -122.4351431 },
              { latitude: 37.7896386, longitude: -122.421646 },
              { latitude: 37.7665248, longitude: -122.4161628 },
              { latitude: 37.7734153, longitude: -122.4577787 },
            ]}
            strokeColor="#38ACFF" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={5}
          />
        </MapView>
        <View style={styles.SummaryCardView}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.textBlue}>890 kcal</Text>
            <View style={styles.rowView1}>
              <Image
                source={require("../../../assets/images/calories.png")}
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
            <Text style={styles.textBlue}>12.2 km</Text>

            <View style={styles.rowView1}>
              <Image
                source={require("../../../assets/images/man-walking.png")}
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
            <Text style={styles.textBlue}>5:10 h</Text>
            <View style={styles.rowView1}>
              <Image
                source={require("../../../assets/images/clock.png")}
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
            width={8}
            fill={80}
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
                  16189
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
              <Text style={styles.textBlue}>1.72 km</Text>
              <View style={styles.rowView1}>
                <Image
                  source={require("../../../assets/images/speed.png")}
                  style={{
                    marginRight: 5,
                    width: 11,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Avg Speed</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>2'4 /km</Text>

              <View style={styles.rowView1}>
                <Image
                  source={require("../../../assets/images/road.png")}
                  style={{
                    marginRight: 5,
                    width: 12,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Avg Pace</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textBlue}>57.85%</Text>
              <View style={styles.rowView1}>
                <Image
                  source={require("../../../assets/images/finish.png")}
                  style={{
                    marginRight: 5,
                    width: 13,
                    height: 15,
                    resizeMode: "contain",
                  }}
                />
                <Text style={styles.rowView1Text}>Target Prfm</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{}}>
          <Text style={{ ...styles.text, paddingHorizontal: 20 }}>
            Comparison with week
          </Text>
          <CustomBarChart
            data={data}
            round={100}
            unit="k"
            width={SCREEN_WIDTH - 20}
            height={250}
            barWidth={8}
            barRadius={6}
            barColor={"#38ACFF"}
            axisColor={"#838383"}
            paddingBottom={40}
            isMiddleLineVisible={true}
            isPercentageVisible={false}
          />
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Summary")}
        >
          <Text style={{ ...styles.text, color: "#fff" }}>
            Week Performance
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DaySummary;

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
  btn: {
    backgroundColor: "#38ACFF",
    marginBottom: 40,
    width: "60%",
    alignSelf: "center",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  text: { color: "#000", fontSize: 16, fontFamily: "Rubik-Regular" },
});
