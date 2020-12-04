import React from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import stl from '../assets/styles/style';
import theme from '../assets/theme';

import {uploadImage, searchSimilarImages} from '../../utils/calls';

const {width} = Dimensions.get('window');

export default function ({navigation}) {
  const [showFindBtn, setShowFindBtn] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [groups, setGroups] = React.useState([]);

  const onPhotoClick = (uri) => {
    navigation.navigate('PhotoView', {image: {uri}});
  };

  const renderImageGroup = (group, index) => (
    <View style={style.imageGroup}>
      <View style={style.groupHeaderContainer}>
        <Text style={style.groupHeader}>Group{`\u00A0${index + 1}`}</Text>
        <Text style={style.groupHeader}>{group.length} similar</Text>
      </View>
      <View style={style.imageContainer}>
        {group.map((img, key) => {
          const uri = `https://galleraiphotos.s3.amazonaws.com/${img}`;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={key}
              onPress={() => onPhotoClick(uri)}>
              <Image style={style.defaultBox} source={{uri}} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderImageGroups = () => (
    <FlatList
      data={groups}
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item, index}) => {
        if (item.length > 1) {
          return renderImageGroup(item, index);
        }
      }}
    />
  );

  const uploadLocalImages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('@user_token');
      const cameralRollRes = await CameraRoll.getPhotos({
        first: 9999,
        assetType: 'Photos',
      });

      const images = cameralRollRes.edges.map((item) => item.node.image);

      const uploadPromises = images.slice(0, 5).map((image) => {
        const formData = new FormData();
        const filename = image.uri.split('/').pop();
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: filename,
        });
        return uploadImage(formData, userToken);
      });

      const res = await Promise.all(uploadPromises);
    } catch (err) {
      console.log('ERROR UPLOADING IMAGES: ', err);
    }
  };

  const getSimilarImages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('@user_token');
      const result = await searchSimilarImages(userToken);
      setShowFindBtn(false);
      setGroups(result.data);
    } catch (err) {
      console.log('ERROR GETTING SIMILAR IMAGES: ', err);
    }
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
            onPress={() => uploadLocalImages()}>
            <Text style={style.btnText}>
              {isLoading ? 'Processing...' : 'Upload Local Images'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stl.button, style.lowerBtn]}
            activeOpacity={0.9}
            onPress={() => getSimilarImages()}>
            <Text style={style.btnText}>
              {isLoading ? 'Processing...' : 'Find Similar Images'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.mainContainer}>{renderImageGroups()}</View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: theme.sizes.font,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: theme.sizes.margin,
  },
  mainContainer: {
    flex: 1,
    paddingTop: theme.sizes.padding * 2,
  },
  imageGroup: {
    marginBottom: theme.sizes.margin * 2,
  },
  groupHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.sizes.padding * 2,
  },
  groupHeader: {
    marginBottom: theme.sizes.margin * 0.5,
    fontSize: theme.sizes.font * 1.1,
    color: theme.colors.gray,
  },
  imageContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  defaultBox: {
    width: width * 0.2412,
    height: 98,
    margin: 1.8,
    borderRadius: 3,
  },
  lowerBtn: {
    marginTop: theme.sizes.margin * 1.6,
  },
});
