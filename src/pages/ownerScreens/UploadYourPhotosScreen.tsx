import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FolderIcon from '../../assets/images/folderIcon.svg';
import CustomButton from '../../components/CustomButton';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { UploadYourPhotosProps } from '../../interfaces/Interfaces';
import { getImage } from '../../store/common/commonActions';
import { showMessage } from '../../store/common/commonSlice';
import {
  addEstablishmentImage,
  getEstablishmentImages,
  updateEstablishmentImage,
} from '../../store/establishment/establishmentActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const UploadYourPhotosScreen: React.FC<UploadYourPhotosProps> = ({
  route,
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const {uploadPhotos} = route.params || {};
  const [mainPhoto, setMainPhoto] = useState<any>({});
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const token = useAppSelector(state => state.userSlice.token);
  const establishmentImages: any = useAppSelector(
    state => state.establishmentSlice.establishmentImages,
  );
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>(
    new Array(6).fill({}),
  );

  useEffect(() => {
    if (token) {
      dispatch(getEstablishmentImages());
    }
  }, []);

  useEffect(() => {
    if (establishmentImages?.main_image?.image) {
      setMainPhoto({
        uri: establishmentImages?.main_image?.image,
        type: 'image/jpg',
        name: `image.jpg`,
        id: establishmentImages?.main_image?.id,
      });
    }
    if (establishmentImages?.additional_images?.length > 0) {
      let data: any = [];
      establishmentImages?.additional_images?.map((img: any) => {
        data.push({
          uri: img?.image,
          type: 'image/jpg',
          name: `image.jpg`,
          id: img?.id,
        });
      });
      while (data.length < 6) {
        data.push({});
      }
      setAdditionalPhotos(data);
    }
  }, [establishmentImages]);

  const handleUpload = async (photo: any, index: number) => {
    const res = await dispatch(getImage('gallery')).unwrap();
    if (photo?.id && token) {
      const formData = new FormData();
      {
        photo?.id && formData.append('media_id', photo?.id);
      }
      formData.append('new_image', res);
      const response = await dispatch(
        updateEstablishmentImage(formData),
      ).unwrap();
      if (response.success == true) {
        console.log('res', response.message);
        dispatch(getEstablishmentImages());
      }
      return;
    }
    if (res != undefined) {
      setAdditionalPhotos(prev =>
        prev.map((photo: any, i: number) => (i === index ? res : photo)),
      );
    }
  };

  const handleSetMainImage = async () => {
    const res = await dispatch(getImage('gallery')).unwrap();
    if (res != undefined) {
      setMainPhoto(res);
    }
    if (establishmentImages?.main_image?.id) {
      const formData = new FormData();
      formData.append('media_id', establishmentImages?.main_image?.id);
      formData.append('new_image', res);
      const response = await dispatch(
        updateEstablishmentImage(formData),
      ).unwrap();
      if (response.success == true) {
        console.log('res', response.message);
        dispatch(getEstablishmentImages());
      }
    }
  };

  const handleSubmit = async () => {
    if (!mainPhoto?.uri) {
      dispatch(showMessage('Select Main Photo'));
      return;
    }
    const hasAtLeastOneImage = additionalPhotos.some(
      (photo: any) => photo.uri && photo.uri !== '',
    );
    if (!hasAtLeastOneImage) {
      dispatch(showMessage('Select at least one photo.'));
      return;
    }
    const check_id = additionalPhotos.some(
      (photo: any) => photo.uri && !photo.id,
    );
    if (token && !check_id) {
      dispatch(getEstablishmentImages());
      navigation.goBack();
      return;
    }
    const formData = new FormData();
    if (!mainPhoto?.id) {
      formData.append(`images[0][file]`, mainPhoto);
      formData.append(`images[0][is_main]`, '1');
    }
    additionalPhotos.forEach((img: any, index: number) => {
      if (!img?.id) {
        if (img?.uri) {
          formData.append(`images[${index + 1}][file]`, img);
          formData.append(`images[${index + 1}][is_main]`, '0');
        }
      }
    });
    const res = await dispatch(addEstablishmentImage(formData)).unwrap();
    if (res.success == true) {
      if (uploadPhotos) {
        navigation.goBack();
      } else {
        navigation.navigate('accessibilityQuestionnaire');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        title="Upload Your Photos"
        navigation={navigation}
        backArrow={true}
        headerStyle={{
          borderBottomWidth: 0,
          marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
        }}
        propTextStyle={{fontFamily: Fonts.InterBold}}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <Text style={styles.subTitle}>
          Upload some latest photos of your establishment to boost your
          visibility
        </Text>
        <View style={styles.mainPhotoContainer}>
          {!mainPhoto?.uri ? (
            <View
              style={{...styles.uploadIconContainer, ...styles.mainPhotoCont}}>
              <FolderIcon height={100} width={100} />
            </View>
          ) : (
            <Image source={{uri: mainPhoto?.uri}} style={styles.mainPhoto} />
          )}
          <Pressable
            onPress={() => handleSetMainImage()}
            style={{
              ...styles.uploadBtn,
              position: 'absolute',
              bottom: 20,
              width: '30%',
              alignSelf: 'flex-start',
              left: moderateScale(25),
            }}>
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
          <View
            style={
              uploadPhotos
                ? {
                    ...styles.mainPhotoLabel,
                    top:
                      Platform.OS == 'ios'
                        ? moderateScale(20)
                        : moderateScale(10),
                  }
                : styles.mainPhotoLabel
            }>
            <Text style={styles.mainPhotoLabelText}>Main Photo</Text>
          </View>
        </View>

        <View
          style={{
            ...styles.additionalPhotosContainer,
            backgroundColor: uploadPhotos
              ? Colors.whiteColor
              : Colors.lightestPinkColor,
          }}>
          {additionalPhotos?.map((photo: any, index) => {
            return (
              <Pressable
                key={index}
                style={styles.additionalPhotoPlaceholder}
                onPress={() => handleUpload(photo, index)}>
                {photo?.uri ? (
                  <View
                    style={{
                      ...styles.uploadIconContainer,
                      position: 'relative',
                    }}>
                    <Image
                      source={{uri: photo?.uri}}
                      style={styles.additionalPhoto}
                    />
                    <Pressable
                      onPress={() => handleUpload(photo, index)}
                      style={{
                        ...styles.uploadBtn,
                        position: 'absolute',
                        bottom: 17,
                      }}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.uploadIconContainer}>
                    <FolderIcon />
                    <Pressable
                      onPress={() => handleUpload(photo, index)}
                      style={styles.uploadBtn}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <CustomButton
        disabled={isLoading}
        isLoading={isLoading}
        title={uploadPhotos ? 'Save Changes' : 'Submit'}
        onPress={handleSubmit}
        buttonStyle={styles.submitButton}
        textStyle={styles.submitButtonText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  scrollContent: {
    flexGrow: 1,
    padding: moderateScale(20),
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    // fontFamily: Fonts.InterSemiBold,
    color: Colors.blackColor,
    marginLeft: moderateScale(15),
  },
  subTitle: {
    fontSize: moderateScale(14),
    // fontFamily: Fonts.InterRegular,
    color: Colors.greyColor,
    marginBottom: verticalScale(20),
  },
  mainPhotoContainer: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    marginBottom: verticalScale(20),
    width: moderateScale(342),
    height: verticalScale(150),
    alignItems: 'center',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  mainPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.lightGreyColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoLabel: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(23),
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  mainPhotoLabelText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(12),
    fontFamily: Fonts.InterMedium,
  },
  additionalPhotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightestPinkColor,
  },
  additionalPhotoPlaceholder: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: Colors.redColor,
    borderStyle: 'dashed',
  },
  additionalPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
  },
  uploadIconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    gap: 18,
  },
  mainPhotoCont: {
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.redColor,
    borderRadius: 5,
    width: '98%',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(12),
    fontFamily: Fonts.InterMedium,
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
  uploadBtn: {
    backgroundColor: Colors.redColor,
    height: verticalScale(24),
    width: '80%',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: Colors.redColor,
    borderRadius: 60,
    height: verticalScale(45),
    width: '90%',
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  submitButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
});

export default UploadYourPhotosScreen;
