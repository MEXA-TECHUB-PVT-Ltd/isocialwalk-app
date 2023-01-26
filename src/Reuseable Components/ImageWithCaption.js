import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Modal } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const ImageWithCaption = ({
  visible,
  setVisible,
  fileUri,
  isFocus,
  setIsFocus,
  imageCaption,
  setImageCaption,
  isSendPressed,
  onSendPress,
}) => {
  return (
    <Modal
      visible={visible}
      // visible={true}
      onDismiss={() => {
        setVisible(false);
      }}
      transparent={true}
    >
      <View
        style={{
          backgroundColor: "#000",
          width: responsiveWidth(100),
          height: responsiveHeight(100),
          // alignItems: "center",
          //   padding: responsiveHeight(6),
          paddingTop: responsiveHeight(4),
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            flex: 1,
            width: responsiveWidth(100),
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, backgroundColor: "#000" }}>
            <TouchableOpacity
              style={{
                marginLeft: responsiveWidth(5),
                width: responsiveWidth(10),
                height: responsiveWidth(10),
              }}
              onPress={() => setVisible(false)}
            >
              <Image
                source={require("../../assets/images/closesearch.png")}
                style={{
                  height: responsiveWidth(5),
                  width: responsiveWidth(5),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
            <View style={{ flex: 0.8, justifyContent: "center" }}>
              {fileUri && (
                <Image
                  // source={require("../../../assets/images/user1.png")}
                  source={{ uri: fileUri }}
                  style={{
                    height: responsiveWidth(100),
                    width: responsiveWidth(100),
                    resizeMode: "contain",
                  }}
                />
              )}
            </View>
            <View style={{ flex: 0.2 }}></View>
            <View
              style={{
                // flex: 1,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  // flex: 1,
                  height: 50,
                  width: "90%",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  borderWidth: responsiveWidth(0.2),
                  borderRadius: responsiveWidth(4),
                  borderColor: "#D9D9D9",
                  marginHorizontal: responsiveWidth(4),
                  position: "absolute",
                  bottom: isFocus ? responsiveHeight(30) : 30,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveHeight(1.5),
                    marginHorizontal: responsiveWidth(4),
                    fontSize: responsiveFontSize(1.8),
                    color: "#2F363D",
                  }}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  // multiline={true}
                  placeholder={"Add a Caption..."}
                  placeholderTextColor={"gray"}
                  value={imageCaption}
                  onChangeText={(txt) => setImageCaption(txt)}
                />
                <TouchableOpacity
                  disabled={isSendPressed}
                  style={{
                    flex: 0.3,
                    marginRight: responsiveWidth(1.2),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={onSendPress}
                >
                  <Image
                    source={require("../../assets/images/send.png")}
                    style={{
                      height: responsiveWidth(7),
                      width: responsiveWidth(7),
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ImageWithCaption;

const styles = StyleSheet.create({});
