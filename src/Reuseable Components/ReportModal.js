import React from "react";
import { Modal } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const ReportModal = ({
  visible,
  setVisible,
  title,
  onPress,
  comment,
  setComment,
}) => {
  return (
    <Modal
      visible={visible}
      onDismiss={() => {
        setVisible(false);
      }}
      transparent={true}
      // theme={{
      //   colors: {
      //     backdrop: "transparent",
      //   },
      // }}

      contentContainerStyle={{
        zIndex: 999,
        position: "absolute",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
        left: 20,
        right: 20,
        top: 0,
        bottom: 0,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          width: responsiveWidth(90),
          height: responsiveHeight(44),
          borderRadius: responsiveWidth(5),
          zIndex: 999,
          position: "absolute",
          alignItems: "center",
          //   padding: responsiveHeight(6),
          paddingTop: responsiveHeight(4),
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#000",
            fontSize: responsiveFontSize(2.5),
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flex: 1,
            width: responsiveWidth(90),
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TextInput
            style={{
              width: "90%",
              height: responsiveHeight(18.5),
              borderWidth: responsiveWidth(0.2),
              borderRadius: responsiveWidth(4),
              borderColor: "#D9D9D9",
              textAlignVertical: "top",
              paddingHorizontal: responsiveWidth(4),
              paddingVertical: responsiveHeight(1.5),
              marginTop: responsiveHeight(2.5),
              //  fontFamily: fontFamily.BioSans_Regular,
              fontSize: responsiveFontSize(1.8),
              color: "#2F363D",
            }}
            multiline={true}
            placeholder={"Write Comment"}
            placeholderTextColor={"gray"}
            value={comment}
            onChangeText={(txt) => setComment(txt)}
          />
          <TouchableOpacity
            style={{
              width: responsiveWidth(70),
              height: responsiveHeight(5.3),
              backgroundColor: "#38ACFF",
              marginHorizontal: 10,
              marginTop: responsiveHeight(5.4),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
            onPress={onPress}
          >
            <Text style={{ color: "#FFF", fontSize: 16 }}>Submit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            position: "absolute",
            right: responsiveWidth(4),
            height: responsiveWidth(7),
            width: responsiveWidth(7),
            top: responsiveHeight(1.5),
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setVisible(false)}
        >
          <Image
            source={require("../../assets/images/closesearch.png")}
            style={{
              height: responsiveWidth(5),
              width: responsiveWidth(5),
              tintColor: "#000",
            }}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({});
