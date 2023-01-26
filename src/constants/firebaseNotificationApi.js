import messaging from "@react-native-firebase/messaging";
import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
  off,
} from "firebase/database";

let url = "https://fcm.googleapis.com/fcm/send";

let server_Key =
  "AAAACewTY_0:APA91bFcIWYxklo6Xjpa8xaafuuojG2UUf0up0DEOohX2nejXW9eGC3nbqvQxRTMPjRs1WcWah8EOsqnImrugYnd9Vl2X0NK5mBlRaxqX4IND42tymxy8bezeKGM3ze0jcmqcWDMNaRW";

const getFirebaseUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const database = getDatabase();
      const mySnapshot = await get(ref(database, `users/${id}`));
      let data = mySnapshot?.val() ? mySnapshot?.val() : null;
      resolve(data);
    } catch (error) {
      resolve(null);
    }
  });
};

const getUserFCMToken = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const fcmToken = await messaging().getToken();
        resolve(fcmToken);
      } else {
        resolve("");
      }
    } catch (error) {
      resolve("");
    }
  });
};

const sendPushNotification = (
  recevierFCMToken = "",
  title = "",
  description = "",
  data = {}
) => {
  let body = {
    to: recevierFCMToken,
    notification: {
      title: title,
      body: description,
      mutable_content: true,
    },
    data: data,
  };
  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${server_Key}`,
    },
    body: JSON.stringify(body),
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((response) => {
        let res = JSON.parse(response);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default {
  getUserFCMToken,
  sendPushNotification,
  getFirebaseUser,
};
