import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Photos from './screens/Photos';
import Albums from './screens/Albums';
import Cloud from './screens/Cloud';

import stl from './assets/styles/style';
import theme from './assets/theme';

const TabBar = ({state, descriptors, navigation, position}) => {
  const iconMapper = {
    Photos: 'photo',
    Albums: 'photo-library',
    Cloud: 'cloud-download',
  };

  return (
    <View style={style.header}>
      <View style={[stl.row, stl.justifyBetween, style.headerTextContent]}>
        <Text style={style.headerText}>{state.routeNames[state.index]}</Text>
        <Icon name="more-vert" color="black" size={theme.sizes.base * 2} />
      </View>
      <View style={[stl.row, stl.alignCenter, style.barIcons]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label = iconMapper[route.name];

          const isFocused = state.index === index;
          const activeColor = isFocused ? theme.colors.blue : theme.colors.gray;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = Animated.interpolateNode(position, {
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
          });

          return (
            <TouchableOpacity
              key={index}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[stl.alignCenter]}>
              <Animated.View>
                <Icon name={label} color={activeColor} size={28} />
              </Animated.View>
              <Animated.View style={[style.iconUnderline, {opacity}]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function () {
  const Tab = createMaterialTopTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Photos"
        lazy
        tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen name="Photos" component={Photos} />
        <Tab.Screen name="Albums" component={Albums} />
        <Tab.Screen name="Cloud" component={Cloud} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: theme.sizes.border,
    borderBottomColor: theme.colors.lightGray,
  },
  headerTextContent: {
    paddingVertical: theme.sizes.padding * 2,
    paddingHorizontal: theme.sizes.padding * 1.3,
  },
  headerText: {
    fontSize: theme.sizes.font * 1.1,
    fontWeight: 'bold',
  },
  barIcons: {
    paddingHorizontal: theme.sizes.padding * 5,
    justifyContent: 'space-around',
    marginBottom: theme.sizes.margin,
  },
  iconUnderline: {
    marginTop: theme.sizes.margin * 0.3,
    width: theme.sizes.base * 3.4,
    height: theme.sizes.base * 0.25,
    borderRadius: theme.sizes.base,
    backgroundColor: theme.colors.blue,
  },
});
