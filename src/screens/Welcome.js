import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import SwiperFlatList, { Pagination } from "react-native-swiper-flatlist";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const Welcome = ({ navigation }) => {
  const [data, setData] = useState([
    {
      id: 0,
      image: require("../../assets/images/onboarding1.png"),
      title: "Track your steps",
      description:
        "Auto tracks your daily steps,burned  calories walking distance, duration,  pace and health data",
    },
    {
      id: 1,
      image: require("../../assets/images/onboarding2.png"),
      title: "Compete with Friends and Participate in Challenges",
      description:
        "Enter challenges and go up against family and friends and win rewards and achievements badges",
    },
    {
      id: 2,
      image: require("../../assets/images/onboarding3.png"),
      title: "Join Groups and Chat",
      description:
        "Intract, create groups, make new friends, chat with existing ones and cheer your everyone on",
    },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 0.8,
          paddingVertical: 20,
        }}
      >
        <SwiperFlatList
          //  autoplay
          // autoplayLoop
          // autoplayInvertDirection
          // disableGesture
          // index={activeIndex}
          // onMomentumScrollEnd={item => setActiveIndex(0)}
          autoplayLoopKeepAnimation
          showPagination
          data={data}
          paginationDefaultColor={"#7cb9e6"}
          paginationActiveColor={"#38ACFF"}
          paginationStyleItemInactive={{
            marginHorizontal: 6,
          }}
          paginationStyleItemActive={{
            marginHorizontal: 6,
          }}
          paginationStyleItem={{
            height: 9,
            width: 9,
            // margin: 0,
          }}
          // PaginationComponenet={props => {
          //   return (
          //     <Pagination
          //       {...props}
          //       paginationStyle={styles.paginationContainer}
          //       paginationStyleItem={styles.pagination}
          //       paginationDefaultColor="#7cb9e6"
          //       paginationActiveColor="#38ACFF"
          //     />
          //   );
          // }}
          renderItem={({ item }) => (
            <View
              style={{
                width: SCREEN_WIDTH,
                alignItems: "center",
                alignSelf: "flex-end",
                marginBottom: 15,
              }}
            >
              <View>
                <Image
                  source={item.image}
                  style={{
                    alignSelf: "center",
                    width: SCREEN_WIDTH - 50,
                    marginBottom: 20,
                  }}
                  resizeMode={"contain"}
                />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>
      <View style={{ flex: 0.3, justifyContent: "center" }}>
        <TouchableOpacity
          style={{ ...styles.btn }}
          onPress={() => navigation.replace("AuthScreen")}
        >
          <Text style={{ color: "#FFF", fontSize: 16 }}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  title: {
    color: "#65BEFF",
    fontSize: 18,
    width: 250,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Rubik-Bold",
  },
  description: {
    textAlign: "center",
    marginTop: 20,
    color: "#838383",
    width: 250,
    fontFamily: "Rubik-Regular",
  },
  paginationContainer: {
    top: 0,
  },
  pagination: {
    borderRadius: 2,
    backgroundColor: "red",
  },
  btn: {
    backgroundColor: "#38ACFF",
    marginBottom: 40,
    height: 50,
    width: "88%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    alignSelf: "center",
  },
});
