import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import Header from "../../Reuseable Components/Header";
import Clipboard from "@react-native-clipboard/clipboard";

const ShareableInvitationLink = ({ navigation }) => {
  const [invitationLink, setInvitationLink] = useState(
    "https://i.socialwalk/3OeO6ik"
  );
  const handleonCopyPress = () => {
    Clipboard.setString(invitationLink);
    ToastAndroid.show("Invitation Link Copied", ToastAndroid.SHORT);
  };
  return (
    <View style={styles.container}>
      <Header title={"Shareable Invitation Link"} navigation={navigation} />
      <Text
        style={{
          color: "#000000",
          fontSize: 18,
          marginTop: 45,
          fontFamily: "Rubik-Regular",
        }}
      >
        Invitation Link
      </Text>
      <Text
        style={{
          marginVertical: 20,
          color: "#4c9de0",
          fontSize: 16,
          fontFamily: "Rubik-Regular",
        }}
      >
        {invitationLink}
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => handleonCopyPress()}>
        <Text
          style={{ color: "#FFF", fontSize: 16, fontFamily: "Rubik-Regular" }}
        >
          Copy Invitation Link
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShareableInvitationLink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  btn: {
    backgroundColor: "#38ACFF",
    marginTop: 10,
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
