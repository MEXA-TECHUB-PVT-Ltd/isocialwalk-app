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

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import MenuHeader from "../../Reuseable Components/Header";
import { api } from "../../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../../Reuseable Components/Loader";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Entypo from "react-native-vector-icons/Entypo";

const ChangePassword1 = ({ navigation, route }) => {
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInvalidConfirmPassword, setIsInvalidConfirmPassword] =
    useState(false);

  const [confirmPassErrorMSG, setConfirmPassErrorMSG] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleUpdate1 = async () => {
    console.log("update......");

    setIsInvalidPassword(false);
    setIsInvalidConfirmPassword(false);
    if (password.length === 0) {
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
      console.log("new password :::: ", password);
      setIsInvalidPassword(false);
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        console.log("logged in user id :: ", user_id);
        setLoading(true);
        let data = {
          code: route?.params?.code,
          email: route?.params?.email,
          newpass: password,
          confirmpass: confirmPassword,
        };
        console.log(
          "data  pass to verify email and change password  ::: ",
          data
        );
        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };

        fetch(api.changePassword, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("result  change password 1 screen : :  ", result);
            if (result[0]?.error == false || result[0]?.error == "false") {
              Snackbar.show({
                text: "Password Updated Successfully",
                duration: Snackbar.LENGTH_SHORT,
              });
              navigation?.replace("AuthScreen");
            } else {
              Snackbar.show({
                text: result[0]?.messsage,
                duration: Snackbar.LENGTH_SHORT,
              });
              navigation?.goBack();
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

  const handleUpdate = async () => {
    console.log("update......");

    setIsInvalidPassword(false);
    setIsInvalidConfirmPassword(false);
    if (password.length === 0) {
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
      console.log("new password :::: ", password);
      setIsInvalidPassword(false);
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        console.log("logged in user id :: ", user_id);
        setLoading(true);
        let data = {
          // code: route?.params?.code,
          // email: route?.params?.email,
          // newpass: password,
          // confirmpass: confirmPassword,
          email: route?.params?.email,
          newpass: password,
          confirmpass: confirmPassword,
        };
        console.log(
          "data  pass to verify email and change password  ::: ",
          data
        );

        console.log(" url ::::::: ", api.forget_change_password);

        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };

        fetch(api.forget_change_password, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result[0]?.error == false || result[0]?.error == "false") {
              Snackbar.show({
                text: "Password Updated Successfully",
                duration: Snackbar.LENGTH_SHORT,
              });
              navigation?.replace("AuthScreen");
            } else {
              Snackbar.show({
                text: result[0]?.messsage,
                duration: Snackbar.LENGTH_SHORT,
              });
              navigation?.goBack();
            }
          })
          .catch((error) => {
            Snackbar.show({
              text: "Something went wrong, please try again",
              duration: Snackbar.LENGTH_SHORT,
            });
          })
          .finally(() => setLoading(false));
      } catch (error) {
        Snackbar.show({
          text: "Something went wrong, please try again",
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Toasts />
      {loading && <Loader />}
      <MenuHeader
        title={"Change Password"}
        navigation={navigation}
        onPress={() => handleOpenCustomDrawer()}
      />
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View style={{ flex: 1, marginTop: 30 }}>
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
            <Text style={styles.btnText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword1;

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
