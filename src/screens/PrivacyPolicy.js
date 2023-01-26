import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
} from "react-native";
import MenuHeader from "../Reuseable Components/MenuHeader";
import { api } from "../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../Reuseable Components/Loader";

const PrivacyPolicy = ({
  navigation,
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
}) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    getPrivacyPolicy();
    chkDate();
  }, []);

  const chkDate = () => {
    if (new Date() >= new Date()) {
      console.log("both are equals");
    } else {
      console.log("not matching date");
    }
  };

  const getPrivacyPolicy = async () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(api.get_privacy_policy, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        if (result?.error == false || result?.error == "false") {
          let privacyText = result["Privacy    "][0]?.privacytext
            ? result["Privacy    "][0]?.privacytext
            : "";
          setText(privacyText);
        } else {
          Snackbar.show({
            text: "No Record found",
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
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MenuHeader
            title={"Privacy Policy"}
            navigation={navigation}
            onPress={() => handleOpenCustomDrawer()}
          />
          {loading && <Loader />}
          <View style={{ marginVertical: 15 }}>
            <Text style={styles.text}>{text}</Text>
            {/* <Text style={styles.text}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
            <Text style={styles.text}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
            <Text style={styles.text}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
            <Text style={styles.text}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text> */}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
    marginBottom: 8,
  },
});
