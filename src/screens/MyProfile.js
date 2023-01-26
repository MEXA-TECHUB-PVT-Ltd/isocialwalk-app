import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import MenuHeader from "../Reuseable Components/MenuHeader";

import RBSheet from "react-native-raw-bottom-sheet";
// import Slider from 'react-native-slider';
// var Slider = require('react-native-slider');
// import Slider from '@react-native-community/slider';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { api } from "../constants/api";
import Loader from "../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { ScrollView } from "react-native-gesture-handler";

import { BASE_URL_Image } from "../constants/Base_URL_Image";
import { useDispatch, useSelector } from "react-redux";

import RNFetchBlob from "rn-fetch-blob";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const MyProfile = ({ scale, showMenu, setShowMenu, moveToRight }) => {
  const navigation = useNavigation();

  const rbsheet_Ref = useRef(null);
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [isImageChange, setIsImageChange] = useState(false);

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "This email doesn't look right"
  );

  const [inValidPhoneNo, setinValidPhoneNo] = useState(false);
  const [invalidFirstName, setInvalidFirstName] = useState(false);
  const [invalidLastName, setInvalidLastName] = useState(false);

  const [image_to_upload, setImage_to_upload] = useState(null);

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

  const getSpecificUserDetail = async (id) => {
    setLoading(true);
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
          // console.log('result :: ', result);
          // setSelected_friend_id(id);
          // setSelected_friend_name(result[0]?.first_name);
          // setSelected_friend_profile(result[0]['profile image']);
          // bottomSheetRef?.current?.open();
          setFirstName(result[0]?.first_name);
          setLastName(result[0]?.last_name);
          setPhoneNo(result[0]?.phoneno);

          let profile = result[0]["profile image"]
            ? BASE_URL_Image + "/" + result[0]["profile image"]
            : "";
          setProfileImage(profile);
          setIsImageChange(true);
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
  };
  const getUser = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    setUserId(user_id);
    getSpecificUserDetail(user_id);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [])
  );

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
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {loading && <Loader />}
          {/* <MenuHeader title={'Update Goals'} navigation={navigation} /> */}
          <MenuHeader
            title={"My Profile"}
            titleStyle={{ position: "absolute", left: 0, right: 0 }}
            navigation={navigation}
            onPress={() => handleOpenCustomDrawer()}
          />

          <View style={{ marginVertical: 10, alignItems: "center" }}>
            <View style={{ position: "relative", left: 0, right: 0 }}>
              {profileImage == null || profileImage == "" ? (
                <Image
                  source={require("../../assets/images/friend-profile.png")}
                  style={{
                    marginVertical: 10,
                    height: 110,
                    width: 123,
                    borderRadius: 10,
                    backgroundColor: "#ccc",
                  }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    marginVertical: 10,
                    height: 110,
                    width: 123,
                    borderRadius: 10,
                    backgroundColor: "#ccc",
                  }}
                />
              )}
            </View>
          </View>
          <View>
            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}>First Name</Text>
              <View style={{ ...styles.textInput, padding: 12 }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {firstName}
                </Text>
              </View>
            </View>

            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}>Last Name</Text>
              <View style={{ ...styles.textInput, padding: 12 }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {lastName}
                </Text>
              </View>
            </View>

            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}>Phone No.</Text>
              <View style={{ ...styles.textInput, padding: 12 }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {phoneNo}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ ...styles.btn, marginBottom: 10, marginTop: 40 }}
              //   onPress={() => handleUpdateProfile()}
              onPress={() => navigation?.navigate("UpdateProfile")}
            >
              <Text style={styles.btnText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.btn,
                marginTop: 0,
                width: 180,
                alignSelf: "center",
                backgroundColor: "transparent",
                // backgroundColor: "red",
              }}
              onPress={() => navigation.navigate("ChangePassword2")}
            >
              <Text style={{ ...styles.btnText, color: "#000" }}>
                Change Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  textInputView: {
    marginVertical: 12,
  },
  textInputHeading: {
    color: "#000000",
    fontSize: 17,
    marginVertical: 5,
    marginBottom: 15,
    fontFamily: "Rubik-Regular",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 9,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: "#38acff",
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: { color: "#ffffff", fontSize: 17, fontFamily: "Rubik-Regular" },
  errorText: {
    color: "#D66262",
    fontSize: 12,
    marginLeft: 10,
    marginTop: 3,
    fontFamily: "Rubik-Regular",
  },
});
