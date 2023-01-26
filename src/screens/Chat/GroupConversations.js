import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  GiftedChat,
  Send,
  Bubble,
  Time,
  InputToolbar,
  Composer,
  SystemMessage,
  Actions,
  MessageImage,
} from "react-native-gifted-chat";
import uuid from "react-native-uuid";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Header from "../../Reuseable Components/Header";
import { getDatabase, get, ref, onValue, off, update } from "firebase/database";
import { useSelector } from "react-redux";
import storage from "@react-native-firebase/storage";
import Loader from "../../Reuseable Components/Loader";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";
import { api } from "../../constants/api";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import HighlightText from "@sanar/react-native-highlight-text";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Modal } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import ImageWithCaption from "../../Reuseable Components/ImageWithCaption";

const GroupConversations = ({ navigation, route }) => {
  const chatRef = useRef(null);
  const _messageContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [userId, setUserId] = useState("-1");
  // const [userId, setUserId] = useState(route.params.user.id);
  // console.log(route.params.user.id);

  //
  const [selectedUserType, setSelectedUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser_PhoneNo, setSelectedUser_PhoneNo] = useState("");
  const [profile_Image, setProfile_Image] = useState(null);

  const [highLightSearchText, setHighLightSearchText] = useState("");

  const [extraData, setExtraData] = useState(new Date()); //to render chat list

  const [selectedMessages, setSelectedMessages] = useState([]);

  const [visible, setVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isSendPressed, setIsSendPressed] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [fileName, setFileName] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  // useEffect(() => {
  //   // if (chatRef) {
  //   //   //scroll to specific message
  //   //   chatRef?.current?._messageContainerRef?.current?.scrollToIndex({
  //   //     animated: true,
  //   //     index: 6,
  //   //   });
  //   //   console.log('chatRaf :: ');
  //   // } else {
  //   //   console.log('chat ref is undefiend......');
  //   // }
  // }, []);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       setKeyboardVisible(true);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => {
  //       setKeyboardVisible(false);
  //     }
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  //
  //--------------------------------------------------CHATTING USING FIREBASE---------------------------------------------

  // chating through firebase
  const [myData, setMyData] = useState(null);
  let { userDetail, routeUserType, selectedChatUser, selectedChatGroup } =
    useSelector((state) => state.userReducer);
  let selectedUser = selectedChatGroup;

  useEffect(() => {
    getGroupDetail();
  }, []);

  const getGroupDetail = async () => {
    let group_info = await getGroup_Info(selectedUser?.id);
    if (group_info) {
      let img = group_info?.image_link
        ? BASE_URL_Image + "/" + group_info?.image_link
        : "";
      setProfile_Image(img);
    }
  };

  //getting specific group info
  const getGroup_Info = (id) => {
    return new Promise((resolve, reject) => {
      try {
        var requestOptions = {
          method: "POST",
          body: JSON.stringify({
            id: id,
          }),
          redirect: "follow",
        };
        fetch(api.get_group_detail, requestOptions)
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

  const findUser = async (name) => {
    const database = getDatabase();

    const mySnapshot = await get(ref(database, `users/${name}`));
    return mySnapshot.val();
  };

  const findGroupInfo = async (id) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `groups/${id}`));
    return mySnapshot.val();
  };

  const updatedUnreadMessageCount = async (
    groupMemerbsList,
    groupId,
    created_at
  ) => {
    console.log("updateing unread message count....");
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem("user_id");
        const database = getDatabase();
        console.log("groupMemerbsList  :::: ", groupMemerbsList?.length);
        for (const element of groupMemerbsList) {
          console.log("element :::: ", element);
          console.log("__________________________", element?.id, user_id);
          if (element?.id != user_id) {
            console.log("updatng.....");
            if (new Date(element?.deleted_at) < new Date(created_at)) {
              let member_index = groupMemerbsList.findIndex(
                (item) => item?.id == element?.id
              );
              console.log("member_index  ::: ", member_index);
              if (member_index != -1) {
                let unread_count = element?.unread_count + 1;
                let newObj = {
                  ...element,
                  unread_count: unread_count ? unread_count : 1,
                };
                update(
                  ref(database, `groups/${groupId}/members/${member_index}`),
                  newObj
                );
              }
            }
          } else {
            console.log("both are same");
          }
        }
        resolve(true);
      } catch (error) {
        resolve(true);
      }
    });
  };

  const markUnreadAsRead = async (groupMemerbsList, groupId) => {
    let user_id = await AsyncStorage.getItem("user_id");
    const database = getDatabase();
    //remove current group_memeber from this group
    const members = groupMemerbsList ? groupMemerbsList : [];
    let memberDetail = members.find((item) => item?.id == user_id);
    let member_index = members.findIndex((item) => item?.id == user_id);
    if (memberDetail && member_index != -1) {
      let newObj = {
        ...memberDetail,
        unread_count: 0,
      };
      update(
        ref(database, `groups/${groupId}/members/${member_index}`),
        newObj
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const myChatroom = await fetchMessages();

      //here selectedUser is user is basically selected group

      //getting logged in user detail from group memebers list
      const groupDetail = await findGroupInfo(selectedUser?.id);
      const groupMembers = groupDetail?.members ? groupDetail?.members : [];

      markUnreadAsRead(groupMembers, selectedUser?.id);

      const my_memberDetail = groupMembers?.filter(
        (item) => item?.id == userDetail?.id
      );

      //get my joining time --> when i joined this group
      const joined_at = my_memberDetail[0]?.created_at;
      const deleted_at = my_memberDetail[0]?.deleted_at;

      let messagesList =
        myChatroom?.messages?.length > 0 ? myChatroom.messages : [];
      if (messagesList.length > 0) {
        // if (joined_at) {
        //   // messagesList = messagesList?.filter(
        //   //   (item) => item?.createdAt >= joined_at
        //   // );
        //   messagesList = messagesList?.filter(
        //     (item) => item?.createdAt >= joined_at
        //   );
        // }

        if (deleted_at) {
          messagesList = messagesList?.filter(
            (item) => new Date(item?.createdAt) >= new Date(deleted_at)
          );
        }

        setMessages(messagesList.reverse());
      } else {
        console.log("no messsage found", messagesList);
      }
    };
    loadData();

    // set chatroom change listener
    const database = getDatabase();
    const chatroomRef = ref(
      database,
      `group_chatroom/${selectedUser.chatroomId}`
    );
    onValue(chatroomRef, async (snapshot) => {
      const data = snapshot.val();
      let messagesList = data?.messages?.length > 0 ? data.messages : [];

      // const myChatroom2 = await fetchMessages();
      // let messagesList =
      //   myChatroom2?.messages?.length > 0 ? myChatroom2.messages : [];

      // let messagesList = data ? renderMessages(data.messages) : [];

      // console.log("messagesList ::: ", messagesList);

      if (messagesList) {
        //    getting logged in user detail from group memebers list
        const groupDetail = await findGroupInfo(selectedUser?.id);
        const groupMembers = groupDetail?.members ? groupDetail?.members : [];
        //update unread_messages count

        // updatedUnreadMessageCount(groupMembers, selectedUser?.id);
        markUnreadAsRead(groupMembers, selectedUser?.id);

        const my_memberDetail = groupMembers?.filter(
          (item) => item?.id == userDetail?.id
        ); //get my joining time --> when i joined this group
        const joined_at = my_memberDetail[0]?.created_at;
        const deleted_at = my_memberDetail[0]?.deleted_at;
        // if (joined_at) {
        //   messagesList = messagesList?.filter(
        //     (item) => item?.createdAt >= joined_at
        //   );
        // }

        if (deleted_at) {
          messagesList = messagesList?.filter(
            (item) => new Date(item?.createdAt) >= new Date(deleted_at)
          );
        }

        // console.log("messagesList  :::   ", messagesList);

        // setMessages(messagesList);
        setMessages(messagesList.reverse());
      }
    });
    return () => {
      //remove chatroom listener
      off(chatroomRef);
    };
  }, [fetchMessages, renderMessages, selectedUser?.chatroomId]);

  const renderMessages = useCallback(
    (msgs) => {
      return msgs
        ? msgs.reverse().map((msg, index) => ({
            ...msg,
            _id: index,
            user: {
              _id:
                msg.user._id === userDetail?.id
                  ? userDetail?.id
                  : selectedUser?.id,
              avatar:
                msg.user._id === userDetail?.id
                  ? userDetail?.avatar
                  : selectedUser?.avatar,
              name:
                msg.user._id === userDetail?.name
                  ? userDetail?.name
                  : selectedUser?.name,
            },
          }))
        : [];
    },
    [
      userDetail?.avatar,
      userDetail?.name,
      selectedUser?.avatar,
      selectedUser?.name,
    ]
  );

  const fetchMessages = useCallback(async () => {
    const database = getDatabase();
    const snapshot = await get(
      ref(database, `group_chatroom/${selectedUser.chatroomId}`)
    );
    return snapshot.val();
  }, [selectedUser?.chatroomId]);

  const handleSend = useCallback(
    async (msg = "", url, isImage, caption) => {
      //send the msg[0] to the other user
      const database = getDatabase();

      //fetch fresh messages from server
      const currentChatroom = await fetchMessages();

      const lastMessages = currentChatroom.messages || [];

      if (userDetail?.id) {
        //updated read count
        const groupDetail = await findGroupInfo(selectedUser?.id);
        const groupMembers = groupDetail?.members ? groupDetail?.members : [];
        //update unread_messages count

        let created_at = new Date();

        await updatedUnreadMessageCount(
          groupMembers,
          selectedUser?.id,
          created_at
        );

        let newMessage = msg[0];
        let obj_newMessage = {
          // _id: newMessage?._id,
          _id: uuid.v4(),
          // text: newMessage?.text,
          text: isImage ? caption : newMessage?.text,
          // text: isImage ? "" : newMessage?.text,
          image: isImage ? url : "",
          type: isImage ? "image" : "text",
          createdAt: isImage ? created_at : newMessage?.createdAt,
          read: false,
          user: {
            _id: userDetail?.id,
            name: userDetail?.first_name
              ? userDetail?.first_name
              : userDetail?.name,
          },
        };
        //TODO: also update messages list in firebase
        update(ref(database, `group_chatroom/${selectedUser?.chatroomId}`), {
          messages: [...lastMessages, obj_newMessage],
        });

        // console.log("obj_newMessage ::: ", obj_newMessage);
        // let newList = [...lastMessages, obj_newMessage];
        // console.log("newList  ::::   ", newList);
        // setMessages(newList);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, obj_newMessage)
        );
        // setExtraData(new Date());
      } else {
        console.log("user detil not found ::::::::");
      }
    },
    [fetchMessages, myData?.username, selectedUser?.chatroomId]
  );

  const handleImageUpload = useCallback(async (fileName, filePath, caption) => {
    try {
      console.log("uploading image......  ::::  ", fileName, filePath, caption);
      if (!fileName) return;
      setLoading(true);
      // let fileName = file?.path?.split('/').pop();

      const uploadTask = storage().ref().child(fileName).putFile(filePath);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress = Math.round(
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          // );
        },
        (error) => {
          // alert(error);
          setLoading(false);
        },
        async () => {
          const url = await storage().ref(fileName).getDownloadURL();
          let isImage = true;
          // let message = "";
          let message = "";
          setLoading(false);

          handleSend(message, url, isImage, caption);
        }
      );
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const handleSendImageWithCaption = () => {
    if (fileUri) {
      setIsSendPressed(true);
      setVisible(false);
      handleImageUpload(fileName, fileUri, imageCaption);
      setIsSendPressed(false);
      setImageCaption("");
    } else {
      Snackbar.show({
        text: "Something went wrong",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  //---------------------------------------------

  //--------------------------------------------------CHATTING USING FIREBASE---------------------------------------------

  // useEffect(() => {
  //   // console.log(route.params.user.id);
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //       image: null,
  //     },
  //     {
  //       _id: 2,
  //       text: 'Hello developer how was the day',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 3,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //       image: null,
  //     },
  //   ]);
  // }, []);

  const onSend = useCallback((messages = []) => {
    handleSend(messages);
    // setMessages(previousMessages =>
    //   GiftedChat.append(previousMessages, messages),
    // );
  }, []);

  const SendComponent = (props) => {
    return (
      <Send
        {...props}
        containerStyle={{
          borderWidth: 0,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            height: "100%",
            marginRight: 10,
            borderWidth: 0,
          }}
        >
          <Image
            source={require("../../../assets/images/send.png")}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              // marginBottom: 14,
            }}
          />
        </View>
      </Send>
    );
  };

  // const CustomBubble = props => {
  //   return (
  //     <Bubble
  //       {...props}
  //       textStyle={{
  //         right: {
  //           color: '#ffffff',
  //         },
  //         left: {
  //           color: '#ffffff',
  //         },
  //       }}
  //       wrapperStyle={{
  //         left: {
  //           backgroundColor: '#0496FF',
  //         },
  //         right: {
  //           backgroundColor: '#003E6B',
  //         },
  //       }}
  //     />
  //   );
  // };

  const CustomBubble = (props) => {
    // if (props?.currentMessage?.text == 11) {
    //   console.log("________________");
    //   console.log(
    //     " props?.currentMessage?.text ::",
    //     props?.currentMessage?.text,
    //     highLightSearchText != "" &&
    //       props?.currentMessage?.text
    //         ?.toLocaleLowerCase()
    //         .includes(highLightSearchText?.toLocaleLowerCase())
    //   );
    // }
    return (
      <Bubble
        ref={_messageContainerRef}
        {...props}
        textStyle={{
          right: {
            color: "#ffffff",
          },
          left: {
            color: "#ffffff",
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor:
              props?.currentMessage?.text == "" ? "transparent" : "#0496FF",
            marginBottom: 25,
            width: 157,
          },
          right: {
            backgroundColor:
              props?.currentMessage?.text == "" ? "transparent" : "#003E6B",
            marginBottom: 25,
            width: 157,
          },
        }}
        // timeTextStyle={{
        //   left: {
        //     color: "#BDBDBD",
        //     marginBottom: -18,
        //   },
        //   right: {
        //     color: "white",
        //     marginBottom: -18,
        //   },
        // }}
      />
    );
  };

  const CustomBubbleText = (props) => {
    // console.log(
    //   "props?.currentMessage?.user?.name  ",
    //   props?.currentMessage.user
    // );
    return (
      <View>
        <Text
          style={{
            color: "#fff",
            paddingHorizontal: 10,
            paddingVertical: 3,
            fontWeight: "bold",
          }}
          numberOfLines={1}
        >
          ~{props?.currentMessage?.user?.name}
          {/* {props?.currentMessage?.text} */}
        </Text>
        <HighlightText
          highlightStyle={{ backgroundColor: "#fcba03" }}
          searchWords={[props?.currentMessage?.highlightText]}
          textToHighlight={props?.currentMessage?.text}
          style={{
            fontSize: 16,
            lineHeight: 20,
            // marginTop: 5,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            color: "#fff",
            ...props?.style,
          }}
        />
      </View>
    );
  };
  const CustomBubbleImage = (props) => {
    return (
      <MessageImage
        {...props}
        imageStyle={{
          backgroundColor: "red",
          marginBottom: 15,
        }}
      />
    );
  };

  const CustomTime = (props) => {
    return (
      <View
        style={{
          position: "relative",
          top: props?.currentMessage?.text == "" ? 0 : 25,
        }}
      >
        <Time
          {...props}
          timeTextStyle={{
            left: {
              color: "#838383",
            },
            right: {
              color: "#838383",
            },
          }}
        />
      </View>
    );
  };
  const CustomMessageImage = (props) => {
    return (
      <MessageImage
        {...props}
        imageStyle={{
          width: 150,
          height: 100,
          borderRadius: 13,
          margin: 3,
          resizeMode: "stretch",
        }}
      />
    );
  };

  const CustomInputToolbar = (props) => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          height: 60,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          left: 0,
          right: 0,
          bottom: 9,
        }}
      >
        <View
          style={{
            backgroundColor: "red",
            position: "absolute",
            top: 52,
            left: 18,
            width: "100%",
          }}
        >
          <InputToolbar
            {...props}
            containerStyle={{
              //   backgroundColor: 'red',
              height: 42,
              borderColor: "#ccc",
              borderTopColor: "#ccc",
              borderTopWidth: 1,
              borderWidth: 1,
              borderRadius: 10,
              width: "90%",
            }}
          />
        </View>
      </View>
    );
  };

  const handleImagePick = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    let id = messages.length;
    await launchCamera(options)
      .then((res) => {
        if (res.assets[0].fileName && res.assets[0].uri) {
          setFileName(res.assets[0].fileName);
          setFileUri(res.assets[0].uri);
          setVisible(true);
          setIsSendPressed(false);
        } else {
          console.log("something went wrong in image picker");
        }

        // handleImageUpload(res.assets[0].fileName, res.assets[0].uri);
      })
      .catch((error) => console.log(error));
  };

  const handleGallery = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    let id = messages.length;
    await launchImageLibrary(options)
      .then((res) => {
        if (res.assets[0].fileName && res.assets[0].uri) {
          setFileName(res.assets[0].fileName);
          setFileUri(res.assets[0].uri);
          setVisible(true);
          setIsSendPressed(false);
        } else {
          console.log("something went wrong in image picker");
        }

        // handleImageUpload(res.assets[0].fileName, res.assets[0].uri);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    const delayDebounceFn1 = setTimeout(() => {
      if (searchText) {
        setLoading(true);
      }
    }, 300);
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchText);
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
      clearTimeout(delayDebounceFn1);
    };
  }, [searchText]);

  const clearSearchList = () => {
    if (messages?.length > 0) {
      const newData = messages.map((item) => {
        return {
          ...item,
          highlight: false,
          highlightText: "",
        };
      });
      setMessages(newData);
    }
  };

  const handleSearch = (txt) => {
    setHighLightSearchText("");
    if (txt) {
      let index = messages?.findIndex((obj) =>
        obj?.text?.toLocaleLowerCase()?.includes(txt?.toLocaleLowerCase())
      );

      if (index != -1 && chatRef) {
        chatRef?.current?._messageContainerRef?.current?.scrollToIndex({
          animated: true,
          index: index,
        });

        setExtraData(new Date());
        // setMessages(messages);
        const newData = messages.map((item) => {
          if (
            item?.text?.toLocaleLowerCase()?.includes(txt?.toLocaleLowerCase())
          ) {
            return {
              ...item,
              highlight: true,
              highlightText: txt,
            };
          } else {
            return {
              ...item,
              highlight: false,
              highlightText: "",
            };
          }
        });
        setMessages(newData);
        setHighLightSearchText(txt);
        setLoading(false);
      } else {
        clearSearchList();
        setExtraData(new Date());
        setLoading(false);
        Snackbar.show({
          text: "No Results Found",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      setExtraData(new Date());
      if (messages?.length > 0) {
        setMessages(messages);
      }
      setHighLightSearchText("");
      setLoading(false);

      clearSearchList();
    }
  };

  const handleCancelSearch = () => {
    setIsSearch(false);
    setSearchText("");
    setExtraData(new Date());
    clearSearchList();
  };

  const CustomChatView = (props) => {
    return <View style={{ backgroundColor: "red" }}></View>;
  };
  return (
    <View style={styles.container}>
      {!isSearch ? (
        <View style={styles.headerView}>
          <TouchableOpacity
            style={{ padding: 10, paddingLeft: 0 }}
            onPress={() => navigation?.goBack()}
          >
            <Image
              source={require("../../../assets/images/left-arrow.png")}
              style={{ width: 12, height: 20 }}
            />
          </TouchableOpacity>
          {profile_Image ? (
            <Image
              source={{ uri: profile_Image }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: "#ccc",
                marginHorizontal: 10,
              }}
            />
          ) : (
            <Image
              source={require("../../../assets/images/group-profile2.png")}
              style={{ width: 40, height: 40, marginHorizontal: 10 }}
            />
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#000000",
                fontSize: 17,
                fontFamily: "Rubik-Medium",
              }}
            >
              {/* {route?.params?.user?.name} */}
              {/* test */}
              {selectedUser?.name}
            </Text>
            {/* <Text
              style={{
                color: "#4BE36C",
                fontSize: 14,
                fontFamily: "Rubik-Regular",
              }}
            >
              Online Now
            </Text> */}
          </View>
          <TouchableOpacity onPress={() => setIsSearch(true)}>
            <Image
              source={require("../../../assets/images/search.png")}
              style={{ width: 23, height: 23, resizeMode: "stretch" }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerView}>
          <View style={styles.searchView}>
            <TextInput
              style={styles.searchTextIntput}
              placeholder={"Search"}
              value={searchText}
              onChangeText={(txt) => {
                setSearchText(txt);
              }}
            />
            <Image
              source={require("../../../assets/images/search.png")}
              style={{ height: 20, width: 20 }}
            />
          </View>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => {
              handleCancelSearch();
            }}
          >
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 0.97, backgroundColor: "#DAE7F1" }}>
        {loading && <Loader />}
        <GiftedChat
          // isTyping
          ref={chatRef}
          messages={messages}
          placeholder={"Type something..."}
          onSend={(messages) => {
            onSend(messages);
          }}
          extraData={extraData}
          shouldUpdateMessage={(props, nextProps) => {
            props.extraData !== nextProps.extraData;
            // console.log("nextProps.extraData", nextProps.extraData);
            // selectedMessages;
          }}
          // renderCustomView={(props) => {
          //   return <CustomChatView {...props} />;
          // }}
          renderUsernameOnMessage={false}
          user={{
            // _id: userId,
            _id: userDetail?.id,
            // _id: 1,
          }}
          showUserAvatar={false}
          // isCustomViewBottom={false}
          // renderMessageText={props => {
          //   let {currentMessage} = props;
          //   console.log(currentMessage);
          //   return (
          //     <View
          //       style={{
          //         backgroundColor:
          //           currentMessage.user._id == 1 ? 'red' : 'blue',
          //       }}>
          //       <Text>{currentMessage.text}</Text>
          //     </View>
          //   );
          // }}
          renderInputToolbar={(props) => {
            return <CustomInputToolbar {...props} />;
          }}
          renderAvatar={null}
          // renderAvatar={(props) => {
          //   return null;
          // }}
          renderBubble={(props) => {
            return <CustomBubble {...props} />;
          }}
          renderMessageText={(props) => {
            return <CustomBubbleText {...props} />;
          }}
          renderMessageImage={(props) => {
            return <CustomMessageImage {...props} />;
          }}
          // renderMessageImage={(props) => {
          //   return <CustomBubbleImage {...props} />;
          // }}
          renderSend={(props) => {
            return <SendComponent {...props} />;
          }}
          renderTime={(props) => {
            return <CustomTime {...props} />;
          }}
          alwaysShowSend
          renderActions={(props) => {
            return (
              <Actions
                style={{ backgroundColor: "red", marginBottom: 20 }}
                {...props}
                options={{
                  ["Open Camera"]: (props) => {
                    handleImagePick();
                  },
                  ["Open Gallery"]: (props) => {
                    handleGallery();
                  },

                  Cancel: (props) => {
                    console.log("Cancel");
                  },
                }}
                icon={() => (
                  <Image
                    source={require("../../../assets/images/Bitmap.png")}
                    style={{ width: 20, height: 20, marginTop: 2 }}
                  />
                )}
                // onSend={args => console.log(args)}
              />
            );
          }}
          renderChatEmpty={(props) => {
            return (
              <View
                {...props}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 14,
                    transform: [{ scaleY: -1 }],
                  }}
                >
                  No Conversations Yet
                </Text>
              </View>
            );
          }}
        />
      </View>

      <ImageWithCaption
        visible={visible}
        setVisible={setVisible}
        fileUri={fileUri}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        imageCaption={imageCaption}
        setImageCaption={setImageCaption}
        isSendPressed={isSendPressed}
        onSendPress={() => handleSendImageWithCaption()}
      />

      {/* <Modal
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
              backgroundColor: "red",
            }}
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
                  source={require("../../../assets/images/closesearch.png")}
                  style={{
                    height: responsiveWidth(5),
                    width: responsiveWidth(5),
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center" }}>
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
                    onPress={() => handleSendImageWithCaption()}
                  >
                    <Image
                      source={require("../../../assets/images/send.png")}
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
      </Modal> */}
    </View>
  );
};

export default GroupConversations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingBottom: 30,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // zIndex: 999,
  },

  searchView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 10,
    marginRight: 15,
    height: 40,
  },
  searchTextIntput: {
    flex: 1,
    borderColor: "#FFFFFF",
    padding: 8,
    color: "#000000",
  },
  btnCancel: {
    // alignSelf: 'flex-end',
    justifyContent: "center",
  },
  btnCancelText: {
    textAlign: "right",
    color: "#4e4e4e",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
  },
});
