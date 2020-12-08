import React, {useState, useEffect} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

import {
  uploadImage,
  searchSimilarImages,
  deleteImages,
} from '../../utils/calls';

const {width} = Dimensions.get('window');

export default function ({navigation}) {
  const [showFindBtn, setShowFindBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  useEffect(() => {
    setDeleteMode(!!selectedPhotos.length);
  }, [selectedPhotos]);

  const onPhotoClick = (uri) => {
    console.log('NAVIGATION uri: ', uri);
    navigation.navigate('PhotoView', {image: {uri}});
  };

  const onPhotoLongPress = (img) => {
    if (!deletedPhotos.includes(img)) {
      setSelectedPhotos(
        selectedPhotos.includes(img)
          ? [...selectedPhotos.filter((items) => items !== img)]
          : [...selectedPhotos, img],
      );
    }
  };

  const renderImageGroup = (group, index) => (
    <View style={style.imageGroup}>
      <View style={style.groupHeaderContainer}>
        <Text style={style.groupHeader}>Group{`\u00A0${index + 1}`}</Text>
        <Text style={style.groupHeader}>{group.length} similar</Text>
      </View>
      <View style={style.imageContainer}>
        {group.map((img, key) => {
          const uri = `file:///storage/emulated/0/DCIM/Camera/${img}`;
          // const uri = `https://galleraiphotos.s3.amazonaws.com/${img}`;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={key}
              onLongPress={() => onPhotoLongPress(img)}
              onPress={() => onPhotoClick(uri)}>
              <Image
                style={[
                  style.defaultBox,
                  selectedPhotos.includes(img) ? style.selected : null,
                  deletedPhotos.includes(img) ? style.deleted : null,
                ]}
                source={{uri}}
              />
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

      const uploadPromises = images.slice(0, 16).map((image) => {
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
      if (result && result.data) {
        setShowFindBtn(false);
        setGroups(result.data);
      }
    } catch (err) {
      console.log('ERROR GETTING SIMILAR IMAGES: ', err);
    }
  };

  const handleDelete = async () => {
    const userToken = await AsyncStorage.getItem('@user_token');
    await deleteImages(userToken, JSON.stringify({images: selectedPhotos}));
    setDeletedPhotos([...deletedPhotos, ...selectedPhotos]);
    setSelectedPhotos([]);
  };

  const handleClear = () => {
    setSelectedPhotos([]);
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
        <View style={stl.flex}>
          <View style={style.mainContainer}>{renderImageGroups()}</View>
          {deleteMode && (
            <View style={style.sideBtnsContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[style.sideBtn, style.deleteBtn]}
                onPress={handleDelete}>
                <Icon name="delete" color="white" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[style.sideBtn, style.cancelBtn]}
                onPress={handleClear}>
                <Icon name="clear" color="white" size={25} />
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  selected: {
    borderWidth: 6,
    borderColor: theme.colors.lightBlue,
    opacity: 0.6,
  },
  deleted: {
    borderWidth: 6,
    borderColor: 'red',
    opacity: 0.6,
  },
  lowerBtn: {
    marginTop: theme.sizes.margin * 1.6,
  },
  sideBtnsContainer: {
    position: 'absolute',
    top: '40%',
    right: theme.sizes.margin * 0.5,
    backgroundColor: theme.colors.white,
    paddingVertical: theme.sizes.padding * 0.5,
    paddingHorizontal: theme.sizes.padding * 0.5,
    borderRadius: 40,
    elevation: 2,
  },
  sideBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: theme.sizes.elevation * 2,
  },
  deleteBtn: {
    backgroundColor: 'red',
  },
  cancelBtn: {
    backgroundColor: 'green',
    marginTop: theme.sizes.margin * 1.6,
  },
});
