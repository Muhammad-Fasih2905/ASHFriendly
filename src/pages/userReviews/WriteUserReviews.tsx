import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating-widget';
import CustomButton from '../../components/CustomButton';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import Tts from '../../services/textToSpeech';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addRview } from '../../store/reviews/ReviewsAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

type RouteParams = {
  voiceIcon?: string;
  headerTitle?: string;
};
const { wp, hp } = ResponsiveSizes;
const { moderateScale, verticalScale } = SizeMattersConfig;
const WriteUserReviews: React.FC = () => {
  const navigation = useNavigation();
  const disptch = useAppDispatch();
  const user: any = useAppSelector(state => state?.userSlice.user);
  const isLoading = useAppSelector(state => state?.commonSlice.isLoading);
  const getReviews = useAppSelector(state => state?.reviewSlice?.establishment);
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const voicIcon = route?.params?.voiceIcon;
  const title = route?.params?.headerTitle;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const userRole = useAppSelector(state => state?.userSlice.role);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: '',
      description: '',
    },
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `You are currently on Write a Review Screen! The place ${getReviews?.name} has a rating of ${getReviews?.average_rating} and has received ${getReviews?.total_reviews} reviews so far.
              You can give this place a rating! upload your pictures! and write a review! Then at the bottom of the screen! we have Submit Button`;
      let content = `${line0}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('Image picker error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        setSelectedImage(selectedAsset.uri);
      }
    });
  };
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('establishment_id', getReviews?.id);
    formData.append('review_text', data.description);
    formData.append('rating', data.rating);
    if (selectedImage) {
      const formattedUri = selectedImage.startsWith('file://')
        ? selectedImage
        : `file://${selectedImage}`;
      formData.append('media[0]', {
        uri: formattedUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }
    const res = await disptch(addRview(formData)).unwrap();
    if (res?.success == true) {
      navigation.goBack();
    }
  };

  const handleClosePicture = () => {
    setSelectedImage('');
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}>
      <UserHeaderComponent
        handleListening={() => ConvertToSpeech()}
        isListening={isSpeaking}
        title={title || ''}
        backArrow={true}
        headerStyle={styles.header}
        rightArrow={userRole === 3 ? true : false}
      />
      <View style={styles.mainContent}>
        <View style={styles.profileView}>
          <View style={styles.profileInfoView}>
            <View style={styles.profileAndText}>
              <Image
                source={{ uri: getReviews?.main_image }}
                style={{ width: 100, height: 100, borderRadius: 100 }}
              />
              <View style={styles.ContentText}>
                <Text style={styles.titleText}>{getReviews?.name}</Text>
                <View style={styles.ratingStarAndText}>
                  <StarRating
                    onChange={() => console.log('')}
                    rating={getReviews?.average_rating}
                    color={Colors.yellowColor}
                    starSize={20}
                    starStyle={{ width: wp(2) }}
                  />
                  <Text style={styles.ratingText}>
                    {getReviews?.average_rating} ({getReviews?.total_reviews})
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.ratingView}>
            <Image
              source={{ uri: user?.user?.profile_pic }}
              style={styles.userProfile}
            />
            <Controller
              name="rating"
              control={control}
              render={({ field: { onChange, value } }) => (
                <StarRating
                  onChange={onChange}
                  rating={value}
                  emptyColor={Colors.greyColor}
                  color={Colors.yellowColor}
                  starSize={40}
                  enableHalfStar={false}
                  starStyle={{ width: wp(10) }}
                />
              )}
              rules={{ required: 'Rating is required' }}
            />
          </View>
        </View>
        {errors.rating && (
          <Text style={{ color: 'red' }}>{errors.rating.message}</Text>
        )}
        <Text style={styles.sectionTitle}>Add Media</Text>
        <Pressable
          onPress={handleImagePicker}
          style={[
            styles.uploadContainer,
            { borderWidth: selectedImage ? 0 : 1 },
          ]}>
          {selectedImage ? (
            <>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImageStyle}
              />
              <Pressable
                onPress={handleClosePicture}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: verticalScale(-25),
                }}>
                <GlobalIcon
                  name={'close'}
                  color={Colors.blackColor}
                  library="Ionicons"
                  size={moderateScale(30)}
                />
              </Pressable>
            </>
          ) : (
            <>
              <GlobalIcon
                library="Feather"
                name="upload-cloud"
                size={wp(18)}
                color={Colors.greyColor}
              />
              <Text style={styles.uploadText}>
                Add photos or videos you want to upload
              </Text>
            </>
          )}
        </Pressable>
        <View>
          <Text style={styles.sectionTitle}>Write a review</Text>
        </View>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              multiline
              value={value}
              onChangeText={onChange}
              placeholder="Write about your experience with our hotel"
              placeholderTextColor={Colors.greyColor}
            />
          )}
        />
        <View style={styles.btnView}>
          <CustomButton
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.contactButton}
            textStyle={styles.contactButtonText}
            isLoading={isLoading}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default WriteUserReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  selectedImageStyle: {
    width: '100%',
    height: hp(20),
    borderRadius: 8,
    // resizeMode:'contain'
  },
  header: {
    borderBottomWidth: 0,
    flexDirection: 'row',
    gap: 120,
    marginTop: Platform.OS == 'ios' ? verticalScale(25) : 0,
  },
  profileView: {
    width: wp(100),
    height: hp(24),
    flexDirection: 'column',
  },
  profileInfoView: {
    flex: 1,
    flexDirection: 'row',
  },
  ContentText: {
    flex: 1,
    flexDirection: 'column',
  },
  titleText: {
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
    fontSize: 20,
  },
  ratingText: {
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  ratingStarAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: wp(-2),
  },
  profileAndText: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: wp(100),
    height: hp(12),
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: wp(7),
  },
  ratingView: {
    flexDirection: 'row',
    width: wp(100),
    height: hp(12),
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: wp(7),
  },
  sectionTitle: {
    color: Colors.blackColor,
    marginHorizontal: wp(6),
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    marginVertical: hp(2),
  },
  uploadContainer: {
    height: hp(20),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.lightestGrey,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(6),
  },
  uploadText: {
    color: Colors.greyColor,
    fontFamily: Fonts.InterMedium,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    flexDirection: 'row',
    height: hp(20),
    marginHorizontal: wp(6),
    borderRadius: 10,
    borderStyle: 'dashed',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  input: {
    flex: 1,
    color: Colors.blackColor,
    textAlignVertical: 'top',
    marginHorizontal: 20,
    height: hp(19),
    borderWidth: 1,
    borderColor: Colors.lightestGrey,
    borderRadius: 9,
    paddingHorizontal: wp(2),
  },
  micButton: {
    alignSelf: 'flex-start',
    marginTop: hp(1),
  },
  contactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.redColor,
    borderRadius: moderateScale(54),
    width: moderateScale(330),
    height: verticalScale(42),
  },
  contactButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
    fontFamily: Fonts.InterBold,
  },
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    paddingBottom: hp(4),
    // backgroundColor: Colors.red
  },
  userProfile: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
});
