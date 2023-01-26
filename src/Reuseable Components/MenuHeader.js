import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { captureScreen } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const MenuHeader = ({ navigation, title, titleStyle, onPress }) => {
  const menu = require("../../assets/images/menu1.png");

  const handleOpenDrawer = (navigation) => {
    captureScreen({
      format: "jpg",
    })
      .then((uri) => {
        AsyncStorage.setItem("Screen", uri.toString());
        navigation.openDrawer();
      })
      .catch((error) => console.log(error));
  };
  return (
    <View style={styles.headerView}>
      <Pressable
        style={{
          padding: 10,
          paddingLeft: 0,
          zIndex: 1,
        }}
        // onPress={() => navigation.openDrawer()}>
        // onPress={() => handleOpenDrawer(navigation)}>
        onPress={onPress}
      >
        <Image
          source={menu}
          style={{
            width: responsiveWidth(8),
            height: responsiveHeight(2),
            resizeMode: "stretch",
          }}
        />
      </Pressable>
      <Text
        style={{
          color: "#000000",
          textAlign: "center",
          flex: 1,
          fontSize: 25,
          fontFamily: "Rubik-Regular",
          ...titleStyle,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default MenuHeader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});
