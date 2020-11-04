import React, {useState, useEffect} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import stl from '../assets/styles/style';
import theme from '../assets/theme';

const {width, height} = Dimensions.get('window');

export default function ({navigation}) {
  const [photos, setPhotos] = useState([]);

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

        const res = await CameraRoll.getPhotos({
          first: 50,
          assetType: 'Photos',
        });

        setPhotos(res.edges);
      } catch (err) {
        console.log('ERROR GETTING DEVICE PHOTOS!');
      }
    })();
  }, []);

  const onPhotoClick = (item) => {
    navigation.navigate('PhotoView', {image: item.node.image});
  };

  return (
    <View>
      <FlatList
        data={photos}
        numColumns={4}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.node.image.uri}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPhotoClick(item)}>
              <Image
                style={style.defaultBox}
                source={{uri: item.node.image.uri}}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  defaultBox: {
    width: width * 0.2419,
    height: 98,
    margin: 1.8,
    borderRadius: 3,
  },
});
