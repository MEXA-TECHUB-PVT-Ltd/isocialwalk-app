import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
// import ProgressCircle from 'react-native-progress-circle';
// import CircularProgress from 'react-native-circular-progress-indicator';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
// import Animated from 'react-native-reanimated';
// import BottomSheet from 'reanimated-bottom-sheet';

const Home = () => {
  const [index, setIndex] = useState(0);
  const handleonTabChange = () => {
    setIndex(index == 0 ? 1 : 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <View>
          <Image source={require('../../assets/images/Line1.png')} />
          <Image
            source={require('../../assets/images/Line2.png')}
            style={{marginTop: 5}}
          />
        </View>
        <Image source={require('../../assets/images/bell.png')} />
      </View>
      <Text style={{color: '#000000', marginTop: 8}}>Good Evening</Text>
      <Text style={{color: '#000305', fontSize: 16, fontWeight: '500'}}>
        Jonathan
      </Text>
      <View style={styles.tabView}>
        <TouchableOpacity
          onPress={() => handleonTabChange()}
          style={{
            ...styles.btn,
            backgroundColor: index == 0 ? '#FFF' : 'transparent',
            elevation: index == 0 ? 23 : 0,
          }}>
          <Text style={styles.btnText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleonTabChange()}
          style={{
            ...styles.btn,
            backgroundColor: index == 1 ? '#FFF' : 'transparent',
            elevation: index == 1 ? 23 : 0,
          }}>
          <Text style={styles.btnText}>This Week</Text>
        </TouchableOpacity>
      </View>
      {/* <CircularProgress value={58} /> */}
      <View style={{alignItems: 'center', marginVertical: 30}}>
        <AnimatedCircularProgress
          size={200}
          width={10}
          fill={0}
          tintColor="#38ACFF"
          backgroundColor="#E2E2E2">
          {fill => (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: '#38ACFF', fontSize: 28, fontWeight: '500'}}>
                {' '}
                {fill}
              </Text>
              <Text style={{color: '#000305'}}>Total amount of steps</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          //   backgroundColor: 'red',
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#38ACFF', fontSize: 16, fontWeight: '600'}}>
            0 kcal
          </Text>
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <Image
              source={require('../../assets/images/kcal.png')}
              style={{marginRight: 5}}
            />
            <Text>Calories</Text>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#38ACFF', fontSize: 16, fontWeight: '600'}}>
            0 km
          </Text>
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <Image
              source={require('../../assets/images/distance.png')}
              style={{marginRight: 5}}
            />
            <Text>Distance</Text>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#38ACFF', fontSize: 16, fontWeight: '600'}}>
            0:01 h
          </Text>
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <Image
              source={require('../../assets/images/time.png')}
              style={{marginRight: 5}}
            />
            <Text>Time</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          marginVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: '#000000', fontSize: 14}}>Today's Ranking</Text>
        <Text style={{color: '#38acff', fontSize: 14}}>See All</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            height: 137,
            width: 101,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            shadowColor: '#000',
            elevation: 24,
            padding: 5,
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
          <View
            style={{
              backgroundColor: '#D8D8D8',
              height: 50,
              width: 50,
              marginVertical: 5,
              borderRadius: 50,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={require('../../assets/images/profile.png')} />
          </View>
          <Text style={{color: '#040103'}}>Me</Text>
          <Text style={{color: '#38acff'}}>0</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/images/flag.png')}
              style={{marginRight: 3, height: 15, width: 15}}
            />
            <Text style={{color: '#a9a9a9'}}>3k</Text>
          </View>
        </View>
        <View
          style={{
            height: 137,
            width: 101,
            // backgroundColor: '#ffffff',
            borderRadius: 5,
            // shadowColor: '#000',
            // elevation: 24,
            padding: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5,
          }}>
          <Image source={require('../../assets/images/addFriend.png')} />
          <Text style={{color: '#002138', marginTop: 8, fontSize: 14}}>
            Add a Friend
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabView: {
    // height: 50,
    height: 48,
    marginTop: 25,
    width: '100%',
    backgroundColor: '#d1ecff',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    marginVertical: 5,
    //   justifyContent: 'space-between',
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
});
