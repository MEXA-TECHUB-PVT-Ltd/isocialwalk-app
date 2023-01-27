import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
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
import { api } from "../../constants/api";
import { BASE_URL_Image } from "../../constants/Base_URL_Image";

import Snackbar from "react-native-snackbar";
import HighlightText from "@sanar/react-native-highlight-text";
import ImageWithCaption from "../../Reuseable Components/ImageWithCaption";

const Conversations = ({ navigation, route }) => {
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

  const [fileName, setFileName] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  const [visible, setVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isSendPressed, setIsSendPressed] = useState(false);

  // useEffect(() => {
  //   if (chatRef) {
  //     //scroll to specific message
  //     chatRef?.current?._messageContainerRef?.current?.scrollToIndex({
  //       animated: true,
  //       index: 6,
  //     });
  //     console.log("chatRaf :: ");
  //   } else {
  //     console.log("chat ref is undefiend......");
  //   }
  // }, []);

  //

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    console.log("selectedUser?.id : ", selectedUser?.id);
    let user_info = await getUser_Info(selectedUser?.id);
    console.log("user_info : :;", user_info);
    if (user_info) {
      let img = user_info["profile image"]
        ? BASE_URL_Image + "/" + user_info["profile image"]
        : "";
      setProfile_Image(img);
    }
  };

  //getting user detail
  const getUser_Info = (id) => {
    console.log("id pass to get user info  ::", id);
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
            console.log("error : ", error);
            resolve(false);
          });
      } catch (error) {
        console.log("error catch  : ", error);
        resolve(false);
      }
    });
  };

  //--------------------------------------------------CHATTING USING FIREBASE---------------------------------------------

  // chating through firebase
  const [myData, setMyData] = useState(null);
  let { userDetail, routeUserType, selectedChatUser } = useSelector(
    (state) => state.userReducer
  );
  let selectedUser = selectedChatUser;

  const findUser = async (name) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, `users/${name}`));
    return mySnapshot.val();
  };

  useEffect(() => {
    //getting user type i.e patient,doctor or hospital
    let isFirstUser = false;
    const loadData = async () => {
      const myChatroom = await fetchMessages();
      isFirstUser = myChatroom?.firstUserId == userDetail?.id ? true : false;

      let messagesList =
        myChatroom?.messages?.length > 0 ? myChatroom.messages : [];

      if (messagesList.length > 0) {
        // console.log('message list :: ', messagesList);

        //handle mark all messages as read ---------------------
        let myArr = [];
        messagesList.forEach((element, index) => {
          let obj = {
            node: index,
            data: element,
          };
          myArr.push(obj);
        });
        let unReadMessages = myArr?.filter(
          (item) =>
            item?.data?.user?._id == selectedUser?.id &&
            item?.data?.read == false
        );
        // console.log('unReadMessages :: ', unReadMessages);
        //mark all new messages as read
        const db = getDatabase();
        for (const element of unReadMessages) {
          update(
            ref(
              db,
              `chatrooms/${selectedUser.chatroomId}/messages/${element?.node}`
            ),
            {
              read: true,
            }
          );
        }
        //----------------------------------------------------------
        const logged_in_user_info = await findUser(userDetail?.id);
        if (isFirstUser) {
          messagesList = messagesList?.filter(
            (item) => item?.deletedBy1 != userDetail?.id
          );
        } else {
          messagesList = messagesList?.filter(
            (item) => item?.deletedBy2 != userDetail?.id
          );
        }
        setMessages(messagesList.reverse());
      }
    };
    loadData();

    // set chatroom change listener
    const database = getDatabase();
    const chatroomRef = ref(database, `chatrooms/${selectedUser?.chatroomId}`);
    onValue(chatroomRef, async (snapshot) => {
      const data = snapshot.val();
      // setMessages(renderMessages(data.messages));
      // let messagesList = data ? renderMessages(data.messages) : [];
      let messagesList = data?.messages?.length > 0 ? data.messages : [];
      if (messagesList) {
        //handle mark all messages as read ---------------------
        let myArr = [];
        messagesList.forEach((element, index) => {
          let obj = {
            node: index,
            data: element,
          };
          myArr.push(obj);
        });
        let unReadMessages = myArr?.filter(
          (item) =>
            item?.data?.user?._id == selectedUser?.id &&
            item?.data?.read == false
        );
        // console.log('unReadMessages :: ', unReadMessages);
        //mark all new messages as read
        console.log("unReadMessages  .....", unReadMessages);
        const db = getDatabase();
        for (const element of unReadMessages) {
          update(
            ref(
              db,
              `chatrooms/${selectedUser.chatroomId}/messages/${element?.node}`
            ),
            {
              read: true,
            }
          );
        }
        //----------------------------------------------------------
        const logged_in_user_info = await findUser(userDetail?.id);
        if (isFirstUser) {
          messagesList = messagesList?.filter(
            (item) => item?.deletedBy1 != userDetail?.id
          );
        } else {
          messagesList = messagesList?.filter(
            (item) => item?.deletedBy2 != userDetail?.id
          );
        }
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
      ref(database, `chatrooms/${selectedUser.chatroomId}`)
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
        let newMessage = msg[0];
        let obj_newMessage = {
          // _id: newMessage?._id,
          _id: uuid.v4(),
          // text: newMessage?.text,
          text: isImage ? caption : newMessage?.text,
          // text: isImage ? "" : newMessage?.text,
          image: isImage ? url : "",
          type: isImage ? "image" : "text",
          createdAt: isImage ? new Date() : newMessage?.createdAt,
          read: false,
          user: {
            _id: userDetail?.id,
            name: userDetail?.name,
          },
        };

        //TODO: also update messages list in firebase
        update(ref(database, `chatrooms/${selectedUser.chatroomId}`), {
          messages: [...lastMessages, obj_newMessage],
        });

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, obj_newMessage)
        );
      }
    },
    [fetchMessages, myData?.username, selectedUser?.chatroomId]
  );

  const handleImageUpload = useCallback(async (fileName, filePath, caption) => {
    try {
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
          let message = "";
          setLoading(false);

          // handleSend(message, url, isImage);
          handleSend(message, url, isImage, caption);
        }
      );
    } catch (error) {
      setLoading(false);
    }
  }, []);

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

  const handleSendImageWithCaption = () => {
    console.log("fileUri  ::::  ", fileUri);
    if (fileUri) {
      setIsSendPressed(true);
      setVisible(false);

      console.log(
        "fileName, fileUri, imageCaption :::: ",
        fileName,
        fileUri,
        imageCaption
      );
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
          },
          right: {
            backgroundColor:
              props?.currentMessage?.text == "" ? "transparent" : "#003E6B",
            marginBottom: 25,
          },
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
  const CustomBubbleText = (props) => {
    return (
      <HighlightText
        highlightStyle={{ backgroundColor: "#fcba03" }}
        searchWords={[props?.currentMessage?.highlightText]}
        textToHighlight={props?.currentMessage?.text}
        style={{
          fontSize: 16,
          lineHeight: 20,
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
          color: "#fff",
          ...props?.style,
        }}
      />
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
        // handleImageUpload(res.assets[0].fileName, res.assets[0].uri);
        if (res.assets[0].fileName && res.assets[0].uri) {
          setFileName(res.assets[0].fileName);
          setFileUri(res.assets[0].uri);
          setVisible(true);
          setIsSendPressed(false);
        } else {
          console.log("something went wrong in image picker");
        }
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
        // handleImageUpload(res.assets[0].fileName, res.assets[0].uri);
        if (res.assets[0].fileName && res.assets[0].uri) {
          setFileName(res.assets[0].fileName);
          setFileUri(res.assets[0].uri);
          setVisible(true);
          setIsSendPressed(false);
        } else {
          console.log("something went wrong in image picker");
        }
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
      // let arr = messages?.reverse();

      let index = messages?.findIndex(
        (obj) => obj?.text?.toLocaleLowerCase() === txt?.toLocaleLowerCase()
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
        //clear messages to remove highlight
        clearSearchList();
        setExtraData(new Date());
        setLoading(false);

        Snackbar.show({
          text: "No Results Found",
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      }
    } else {
      setExtraData(new Date());
      setHighLightSearchText("");
      setLoading(false);
      //clear messages to remove highlight
      clearSearchList();
    }
  };

  const handleCancelSearch = () => {
    setIsSearch(false);
    setSearchText("");
    setExtraData(new Date());
    const newData = messages.map((item) => {
      return {
        ...item,
        highlight: false,
        highlightText: "",
      };
    });
    setMessages(newData);
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
              source={require("../../../assets/images/friend-profile.png")}
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
                color: '#4BE36C',
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
              }}>
              Online Now
            </Text> */}
          </View>
          <TouchableOpacity onPress={() => setIsSearch(true)}>
            <Image
              source={require("../../../assets/images/search.png")}
              style={{ width: 23, height: 23 }}
              resizeMode="stretch"
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
          }}
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
    </View>
  );
};

export default Conversations;

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
