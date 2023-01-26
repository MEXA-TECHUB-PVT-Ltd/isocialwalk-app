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
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { api } from "../../constants/api";
import Snackbar from "react-native-snackbar";
import Loader from "../../Reuseable Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";

const CreateChallenges = ({ navigation, route }) => {
  const [challengeImage, setchallengeImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [membersList, setMembersList] = useState([
    // {
    //   id: 0,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 1,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 2,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 3,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 4,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 5,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 6,
    //   group_name: "Naomi",
    //   selected: false,
    // },
    // {
    //   id: 7,
    //   group_name: "Naomi",
    //   selected: false,
    // },
  ]);

  const [groupsList, setGroupsList] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  // challenges list
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [challengeTypes, setChallengeTypes] = useState([
    { label: "Individual Challenge", value: "indiviual" },
    { label: "Group Challenge", value: "group" },
  ]);
  const [selectedChallengeType, setSelectedChallengeType] = useState(
    challengeTypes[0].value
  );

  //challenges visibility
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [challengeVisibilities, setChallengeVisibilities] = useState([
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ]);
  const [selectedVisibility, setSelectedVisibility] = useState(
    challengeVisibilities[0].value
  );

  //challenges entry
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [entriesList, setEntriesList] = useState([
    // {label: 'Anyone can join', value: 'Anyone can join'},
    // {label: 'Permission Required', value: 'Permission Required'},
    { label: "Anyone can join", value: "public" },
    { label: "Permission Required", value: "private" },
  ]);
  const [selectedEntry, setSelectedEntry] = useState(entriesList[0]?.value);

  //steps list
  const [isMetricopen, setIsMetricopen] = useState(false);
  const [metricList, setMetricList] = useState([
    // {label: 'Total Steps', value: 'Total Steps'},
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ]);

  const [selectedMetric, setselectedMetric] = useState(null);
  // const [selectedMetric, setselectedMetric] = useState(metricList[0]?.value);

  const [isStartDatePickerShow, setIsStartDatePickerShow] = useState(false);
  const [isEndDatePickerShow, setIsEndDatePickerShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [metricNumber, setMetricNumber] = useState("");
  useEffect(() => {
    getAddMembersList();
    getUserGroups();
  }, []);

  const getUserGroups = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    // setGroupList([]);
    let data = {
      created_by_user_id: user_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };
    fetch(api.search_group_by_specific_admin, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.error == false || result?.error == "false") {
          let responseList = result?.Groups ? result?.Groups : [];
          let list = [];
          if (responseList?.length > 0) {
            responseList.forEach((element) => {
              let obj = {
                id: element?.id,
                name: element?.name,
                profile: element?.image
                  ? BASE_URL_Image + "/" + element?.image
                  : "",
                status: false,
              };
              list.push(obj);
            });
          } else {
            Snackbar.show({
              text: "No Group Found",
              duration: Snackbar.LENGTH_SHORT,
            });
          }
          setGroupsList(list);
          // setGroupList(list);
        } else {
          // setGroupList([]);
          Snackbar.show({
            text: result?.Message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => {
        console.log("error  : ", error);
        Snackbar.show({
          text: "Something went wrong.Unable to get groups.",
          duration: Snackbar.LENGTH_SHORT,
        });
      })
      .finally(() => setLoading(false));
  };

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

    fetch(api.show_challenge_participants, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result[0]?.error == false || result[0]?.error == false) {
          // console.log("add member list response  ::: ", result);
          // console.log("cjhallgennge paticipatns list :: ", result);
          // let list = result[0]["array of Members"]
          //   ? result[0]["array of Members"]
          //   : [];
          let response = result ? result : [];
          let last_item = response?.pop();
          let list = last_item ? last_item["array of participants"] : [];
          let responseList = [];
          for (const element of list) {
            const found = responseList.some((el) => el.id === element);
            if (!found) {
              let user_info = await getUser_Info(element);

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

  const onStartDateChange = (event, value) => {
    setIsStartDatePickerShow(false);
    setStartDate(value);
  };
  const onEndDateChange = (event, value) => {
    setIsEndDatePickerShow(false);
    setEndDate(value);
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
        console.log("images selected :: ", res.assets[0]?.fileName);
        setFileName(res.assets[0]?.fileName);
        setFileType(res.assets[0]?.type);
        setchallengeImage(res.assets[0].uri);
      })
      .catch((error) => console.log(error));
  };

  const handleGroupSelect = (id) => {
    const newData = groupsList.map((item) => {
      if (id === item.id) {
        return {
          ...item,
          // selected: !item.selected,
          status: !item.status,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setGroupsList(newData);
  };
  const handleAddMember = (id) => {
    const newData = membersList.map((item) => {
      console.log("item : ", item);
      if (id === item.id) {
        return {
          ...item,
          // selected: !item.selected,
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

  const handleAddGroup_In_Challenge = (adminid, challengeId) => {
    let selectedGroupList = groupsList
      ?.filter((item) => item?.status == true)
      ?.map((element) => element?.id);

    console.log("selected groups ::: ", selectedGroupList);
    if (selectedGroupList?.length > 0) {
      selectedGroupList.forEach((element) => {
        console.log("group id  :: ", element);

        //adding group to challenge one by one
        setLoading(true);
        let data = {
          // challenge_id: challengeId,
          // group_id: element, //selected group id
          // user_id: adminid,
          // date: new Date(),

          date: new Date(),
          group_id: element,
          challenge_id: challengeId,
        };

        console.log("data pass  to add members in challgee api  : ", data);
        var requestOptions = {
          method: "POST",
          body: JSON.stringify(data),
          redirect: "follow",
        };

        fetch(api.add_group_to_Challenge, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("add group response :::: ", result);
            // if (result[0]?.error == false || result[0]?.error == "false") {
            //   console.log("group is added to challnge successfully");
            // } else {
            //   Snackbar.show({
            //     text: result[0]?.message,
            //     duration: Snackbar.LENGTH_SHORT,
            //   });
            // }
          })
          .catch((error) => {
            console.log("error in add groups  ::::  ", error);
            Snackbar.show({
              text: "Something went wrong.Group is not added to challenge.",
              duration: Snackbar.LENGTH_SHORT,
            });
          })
          .finally(() => setLoading(false));
      });
    } else {
      console.log("no group is selected to add in challenge");
    }
  };
  const handleAddMemberstoChallenge = (adminid, challengeId) => {
    console.log("adminid, challengeId :::: ", adminid, challengeId);
    let selectedMembersList = membersList
      ?.filter((item) => item?.status == true)
      ?.map((element) => element?.id);

    if (selectedMembersList?.length > 0) {
      setLoading(true);

      let data = {
        user_id: selectedMembersList,
        challenge_id: challengeId,
        created_by_user_id: adminid,
        date: new Date(),
      };
      console.log("data pass  to add members in challgee api  : ", data);
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.add_participants_to_Challenge, requestOptions)
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
        .catch((error) => {
          console.log("error in add members  ::::  ", error);
          Snackbar.show({
            text: "Something went wrong.Members are not added to challenge.",
            duration: Snackbar.LENGTH_SHORT,
          });
        })
        .finally(() => setLoading(false));
    } else {
      console.log("not member is selected to add in challenge");
    }
  };

  const handleCreateChallenge = async () => {
    if (challengeImage == null) {
      Snackbar.show({
        text: "Please Upload Challenge Image",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (challengeName?.length == 0) {
      Snackbar.show({
        text: "Please Enter Challenge Name",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (metricNumber?.length == 0) {
      Snackbar.show({
        text: "Please Enter Challenge Metric",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (selectedMetric == null) {
      Snackbar.show({
        text: "Please Select Challenge Metric Total Steps.",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      let user_id = await AsyncStorage.getItem("user_id");
      setLoading(true);
      let data = {
        created_by_user_id: user_id,
        name: challengeName,
        challenge_type: selectedChallengeType,
        challenge_visibility: selectedVisibility,
        challenge_privacy: selectedEntry,
        end_date: moment(new Date(endDate)).format("YYYY-MM-DD"),
        start_date: moment(new Date(startDate)).format("YYYY-MM-DD"),
        challenge_metric_no: metricNumber,
        challenge_metric_step_type: selectedMetric,
      };
      console.log("data of create challenge  ::: ", data);
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(api.create_challenge, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("response create challenge ::: ", result);
          if (
            result?.error == false ||
            result[0]?.error == false ||
            result[0]?.error == "false"
          ) {
            handleUploadImage(result["challenge id"]);
            if (selectedChallengeType == "group") {
              handleAddGroup_In_Challenge(user_id, result["challenge id"]);
            } else {
              handleAddMemberstoChallenge(user_id, result["challenge id"]);
            }
            Snackbar.show({
              text: "Challenge Created successfully!",
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
        .catch((error) =>
          console.log("error occur in create challenge ", error)
        )
        .finally(() => setLoading(false));
    }
  };
  const handleUploadImage = (id) => {
    if (id) {
      console.log("id pass to upload challenge image :::: ", id);
      setLoading(true);

      let formData = new FormData();
      formData.append("id", id);
      let obj = {
        uri: challengeImage,
        type: fileType,
        name: fileName,
      };
      console.log("image obj  : ", obj);
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

      fetch(api.upload_challenge_image, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("challenge image upload response  ::: ", result);
        })
        .catch((error) =>
          console.log("error in uploading group image :: ", error)
        )
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
        <Header title={"Create Challenge"} navigation={navigation} />

        {loading && <Loader />}

        <View style={{ marginVertical: 10, alignItems: "center" }}>
          <View style={{}}>
            {challengeImage == null ? (
              <Image
                source={require("../../../assets/images/Challenge.png")}
                style={{
                  marginVertical: 10,
                  height: 123,
                  width: 123,
                }}
              />
            ) : (
              <Image
                source={{ uri: challengeImage }}
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
                  borderRadius: 30,
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
              marginTop: 5,
            }}
          >
            Challenge image
          </Text>
        </View>
        {/* ----------------------------------Create Challenge Form Start---------------------------------------- */}
        <View>
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Challenge Name</Text>
            <TextInput
              style={styles.textInput}
              autoFocus
              placeholder={"Enter Challenge Name"}
              value={challengeName}
              onChangeText={(txt) => setChallengeName(txt)}
            />
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Challenge Type</Text>
            <DropDownPicker
              zIndex={isTypeOpen ? 999 : 0}
              open={isTypeOpen}
              value={selectedChallengeType}
              items={challengeTypes}
              setOpen={setIsTypeOpen}
              setValue={setSelectedChallengeType}
              setItems={setChallengeTypes}
              containerStyle={{
                width: "100%",
              }}
              dropDownContainerStyle={{
                padding: 0,
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                zIndex: 999,
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
          <View
            style={{ ...styles.textInputView, marginTop: isTypeOpen ? 75 : 12 }}
          >
            <Text style={styles.textInputHeading}>Challenge Visibility</Text>
            <DropDownPicker
              zIndex={isVisibilityOpen ? 999 : 0}
              open={isVisibilityOpen}
              value={selectedVisibility}
              items={challengeVisibilities}
              setOpen={setIsVisibilityOpen}
              setValue={setSelectedVisibility}
              setItems={setChallengeVisibilities}
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
            {/* <TextInput
              style={styles.textInput}
              placeholder={'Enter Challenge Name'}
            /> */}
          </View>
          {/* <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Challenge Visibility</Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Enter Challenge Name'}
            />
          </View> */}

          <View
            style={{
              ...styles.textInputView,
              marginTop: isVisibilityOpen ? 80 : 12,
            }}
          >
            <Text style={styles.textInputHeading}>Challenge Entry</Text>
            <DropDownPicker
              zIndex={isEntryOpen ? 999 : 0}
              open={isEntryOpen}
              value={selectedEntry}
              items={entriesList}
              setOpen={setIsEntryOpen}
              setValue={setSelectedEntry}
              setItems={setEntriesList}
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

          {/* <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Challenge Entry</Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Enter Challenge Name'}
            />
          </View> */}
          <View
            style={{
              ...styles.textInputView,
              marginTop: isEntryOpen ? 75 : 12,
            }}
          >
            <Text style={styles.textInputHeading}>Start Date</Text>
            <View style={{ justifyContent: "center" }}>
              <TextInput
                style={{ ...styles.textInput, paddingRight: 40 }}
                placeholder={"mm/dd/yyyy"}
                value={moment(new Date(startDate)).format("MM/DD/yyyy")}
              />
              <TouchableOpacity
                onPress={() => setIsStartDatePickerShow(true)}
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 10,
                }}
              >
                <Image
                  source={require("../../../assets/images/calender.png")}
                  style={{ width: 15, height: 17 }}
                />
              </TouchableOpacity>
              {isStartDatePickerShow === true && (
                <DateTimePicker
                  value={startDate}
                  mode={"date"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  is24Hour={true}
                  onChange={onStartDateChange}
                  style={styles.datePicker}
                />
              )}
            </View>
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>End Date</Text>
            <View style={{ justifyContent: "center" }}>
              <TextInput
                style={{ ...styles.textInput, paddingRight: 40 }}
                placeholder={"mm/dd/yyyy"}
                value={moment(new Date(endDate)).format("MM/DD/yyyy")}
              />
              <TouchableOpacity
                onPress={() => setIsEndDatePickerShow(true)}
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 10,
                }}
              >
                <Image
                  source={require("../../../assets/images/calender.png")}
                  style={{ width: 15, height: 17 }}
                />
              </TouchableOpacity>
              {isEndDatePickerShow === true && (
                <DateTimePicker
                  value={endDate}
                  mode={"date"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  is24Hour={true}
                  onChange={onEndDateChange}
                  style={styles.datePicker}
                />
              )}
            </View>
          </View>

          <View style={styles.textInputView}>
            <Text style={styles.textInputHeading}>Challenge Metric</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextInput
                style={{ ...styles.textInput, flex: 1, marginRight: 20 }}
                placeholder={"Number"}
                value={metricNumber}
                onChangeText={(txt) => setMetricNumber(txt)}
              />
              {/* <TextInput
                style={{...styles.textInput, flex: 1}}
                placeholder={'Total steps'}
              /> */}
              <DropDownPicker
                zIndex={999}
                open={isMetricopen}
                value={selectedMetric}
                placeholder="Total Steps"
                items={metricList}
                setOpen={setIsMetricopen}
                setValue={setselectedMetric}
                setItems={setMetricList}
                containerStyle={{
                  // width: '100%',
                  flex: 1.4,
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
          </View>
        </View>
        {/* ----------------------------------Create Challenge Form END------------------------------------------ */}
        <View style={{}}>
          <Text
            style={{
              color: "#000000",
              fontSize: 17,
              fontFamily: "Rubik-Regular",
            }}
          >
            Add {selectedChallengeType == "group" ? "Group" : "Members"}
          </Text>
          <View
            style={{
              marginVertical: 15,
              paddingBottom: 10,
              alignSelf: "center",
              flex: 1,
              width: "100%",
            }}
          >
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={selectedChallengeType == "group" ? groupsList : membersList}
              numColumns={3}
              // scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      selectedChallengeType == "group"
                        ? handleGroupSelect(item?.item?.id)
                        : handleAddMember(item.item.id)
                    }
                    style={{
                      ...styles.cardView,
                      justifyContent: "center",
                      width: "28.5%",
                      // width: 300,
                      // backgroundColor: item.item.selected ? "red" : "pink",
                      borderWidth: item.item.status ? 1 : 0,
                    }}
                  >
                    {selectedChallengeType == "group" &&
                      (item?.item?.profile ? (
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
                          source={require("../../../assets/images/group-profile2.png")}
                          style={{ marginVertical: 8, width: 44, height: 44 }}
                        />
                      ))}

                    {selectedChallengeType !== "group" &&
                      (item?.item?.profile ? (
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
                      ))}

                    <Text style={styles.cardText} numberOfLines={2}>
                      {item?.item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleCreateChallenge()}
            // onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnText}>Create Challenge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateChallenges;

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
    height: 110,
    width: 92,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "blue",
    elevation: 5,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 10,
    overflow: "hidden",
    borderColor: "#38acff",
  },
  cardText: {
    color: "#040103",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Rubik-Regular",
  },

  btn: {
    backgroundColor: "#38acff",
    marginTop: 30,
    marginBottom: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  btnText: { color: "#ffffff", fontSize: 17 },
});
