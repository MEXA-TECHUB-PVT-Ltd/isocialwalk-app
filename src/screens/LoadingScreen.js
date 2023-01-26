import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import Loader from "../Reuseable Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    let user = await AsyncStorage.getItem("user");

    if (user === null) {
      setLoading(false);
      navigation.replace("Welcome");
    } else {
      setLoading(false);
      navigation.replace("DrawerTest");
    }
  };
  useEffect(() => {
    // setTimeout(() => {
    getUser();
    // }, 2000);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/launch_screen.png")}
      style={{
        flex: 1,
        backgroundColor: "#38ACFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <StatusBar backgroundColor={"#38ACFF"} translucent /> */}

      <StatusBar translucent backgroundColor="transparent" />

      {/* {loading && <Loader />} */}

      {/* <Image
        source={require("../../assets/images/logo.png")}
        style={{ width: "65%", resizeMode: "contain" }}
      /> */}
    </ImageBackground>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
