import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import MenuHeader from "../Reuseable Components/MenuHeader";
import Loader from "../Reuseable Components/Loader";
import Snackbar from "react-native-snackbar";
import { api } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConnectDevices = ({
  navigation,
  scale,
  showMenu,
  setShowMenu,
  moveToRight,
}) => {
  const right_arrow = require("../../assets/images/right-arrow.png");
  const tick_icon = require("../../assets/images/tick-icon.png");
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [devicesList, setDevicesList] = useState([
    {
      id: 0,
      name: "Apple Watch",
      isConnected: false,
    },
    {
      id: 1,
      name: "Fitbit",
      isConnected: false,
    },
    {
      id: 2,
      name: "Garmin",
      isConnected: false,
    },
  ]);
  const updateStatus = (id, deviceId) => {
    const newData = devicesList.map((item) => {
      if (id === item.id) {
        return {
          ...item,
          isConnected: !item.isConnected,
          device_id: deviceId,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setDevicesList(newData);
  };
  useEffect(() => {
    setLoading(true);
    getAllConnectedDevices();
  }, []);

  const getAllConnectedDevices = async () => {
    let user_id = await AsyncStorage.getItem("user_id");

    let data = {
      this_user_id: user_id,
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.get_device_connected, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("devices list  ::: ", result);
        result?.map((element) => {
          const newData = devicesList.map((item) => {
            if (
              element?.device_name?.toLocaleLowerCase() ===
              item.name.toLocaleLowerCase()
            ) {
              return {
                ...item,
                // isConnected: !item.isConnected,
                isConnected: true,
                device_id: element.id,
              };
            } else {
              return {
                ...item,
              };
            }
          });
          setDevicesList(newData);
        });
      })
      .catch((error) => console.log("error occur in create challenge ", error))
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };
  const handleDisconnectDevice = async (id, name, device_id) => {
    console.log({ id, name, device_id });

    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      // id: user_id,
      id: device_id,
    };
    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.delete_device, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("response delete device ::: ", result);

        updateStatus(id, device_id);
        Snackbar.show({
          text: "Device Disconnected successfully!",
          duration: Snackbar.LENGTH_SHORT,
        });

        // if (
        //   result?.error == false ||
        //   result[0]?.error == false ||
        //   result[0]?.error == "false"
        // ) {
        //   updateStatus(id);
        //   Snackbar.show({
        //     text: "Device Connected successfully!",
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // } else {
        //   Snackbar.show({
        //     text: result?.message,
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch((error) => console.log("error occur in disconnect device ", error))
      .finally(() => setLoading(false));
  };

  const handleConnectDevice = async (id, name) => {
    let user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let data = {
      user_id: user_id,
      device_name: name,
      device_modal_name: name,
      watch_connection_name: name,
    };

    var requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(api.connect_device, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("response create challenge ::: ", result);
        if (
          result?.error == false ||
          result[0]?.error == false ||
          result[0]?.error == "false"
        ) {
          updateStatus(id, result?.id);
          Snackbar.show({
            text: "Device Connected successfully!",
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch((error) => console.log("error occur in create challenge ", error))
      .finally(() => setLoading(false));
  };
  const showAlert = (item) =>
    Alert.alert(
      "Connect Device",
      `Are you sure you want to connect your ${item.name} to isocialWalk?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleConnectDevice(item.id, item?.name) },
      ]
    );
  const showDisconnectAlert = (item) =>
    Alert.alert(
      "Connect Device",
      `Are you sure you want to disconnect your ${item.name} to isocialWalk?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            handleDisconnectDevice(item.id, item?.name, item?.device_id),
        },
      ]
    );

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

  const handlePullRefresh = () => {
    setLoading(false);
    setIsRefreshing(!isRefreshing);
    getAllConnectedDevices();
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "white",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: showMenu ? 15 : 0,
        transform: [{ scale: scale }, { translateX: moveToRight }],
      }}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={["#38acff"]}
            />
          }
        >
          {loading && <Loader />}
          <MenuHeader
            title={"Connect Devices"}
            navigation={navigation}
            onPress={() => handleOpenCustomDrawer()}
          />

          {/* <View style={styles.headerView}>
          <Pressable
            style={{padding: 10, paddingLeft: 0}}
            // onPress={() => navigation.openDrawer()}>
            // onPress={() => handleOpenDrawer(navigation)}
            onPress={() => {
              handleOpenCustomDrawer();
            }}>
            <Image
              source={require('../../assets/images/menu1.png')}
              style={{width: 34, height: 17}}
            />
          </Pressable>
          <Text
            style={{
              color: '#000000',
              textAlign: 'center',
              flex: 1,
              fontSize: 25,
              //   fontWeight: 'bold',
            }}>
            Connect Devices
          </Text>
        </View> */}

          <FlatList
            style={{ marginBottom: 10, marginTop: 30 }}
            data={devicesList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => {
              return (
                <View style={styles.itemView}>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 17,
                      fontFamily: "Rubik-Regular",
                    }}
                  >
                    {item.item.name}
                  </Text>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    // onPress={() => handleConnectDevice(item.item.id)}>
                    onPress={() =>
                      !item.item.isConnected
                        ? showAlert(item.item)
                        : showDisconnectAlert(item.item)
                    }
                  >
                    {item.item.isConnected ? (
                      <Image
                        source={tick_icon}
                        style={{
                          width: 17,
                          height: 13,
                        }}
                      />
                    ) : (
                      <Image
                        source={right_arrow}
                        style={{
                          width: 9,
                          height: 14,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default ConnectDevices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  itemView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
});
