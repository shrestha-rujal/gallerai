import React from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import stl from '../assets/styles/style';
import theme from '../assets/theme';

import {uploadImage} from '../../utils/calls';

const uploadLocalImages = async (setShowFindBtn) => {
  try {
    const cameralRollRes = await CameraRoll.getPhotos({
      first: 9999,
      assetType: 'Photos',
    });

    const images = cameralRollRes.edges.map((item) => item.node.image);

    const formData = new FormData();
    images.slice(0, 3).forEach((image) => {
      const filename = image.uri.split('/').pop();
      formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: filename,
      });
    });

    const res = await uploadImage(formData);
    console.log('RES: ', res);
    setShowFindBtn(false);
  } catch (err) {
    console.log('ERROR UPLOADING IMAGES: ', err);
  }
};

export default function () {
  const [showFindBtn, setShowFindBtn] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const findSimilar = async () => {
    await uploadLocalImages(setShowFindBtn);
  };

  return (
    <View style={stl.flex}>
      {showFindBtn ? (
        <View style={style.buttonContainer}>
          <Image
            source={require('../assets/images/similarity_icon.png')}
            style={style.icon}
          />
          <TouchableOpacity
            style={stl.button}
            activeOpacity={0.9}
            onPress={() => findSimilar()}>
            <Text style={style.btnText}>
              {isLoading ? 'Processing...' : 'Click to find similar images'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View><Text>Images</Text></View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: theme.colors.greenBg,
  },
  btnText: {
    // color: theme.colors.greenBg,
    fontSize: theme.sizes.font,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: theme.sizes.margin,
  },
});
