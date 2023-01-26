import { roundToNearestMinutes } from "date-fns";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import { api } from "../constants/api";
import Loader from "../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
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
import { useDispatch } from "react-redux";
import { setLoginUserDetail } from "../redux/actions";
import firebaseNotificationApi from "../constants/firebaseNotificationApi";

import { TextInput as TextInputPaper } from "react-native-paper";

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "This email doesn't look right"
  );
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [invalidFirstName, setInvalidFirstName] = useState(false);
  const [invalidLastName, setInvalidLastName] = useState(false);

  //login
  const [login_email, setLogin_email] = useState("");
  const [login_password, setLogin_password] = useState("");

  const handleRegister = (firstName, lastName, email, password) => {
    setInvalidEmail(false);
    setInvalidPassword(false);
    setInvalidFirstName(false);
    setInvalidLastName(false);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (firstName?.length == 0 || typeof firstName == "undefined") {
      setInvalidFirstName(true);
    } else if (lastName?.length == 0 || typeof lastName == "undefined") {
      setInvalidLastName(true);
    } else if (
      email?.length === 0 ||
      typeof email == "undefined" ||
      reg.test(email) === false
    ) {
      setInvalidEmail(true);
      setEmailErrorMessage("This email doesn't look right");
    } else if (password?.length === 0 || typeof password == "undefined") {
      setInvalidPassword(true);
      setPasswordErrorMessage(
        "Enter a password with a cap, small letter, symbol and a number"
      );
    } else {
      console.log("handle signup here....");
      console.log({ firstName, lastName, email, password });
      setLoading(true);
      var data = {
        email: email,
        password: password,
        // phoneno: '0331-0177884',
        first_name: firstName,
        last_name: lastName,
      };

      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.signup, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("register response :: ", result);
          if (result[0]) {
            if (result[0]?.error == false || result[0]?.error == "false") {
              Snackbar.show({
                text: "Register Successfully",
                duration: Snackbar.LENGTH_SHORT,
              });
              await AsyncStorage.setItem("user_id", result[0]?.id);
              await AsyncStorage.setItem("user", JSON.stringify(result[0]));
              createUserIn_firebase(
                result[0]?.id,
                result[0]?.first_name,
                result[0]?.email
              );
              navigation.replace("DrawerTest");
            } else {
              if (result[0]?.message == "Email Already Exist") {
                setInvalidEmail(true);
                setEmailErrorMessage(result[0]?.message);
              } else {
                // setInvalidPassword(true);
                // setPasswordErrorMessage(result[0]?.message);
                Snackbar.show({
                  text: result[0]?.message,
                  duration: Snackbar.LENGTH_SHORT,
                });
              }
            }
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    }
  };
  const handleLogin = async (email, password) => {
    setInvalidEmail(false);
    setInvalidPassword(false);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setInvalidEmail(true);
      setEmailErrorMessage("This email doesn't look right");
    } else if (email?.length === 0 || typeof email == "undefined") {
      setInvalidEmail(true);
      setEmailErrorMessage("This email doesn't look right");
    } else if (password?.length === 0 || typeof password == "undefined") {
      setInvalidPassword(true);
      setPasswordErrorMessage(
        "Enter a password with a cap, small letter, symbol and a number"
      );
    } else {
      // navigation.navigate('DrawerTest');
      setLoading(true);
      var data = {
        email: email,
        password: password,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      fetch(api.signin, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("result b ::: ", result);
          if (result[0]) {
            if (result[0]?.error == false) {
              await AsyncStorage.setItem("user_id", result[0]?.id);
              await AsyncStorage.setItem("user", JSON.stringify(result[0]));

              createUserIn_firebase(
                result[0]?.id,
                result[0]?.first_name,
                result[0]?.email
              );
              navigation.replace("DrawerTest");
            } else {
              // setInvalidPassword(true);
              // setPasswordErrorMessage(result[0]?.message);

              Snackbar.show({
                text: result[0]?.message,
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    }
  };
  //-------------------------------------------------------------------------------------
  const createUserIn_firebase = async (id, name, email) => {
    try {
      const database = getDatabase();
      //first check if the user registered before
      let user = await findUser(id);
      console.log("user", user);
      if (!user) {
        user = await findUser(id);
      }
      //getting user fcmToken for push notifications
      let token = await firebaseNotificationApi.getUserFCMToken();
      //create a new user if not registered
      if (user) {
        // set loggedin user details
        dispatch(setLoginUserDetail(user));
        await AsyncStorage.setItem(
          "LoggedInUserFirebaseDetail",
          JSON.stringify(user)
        );

        //update user fcm token on login
        const obj = {
          ...user,
          fcmToken: token,
        };
        update(ref(database, `users/${id}`), obj);
      } else {
        // create new user
        const newUserObj = {
          id: id ? id : "",
          name: name ? name : "",
          email: email ? email : "",
          fcmToken: token,
        };
        set(ref(database, `users/${id}`), newUserObj);
        dispatch(setLoginUserDetail(newUserObj));
        await AsyncStorage.setItem(
          "LoggedInUserFirebaseDetail",
          JSON.stringify(newUserObj)
        );
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  const findUser = async (id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `users/${id}`)).catch((err) =>
      console.log(err)
    );
    return mySnapshot?.val() ? mySnapshot?.val() : null;
    // return mySnapshot?.val();
  };

  //-------------------------------------------------------------------------------------
  const handleonTabChange = () => {
    setIndex(index == 0 ? 1 : 0);
    setInvalidEmail(false);
    setInvalidPassword(false);
  };

  //-------------------------------google & facebook login ------------------------------------
  useEffect(() => {
    // npm install firebase
    GoogleSignin.configure({
      scopes: ["email"], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "42615399421-el0cnm0ckmshdh4aqo25u40fonp92p8o.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const googleSignup = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        console.log("userinfo _____", userInfo);
        console.log(
          "userInfo _____",
          userInfo?.idToken,
          userInfo.user.email,
          userInfo.user.name,
          userInfo.user.photo
        );
        // params : firstName, lastName, email, password
        handleRegister(
          userInfo.user.name,
          userInfo.user.name,
          userInfo.user.email,
          userInfo?.idToken
        );
      }
      // props.navigation.navigate('App');
    } catch (error) {
      console.log("error", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const googleLogin = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        // console.log('userinfo _____', userInfo);
        // console.log(
        //   'userInfo _____',
        //   userInfo?.idToken,
        //   userInfo.user.email,
        //   userInfo.user.name,
        //   userInfo.user.photo,
        // );
        // params :  email, password
        handleLogin(userInfo.user.email, userInfo?.idToken);
      }
      // props.navigation.navigate('App');
    } catch (error) {
      console.log("error", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const fbSignUp = async (resCallback) => {
    LoginManager.logOut();
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
      "user_friends",
    ]);

    if (result.isCancelled) {
      console.log("User cancelled the login process");
      return;
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.log("Something went wrong obtaining access token");
      return;
    } else {
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      // console.log('facebook credientails  :: ', facebookCredential);
      // Sign-in the user with the credential
      let userinfo = await auth().signInWithCredential(facebookCredential);
      if (userinfo) {
        // params : firstName, lastName, email, password
        handleRegister(
          userinfo?.additionalUserInfo?.profile?.first_name,
          userinfo?.additionalUserInfo?.profile?.last_name,
          userinfo?.user?.email,
          facebookCredential.token
        );
      } else {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
  };

  const fbLogin = async (resCallback) => {
    LoginManager.logOut();
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
      "user_friends",
    ]);

    if (result.isCancelled) {
      console.log("User cancelled the login process");
      return;
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.log("Something went wrong obtaining access token");
      return;
    } else {
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      // console.log('facebook credientails  :: ', facebookCredential);
      // Sign-in the user with the credential
      let userinfo = await auth().signInWithCredential(facebookCredential);
      console.log(userinfo);
      if (userinfo) {
        // params : firstName, lastName, email, password
        handleLogin(userinfo?.user?.email, facebookCredential.token);
      } else {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
  };

  //---------------------------------------------------------------------------------------------

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar backgroundColor={"#fff"} />
      {/* {loading && <Loader />} */}
      <View style={styles.tabView}>
        <TouchableOpacity
          // onPress={() => handleonTabChange()}
          onPress={() => {
            setIndex(1);
            setInvalidEmail(false);
            setInvalidPassword(false);
          }}
          style={{
            ...styles.btn,
            backgroundColor: index == 1 ? "#FFF" : "transparent",
            elevation: index == 1 ? 23 : 0,
          }}
        >
          <Text style={styles.btnText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => handleonTabChange()}
          onPress={() => {
            setIndex(0);
            setInvalidEmail(false);
            setInvalidPassword(false);
          }}
          style={{
            ...styles.btn,
            backgroundColor: index == 0 ? "#FFF" : "transparent",
            elevation: index == 0 ? 23 : 0,
          }}
        >
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
      </View>
      {index == 0 ? (
        <View style={{ flex: 1, marginBottom: 30 }}>
          <Text
            style={{
              color: "#000",
              // fontWeight: 'bold',
              fontFamily: "PlusJakartaDisplay-Bold",
              fontSize: 20,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Create your account
          </Text>
          <Text
            style={{
              marginBottom: 20,
              color: "#000",
              fontFamily: "Rubik-Regular",
            }}
          >
            Signup with Email for an account
          </Text>

          <View style={styles.textInputView}>
            <Text
              style={{
                color: "#000",
                marginVertical: 5,
                fontFamily: "Rubik-Regular",
              }}
            >
              First Name
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidFirstName ? "#D66262" : "#ccc",
              }}
              autoFocus
              placeholder={"Enter your FirstName"}
              value={firstName}
              onChangeText={(txt) => setFirstName(txt)}
            />
            {invalidFirstName && (
              <Text style={styles.errorText}>Please enter your first name</Text>
            )}
          </View>

          <View style={styles.textInputView}>
            <Text
              style={{
                color: "#000",
                marginVertical: 5,
                fontFamily: "Rubik-Regular",
              }}
            >
              Last Name
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidLastName ? "#D66262" : "#ccc",
              }}
              placeholder={"Enter your LastName"}
              value={lastName}
              onChangeText={(txt) => setLastName(txt)}
            />
            {invalidLastName && (
              <Text style={styles.errorText}>Please enter your last name</Text>
            )}
          </View>

          <View style={styles.textInputView}>
            <Text
              style={{
                color: "#000",
                marginVertical: 5,
                fontFamily: "Rubik-Regular",
              }}
            >
              Email Address
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidEmail ? "#D66262" : "#ccc",
              }}
              placeholder={"Enter your Email"}
              value={email}
              onChangeText={(txt) => setEmail(txt)}
            />

            {/* <TextInputPaper
              label="Email"
              value={email}
              onChangeText={(txt) => setEmail(txt)}
              mode={"outlined"}
              error={invalidEmail}
            /> */}

            {invalidEmail && (
              <Text style={styles.errorText}>{emailErrorMessage}</Text>
            )}
          </View>
          <View style={styles.textInputView}>
            <Text
              style={{
                color: "#000",
                marginVertical: 5,
                fontFamily: "Rubik-Regular",
              }}
            >
              Password
            </Text>
            <View>
              <TextInput
                style={{
                  ...styles.textInput,
                  paddingRight: 45,
                  borderColor: invalidPassword ? "#D66262" : "#ccc",
                }}
                secureTextEntry={!isPasswordShow}
                placeholder={"Enter your Password"}
                value={password}
                onChangeText={(txt) => setPassword(txt)}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShow(!isPasswordShow)}
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
                  name={isPasswordShow ? "eye" : "eye-with-line"}
                  color={"#000"}
                  size={20}
                  style={{}}
                />
              </TouchableOpacity>
            </View>
            {invalidPassword && (
              <Text style={styles.errorText}>{passwordErrorMessage}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.btnRegister}
            disabled={loading}
            onPress={() => handleRegister(firstName, lastName, email, password)}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontFamily: "Rubik-Regular",
                marginRight: 8,
              }}
            >
              Register
            </Text>
            {loading && <ActivityIndicator size={"small"} color={"#fff"} />}
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={styles.socialBtn}
              // onPress={() => navigation.navigate('TabNavigation')}>
              onPress={() => {
                Snackbar.show({
                  text: "Working in progress....Sorry for inconvenience",
                  duration: Snackbar.LENGTH_SHORT,
                });
              }}
            >
              <Image
                source={require("../../assets/images/apple.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles.socialBtnText}>Signup with Apple ID</Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => navigation.navigate('DrawerTest')}
              onPress={() => fbSignUp()}
              style={{ ...styles.socialBtn, backgroundColor: "#4267B2" }}
            >
              <Image
                source={require("../../assets/images/facebook.png")}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  tintColor: "#FFF",
                }}
              />
              <Text style={styles.socialBtnText}>Signup with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => navigation.navigate('TabNavigation')}
              // onPress={() => navigation.navigate('DrawerTest')}
              onPress={() => googleSignup()}
              style={{ ...styles.socialBtn, backgroundColor: "#4285F4" }}
            >
              <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles.socialBtnText}>Signup with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#000",
              fontFamily: "PlusJakartaDisplay-Bold",
              fontSize: 20,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Welcome back !
          </Text>
          <Text style={{ marginBottom: 15, color: "#000", fontWeight: "400" }}>
            Sign in to access your account
          </Text>

          <View style={styles.textInputView}>
            <Text style={{ color: "#000", marginVertical: 5 }}>
              Email Address
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidEmail ? "#D66262" : "#ccc",
              }}
              autoFocus
              value={login_email}
              onChangeText={(txt) => setLogin_email(txt)}
              placeholder={"Enter your Email"}
            />
            {invalidEmail && (
              <Text style={styles.errorText}>{emailErrorMessage}</Text>
            )}
          </View>
          <View style={styles.textInputView}>
            <Text style={{ color: "#000", marginVertical: 5 }}>Password</Text>
            <View>
              <TextInput
                style={{
                  ...styles.textInput,
                  paddingRight: 45,
                  borderColor: invalidPassword ? "#D66262" : "#ccc",
                }}
                secureTextEntry={!isPasswordShow}
                placeholder={"Enter your Password"}
                value={login_password}
                onChangeText={(txt) => setLogin_password(txt)}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShow(!isPasswordShow)}
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
                  name={isPasswordShow ? "eye" : "eye-with-line"}
                  color={"#000"}
                  size={20}
                  style={{}}
                />
              </TouchableOpacity>
            </View>
            {invalidPassword && (
              <Text style={styles.errorText}>
                {/* Enter a password with a cap, small letter, symbol and a number */}
                {passwordErrorMessage}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={{ ...styles.btnRegister, marginBottom: 18 }}
            disabled={loading}
            // onPress={() => handleLogin(email, password)}
            onPress={() => handleLogin(login_email, login_password)}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontFamily: "Rubik-Regular",
                marginRight: 5,
              }}
            >
              Sign In
            </Text>
            {loading && <ActivityIndicator size={"small"} color={"#fff"} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 130,
              paddingVertical: 7,
              alignSelf: "flex-end",
            }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            {/* <Text
              style={{
                color: "#000",
                fontSize: 14,
                fontFamily: "Rubik-Regular",
              }}
            >
              Forgot Password?
            </Text> */}
            <Text
              style={{
                color: "#3BADFF",
                fontFamily: "Rubik-Medium",
                marginBottom: 10,
              }}
            >
              {/* Reset Password */}
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={styles.socialBtn}
              // onPress={() => navigation.navigate('TabNavigation')}
              // onPress={() => navigation.navigate("DrawerTest")}
              onPress={() => {
                Snackbar.show({
                  text: "Working in progress....Sorry for inconvenience",
                  duration: Snackbar.LENGTH_SHORT,
                });
              }}
            >
              <Image
                source={require("../../assets/images/apple.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles.socialBtnText}>Log in with Apple ID</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fbLogin()}
              style={{ ...styles.socialBtn, backgroundColor: "#4267B2" }}
            >
              <Image
                source={require("../../assets/images/facebook.png")}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  tintColor: "#FFF",
                }}
              />
              <Text style={styles.socialBtnText}>Log in with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => googleLogin()}
              style={{ ...styles.socialBtn, backgroundColor: "#4285F4" }}
            >
              <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles.socialBtnText}>Log in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  tabView: {
    height: 50,
    width: "100%",
    backgroundColor: "#D1ECFF",
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: "row",
    marginVertical: 5,
    //   justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: "#FFF",
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#cdcdcd",
  },
  btnText: {
    color: "#000",
  },
  textInputView: {
    // backgroundColor: 'blue',
    marginVertical: 15,
  },
  textInput: {
    // backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  btnRegister: {
    // backgroundColor: '#0496FF',
    backgroundColor: "#38ACFF",
    marginTop: 30,
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  socialBtn: {
    flexDirection: "row",
    backgroundColor: "#000",
    marginVertical: 10,
    height: 45,
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  socialBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
  },
  errorText: {
    color: "#D66262",
    fontSize: 10,
    marginLeft: 10,
    marginTop: 3,
    fontFamily: "Rubik-Regular",
  },
});
