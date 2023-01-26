import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import MenuHeader from "../Reuseable Components/MenuHeader";

import RBSheet from "react-native-raw-bottom-sheet";
// import Slider from 'react-native-slider';
// var Slider = require('react-native-slider');
// import Slider from '@react-native-community/slider';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { api } from "../constants/api";
import Loader from "../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { ScrollView } from "react-native-gesture-handler";

import { BASE_URL_Image } from "../constants/Base_URL_Image";
import { useDispatch, useSelector } from "react-redux";

import RNFetchBlob from "rn-fetch-blob";

import Header from "../Reuseable Components/Header";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const UpdateProfile = ({ navigation }) => {
  const rbsheet_Ref = useRef(null);
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [isImageChange, setIsImageChange] = useState(false);

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "This email doesn't look right"
  );

  const [inValidPhoneNo, setinValidPhoneNo] = useState(false);
  const [invalidFirstName, setInvalidFirstName] = useState(false);
  const [invalidLastName, setInvalidLastName] = useState(false);

  const [image_to_upload, setImage_to_upload] = useState(null);

  const handleOpenCustomDrawer = () => {
    Animated.timing(scale, {
      toValue: showMenu ? 1 : 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(moveToRight, {
      toValue: showMenu ? 0 : 230,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowMenu(!showMenu);
  };
  const chooseFromCamera = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };
    await launchCamera(options)
      .then((res) => {
        if (res.didCancel) {
          console.log("user cancel picking image...");
          return;
        }
        // setProfileImage(res.assets[0].uri);
        // setFileName(res.assets[0].fileName);
        // setMimeType(res.assets[0].type);
        // let obj = {
        //   name: "profile_image",
        //   filename: res.assets[0].uri?.split("/").pop(),
        //   type: "image/jpeg",
        //   data: RNFetchBlob.wrap(res.assets[0].uri),
        // };
        // setImage_to_upload(obj);
        // setIsImageChange(true);
        // //upload profile image
        // // id, profileImage,fileName,mimeType
        // updateProfile(
        //   userId,
        //   res.assets[0].uri,
        //   res.assets[0].fileName,
        //   res.assets[0].type
        // );

        // ____________________________________________________________
        setProfileImage(res.assets[0].uri);
        setFileName(res.assets[0].fileName);
        setMimeType(res.assets[0].type);
        //  apiImagesList.push({
        //     name: "listing-images",
        //     filename: filename,
        //     type: response.assets[0].type,
        //     data: RNFetchBlob.wrap(response.assets[0].uri),
        //   });

        // let obj = {
        //   name: "profile_image",
        //   filename: res.assets[0].uri?.split("/").pop(),
        //   type: "image/jpeg",
        //   data: RNFetchBlob.wrap(res.assets[0].uri),
        // };
        // setImage_to_upload(obj);

        // //upload profile image
        // // id, profileImage,fileName,mimeType
        updateProfile(
          userId,
          res.assets[0].uri,
          res.assets[0].fileName,
          res.assets[0].type
        );
        // ____________________________________________________________
      })
      .catch((error) => console.log(error));
  };
  const chooseFromGallery = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };
    await launchImageLibrary(options)
      .then((res) => {
        if (res.didCancel) {
          console.log("user cancel picking image...");
          return;
        }
        console.log("image res :: ", res);
        setProfileImage(res.assets[0].uri);
        setFileName(res.assets[0].fileName);
        setMimeType(res.assets[0].type);
        //  apiImagesList.push({
        //     name: "listing-images",
        //     filename: filename,
        //     type: response.assets[0].type,
        //     data: RNFetchBlob.wrap(response.assets[0].uri),
        //   });

        let obj = {
          name: "profile_image",
          filename: res.assets[0].uri?.split("/").pop(),
          type: "image/jpeg",
          data: RNFetchBlob.wrap(res.assets[0].uri),
        };
        setImage_to_upload(obj);

        //upload profile image
        // id, profileImage,fileName,mimeType

        updateProfile(
          userId,
          res.assets[0].uri,
          res.assets[0].fileName,
          res.assets[0].type
        );
      })
      .catch((error) => console.log(error));
  };
  const getSpecificUserDetail = async (id) => {
    setLoading(true);
    var requestOptions = {
      method: "POST",
      body: JSON.stringify({
        user_id: id,
      }),
      redirect: "follow",
    };
    fetch(api.get_specific_user, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.length > 0) {
          // console.log('result :: ', result);
          // setSelected_friend_id(id);
          // setSelected_friend_name(result[0]?.first_name);
          // setSelected_friend_profile(result[0]['profile image']);
          // bottomSheetRef?.current?.open();
          setFirstName(result[0]?.first_name);
          setLastName(result[0]?.last_name);
          setPhoneNo(result[0]?.phoneno);

          let profile = result[0]["profile image"]
            ? BASE_URL_Image + "/" + result[0]["profile image"]
            : "";
          setProfileImage(profile);
          setIsImageChange(true);
        } else {
          Snackbar.show({
            text: result?.Message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };
  const getUser = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    setUserId(user_id);
    getSpecificUserDetail(user_id);
    // let user_info = await AsyncStorage.getItem("user");
    // console.log("logged in user info ::: ", user_info);
    // if (user_info != null) {
    //   let parse = JSON.parse(user_info);
    //   setFirstName(parse?.first_name);
    //   setLastName(parse?.last_name);
    //   //   setPhoneNo(parse?.first_name);
    // }
    // console.log(user_info);
  };
  useEffect(() => {
    getUser();
    setLoading(false);
  }, []);

  const updateProfile = async (id, profileImage1, fileName1, mimeType1) => {
    // console.log(
    //   "data passed to updateProfile",
    //   id,
    //   profileImage1,
    //   fileName1,
    //   mimeType1
    // );
    // updateProfileImage(id, profileImage1, fileName1, mimeType1);
    // return;

    if (profileImage1) {
      setLoading(true);

      //______________________________________________________________________________

      RNFetchBlob.fetch(
        "POST",
        api.profileimage,
        {
          otherHeader: "foo",
          "Content-Type": "multipart/form-data",
        },
        [
          { name: "id", data: id },
          {
            name: "profile_image",
            filename: fileName1,
            type: mimeType1,
            data: RNFetchBlob.wrap(profileImage1),
          },
        ]
      )
        .then((response) => {
          console.log("response before : ", response?.data);

          let myresponse = JSON.parse(response.data);
          console.log("updaing profile response _____", myresponse);
          Snackbar.show({
            text: "Image uploaded successfully",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .catch((error) => {
          console.log("error in updating profile image ::: ", error);
          Snackbar.show({
            text: "Something went wrong.Profile Image not updated.Please Try Again",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    } else {
      console.log("profile not updating .... .", profileImage);
    }

    //______________________________________________________________________________

    // var formData = new FormData();
    // formData.append("id", id);
    // let profile_Obj = {
    //   uri: profileImage,
    //   name: fileName,
    //   type: mimeType,
    // };
    // console.log("profile_Obj ", profile_Obj);
    // formData.append("profile_image", profile_Obj, fileName);
    // console.log("formdata :: ", formData);

    // var requestOptions = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     Accept: "application/json",
    //   },
    //   body: formData,
    //   redirect: "follow",
    // };

    // fetch(api.profileimage, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     if (result[0]) {
    //       if (result[0]?.error == false) {
    //         Snackbar.show({
    //           text: "Profile Updated Successfully",
    //           duration: Snackbar.LENGTH_SHORT,
    //         });
    //       } else {
    //         Snackbar.show({
    //           text: result[0]?.message,
    //           duration: Snackbar.LENGTH_SHORT,
    //         });
    //       }
    //     }
    //   })
    //   .catch((error) => console.log("error in uploading image ::: ", error))
    //   .finally(() => setLoading(false));
  };

  const updateProfileImage = async (id, profileImage, fileName, mimeType) => {
    var formdata = new FormData();
    setLoading(true);
    formdata.append("id", "26");
    let obj = {
      uri: profileImage,
      name: fileName,
      type: mimeType,
    };
    console.log("image object  :: ", obj);
    formdata.append("profile_image", obj, fileName);
    console.log("formdata ::: ", formdata);
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    console.log("api.profileimage  ::: ", api.profileimage);
    fetch(api.profileimage, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
        // Authorization: `Token ${Token}`
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => console.log("result of upload profile", result))
      .catch((error) =>
        console.log("error in uploading profile image :::: ", error)
      )
      .finally(() => setLoading(false));
  };

  const handleUpdateProfile = async () => {
    setInvalidFirstName(false);
    setInvalidLastName(false);
    setinValidPhoneNo(false);
    console.log({ firstName, lastName, phoneNo, profileImage });
    if (firstName.length == 0) {
      setInvalidFirstName(true);
    } else if (lastName.length == 0) {
      setInvalidLastName(true);
    } else if (phoneNo.length == 0) {
      setinValidPhoneNo(true);
    } else {
      //handle update profile
      let user_id = await AsyncStorage.getItem("user_id");
      console.log("logged in user id ::", user_id);
      setLoading(true);
      var data = {
        phoneno: phoneNo,
        first_name: firstName,
        last_name: lastName,
        id: user_id,
      };

      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.updateprofile, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("profile update response ::", result);

          if (result[0]) {
            if (result[0]?.error == false) {
              Snackbar.show({
                text: "Profile Updated Successfully",
                duration: Snackbar.LENGTH_SHORT,
              });
              // id, profileImage, fileName, mimeType
              //  updateProfile(user_id, profileImage, fileName, mimeType);
              updateDeviceToken(user_id);
              navigation.goBack();
            } else {
              Snackbar.show({
                text: result[0]?.message,
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }
        })
        .catch((error) => console.log("error", error))
        .finally(() => setLoading(false));
    }
  };

  const updateDeviceToken = async (id) => {
    var data = {
      id: id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.updatedevicetoken, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("device token  response ::: ", result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {loading && <Loader />}
        {/* <MenuHeader title={'Update Goals'} navigation={navigation} /> */}
        <Header
          title={"Update Profile"}
          navigation={navigation}
          // onPress={() => handleOpenCustomDrawer()}
        />

        <View style={{ marginVertical: 10, alignItems: "center" }}>
          <View style={{}}>
            {profileImage == null || profileImage == "" ? (
              <Image
                source={require("../../assets/images/friend-profile.png")}
                style={{
                  marginVertical: 10,
                  height: 110,
                  width: 123,
                  borderRadius: 10,
                  backgroundColor: "#ccc",
                }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{ uri: profileImage }}
                style={{
                  marginVertical: 10,
                  height: 110,
                  width: 123,
                  borderRadius: 10,
                  backgroundColor: "#ccc",
                }}
              />
            )}
            {/* <TouchableOpacity
              // onPress={() => pickImage()}
              onPress={() => rbsheet_Ref?.current?.open()}
              style={{
                position: "absolute",
                right: 0,
                top: 20,
              }}
            >
              <Image
                source={require("../../assets/images/camera.png")}
                style={{
                  width: 30,
                  height: 28,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity
            onPress={() => rbsheet_Ref?.current?.open()}
            style={{
              backgroundColor: "#38acff",
              marginBottom: 40,
              // height: 50,
              padding: 5,
              paddingHorizontal: 7,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 17,
                fontFamily: "Rubik-Regular",
              }}
            >
              Change Image
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>First Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder={"Enter Your firstname"}
              autoFocus
              value={firstName}
              onChangeText={(txt) => setFirstName(txt)}
            />
            {invalidFirstName && (
              <Text style={styles.errorText}>Please enter your first name</Text>
            )}
          </View>

          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder={"Enter Your lastname"}
              value={lastName}
              onChangeText={(txt) => setLastName(txt)}
            />
            {invalidLastName && (
              <Text style={styles.errorText}>Please enter your last name</Text>
            )}
          </View>

          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Phone No.</Text>
            <TextInput
              style={styles.textInput}
              placeholder={"Enter Your phone no."}
              keyboardType={"number-pad"}
              value={phoneNo}
              onChangeText={(txt) => setPhoneNo(txt)}
            />
            {inValidPhoneNo && (
              <Text style={styles.errorText}>Please enter your phone no.</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleUpdateProfile()}
          >
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={rbsheet_Ref}
          openDuration={250}
          animationType="slide"
          customStyles={{
            container: {
              height: "30%",
              // height: responsiveHeight(45),
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            },
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "80%",
                alignSelf: "center",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  //  fontFamily: fontFamily.BioSans_Regular,
                  //  fontSize: responsiveFontSize(3),
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                }}
              >
                Upload Image
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => rbsheet_Ref?.current?.close()}
              >
                <Image
                  source={require("../../assets/images/closerbsheet.png")}
                  resizeMode="contain"
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                // marginTop: responsiveHeight(2),
                // marginBottom: responsiveHeight(1.5),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  rbsheet_Ref?.current?.close();
                  chooseFromCamera();
                }}
                activeOpacity={0.6}
                style={{
                  width: "80%",
                  alignSelf: "center",
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderColor: "#EBEBEB",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 15,
                  }}
                >
                  <Image
                    source={require("../../assets/images/camera2.png")}
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: "#000",
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color: "#717171",
                      // fontFamily: fontFamily.BioSans_Regular,
                      fontSize: 16,
                      marginLeft: 10,
                      width: "100%",
                    }}
                  >
                    Upload From Camera
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  rbsheet_Ref?.current?.close();
                  chooseFromGallery();
                }}
                activeOpacity={0.6}
                style={{
                  width: "80%",
                  alignSelf: "center",
                  paddingVertical: 15,
                  borderBottomWidth: 0,
                  borderColor: "#EBEBEB",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 15,
                  }}
                >
                  <Image
                    source={require("../../assets/images/uploadgallery.png")}
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: "#717171",
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color: "#717171",
                      // fontFamily: fontFamily.BioSans_Regular,
                      fontSize: 16,
                      marginLeft: 10,
                      width: "100%",
                    }}
                  >
                    Upload From Gallery
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    </ScrollView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  textInputView: {
    marginVertical: 12,
  },
  textInputHeading: {
    color: "#000000",
    fontSize: 17,
    marginVertical: 5,
    marginBottom: 15,
    fontFamily: "Rubik-Regular",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 9,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: "#38acff",
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: { color: "#ffffff", fontSize: 17, fontFamily: "Rubik-Regular" },
  errorText: {
    color: "#D66262",
    fontSize: 12,
    marginLeft: 10,
    marginTop: 3,
    fontFamily: "Rubik-Regular",
  },
});

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Pressable,
//   TextInput,
//   Dimensions,
// } from "react-native";
// import MenuHeader from "../Reuseable Components/MenuHeader";

// import RBSheet from "react-native-raw-bottom-sheet";
// // import Slider from 'react-native-slider';
// // var Slider = require('react-native-slider');
// // import Slider from '@react-native-community/slider';
// import MultiSlider from "@ptomasroos/react-native-multi-slider";
// import { api } from "../constants/api";
// import Loader from "../Reuseable Components/Loader";
// import Snackbar from "react-native-snackbar";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import { ScrollView } from "react-native-gesture-handler";

// import { BASE_URL_Image } from "../constants/Base_URL_Image";
// import { useDispatch, useSelector } from "react-redux";

// import RNFetchBlob from "rn-fetch-blob";

// const SCREEN_WIDTH = Dimensions.get("screen").width;

// const UpdateProfile = ({
//   navigation,
//   scale,
//   showMenu,
//   setShowMenu,
//   moveToRight,
// }) => {
//   const rbsheet_Ref = useRef(null);
//   const [loading, setLoading] = useState(false);

//   const [profileImage, setProfileImage] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [mimeType, setMimeType] = useState("");
//   const [isImageChange, setIsImageChange] = useState(false);

//   const [userId, setUserId] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNo, setPhoneNo] = useState("");

//   const [invalidEmail, setInvalidEmail] = useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = useState(
//     "This email doesn't look right"
//   );

//   const [inValidPhoneNo, setinValidPhoneNo] = useState(false);
//   const [invalidFirstName, setInvalidFirstName] = useState(false);
//   const [invalidLastName, setInvalidLastName] = useState(false);

//   const [image_to_upload, setImage_to_upload] = useState(null);

//   const handleOpenCustomDrawer = () => {
//     Animated.timing(scale, {
//       toValue: showMenu ? 1 : 0.8,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     Animated.timing(moveToRight, {
//       toValue: showMenu ? 0 : 230,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     setShowMenu(!showMenu);
//   };
//   const chooseFromCamera = async () => {
//     var options = {
//       storageOptions: {
//         skipBackup: true,
//         path: "images",
//       },
//     };
//     await launchCamera(options)
//       .then((res) => {
//         if (res.didCancel) {
//           console.log("user cancel picking image...");
//           return;
//         }
//         setProfileImage(res.assets[0].uri);
//         setFileName(res.assets[0].fileName);
//         setMimeType(res.assets[0].type);
//         let obj = {
//           name: "profile_image",
//           filename: res.assets[0].uri?.split("/").pop(),
//           type: "image/jpeg",
//           data: RNFetchBlob.wrap(res.assets[0].uri),
//         };
//         setImage_to_upload(obj);
//         setIsImageChange(true);
//         //upload profile image
//         // id, profileImage,fileName,mimeType
//         updateProfile(
//           userId,
//           res.assets[0].uri,
//           res.assets[0].fileName,
//           res.assets[0].type
//         );
//       })
//       .catch((error) => console.log(error));
//   };
//   const chooseFromGallery = async () => {
//     var options = {
//       storageOptions: {
//         skipBackup: true,
//         path: "images",
//       },
//     };
//     await launchImageLibrary(options)
//       .then((res) => {
//         if (res.didCancel) {
//           console.log("user cancel picking image...");
//           return;
//         }
//         console.log("image res :: ", res);
//         setProfileImage(res.assets[0].uri);
//         setFileName(res.assets[0].fileName);
//         setMimeType(res.assets[0].type);
//         //  apiImagesList.push({
//         //     name: "listing-images",
//         //     filename: filename,
//         //     type: response.assets[0].type,
//         //     data: RNFetchBlob.wrap(response.assets[0].uri),
//         //   });

//         let obj = {
//           name: "profile_image",
//           filename: res.assets[0].uri?.split("/").pop(),
//           type: "image/jpeg",
//           data: RNFetchBlob.wrap(res.assets[0].uri),
//         };
//         setImage_to_upload(obj);

//         //upload profile image
//         // id, profileImage,fileName,mimeType
//         updateProfile(
//           userId,
//           res.assets[0].uri,
//           res.assets[0].fileName,
//           res.assets[0].type
//         );
//       })
//       .catch((error) => console.log(error));
//   };
//   const getSpecificUserDetail = async (id) => {
//     setLoading(true);
//     var requestOptions = {
//       method: "POST",
//       body: JSON.stringify({
//         user_id: id,
//       }),
//       redirect: "follow",
//     };
//     fetch(api.get_specific_user, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         if (result?.length > 0) {
//           // console.log('result :: ', result);
//           // setSelected_friend_id(id);
//           // setSelected_friend_name(result[0]?.first_name);
//           // setSelected_friend_profile(result[0]['profile image']);
//           // bottomSheetRef?.current?.open();
//           setFirstName(result[0]?.first_name);
//           setLastName(result[0]?.last_name);
//           setPhoneNo(result[0]?.phoneno);

//           let profile = result[0]["profile image"]
//             ? BASE_URL_Image + "/" + result[0]["profile image"]
//             : "";
//           setProfileImage(profile);
//           setIsImageChange(true);
//         } else {
//           Snackbar.show({
//             text: result?.Message,
//             duration: Snackbar.LENGTH_SHORT,
//           });
//         }
//       })
//       .catch((error) => {
//         Snackbar.show({
//           text: "Something went wrong",
//           duration: Snackbar.LENGTH_SHORT,
//         });
//       })
//       .finally(() => setLoading(false));
//   };
//   const getUser = async () => {
//     let user_id = await AsyncStorage.getItem("user_id");
//     setUserId(user_id);
//     getSpecificUserDetail(user_id);
//     // let user_info = await AsyncStorage.getItem("user");
//     // console.log("logged in user info ::: ", user_info);
//     // if (user_info != null) {
//     //   let parse = JSON.parse(user_info);
//     //   setFirstName(parse?.first_name);
//     //   setLastName(parse?.last_name);
//     //   //   setPhoneNo(parse?.first_name);
//     // }
//     // console.log(user_info);
//   };
//   useEffect(() => {
//     getUser();
//     setLoading(false);
//   }, []);

//   const updateProfile = async (id, profileImage, fileName, mimeType) => {
//     if (profileImage) {
//       console.log("user id passed ::: ", id);
//       console.log("profile image ::: ", profileImage);
//       setLoading(true);

//       //______________________________________________________________________________

//       RNFetchBlob.fetch(
//         "POST",
//         api.profileimage,
//         {
//           otherHeader: "foo",
//           "Content-Type": "multipart/form-data",
//         },
//         [
//           { name: "id", data: id },
//           {
//             name: "profile_image",
//             filename: fileName,
//             type: mimeType,
//             data: RNFetchBlob.wrap(profileImage),
//           },
//         ]
//       )
//         .then((response) => {
//           let myresponse = JSON.parse(response.data);
//           console.log("updaing profile response _____", myresponse);
//           Snackbar.show({
//             text: "Image uploaded successfully",
//             duration: Snackbar.LENGTH_SHORT,
//           });
//         })
//         .catch((error) => {
//           console.log("error in updating profile image ::: ", error);
//           Snackbar.show({
//             text: "Something went wrong, please try again",
//             duration: Snackbar.LENGTH_SHORT,
//           });
//         })
//         .finally(() => setLoading(false));
//     } else {
//       console.log("profile not updating .... .", profileImage);
//     }

//     //______________________________________________________________________________

//     // var formData = new FormData();
//     // formData.append("id", id);
//     // let profile_Obj = {
//     //   uri: profileImage,
//     //   name: fileName,
//     //   type: mimeType,
//     // };
//     // console.log("profile_Obj ", profile_Obj);
//     // formData.append("profile_image", profile_Obj, fileName);
//     // console.log("formdata :: ", formData);

//     // var requestOptions = {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "multipart/form-data",
//     //     Accept: "application/json",
//     //   },
//     //   body: formData,
//     //   redirect: "follow",
//     // };

//     // fetch(api.profileimage, requestOptions)
//     //   .then((response) => response.json())
//     //   .then((result) => {
//     //     if (result[0]) {
//     //       if (result[0]?.error == false) {
//     //         Snackbar.show({
//     //           text: "Profile Updated Successfully",
//     //           duration: Snackbar.LENGTH_SHORT,
//     //         });
//     //       } else {
//     //         Snackbar.show({
//     //           text: result[0]?.message,
//     //           duration: Snackbar.LENGTH_SHORT,
//     //         });
//     //       }
//     //     }
//     //   })
//     //   .catch((error) => console.log("error in uploading image ::: ", error))
//     //   .finally(() => setLoading(false));
//   };

//   const handleUpdateProfile = async () => {
//     setInvalidFirstName(false);
//     setInvalidLastName(false);
//     setinValidPhoneNo(false);
//     console.log({ firstName, lastName, phoneNo, profileImage });
//     if (firstName.length == 0) {
//       setInvalidFirstName(true);
//     } else if (lastName.length == 0) {
//       setInvalidLastName(true);
//     } else if (phoneNo.length == 0) {
//       setinValidPhoneNo(true);
//     } else {
//       //handle update profile
//       let user_id = await AsyncStorage.getItem("user_id");
//       console.log("logged in user id ::", user_id);
//       setLoading(true);
//       var data = {
//         phoneno: phoneNo,
//         first_name: firstName,
//         last_name: lastName,
//         id: user_id,
//       };

//       var requestOptions = {
//         method: "POST",
//         body: JSON.stringify(data),
//         redirect: "follow",
//       };

//       fetch(api.updateprofile, requestOptions)
//         .then((response) => response.json())
//         .then((result) => {
//           console.log("profile update response ::", result);

//           if (result[0]) {
//             if (result[0]?.error == false) {
//               Snackbar.show({
//                 text: "Profile Updated Successfully",
//                 duration: Snackbar.LENGTH_SHORT,
//               });
//               // updateProfile(user_id);
//               updateDeviceToken(user_id);
//             } else {
//               Snackbar.show({
//                 text: result[0]?.message,
//                 duration: Snackbar.LENGTH_SHORT,
//               });
//             }
//           }
//         })
//         .catch((error) => console.log("error", error))
//         .finally(() => setLoading(false));
//     }
//   };

//   const updateDeviceToken = async (id) => {
//     var data = {
//       id: id,
//     };
//     var requestOptions = {
//       method: "POST",
//       body: JSON.stringify(data),
//       redirect: "follow",
//     };

//     fetch(api.updatedevicetoken, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("device token  response ::: ", result);
//       })
//       .catch((error) => console.log("error", error));
//   };

//   return (
//     <Animated.View
//       style={{
//         flex: 1,
//         backgroundColor: "white",
//         position: "absolute",
//         left: 0,
//         right: 0,
//         top: 0,
//         bottom: 0,
//         borderRadius: showMenu ? 15 : 0,
//         transform: [{ scale: scale }, { translateX: moveToRight }],
//       }}
//     >
//       <ScrollView>
//         <View style={styles.container}>
//           {loading && <Loader />}
//           {/* <MenuHeader title={'Update Goals'} navigation={navigation} /> */}
//           <MenuHeader
//             title={"Update Profile"}
//             navigation={navigation}
//             onPress={() => handleOpenCustomDrawer()}
//           />

//           <View style={{ marginVertical: 10, alignItems: "center" }}>
//             <View style={{}}>
//               {profileImage == null || profileImage == "" ? (
//                 <Image
//                   source={require("../../assets/images/friend-profile.png")}
//                   style={{
//                     marginVertical: 10,
//                     height: 123,
//                     width: 123,
//                   }}
//                 />
//               ) : (
//                 <Image
//                   source={{ uri: profileImage }}
//                   style={{
//                     marginVertical: 10,
//                     height: 123,
//                     width: 123,
//                     borderRadius: 123,
//                     backgroundColor: "#ccc",
//                   }}
//                 />
//               )}
//               <TouchableOpacity
//                 // onPress={() => pickImage()}
//                 onPress={() => rbsheet_Ref?.current?.open()}
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   top: 20,
//                 }}
//               >
//                 <Image
//                   source={require("../../assets/images/camera.png")}
//                   style={{
//                     width: 30,
//                     height: 28,
//                     resizeMode: "contain",
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>

//             <Text
//               style={{
//                 color: "#000000",
//                 fontSize: 17,
//                 fontFamily: "Rubik-Regular",
//               }}
//             >
//               Profile image
//             </Text>
//           </View>
//           <View>
//             <View style={styles.textInputView}>
//               <Text style={styles.textInputHeading}>First Name</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder={"Enter Your firstname"}
//                 autoFocus
//                 value={firstName}
//                 onChangeText={(txt) => setFirstName(txt)}
//               />
//               {invalidFirstName && (
//                 <Text style={styles.errorText}>
//                   Please enter your first name
//                 </Text>
//               )}
//             </View>

//             <View style={styles.textInputView}>
//               <Text style={styles.textInputHeading}>Last Name</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder={"Enter Your lastname"}
//                 value={lastName}
//                 onChangeText={(txt) => setLastName(txt)}
//               />
//               {invalidLastName && (
//                 <Text style={styles.errorText}>
//                   Please enter your last name
//                 </Text>
//               )}
//             </View>

//             <View style={styles.textInputView}>
//               <Text style={styles.textInputHeading}>Phone No.</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder={"Enter Your phone no."}
//                 keyboardType={"number-pad"}
//                 value={phoneNo}
//                 onChangeText={(txt) => setPhoneNo(txt)}
//               />
//               {inValidPhoneNo && (
//                 <Text style={styles.errorText}>
//                   Please enter your phone no.
//                 </Text>
//               )}
//             </View>

//             <TouchableOpacity
//               style={styles.btn}
//               onPress={() => handleUpdateProfile()}
//             >
//               <Text style={styles.btnText}>Update</Text>
//             </TouchableOpacity>
//           </View>
//           <RBSheet
//             ref={rbsheet_Ref}
//             openDuration={250}
//             animationType="slide"
//             customStyles={{
//               container: {
//                 height: "30%",
//                 // height: responsiveHeight(45),
//                 borderTopRightRadius: 15,
//                 borderTopLeftRadius: 15,
//               },
//             }}
//           >
//             <View style={{ flex: 1 }}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   width: "80%",
//                   alignSelf: "center",
//                   marginTop: 20,
//                   marginBottom: 10,
//                 }}
//               >
//                 <Text
//                   style={{
//                     color: "#38ACFF",
//                     //  fontFamily: fontFamily.BioSans_Regular,
//                     //  fontSize: responsiveFontSize(3),
//                     fontSize: 20,
//                   }}
//                 >
//                   Upload Photo
//                 </Text>
//                 <TouchableOpacity
//                   activeOpacity={0.7}
//                   onPress={() => rbsheet_Ref?.current?.close()}
//                 >
//                   <Image
//                     source={require("../../assets/images/closerbsheet.png")}
//                     resizeMode="contain"
//                     style={{
//                       height: 15,
//                       width: 15,
//                       resizeMode: "contain",
//                     }}
//                   />
//                 </TouchableOpacity>
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   // marginTop: responsiveHeight(2),
//                   // marginBottom: responsiveHeight(1.5),
//                 }}
//               >
//                 <TouchableOpacity
//                   onPress={() => {
//                     rbsheet_Ref?.current?.close();
//                     chooseFromCamera();
//                   }}
//                   activeOpacity={0.6}
//                   style={{
//                     width: "80%",
//                     alignSelf: "center",
//                     paddingVertical: 15,
//                     borderBottomWidth: 1,
//                     borderColor: "#EBEBEB",
//                     flexDirection: "row",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "#717171",
//                       // fontFamily: fontFamily.BioSans_Regular,
//                       fontSize: 16,
//                       marginLeft: 10,
//                       textAlign: "center",
//                       width: "100%",
//                     }}
//                   >
//                     TAKE A PHOTO
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     rbsheet_Ref?.current?.close();
//                     chooseFromGallery();
//                   }}
//                   activeOpacity={0.6}
//                   style={{
//                     width: "80%",
//                     alignSelf: "center",
//                     paddingVertical: 15,
//                     borderBottomWidth: 0,
//                     borderColor: "#EBEBEB",
//                     flexDirection: "row",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "#717171",
//                       // fontFamily: fontFamily.BioSans_Regular,
//                       fontSize: 16,
//                       marginLeft: 10,
//                       textAlign: "center",
//                       width: "100%",
//                     }}
//                   >
//                     CHOOSE FROM GALLERY
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </RBSheet>
//         </View>
//       </ScrollView>
//     </Animated.View>
//   );
// };

// export default UpdateProfile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//   },
//   textInputView: {
//     marginVertical: 12,
//   },
//   textInputHeading: {
//     color: "#000000",
//     fontSize: 17,
//     marginVertical: 5,
//     marginBottom: 15,
//     fontFamily: "Rubik-Regular",
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 9,
//     paddingHorizontal: 17,
//     borderRadius: 5,
//   },
//   btn: {
//     backgroundColor: "#38acff",
//     marginBottom: 40,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 10,
//     marginTop: 30,
//   },
//   btnText: { color: "#ffffff", fontSize: 17, fontFamily: "Rubik-Regular" },
//   errorText: {
//     color: "#D66262",
//     fontSize: 12,
//     marginLeft: 10,
//     marginTop: 3,
//     fontFamily: "Rubik-Regular",
//   },
// });
