import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { renderReview } from '../../components/OwnerReviewList';
import { OwnerReviewsProps, ReviewApi } from '../../interfaces/Interfaces';
import { socket } from '../../services/socket';
import Tts from '../../services/textToSpeech';
import { saveEstablishmentDetails } from '../../store/establishment/establishmentSliceDetails';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getReviewDetails } from '../../store/reviews/ReviewsAction';
import { setEstablishment, setReviews } from '../../store/reviews/ReviewsSlice';
import { Colors } from '../../utlis/Colors';
import { reviewBar } from '../../utlis/DummyData';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const {wp, hp} = ResponsiveSizes;

const OwnerReviews: React.FC<OwnerReviewsProps> = ({route}) => {
  const totalStars = 5;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const title = route?.params?.title;
  const voicIcon = route?.params?.vioceIcon;
  const reviewbtn = route?.params?.writeReviewbtn;
  const getReviews = useAppSelector(state => state?.reviewSlice?.establishment);
  const ratingStats = getReviews?.rating_stats;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const averageRating = getReviews?.average_rating || 0;
  const userRole = useAppSelector(state => state?.userSlice.role);
  const getReviewsDetails: any = useAppSelector(
    state => state?.reviewSlice?.reviews,
  );
  const getEstablishmentsDetails = useAppSelector(
    state => state?.establishmentDetailSlice?.establishmentDetails,
  );

  useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  const readFromApi = () => {
    if (getReviewsDetails?.data?.length === 0) {
      return '';
    }
    return getReviewsDetails?.data.map((item: ReviewApi, index: number) => {
      return `${index > 0 ? 'Next' : 'This'} review is from ${item.user.name}!.
             ${item?.user.name}! has given a rating of ${item?.rating} ${
        item?.comment ? `and says ${item.comment}!` : ``
      }!`;
    });
  };

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `You are on Reviews Screen! The place ${
        getReviews?.name
      } has a rating of ${getReviews?.average_rating} and has received ${
        getReviews?.total_reviews
      } reviews so far.
            ${readFromApi()}
              At the bottom of the screen! we have Write A Review Button`;
      let content = `${line0}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  useEffect(() => {
    socket.on('newReview', data => {
      if (data.success == true) {
        const establishment = data.data.establishment || {};
        const newReview = data.data.review || {};
        let updatedReviews: any = {
          ...getReviewsDetails,
          data:
            getReviewsDetails?.data?.length > 0
              ? [newReview, ...getReviewsDetails?.data]
              : [newReview],
        };
        dispatch(setEstablishment(establishment));
        dispatch(setReviews(updatedReviews));
        let updatedEstablishmentDetails: any = {
          ...getEstablishmentsDetails,
          total_reviews: establishment.total_reviews || 0,
          rating: establishment.average_rating || 0,
        };
        dispatch(saveEstablishmentDetails({data: updatedEstablishmentDetails}));
      }
    });

    return () => {
      socket.off('newReview');
    };
  }, []);

  useMemo(() => {
    if (getReviews?.id) {
      dispatch(getReviewDetails({id: getReviews?.id}));
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    if (getReviews?.id) {
      dispatch(getReviewDetails({id: getReviews?.id}));
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        title={title}
        handleListening={() => ConvertToSpeech()}
        isListening={isSpeaking}
        backArrow={true}
        headerStyle={styles.header}
        rightArrow={userRole === 3 ? true : false}
      />
      <View style={styles.content}>
        <View style={styles.hotelInfoContainer}>
          <Image
            source={{uri: getReviews?.main_image}}
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)}
            style={styles.reviewImageScreen}
          />
          {isImageLoading && (
            <View style={{position: 'absolute', top: hp(3.5)}}>
              <ActivityIndicator size="large" color={Colors.redColor} />
            </View>
          )}
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>
              {voicIcon ? getReviews?.name : ''}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{averageRating}</Text>
              {[...Array(Math.floor(averageRating))].map((_, index) => (
                <GlobalIcon
                  key={`filled-${index}`}
                  library="FontAwesome"
                  name="star"
                  size={14}
                  color={Colors.yellowColor}
                />
              ))}

              {averageRating % 1 !== 0 && (
                <GlobalIcon
                  key="half-star"
                  library="FontAwesome"
                  name="star-half-full"
                  size={14}
                  color={Colors.yellowColor}
                />
              )}

              {[...Array(totalStars - Math.ceil(averageRating))].map(
                (_, index) => (
                  <GlobalIcon
                    key={`empty-${index}`}
                    library="FontAwesome"
                    name="star-o"
                    size={14}
                    color={Colors.greyColor}
                  />
                ),
              )}
            </View>
            <Text style={styles.reviewCount}>
              Based on {getReviews?.total_reviews} reviews
            </Text>
          </View>
        </View>
        <View style={styles.ratingBars}>
          {reviewBar.map((item, index) => (
            <View key={index} style={styles.ratingBar}>
              <Text style={styles.ratingLabel}>{item.label}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${ratingStats?.[item.key]?.percentage || 0}%`,
                      backgroundColor: Colors.ratingColors[index],
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
        <FlatList
          data={getReviewsDetails?.data}
          renderItem={renderReview}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      {reviewbtn && (
        <View style={styles.btnView}>
          <CustomButton
            title="Write a Review"
            onPress={() =>
              navigation.navigate('writeUserReview', {
                voiceIcon: true,
                headerTitle: 'Write a Review',
              })
            }
            buttonStyle={styles.contactButton}
            textStyle={styles.contactButtonText}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightestGrey,
    flexDirection: 'row',
    marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
    gap: 120,
  },
  hotelInfoContainer: {
    flexDirection: 'column',
    marginBottom: verticalScale(16),
    alignItems: 'center',
  },
  hotelLogo: {
    width: 120,
    height: 120,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: Colors.redColor,
  },
  hotelImage: {
    width: moderateScale(60),
    height: moderateScale(60),
  },
  hotelDetails: {
    marginLeft: moderateScale(16),
    alignItems: 'center',
  },
  hotelName: {
    fontSize: moderateScale(23),
    marginBottom: verticalScale(4),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
    gap: 12,
  },
  ratingText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(25),
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: moderateScale(16),
    color: Colors.greenAndGreyMixColor,
    fontFamily: Fonts.InterRegular,
  },
  ratingBars: {
    marginBottom: verticalScale(16),
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  ratingLabel: {
    width: moderateScale(100),
    fontSize: moderateScale(14),
    color: Colors.greyColor,
  },
  barContainer: {
    flex: 1,
    height: verticalScale(8),
    // backgroundColor: Colors.lightGrayColor,
    borderRadius: moderateScale(4),
  },
  bar: {
    height: '100%',
    borderRadius: moderateScale(12),
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  reviewContent: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  reviewName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  dateText: {
    fontSize: moderateScale(12),
    marginLeft: moderateScale(8),
  },
  commentText: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
  },
  contactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.redColor,
    borderRadius: moderateScale(54),
    width: moderateScale(300),
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
    paddingBottom: verticalScale(2),
  },
  reviewImageScreen: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});

export default OwnerReviews;
