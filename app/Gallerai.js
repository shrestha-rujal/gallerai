import 'react-native-gesture-handler';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './screens/Login';
import Register from './screens/Register';
import Photos from './screens/Photos';
import PhotoView from './screens/PhotoView';
import Albums from './screens/Albums';
import Cloud from './screens/Cloud';
import AuthContext from '../utils/AuthContext';
import TabBar from './screens/components/TabBar';

import {ACTIONS} from '../consts';
import * as API from '../utils/calls';

const initialState = {
  isLoading: true,
  isLoggedIn: false,
  userToken: null,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case ACTIONS.RESTORE_TOKEN:
      return {
        ...prevState,
        usertoken: action.userToken,
        isLoggedIn: true,
        isLoading: false,
      };
    case ACTIONS.LOG_IN:
      return {
        ...prevState,
        userToken: action.userToken,
        isLoggedIn: true,
      };
    case ACTIONS.LOG_OUT:
      return {
        ...prevState,
        userToken: null,
        isLoggedIn: false,
      };
  }
};

const photoNavigation = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Photos" headerMode="none">
      <Stack.Screen name="Photos" component={Photos} />
      <Stack.Screen name="PhotoView" component={PhotoView} />
    </Stack.Navigator>
  );
};

export default function () {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const Tab = createMaterialTopTabNavigator();
  const Stack = createStackNavigator();

  React.useEffect(() => {
    (async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('@user_token');
        if (token) {
          dispatch({type: ACTIONS.RESTORE_TOKEN, token});
        }
      } catch (err) {
        console.log('ERROR RETRIEVING TOKEN: ', err);
      }
    })();
  }, []);

  const authContext = React.useMemo(
    () => ({
      login: async (email, password) => {
        try {
          const res = await API.login(email, password);
          if (res.status === 'success') {
            res.token = 'temporary_token';
            await AsyncStorage.setItem('@user_token', res.token);
            dispatch({type: ACTIONS.LOG_IN, token: res.token});
          } else {
            throw new Error(res.message);
          }
        } catch (err) {
          console.log('ERROR LOGGING IN: ', err);
        }
      },
      logout: async () => {
        await AsyncStorage.removeItem('@user_token');
        dispatch({type: ACTIONS.LOG_OUT});
      },
      signup: async (name, email, password, passwordConfirm) => {
        try {
          const res = await API.signup(name, email, password, passwordConfirm);
          if (res.status === 'success') {
            res.token = 'temporary_token';
            await AsyncStorage.setItem('@user_token', res.token);
            dispatch({type: ACTIONS.LOG_IN, userToken: res.token});
          } else {
            throw new Error(res.message);
          }
        } catch (err) {
          console.log('ERROR REGISTERTING ACCOUNT: ', err);
        }
      },
      userToken: state.userToken,
    }),
    [state.userToken],
  );

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        {!state.isLoggedIn ? (
          <Stack.Navigator headerMode="none" initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        ) : (
          <Tab.Navigator
            initialRouteName="All Photos"
            lazy
            tabBar={(props) => <TabBar {...props} />}>
            <Tab.Screen name="All Photos" component={photoNavigation} />
            <Tab.Screen name="Albums" component={Albums} />
            <Tab.Screen name="Cloud" component={Cloud} />
          </Tab.Navigator>
        )}
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
