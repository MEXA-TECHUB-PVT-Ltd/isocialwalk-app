import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const AccountCreated = ({ navigation }) => {
  const left_arrow = require("../../../assets/images/left-arrow.png");
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity
          style={{ padding: 10, paddingLeft: 0 }}
          onPress={() => navigation?.goBack()}
        >
          <Image source={left_arrow} style={{ width: 14, height: 24 }} />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          color: "#000000",
          fontSize: 18,
          fontFamily: "Rubik-Regular",
        }}
      >
        Your Account has been created
      </Text>
      <Text
        style={{ color: "#838383", fontSize: 14, fontFamily: "Rubik-Regular" }}
      >
        We created an account for you
      </Text>
      <TouchableOpacity
        style={styles.btn}
        // onPress={() => navigation.navigate('TabNavigation')}
        onPress={() => navigation.navigate("DrawerTest")}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 17,
            fontFamily: "Rubik-Regular",
          }}
        >
          Proceed to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountCreated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#38ACFF",
    marginTop: 30,
    marginBottom: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    width: "56%",
  },
  headerView: {
    marginTop: 20,
    position: "absolute",
    top: 0,
    left: 20,
  },
});
