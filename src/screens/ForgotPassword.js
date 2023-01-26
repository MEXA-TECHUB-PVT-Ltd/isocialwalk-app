import { style } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { api } from "../constants/api";
import Snackbar from "react-native-snackbar";
import axios from "react-native-axios";
const ForgotPassword = ({ navigation }) => {
  const left_arrow = require("../../assets/images/left-arrow.png");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "The email doesn't look right"
  );
  const handleSend = async () => {
    // navigation.navigate("Verification", {
    //   email: "test",
    //   code: "1312",
    // });

    // return;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setIsInvalidEmail(true);
      setErrorMessage("The email doesn't look right");
    } else if (email?.length === 0) {
      setIsInvalidEmail(true);
      setErrorMessage("The email doesn't look right");
    } else {
      setIsInvalidEmail(false);
      setLoading(true);
      var data = {
        email: email,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.forgetpassword, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("response :: ", result);
          if (result[0]) {
            if (
              result[0]?.error == false ||
              typeof result[0]?.code != "undefined"
            ) {
              navigation.navigate("Verification", {
                // email: result[0]?.sentto,
                email: email,
                code: result[0]?.code,
              });
              let message = `Verification email sent to ${result[0]?.sentto} successfully`;
              Snackbar.show({
                text: message,
                duration: Snackbar.LENGTH_SHORT,
              });
            } else {
              setIsInvalidEmail(true);
              setErrorMessage(result[0]?.message);
            }
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.Please try again.",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    }
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerView}>
          <TouchableOpacity
            style={{
              padding: 10,
              paddingLeft: 0,
              width: 30,
            }}
            onPress={() => navigation?.goBack()}
          >
            <Image source={left_arrow} style={{ width: 14, height: 24 }} />
          </TouchableOpacity>
          <Text
            style={{
              color: "#000000",
              fontSize: 24,
              marginTop: 40,
              // fontWeight: 'bold',
              fontFamily: "Rubik-Bold",
            }}
          >
            Forgot Password
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              marginTop: 8,
              fontFamily: "Rubik-Regular",
            }}
          >
            Please Provide your account email so that we can send password reset
            code
          </Text>
          <View style={styles.textInputView}>
            <Text
              style={{
                color: "#000",
                marginVertical: 10,
                fontFamily: "Rubik-Regular",
              }}
            >
              Email Address
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: isInvalidEmail ? "#D66262" : "#ccc",
              }}
              placeholder={"Enter your Email"}
              value={email}
              onChangeText={(txt) => setEmail(txt)}
            />
            {isInvalidEmail && (
              <Text
                style={{
                  color: "#D66262",
                  fontSize: 10,
                  marginLeft: 10,
                  marginTop: 3,
                  fontFamily: "Rubik-Regular",
                }}
              >
                {errorMessage}
              </Text>
            )}
          </View>

          <TouchableOpacity
            disabled={loading}
            style={styles.btn}
            onPress={() => handleSend()}
          >
            <Text style={styles.btnText}>Send Password Reset Code</Text>
            {loading && <ActivityIndicator size={"small"} color={"#fff"} />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    marginTop: 20,
  },
  textInputView: {
    marginVertical: 15,
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
    marginTop: 30,
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    flexDirection: "row",
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    marginRight: 5,
  },
});
