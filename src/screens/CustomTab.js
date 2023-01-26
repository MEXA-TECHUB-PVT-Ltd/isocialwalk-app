import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import Chat from './Chat/Chat';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import RBSheet from 'react-native-raw-bottom-sheet';
import {captureScreen} from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Home from './Home';

const CustomTab = ({scale, showMenu, setShowMenu, moveToRight}) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [index, setIndex] = useState(0);
  const moveToRight1 = useRef(new Animated.Value(1)).current;
  const scale1 = useRef(new Animated.Value(1)).current;

  const handleonTabChange = () => {
    setIndex(index == 0 ? 1 : 0);
  };
  const handleOpenDrawer = navigation => {
    captureScreen({
      format: 'jpg',
    })
      .then(uri => {
        AsyncStorage.setItem('Screen', uri.toString());
        AsyncStorage.setItem('ScreenName', 'Home');
        navigation.openDrawer();
      })
      .catch(error => console.log(error));
  };

  const [tabList, setTabList] = useState([
    {
      title: 'Home',
      icon: require('../../assets/images/home1.png'),
    },
    {
      title: 'History',
      icon: require('../../assets/images/history.png'),
    },
    {
      title: 'Change Password',
      icon: require('../../assets/images/lock.png'),
    },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  console.log(showMenu, scale, moveToRight);
  return (
    <>
      <Home
        scale={scale1}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        moveToRight={moveToRight1}
      />
    </>
  );
};

{
  /* footer menu----------------------------- */
}
{
  /* <View
        style={{
          width: '100%',
          height: 60,
          backgroundColor: '#cdcdcd',
          elevation: 30,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {tabList.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Chat', {
                  scale,
                  // showMenu,
                  // setShowMenu,
                  moveToRight,
                })
              }
              key={index}
              style={{
                flex: 1,
                marginHorizontal: 5,
              }}>
              <Image
                source={item.icon}
                style={{
                  height: 30,
                  width: 30,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View> */
}
export default CustomTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabView: {
    height: 48,
    marginTop: 25,
    width: '100%',
    backgroundColor: '#d1ecff',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    marginVertical: 5,
  },
  btn: {
    backgroundColor: '#FFF',
    flex: 1,
    height: 30,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    shadowColor: '#cdcdcd',
  },
  btnText: {
    color: '#002138',
  },
  bootSheetCardView: {
    height: 126,
    width: 101,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: 'blue',
    elevation: 6,
    padding: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
