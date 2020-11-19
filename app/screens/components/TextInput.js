import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../assets/theme';

export default function (props) {
  return (
    <View style={style.container}>
      <View style={style.leftIconContainer}>
        <Icon
          name={props.inputLeftIcon}
          size={theme.sizes.font * 1.5}
          color={theme.colors.golden}
          style={style.leftIcon}
        />
      </View>
      <TextInput
        style={style.inputField}
        {...props}
        placeholderTextColor={theme.colors.dimWhite}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    borderBottomWidth: theme.sizes.border * 0.5,
    borderColor: theme.colors.dimmerWhite,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.sizes.margin * 2,
    width: '100%',
    overflow: 'hidden',
  },
  inputField: {
    color: theme.colors.dimWhite,
    paddingHorizontal: theme.sizes.padding * 2,
    fontSize: theme.sizes.font,
  },
  leftIconContainer: {
    height: '100%',
    borderRightWidth: theme.sizes.border * 0.5,
    borderColor: theme.colors.dimmerWhite,
  },
  leftIcon: {
    padding: theme.sizes.padding,
  },
});
