import React from 'react';
import {StyleSheet, Image} from 'react-native';

import stl from '../assets/styles/style';
import theme from '../assets/theme';

export default function (props) {
  const {image} = props.route.params;
  return (
    <Image
      resizeMode="contain"
      style={style.viewImage}
      source={{uri: image.uri}}
    />
  );
}

const style = StyleSheet.create({
  viewImage: {
    width: '100%',
    flex: 1,
    backgroundColor: theme.colors.black,
  },
});
