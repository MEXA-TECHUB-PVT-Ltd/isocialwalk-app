import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

const AuthScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const handleRegister = () => {
    if (email.length === 0) {
      setInvalidEmail(true);
    }
    if (password.length === 0) {
      setInvalidPassword(true);
    }
  };
  const handleLogin = () => {
    if (email.length === 0) {
      setInvalidEmail(true);
    }
    if (password.length === 0) {
      setInvalidPassword(true);
    }
  };
  const handleonTabChange = () => {
    setIndex(index == 0 ? 1 : 0);
    setInvalidEmail(false);
    setInvalidPassword(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.tabView}>
        <TouchableOpacity
          onPress={() => handleonTabChange()}
          style={{
            ...styles.btn,
            backgroundColor: index == 0 ? '#FFF' : 'transparent',
            elevation: index == 0 ? 23 : 0,
          }}>
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleonTabChange()}
          style={{
            ...styles.btn,
            backgroundColor: index == 1 ? '#FFF' : 'transparent',
            elevation: index == 1 ? 23 : 0,
          }}>
          <Text style={styles.btnText}>Sign in</Text>
        </TouchableOpacity>
      </View>
      {index == 0 ? (
        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 24,
              marginTop: 10,
              marginBottom: 5,
            }}>
            Create your account
          </Text>
          <Text style={{color: '#000', fontWeight: '400'}}>
            Signup with Email for an account
          </Text>

          <View style={styles.textInputView}>
            <Text style={{color: '#000', marginVertical: 5}}>
              Email Address
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidEmail ? '#D66262' : '#ccc',
              }}
              placeholder={'Enter your Email'}
            />
            {invalidEmail && (
              <Text
                style={{
                  color: '#D66262',
                  fontSize: 10,
                  marginLeft: 10,
                  marginTop: 3,
                }}>
                This email doesn't look right
              </Text>
            )}
          </View>
          <View style={styles.textInputView}>
            <Text style={{color: '#000', marginVertical: 5}}>Password</Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidPassword ? '#D66262' : '#ccc',
              }}
              placeholder={'Enter your Password'}
            />
            {invalidPassword && (
              <Text
                style={{
                  color: '#D66262',
                  fontSize: 10,
                  marginLeft: 10,
                  marginTop: 3,
                }}>
                Enter a password with a cap, small letter, symbol and a number
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.btnRegister}
            onPress={() => handleRegister()}>
            <Text style={{color: '#FFF', fontSize: 16}}>Register</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => navigation.navigate('TabNavigation')}>
              <Image
                source={require('../../assets/images/apple.png')}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={{color: '#FFF', fontSize: 14}}>
                Signup with Apple ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('TabNavigation')}
              style={{...styles.socialBtn, backgroundColor: '#4267B2'}}>
              <Image
                source={require('../../assets/images/facebook.png')}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  tintColor: '#FFF',
                }}
              />
              <Text style={{color: '#FFF', fontSize: 14}}>
                Signup with Facebook
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('TabNavigation')}
              style={{...styles.socialBtn, backgroundColor: '#4285F4'}}>
              <Image
                source={require('../../assets/images/google.png')}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={{color: '#FFF', fontSize: 14}}>
                Signup with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 24,
              marginTop: 10,
              marginBottom: 5,
            }}>
            Welcome back !
          </Text>
          <Text style={{color: '#000', fontWeight: '400'}}>
            Sign in to access your account
          </Text>

          <View style={styles.textInputView}>
            <Text style={{color: '#000', marginVertical: 5}}>
              Email Address
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidEmail ? '#D66262' : '#ccc',
              }}
              placeholder={'Enter your Email'}
            />
            {invalidEmail && (
              <Text
                style={{
                  color: '#D66262',
                  fontSize: 10,
                  marginLeft: 10,
                  marginTop: 3,
                }}>
                This email doesn't look right
              </Text>
            )}
          </View>
          <View style={styles.textInputView}>
            <Text style={{color: '#000', marginVertical: 5}}>Password</Text>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: invalidPassword ? '#D66262' : '#ccc',
              }}
              placeholder={'Enter your Password'}
            />
            {invalidPassword && (
              <Text
                style={{
                  color: '#D66262',
                  fontSize: 10,
                  marginLeft: 10,
                  marginTop: 3,
                }}>
                Enter a password with a cap, small letter, symbol and a number
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={{...styles.btnRegister, marginBottom: 18}}
            onPress={() => handleLogin()}>
            <Text style={{color: '#FFF', fontSize: 16}}>Sign In</Text>
          </TouchableOpacity>
          <Text style={{color: '#000', fontSize: 14, fontWeight: '400'}}>
            Forgot Password?
          </Text>
          <Text
            style={{color: '#3BADFF', fontWeight: 'bold', marginBottom: 10}}>
            Reset Password
          </Text>

          <View>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => navigation.navigate('TabNavigation')}>
              <Image
                source={require('../../assets/images/apple.png')}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={{color: '#FFF', fontSize: 14}}>
                Signup with Apple ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('TabNavigation')}
              style={{...styles.socialBtn, backgroundColor: '#4267B2'}}>
              <Image
                source={require('../../assets/images/facebook.png')}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  tintColor: '#FFF',
                }}
              />
              <Text style={{color: '#FFF', fontSize: 14}}>
                Signup with Facebook
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('TabNavigation')}
              style={{...styles.socialBtn, backgroundColor: '#4285F4'}}>
              <Image
                source={require('../../assets/images/google.png')}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={{color: '#FFF', fontSize: 14}}>
                Signup with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  tabView: {
    height: 50,
    width: '100%',
    backgroundColor: '#D1ECFF',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    marginVertical: 5,
    //   justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: '#FFF',
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#cdcdcd',
  },
  btnText: {
    color: '#000',
  },
  textInputView: {
    // backgroundColor: 'blue',
    marginVertical: 15,
  },
  textInput: {
    // backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  btnRegister: {
    // backgroundColor: '#0496FF',
    backgroundColor: '#38ACFF',
    marginTop: 30,
    marginBottom: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  socialBtn: {
    flexDirection: 'row',
    backgroundColor: '#000',
    marginVertical: 10,
    height: 45,
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
