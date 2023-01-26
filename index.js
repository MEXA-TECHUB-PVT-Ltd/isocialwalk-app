/**
 * @format
 */
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Platform, AppState } from "react-native";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "./RootNavigation";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    let data = notification?.data;
    console.log("data....", data);
    if (data) {
      if (AppState.currentState.match(/inactive|background/)) {
        console.log("App has come to the foreground!", data);
        // let user = await AsyncStorage.getItem('user');
        setTimeout(() => {
          console.log("else call_________________________________");
          navigationRef?.current?.navigate("Notification", {
            data,
          });
          console.log("here....");
          AsyncStorage.removeItem("notification");
        }, 1000);
      } else {
        console.log("else  :::  ", AppState.currentState);
        AsyncStorage.setItem("notification", JSON.stringify(data));
      }
      // navigation.navigate('DoctorProfilePatient');
    } else {
      console.log("data not find...", data);
    }
  },
  requestPermissions: Platform.OS === "ios",
});

AppRegistry.registerComponent(appName, () => App);
