import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const Groups = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([
    {
      id: 0,
      group_name: 'Incorruptible',
      status: false,
    },
    {
      id: 1,
      group_name: 'Forest Foragers',
      status: false,
    },
    {
      id: 2,
      group_name: 'Cyanide',
      status: false,
    },
    {
      id: 3,
      group_name: 'Group Name',
      status: false,
    },
    {
      id: 4,
      group_name: 'Group Name',
      status: false,
    },
  ]);
  const [isSuggestedVisible, setIsSuggestedVisible] = useState(true);
  const [suggestedGroups, setSuggestedGroups] = useState([
    {
      id: 0,
      group_name: 'Incorruptible',
      status: false,
    },
    {
      id: 1,
      group_name: 'Forest Foragers',
      status: false,
    },
    {
      id: 2,
      group_name: 'Cyanide',
      status: false,
    },
    {
      id: 3,
      group_name: 'Group Name',
      status: false,
    },
    {
      id: 4,
      group_name: 'Group Name',
      status: false,
    },
  ]);

  const handleonJoin = id => {
    const newData = suggestedGroups.map(item => {
      if (id == item.id) {
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
    setSuggestedGroups(newData);
  };
  return (
    <View style={styles.container}>
      <View style={{height: 40, justifyContent: 'center'}}>
        {isSearch ? (
          <View style={styles.headerView}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // height: 40,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#CCC',
                paddingHorizontal: 10,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  borderColor: '#FFFFFF',
                  padding: 8,
                  color: '#000000',
                }}
                placeholder={'Search'}
                value={searchText}
                onChangeText={txt => setSearchText(txt)}
              />
              <Image
                source={require('../../assets/images/search.png')}
                style={{height: 20, width: 20}}
              />
            </View>
            <TouchableOpacity
              onPress={() => setIsSearch(!isSearch)}
              style={{
                flex: 0.25,
                height: '100%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  color: '#4e4e4e',
                  fontSize: 16,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerView}>
            <View>
              <Image source={require('../../assets/images/Line1.png')} />
              <Image
                source={require('../../assets/images/Line2.png')}
                style={{marginTop: 5}}
              />
            </View>
            <TouchableOpacity onPress={() => setIsSearch(!isSearch)}>
              <Image source={require('../../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {searchText.length == 0 ? (
        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#000000',
              fontSize: 30,
              marginTop: 8,
              fontWeight: 'bold',
            }}>
            Groups
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 16,
              }}>
              Suggested Groups
            </Text>

            <TouchableOpacity
              style={{
                height: 20,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setIsSuggestedVisible(!isSuggestedVisible)}>
              {isSuggestedVisible ? (
                <Image source={require('../../assets/images/arrow-up.png')} />
              ) : (
                <Image source={require('../../assets/images/arrow-down.png')} />
              )}
            </TouchableOpacity>
          </View>
          {/* ----------------------Suggested Groups List ---------------------------- */}
          <View
            style={{
              marginVertical: 15,
              width: SCREEN_WIDTH - 15,
              paddingRight: 15,
              //   backgroundColor: 'red',
            }}>
            {isSuggestedVisible && (
              <FlatList
                data={suggestedGroups}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={item => {
                  return (
                    <View
                      style={{
                        height: 137,
                        width: 101,
                        backgroundColor: '#ffffff',
                        borderRadius: 10,
                        shadowColor: 'blue',
                        elevation: 5,
                        padding: 5,
                        alignItems: 'center',
                        // marginRight: 20,
                        marginHorizontal: 8,
                        marginVertical: 10,
                        overflow: 'hidden',
                      }}>
                      <Image
                        source={require('../../assets/images/group-profile.png')}
                        style={{marginVertical: 8}}
                      />

                      <Text
                        style={{
                          color: '#040103',
                          textAlign: 'center',
                          fontSize: 13,
                          width: 75,
                        }}>
                        {item.item.group_name}
                      </Text>
                      <View
                        style={{
                          //   backgroundColor: 'green',
                          justifyContent: 'flex-end',
                          flex: 1,
                        }}>
                        {item.item.status ? (
                          <TouchableOpacity
                            onPress={() => handleonJoin(item.item.id)}
                            style={{
                              backgroundColor: '#38acff',
                              width: 60,
                              borderRadius: 5,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginVertical: 5,
                              alignSelf: 'flex-end',
                              padding: 5,
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 11}}>
                              Join
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleonJoin(item.item.id)}
                            style={{
                              backgroundColor: '#d8d8d8',
                              width: 70,
                              borderRadius: 5,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginVertical: 5,
                              alignSelf: 'flex-end',
                              padding: 5,
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 11}}>
                              Requested
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
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#000000',
              fontSize: 30,
              marginTop: 8,
              fontWeight: 'bold',
            }}>
            Groups
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 16,
              }}>
              Suggested Groups
            </Text>

            <TouchableOpacity
              style={{
                height: 20,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setIsSuggestedVisible(!isSuggestedVisible)}>
              {isSuggestedVisible ? (
                <Image source={require('../../assets/images/arrow-up.png')} />
              ) : (
                <Image source={require('../../assets/images/arrow-down.png')} />
              )}
            </TouchableOpacity>
          </View>
          {/* ----------------------Suggested Groups List ---------------------------- */}
          <View
            style={{
              marginVertical: 15,
              width: SCREEN_WIDTH - 15,
              paddingRight: 15,
              //   backgroundColor: 'red',
            }}>
            {isSuggestedVisible && (
              <FlatList
                data={suggestedGroups}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={item => {
                  return (
                    <View
                      style={{
                        height: 137,
                        width: 101,
                        backgroundColor: '#ffffff',
                        borderRadius: 10,
                        shadowColor: 'blue',
                        elevation: 5,
                        padding: 5,
                        alignItems: 'center',
                        // marginRight: 20,
                        marginHorizontal: 8,
                        marginVertical: 10,
                        overflow: 'hidden',
                      }}>
                      <Image
                        source={require('../../assets/images/group-profile.png')}
                        style={{marginVertical: 8}}
                      />

                      <Text
                        style={{
                          color: '#040103',
                          textAlign: 'center',
                          fontSize: 13,
                          width: 75,
                        }}>
                        {item.item.group_name}
                      </Text>
                      <View
                        style={{
                          //   backgroundColor: 'green',
                          justifyContent: 'flex-end',
                          flex: 1,
                        }}>
                        {item.item.status ? (
                          <TouchableOpacity
                            onPress={() => handleonJoin(item.item.id)}
                            style={{
                              backgroundColor: '#38acff',
                              width: 60,
                              borderRadius: 5,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginVertical: 5,
                              alignSelf: 'flex-end',
                              padding: 5,
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 11}}>
                              Join
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleonJoin(item.item.id)}
                            style={{
                              backgroundColor: '#d8d8d8',
                              width: 70,
                              borderRadius: 5,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginVertical: 5,
                              alignSelf: 'flex-end',
                              padding: 5,
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 11}}>
                              Requested
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
          <Text style={{color: '#000000', fontSize: 16}}>Groups</Text>
          <View
            style={{
              flex: 1,

              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/images/group1.png')}
              style={{backgroundColor: '#FFFF', resizeMode: 'contain'}}
            />
            <Text
              style={{
                width: 206,
                textAlign: 'center',
                fontSize: 16,
                color: '#000000',
                marginVertical: 20,
              }}>
              Create or join a group and compete in challenges with other groups
            </Text>
            <TouchableOpacity
              style={{
                width: 144,
                height: 40,
                backgroundColor: '#38acff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <Text style={{color: '#FFFFFF', fontSize: 13}}>
                Create a Group
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Groups;

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
});
