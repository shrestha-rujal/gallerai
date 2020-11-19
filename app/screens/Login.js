import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import AuthContext from '../../utils/AuthContext';
import stl from '../assets/styles/style';
import theme from '../assets/theme';
import TextInput from './components/TextInput';

export default function ({navigation}) {
  const [email, setEmail] = React.useState('admin@gallerai.io');
  const [password, setPassword] = React.useState('test1234');
  const {login} = React.useContext(AuthContext);

  return (
    <KeyboardAwareScrollView style={[style.mainContainer]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.greenBg}
      />
      <View style={[stl.alignCenter, style.logoContainer]}>
        <Image
          source={require('../assets/images/app_logo.png')}
          style={style.appLogo}
        />
      </View>
      <View style={style.inputArea}>
        <TextInput
          placeholder="E-MAIL"
          value={email}
          onChangeText={setEmail}
          inputLeftIcon="alternate-email"
        />
        <TextInput
          placeholder="PASSWORD"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          inputLeftIcon="lock-open"
        />
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.forgotPassContainer}>
          <Text style={style.forgotPass}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.submitBtn}
          onPress={() => login(email, password)}>
          <Text style={style.submitText}>Log in</Text>
        </TouchableOpacity>
        <View style={style.navLink}>
          <Text style={{color: theme.colors.dimWhite}}>
            Not a member ?{'\u00A0'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Register')}>
            <Text style={{color: theme.colors.golden}}>Join now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.greenBg,
    padding: theme.sizes.padding,
  },
  logoContainer: {
    marginTop: theme.sizes.margin * 6,
  },
  appLogo: {
    width: 125,
    height: 125,
  },
  inputArea: {
    flex: 1,
    alignItems: 'center',
    marginTop: theme.sizes.margin * 3.5,
    paddingHorizontal: theme.sizes.padding * 1.4,
  },
  forgotPassContainer: {
    marginTop: theme.sizes.margin * 2,
  },
  forgotPass: {
    color: theme.colors.dimWhite,
  },
  submitBtn: {
    marginTop: theme.sizes.margin * 2.5,
    paddingVertical: theme.sizes.padding * 1.3,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colors.golden,
    borderRadius: theme.sizes.radius,
  },
  submitText: {
    fontWeight: 'bold',
    fontSize: theme.sizes.font,
    color: theme.colors.greenBg,
  },
  navLink: {
    marginTop: theme.sizes.margin * 1.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
