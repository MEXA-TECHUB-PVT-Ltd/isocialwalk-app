import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import OtpInputs from "react-native-otp-inputs";
import { api } from "../../constants/api";
import Snackbar from "react-native-snackbar";

const Verification = ({ navigation, route }) => {
  let { email } = route?.params;

  const left_arrow = require("../../../assets/images/left-arrow.png");
  const [optCode, setOptCode] = useState("");
  const [invalidOTP, setInvalidOTP] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    console.log("verifying....");

    if (optCode.length < 4) {
      setInvalidOTP(true);
      setErrorMessage("You need to enter a verification code");
    } else if (optCode != route?.params?.code) {
      console.log("invalid code", optCode, route?.params?.code);

      setInvalidOTP(true);
      setErrorMessage("Invalid code");
    } else {
      setInvalidOTP(false);

      navigation?.replace("ChangePassword1", {
        email: email,
        code: optCode,
      });

      // setLoading(true);
      // var data = {
      //   email: email,
      //   code: optCode,
      // };
      // console.log("dat to pass api  :::", data);
      // var requestOptions = {
      //   method: "POST",
      //   body: JSON.stringify(data),
      //   redirect: "follow",
      // };
      // fetch(api.verify_otp, requestOptions)
      //   .then((response) => response.json())
      //   .then((result) => {
      //     console.log("result :::: in verification screen _____ ", result);
      //     if (result[0]) {
      //       if (result[0]?.error == false || result[0]?.error == "false") {
      //         // alert("verifed");
      //         // navigation.navigate("ChangePassword", {
      //         //   email,
      //         // });
      //         navigation.navigate("ChangePassword1", {
      //           email: email,
      //           code: optCode,
      //         });
      //       } else {
      //         setInvalidOTP(true);
      //         // setErrorMessage(result[0]?.messsage);
      //         setErrorMessage("Invalid Code");
      //       }
      //     }
      //   })
      //   .catch((error) => console.log("error", error))
      //   .finally(() => setLoading(false));
    }
  };
  const handleResendCode = () => {
    setOptCode("");
    setLoading(true);
    var data = {
      email: email,
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.otpverification, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("response :: ", result);
        if (result[0]) {
          if (result[0]?.error == false) {
            let message = `Verification code sent to ${email} successfully`;
            Snackbar.show({
              text: message,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            Snackbar.show({
              text: "Something went wrong.Code not sent",
              duration: Snackbar.LENGTH_SHORT,
            });
            // setIsInvalidEmail(true);
            // setErrorMessage(result[0]?.message);
          }
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => setLoading(false));
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerView}>
          <TouchableOpacity
            style={{ padding: 10, paddingLeft: 0 }}
            onPress={() => navigation?.goBack()}
          >
            <Image source={left_arrow} style={{ width: 14, height: 24 }} />
          </TouchableOpacity>
          <Text
            style={{
              color: "#000000",
              fontSize: 24,
              marginTop: 50,
              // fontWeight: 'bold',
              fontFamily: "Rubik-Bold",
            }}
          >
            Verify your account
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#000000",
              width: "75%",
              fontSize: 16,
              marginTop: 15,
              fontFamily: "Rubik-Regular",
            }}
          >
            A verification was sent to {email}
          </Text>
          <Text
            style={{
              color: "#000000",
              marginTop: 30,
              fontSize: 17,
              fontFamily: "Rubik-Regular",
            }}
          >
            Verification Code
          </Text>

          <OTPInputView
            style={{
              height: 50,
              marginTop: 15,
            }}
            pinCount={4}
            code={optCode}
            onCodeChanged={(code) => {
              setOptCode(code);
            }}
            autoFocusOnLoad={true}
            placeholderCharacter={""}
            placeholderTextColor={"#ABA7AF"}
            codeInputFieldStyle={{
              ...styles.underlineStyleBase,
              borderColor: invalidOTP ? "red" : "#CCC",
            }}
            codeInputHighlightStyle={{
              ...styles.underlineStyleHighLighted,
              borderColor: invalidOTP ? "red" : "#CCC",
            }}
          />
          {invalidOTP && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            disabled={loading}
            style={styles.btn}
            onPress={() => handleVerify()}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 17,
                fontFamily: "Rubik-Regular",
                marginRight: 5,
              }}
            >
              Verify Now
            </Text>
            {loading && <ActivityIndicator size={"small"} color={"#fff"} />}
          </TouchableOpacity>
          <Text
            style={{ color: "#000", fontSize: 15, fontFamily: "Rubik-Regular" }}
          >
            Didn't receive any code?
          </Text>
          <TouchableOpacity onPress={() => handleResendCode()}>
            <Text
              style={{
                color: "#38ACFF",
                fontWeight: "bold",
                fontSize: 14,
                fontFamily: "Rubik-Regular",
              }}
            >
              Re-send Code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    marginTop: 20,
  },

  underlineStyleBase: {
    color: "#000000",
    fontSize: 24,
    fontFamily: "Rubik-Bold",
    width: 60,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    marginHorizontal: 5,
  },

  underlineStyleHighLighted: {
    borderColor: "#CCC",
  },
  btn: {
    backgroundColor: "#38ACFF",
    marginTop: 30,
    marginBottom: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  errorText: {
    color: "#D66262",
    fontSize: 11,
    marginLeft: 10,
    marginTop: 3,
    fontFamily: "Rubik-Regular",
  },
});
