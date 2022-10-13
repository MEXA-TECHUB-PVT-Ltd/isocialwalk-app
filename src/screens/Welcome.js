import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
// import Carousel from 'react-native-looped-carousel';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const Welcome = ({navigation}) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [data, setData] = useState([
    {
      id: 0,
      image: require('../../assets/images/onboarding1.png'),
      title: 'Track your steps',
      description:
        'Auto tracks your daily steps,burned  calories walking distance, duration,  pace and health data',
    },
    {
      id: 1,
      image: require('../../assets/images/onboarding2.png'),
      title: 'Compete with Friends and Participate in Challenges',
      description:
        'Enter challenges and go up against family and friends and win rewards and achievements badges',
    },
    {
      id: 2,
      image: require('../../assets/images/onboarding3.png'),
      title: 'Join Groups and Chat',
      description:
        'Intract, create groups, make new friends, chat with existing ones and cheer your everyone on',
    },
  ]);
  let onScrollEnd = e => {
    let pageNumber = Math.min(
      Math.max(
        Math.floor(e.nativeEvent.contentOffset.x / SCREEN_WIDTH + 0.5) + 1,
        0,
      ),
      data.length,
    );
    // console.log(pageNumber);
    setActiveIndex(pageNumber);
  };
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <View
        style={{
          height: '65%',
          paddingVertical: 20,
        }}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          // onEndReached={() => {
          //   console.log('end..');
          //   flatListRef.current.scrollToOffset({offset: 0, animated: true});
          // }}
          // bounces={false}
          onEndReachedThreshold={() => console.log('end')}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={item => {
            return (
              <View
                style={{
                  width: SCREEN_WIDTH,
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}>
                <View>
                  <Image
                    source={item.item.image}
                    style={{
                      alignSelf: 'center',
                      // height: 200,
                      width: SCREEN_WIDTH - 50,
                      // backgroundColor: 'red',
                      marginBottom: 20,
                    }}
                    resizeMode={'contain'}
                  />
                </View>
                <Text style={styles.title}>{item.item.title}</Text>
                <Text style={styles.description}>{item.item.description}</Text>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.dotContainer}>
        <View
          style={{
            ...styles.dot,
            backgroundColor: activeIndex == 1 ? '#38ACFF' : '#7cb9e6',
          }}></View>
        <View
          style={{
            ...styles.dot,
            backgroundColor: activeIndex == 2 ? '#38ACFF' : '#7cb9e6',
          }}></View>
        <View
          style={{
            ...styles.dot,
            backgroundColor: activeIndex == 3 ? '#38ACFF' : '#7cb9e6',
          }}></View>
      </View>

      <TouchableOpacity
        style={{...styles.btn}}
        onPress={() => navigation.navigate('AuthScreen')}>
        <Text style={{color: '#FFF', fontSize: 16}}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    // padding: 20,
  },
  title: {
    color: '#65BEFF',
    fontWeight: 'bold',
    fontSize: 18,
    width: 250,
    marginTop: 10,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 20,
    // color: '#DBDBDB',
    // color: '#E2E2E2',
    color: '#797777',
    width: 250,
  },

  btn: {
    backgroundColor: '#38ACFF',
    marginTop: 110,
    marginBottom: 40,
    height: 50,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  dotContainer: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    width: 50,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: 'pink',
  },
});

// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   FlatList,
// } from 'react-native';
// // import Carousel from 'react-native-looped-carousel';
// const SCREEN_WIDTH = Dimensions.get('window').width;
// const Welcome = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={[1, 2, 3]}
//         keyExtractor={(item, inedx) => inedx.toString()}
//         style={{backgroundColor: 'blue', flex: 1}}
//         horizontal
//         renderItem={item => {
//           return (
//             <View
//               style={{
//                 flex: 1,
//                 width: SCREEN_WIDTH,
//                 margin: 10,
//                 backgroundColor: 'red',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Image
//                 source={require('../../assets/images/onboarding2.png')}
//                 style={{
//                   alignSelf: 'center',
//                   // backgroundColor: 'red',
//                   height: 300,
//                   width: 200,
//                 }}
//                 resizeMode={'cover'}
//               />
//               <Text
//                 style={{color: '#4285F4', fontWeight: 'bold', fontSize: 18}}>
//                 Track your steps
//               </Text>
//               <Text
//                 style={{
//                   textAlign: 'center',
//                   marginVertical: 20,
//                   color: '#DBDBDB',
//                 }}>
//                 Auto tracks your daily steps,burned {'\n'} calories walking
//                 distance, duration, {'\n'} pace and health data
//               </Text>
//             </View>
//           );
//         }}
//       />

//       <TouchableOpacity style={{...styles.btn, marginBottom: 18}}>
//         <Text style={{color: '#FFF', fontSize: 16}}>Get Started</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Welcome;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     // padding: 20,
//   },
//   btn: {
//     // backgroundColor: '#0496FF',
//     backgroundColor: '#38ACFF',
//     marginTop: 30,
//     marginBottom: 40,
//     height: 50,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     alignSelf: 'flex-end',
//   },
// });
