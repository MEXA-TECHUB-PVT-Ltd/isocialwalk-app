import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import moment from "moment/moment";
import Header from "../../Reuseable Components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { api } from "../../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../../Reuseable Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { image } from "d3";
import { id } from "date-fns/locale";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const CreateGroup = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  const [groupImage_Name, setGroupImage_Name] = useState("");
  const [groupImage_Type, setGroupImage_Type] = useState("");

  const [groupName, setGroupName] = useState("");
  const [isValidGroupName, setIsValidGroupName] = useState(true);
  // membership list
  const [isMembershipopen, setIsMembershipopen] = useState(false);
  const [membershipList, setMembershipList] = useState([
    // {label: 'Anyone can join', value: 'Anyone can join'},
    // {label: 'Permission Required', value: 'Permission Required'},
    { label: "Anyone can join", value: "public" },
    { label: "Permission Required", value: "private" },
  ]);
  const [selectedMembership, setSelectedMembership] = useState(
    membershipList[0].value
  );
  // visibilty list
  const [isVisibiltyOpen, setIsVisibiltyOpen] = useState(false);
  const [visiblityList, setVisiblityList] = useState([
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ]);
  const [selectedVisiblity, setSelectedVisiblity] = useState(
    visiblityList[0].value
  );

  //   members list
  const [membersList, setMembersList] = useState([
    // {
    //   id: 0,
    //   name: "Saffa",
    //   status: false,
    // },
    // {
    //   id: 1,
    //   name: "Nahla",
    //   status: false,
    // },
    // {
    //   id: 2,
    //   name: "Naomi",
    //   status: false,
    // },
    // {
    //   id: 3,
    //   name: "Rui",
    //   status: false,
    // },
  ]);

  const handleonAdd = (id) => {
    const newData = membersList.map((item) => {
      if (id === item.id) {
        return {
          ...item,
          status: !item.status,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setMembersList(newData);
  };

  const handleAddMembertoGroup = (adminid, groupId, memberList) => {
    console.log("data pass to add members ::: ", adminid, groupId, memberList);
    setLoading(true);

    let data = {
      group_id: groupId,
      adminid: adminid,
      date: new Date(),
      user_id: memberList,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.addmembers, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("add memebrs response :::: ", result);
        if (result[0]?.error == false || result[0]?.error == "false") {
          console.log("memebers are added to group successfully");
        } else {
          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => console.log("error in add memmbers  ::::  ", error))
      .finally(() => setLoading(false));
  };
  const uploadGroupImage = (id) => {
    console.log("id pass to upload group image :::: ", id);
    setLoading(true);
    console.log("group image ::::: ", groupImage);
    let formData = new FormData();
    formData.append("id", id);
    let obj = {
      uri: groupImage,
      type: groupImage_Type,
      name: groupImage_Name,
    };
    formData.append("image", obj);

    console.log("formdata   :::  : ", formData);
    // body.append('Content-Type', 'image/png');
    var requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    };

    fetch(api.group_profileimage, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("update group image response ::  ::   ", result);
        // if (result[0]?.error == false) {
        // Snackbar.show({
        //   text: result[0]?.message,
        //   duration: Snackbar.LENGTH_SHORT,
        // });
        // }
      })
      .catch((error) =>
        console.log("error in uploading group image :: ", error)
      )
      .finally(() => setLoading(false));
  };
  const handleCreateGroup = async () => {
    if (groupImage == null) {
      Snackbar.show({
        text: "Please upload group image",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (groupName.length === 0) {
      setIsValidGroupName(false);
    } else {
      setIsValidGroupName(true);
      // navigation.goBack();
      console.log(groupName, groupImage, selectedMembership);
      let user_id = await AsyncStorage.getItem("user_id");
      setLoading(true);

      let data = {
        created_by_user_id: user_id,
        name: groupName,
        group_privacy: selectedMembership,
        group_visibility: selectedVisiblity,
      };
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.create_group, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("create group response ::   ", result);
          if (result?.error == false || result?.error == "false") {
            uploadGroupImage(result?.id);
            let memberList = membersList
              ?.filter((item) => item?.status == true)
              ?.map((element) => element?.id);

            console.log("members to add ::: ", memberList);
            if (memberList?.length > 0) {
              // adminid, groupId, memberList
              handleAddMembertoGroup(user_id, result?.id, memberList);
            }
            Snackbar.show({
              text: "Group Created Successfully!",
              duration: Snackbar.LENGTH_SHORT,
            });
            navigation?.goBack();
          } else {
            Snackbar.show({
              text: result?.message,
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        })
        .catch((error) => {
          console.log("error  ::: ", error);
          Snackbar.show({
            text: "Something went wrong!",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    getAddMembersList();
  }, []);

  const getAddMembersList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      this_user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.showmembers, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result[0]?.error == false || result[0]?.error == false) {
          // console.log("add member list response  ::: ", result);
          let list = result[0]["array of Members"]
            ? result[0]["array of Members"]
            : [];
          let responseList = [];
          for (const element of list) {
            let user_info = await getUser_Info(element);
            console.log("user info  :::: ", user_info);
            if (user_info == false) {
              console.log("user detail not found ....");
            } else {
              let obj = {
                id: element, //userid
                name: user_info?.first_name,
                profile: user_info["profile image"]
                  ? BASE_URL_Image + "/" + user_info["profile image"]
                  : "",
                status: false,
              };
              responseList.push(obj);
            }
          }
          setMembersList(responseList);
        } else {
          Snackbar.show({
            text: result[0]?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => setLoading(false));
  };

  const getUser_Info = (id) => {
    return new Promise((resolve, reject) => {
      try {
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
              resolve(result[0]);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            console.log("error in getting user detail ::", error);
            resolve(false);
          });
      } catch (error) {
        console.log("error occur in getting user profile detail ::", error);
        resolve(false);
      }
    });
  };

  const pickImage = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    await launchImageLibrary(options)
      .then((res) => {
        console.log("res :", res);
        if (res.didCancel) {
          console.log("User cancelled image picker");
        } else if (res.error) {
          console.log("ImagePicker Error: ", res.error);
        } else if (res.customButton) {
          console.log("User tapped custom button: ", res.customButton);
        } else {
          console.log("image set...");
          setGroupImage(res.assets[0].uri);
          setGroupImage_Name(res.assets[0].fileName);
          setGroupImage_Type(res.assets[0].type);
        }
      })
      .catch((error) => console.log(error));
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
        <Header title={"Create Group"} navigation={navigation} />
        {loading && <Loader />}
        <View style={{ marginVertical: 10, alignItems: "center" }}>
          <View style={{}}>
            {groupImage == null ? (
              <Image
                source={require("../../../assets/images/group-profile2.png")}
                style={{
                  marginVertical: 10,
                  height: 123,
                  width: 123,
                }}
              />
            ) : (
              <Image
                source={{ uri: groupImage }}
                style={{
                  marginVertical: 10,
                  height: 123,
                  width: 123,
                  borderRadius: 123,
                }}
              />
            )}
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                position: "absolute",
                right: 0,
                top: 20,
              }}
            >
              <Image
                source={require("../../../assets/images/camera.png")}
                style={{
                  width: 30,
                  height: 28,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "#000000",
              fontSize: 17,
              fontFamily: "Rubik-Regular",
            }}
          >
            Group image
          </Text>
        </View>
        <View>
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Group Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder={"Enter Group Name"}
              autoFocus
              value={groupName}
              onChangeText={(txt) => setGroupName(txt)}
            />
            {!isValidGroupName && (
              <Text style={styles.errorText}>Please enter a group name</Text>
            )}
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Group Membership</Text>
            <DropDownPicker
              zIndex={isMembershipopen ? 999 : 0}
              open={isMembershipopen}
              value={selectedMembership}
              items={membershipList}
              setOpen={setIsMembershipopen}
              setValue={setSelectedMembership}
              setItems={setMembershipList}
              containerStyle={{
                width: "100%",
              }}
              dropDownContainerStyle={{
                padding: 0,
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
              }}
              showTickIcon={false}
              selectedItemContainerStyle={{
                backgroundColor: "#0496ff",
                marginHorizontal: 5,
              }}
              selectedItemLabelStyle={{
                color: "#FFF",
              }}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                showsHorizontalScrollIndicator: false,
              }}
              labelStyle={{
                fontSize: 14,
                textAlign: "left",
                paddingLeft: 5,
              }}
              style={{
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#ccc",
                alignSelf: "center",
                justifyContent: "center",
              }}
            />
          </View>

          {/* ----------------------Group Visibilty Dropdown______________________________________________ */}
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Group Visibility</Text>
            <DropDownPicker
              zIndex={isVisibiltyOpen ? 999 : 0}
              open={isVisibiltyOpen}
              value={selectedVisiblity}
              items={visiblityList}
              setOpen={setIsVisibiltyOpen}
              setValue={setSelectedVisiblity}
              setItems={setVisiblityList}
              containerStyle={{
                width: "100%",
              }}
              dropDownContainerStyle={{
                padding: 0,
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
              }}
              showTickIcon={false}
              selectedItemContainerStyle={{
                backgroundColor: "#0496ff",
                marginHorizontal: 5,
              }}
              selectedItemLabelStyle={{
                color: "#FFF",
              }}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                showsHorizontalScrollIndicator: false,
              }}
              labelStyle={{
                fontSize: 14,
                textAlign: "left",
                paddingLeft: 5,
              }}
              style={{
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#ccc",
                alignSelf: "center",
                justifyContent: "center",
              }}
            />
          </View>
          {/* ----------------------Group Visibilty Dropdown______________________________________________ */}

          <View
            style={{
              marginVertical: 15,
              width: SCREEN_WIDTH - 15,
              paddingRight: 15,
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 16,
                fontFamily: "Rubik-Regular",
              }}
            >
              Add Members
            </Text>
            {membersList.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 150,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 16 }}>
                  No friends to add
                </Text>
              </View>
            ) : (
              <FlatList
                data={membersList}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={(item) => {
                  return (
                    <View style={styles.cardView}>
                      {item?.item?.profile ? (
                        <Image
                          source={{ uri: item?.item?.profile }}
                          style={{
                            marginVertical: 8,
                            width: 44,
                            height: 44,
                            borderRadius: 44,
                            backgroundColor: "#ccc",
                          }}
                        />
                      ) : (
                        <Image
                          source={require("../../../assets/images/friend-profile.png")}
                          style={{ marginVertical: 8, width: 44, height: 44 }}
                        />
                      )}

                      <Text style={styles.name} numberOfLines={2}>
                        {item.item.name}
                      </Text>
                      <View
                        style={{
                          justifyContent: "flex-end",
                          flex: 1,
                        }}
                      >
                        {item.item.status ? (
                          <TouchableOpacity
                            onPress={() => handleonAdd(item.item.id)}
                            style={styles.cardButton}
                          >
                            <Text
                              style={{
                                color: "#ffffff",
                                fontSize: 11,
                                fontFamily: "Rubik-Regular",
                              }}
                            >
                              Added
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleonAdd(item.item.id)}
                            style={{
                              ...styles.cardButton,
                              backgroundColor: "#38acff",
                              width: 60,
                            }}
                          >
                            <Text
                              style={{
                                color: "#ffffff",
                                fontSize: 11,
                                fontFamily: "Rubik-Regular",
                              }}
                            >
                              Add
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleCreateGroup()}
            // onPress={() => updateGroupImage()}
          >
            <Text style={styles.btnText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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

  cardView: {
    height: 140,
    width: 101,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 5,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 25,
    overflow: "hidden",
  },
  cardButton: {
    backgroundColor: "#d8d8d8",
    width: 70,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    alignSelf: "flex-end",
    padding: 5,
  },
  name: {
    color: "#040103",
    textAlign: "center",
    fontSize: 13,
    width: 75,
    marginVertical: 5,
    fontFamily: "Rubik-Regular",
  },
  btn: {
    backgroundColor: "#38acff",
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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
