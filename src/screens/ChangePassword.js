import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  ScrollView,
} from "react-native";
import {
  toast,
  Toasts,
  ToastPosition,
} from "@backpackapp-io/react-native-toast";
import MenuHeader from "../Reuseable Components/MenuHeader";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { api } from "../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../Reuseable Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Entypo from "react-native-vector-icons/Entypo";

const ChangePassword = ({
  navigation,
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
}) => {
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [invalidOldPassword, setInvalidOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInvalidConfirmPassword, setIsInvalidConfirmPassword] =
    useState(false);

  const [confirmPassErrorMSG, setConfirmPassErrorMSG] = useState("");

  const [isoldPasswordVisible, setIsoldPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

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

  const handleUpdate = async () => {
    console.log("update......");
    setInvalidOldPassword(false);
    setIsInvalidPassword(false);
    setIsInvalidConfirmPassword(false);
    if (oldPassword.length == 0) {
      setInvalidOldPassword(true);
    } else if (password.length === 0) {
      setIsInvalidPassword(true);
    } else if (confirmPassword.length === 0) {
      setIsInvalidConfirmPassword(true);
      setConfirmPassErrorMSG(
        "Enter a password with a cap, small letter, symbol and a number"
      );
    } else if (password !== confirmPassword) {
      console.log("password and confirm password not matchedrd....");
      setIsInvalidConfirmPassword(true);
      setConfirmPassErrorMSG("New Password and confirm password not matched.");
    } else {
      console.log("old password :::: ", oldPassword);
      console.log("new password :::: ", password);
      setIsInvalidPassword(false);
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        console.log("logged in user id :: ", user_id);
        setLoading(true);
        let data = {
          id: user_id,
          oldpassword: oldPassword,
          password: password,
        };
        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };

        fetch(api.updatepassword, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("result   : :  ", result);
            if (result[0]?.error == true || result[0]?.error == "true") {
              Snackbar.show({
                text: result[0]?.message,
                duration: Snackbar.LENGTH_SHORT,
              });
            } else {
              Snackbar.show({
                text: "Password Updated Successfully",
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          })
          .catch((error) => console.log("error", error))
          .finally(() => setLoading(false));
      } catch (error) {
        console.log("error :", error);
        setLoading(false);
      }

      // toast.dismiss();
      // toast('Password Update was a Success', {
      //   position: ToastPosition.BOTTOM,
      //   duration: 2000,
      //   customToast: toast => {
      //     return (
      //       <View
      //         style={{
      //           height: toast.height,
      //           // width: toast.width,
      //           padding: 15,
      //           backgroundColor: '#28a745',
      //           borderRadius: 8,
      //           justifyContent: 'center',
      //           alignItems: 'center',
      //           // alignSelf: 'center',
      //           position: 'absolute',
      //           left: wp(13),
      //           // right: 0,
      //         }}>
      //         <Text style={{color: '#fff'}}>{toast.message}</Text>
      //       </View>
      //     );
      //   },
      // });
    }
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
        >
          <Toasts />
          {loading && <Loader />}
          <MenuHeader
            title={"Change Password"}
            navigation={navigation}
            onPress={() => handleOpenCustomDrawer()}
          />
          <View style={{ flex: 1, marginTop: 30 }}>
            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}> Old Password</Text>
              <View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: invalidOldPassword ? "#D66262" : "#ccc",
                  }}
                  autoFocus
                  placeholder={"Enter Old Password"}
                  value={oldPassword}
                  secureTextEntry={!isoldPasswordVisible}
                  onChangeText={(txt) => setOldPassword(txt)}
                />

                <TouchableOpacity
                  onPress={() => setIsoldPasswordVisible(!isoldPasswordVisible)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                  }}
                >
                  <Entypo
                    name={isoldPasswordVisible ? "eye" : "eye-with-line"}
                    color={"#000"}
                    size={20}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>
              {invalidOldPassword && (
                <Text style={styles.errorText}>
                  Enter a password with a cap, small letter, symbol and a number
                </Text>
              )}
            </View>

            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}> New Password</Text>
              <View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: isInvalidPassword ? "#D66262" : "#ccc",
                  }}
                  placeholder={"Enter New Password"}
                  value={password}
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={(txt) => setPassword(txt)}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                  }}
                >
                  <Entypo
                    name={isPasswordVisible ? "eye" : "eye-with-line"}
                    color={"#000"}
                    size={20}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>
              {isInvalidPassword && (
                <Text style={styles.errorText}>
                  Enter a password with a cap, small letter, symbol and a number
                </Text>
              )}
            </View>

            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}> Confirm Password</Text>
              <View>
                <TextInput
                  style={{
                    ...styles.textInput,
                    borderColor: isInvalidConfirmPassword ? "#D66262" : "#ccc",
                  }}
                  placeholder={"Enter Confirm Password"}
                  value={confirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                  onChangeText={(txt) => setConfirmPassword(txt)}
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                  }}
                >
                  <Entypo
                    name={isConfirmPasswordVisible ? "eye" : "eye-with-line"}
                    color={"#000"}
                    size={20}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>

              {isInvalidConfirmPassword && (
                <Text style={styles.errorText}>{confirmPassErrorMSG}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.btn} onPress={() => handleUpdate()}>
              <Text style={styles.btnText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#D66262",
    fontSize: 10,
    marginLeft: 10,
    marginTop: 3,
    fontFamily: "Rubik-Regular",
  },
  textInputView: {
    marginVertical: 15,
  },
  textInputHeading: {
    color: "#000",
    marginVertical: 7,
    fontFamily: "Rubik-Regular",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: "#38ACFF",
    marginTop: 20,
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
  },
});
