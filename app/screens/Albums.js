import React, {useState, useEffect} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import stl from '../assets/styles/style';
import theme from '../assets/theme';

const {height, width} = Dimensions.get('screen');

export default function () {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'android') {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permission Explanation',
              message: 'Gallerai would like to access your photos!',
            },
          );
          if (result !== 'granted') {
            console.log('Access to pictures was denied');
            return;
          }
        }

        const res = await CameraRoll.getAlbums({
          first: 50,
          assetType: 'Photos',
        });

        setAlbums(res);
      } catch (err) {
        console.log('ERROR GETTING DEVICE PHOTOS!');
      }
    })();
  }, []);

  return (
    <View style={[stl.flex, style.mainContainer]}>
      <FlatList
        style={stl.flex}
        data={albums}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        renderItem={({item}) => {
          return (
            <View style={style.albumBox}>
              <View style={[style.defaultBox, stl.center]}>
                <Image
                  style={style.albumPlaceholder}
                  source={require('../assets/images/album_placeholder_white.png')}
                />
              </View>
              <View style={style.labelContainer}>
                <Text style={style.albumTitle}>
                  {item.title.split('').splice(0, 18)}
                </Text>
                <Text style={style.albumQuantity}>{item.count}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: theme.sizes.padding,
  },
  albumBox: {
    marginHorizontal: 3,
    marginVertical: 7,
    overflow: 'hidden',
  },
  defaultBox: {
    backgroundColor: theme.colors.gray,
    width: width * 0.3,
    height: 120,
    borderRadius: 3,
  },
  labelContainer: {
    marginLeft: 2,
    marginTop: theme.sizes.base * 0.4,
  },
  albumTitle: {
    fontSize: theme.sizes.font * 0.8,
  },
  albumPlaceholder: {
    width: 65,
    height: 65,
  },
  albumQuantity: {
    fontSize: theme.sizes.font * 0.8,
    color: theme.colors.blue,
  },
});
