import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import StarIcon from '../../assets/images/starIcon1.svg';
import { navigationProps } from '../../interfaces/Interfaces';
import { socket } from '../../services/socket';
import {
  getEstablishmentDetails,
  getEstablishmentsDashboard,
} from '../../store/establishment/establishmentActions';
import { saveEstablishmentOwnerDetails } from '../../store/establishment/establishmentSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getReviewDetails } from '../../store/reviews/ReviewsAction';
import { saveLocationName } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { apiKey } from '../../utlis/Constant';
import { getAccurateLocationAddress } from '../../utlis/functions';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;
const { hp } = ResponsiveSizes;
const Dashboard: React.FC<navigationProps> = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userSlice.user);
  const establishmentOwnerDetails: any = useAppSelector(
    state => state.establishmentSlice.establishmentOwnerDetails,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMainImageLoading, setIsMainImageLoading] = useState(false);
  const token = useAppSelector(state => state.userSlice.token);
  const [refreshing, setRefreshing] = useState(false);
  const isLogin = useAppSelector(state => state.userSlice.isLogin);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server dashboard');
    });

    socket.emit('joinReviewFeed');

    socket.on('newReview', data => {
      if (data.success == true) {
        const { establishment, recent_reviews, statistics, ...obj } =
          establishmentOwnerDetails || {};
        const updatedEstablishment = {
          ...obj,
          establishment: data?.data?.establishment || {},
          statistics: data?.data?.statistics,
          recent_reviews:
            recent_reviews?.length > 0
              ? [data.data.review, ...recent_reviews]
              : [data.data.review],
        };
        dispatch(saveEstablishmentOwnerDetails(updatedEstablishment));
      }
    });

    return () => {
      socket.off('newReview');
      socket.off('connect');
    };
  }, []);

  const handleNavigateReview = async (title: string) => {
    const res = await dispatch(
      getReviewDetails({
        token: token,
        id: establishmentOwnerDetails?.establishment?.id,
      }),
    ).unwrap();
    if (res.success == true) {
      navigation.navigate('ownerReviews', { title, vioceIcon: true });
    }
  };

  useEffect(() => {
    dispatch(getEstablishmentsDashboard());

    if (isLogin) {
      (async () => {
        const res = await dispatch(getEstablishmentDetails()).unwrap();
        if (res.success == true) {
          const locationName = await getAccurateLocationAddress(
            res.data.latitude,
            res.data.longitude,
            apiKey,
          );
          dispatch(saveLocationName(locationName));
        }
      })();
    }
  }, []);

  const totalReviews = establishmentOwnerDetails?.establishment;
  const displayReviews =
    totalReviews?.total_reviews > 0
      ? `${totalReviews?.total_reviews}`
      : totalReviews?.total_reviews;
  const displayAverageRating =
    totalReviews?.average_rating > 0
      ? Number(totalReviews?.average_rating)
      : totalReviews?.average_rating ?? 0;

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getEstablishmentsDashboard());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                establishmentOwnerDetails?.establishment?.cover_image ||
                establishmentOwnerDetails?.establishment?.main_image,
            }}
            onLoadStart={() => setIsMainImageLoading(true)}
            onLoadEnd={() => setIsMainImageLoading(false)}
            style={styles.headerImage}
          />
          {isMainImageLoading && (
            <View style={styles.mainImageLoading}>
              <ActivityIndicator size="large" color={Colors.redColor} />
            </View>
          )}
          <View style={styles.overlay} />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              <Text style={styles.waveEmoji}>👋 </Text>
              <Text style={styles.waveEmoji}>Welcome Back,</Text>{' '}
              <Text
                style={[
                  styles.nameText,
                  Platform.OS == 'ios' && { fontWeight: 'bold' },
                ]}>
                {user?.user?.name}!
              </Text>
            </Text>
          </View>
          <View style={styles.hotelInfoContainer}>
            <Image
              source={{ uri: user?.user?.profile_pic }}
              style={styles.hotelLogo}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
            {isLoading && (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={Colors.redColor} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.hotelName}>
            {establishmentOwnerDetails?.establishment?.name || ''}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.ratingText}>{displayAverageRating}</Text>
                <StarRating
                  rating={displayAverageRating}
                  onChange={e => console.log(e)}
                  starStyle={{ width: 15 }}
                />
              </View>
              <Text style={styles.reviewsText}>
                Based on {displayReviews} reviews
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <Pressable
              style={styles.statItem}
              onPress={() => handleNavigateReview('Ratings')}>
              <View style={styles.ThumbIconView}>
                <GlobalIcon
                  library="CustomIcon"
                  name="Group-1"
                  size={33}
                  color={Colors.redColor}
                />
              </View>
              <View style={styles.statItemText}>
                <Text style={styles.statValue}>
                  {establishmentOwnerDetails?.statistics?.ratings?.count}
                </Text>
                <Text style={styles.statLabel}>Ratings</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.statItem1}
              onPress={() => handleNavigateReview('Reviews')}>
              <View style={styles.ThumbIconView}>
                <GlobalIcon
                  library="CustomIcon"
                  name="Vector-3"
                  size={24}
                  color={Colors.redColor}
                />
              </View>
              <View style={styles.statItemText}>
                <Text style={styles.statValue}>
                  {establishmentOwnerDetails?.statistics?.reviews?.count}
                </Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.recentReviewsHeader}>
            <View style={styles.reviewHead}>
              <StarIcon />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                Recent Reviews
              </Text>
            </View>
            <Pressable
              style={styles.ViewAllBtn}
              onPress={() => handleNavigateReview('Reviews')}>
              <Text style={styles.viewAllText}>View All</Text>
              <GlobalIcon
                library="AntDesign"
                name="right"
                size={14}
                color={Colors.redColor}
              />
            </Pressable>
          </View>

          {establishmentOwnerDetails?.recent_reviews?.length > 0 ? (
            establishmentOwnerDetails?.recent_reviews.map(
              (review: any, index: number) => (
                <View key={index} style={styles.reviewItem}>
                  <Image
                    style={styles.recentReviewsImage}
                    source={{ uri: review?.user?.profile_image }}
                  />
                  <View style={styles.reviewContent}>
                    <Text style={styles.reviewerName}>
                      {review?.user?.name}
                    </Text>
                    <View style={styles.subContent}>
                      <View style={styles.reviewRating}>
                        <StarRating
                          rating={review?.rating}
                          onChange={e => console.log(e)}
                          starStyle={{ width: 5 }}
                          style={{ width: 85 }}
                          starSize={20}
                        />
                        <Text style={styles.reviewRatingText}>
                          {review?.rating}.0
                        </Text>
                      </View>
                      <Text style={styles.reviewTime}>
                        {review?.created_at}
                      </Text>
                    </View>
                    <Text numberOfLines={5} style={styles.reviewText}>
                      {review?.comment}
                    </Text>
                  </View>
                </View>
              ),
            )
          ) : (
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: Fonts.InterBold,
                }}>
                No Record Found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: hp(2),
  },
  header: {
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  mainImageLoading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '90%',
  },
  welcomeContainer: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 50 : 20,
    left: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  waveEmoji: {
    fontSize: 20,
    fontFamily: Fonts.InterRegular,
  },
  nameText: {
    fontFamily: Fonts.InterBlack,
  },
  hotelInfoContainer: {
    position: 'absolute',
    bottom: -40,
    left: hp(15),
    borderRadius: 65,
    borderWidth: 7,
    borderColor: Colors.whiteColor,
  },
  hotelLogo: {
    width: 120,
    height: 120,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: Colors.redColor,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // backgroundColor: 'white',
    borderRadius: 15,
    padding: 3,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  hotelName: {
    fontSize: moderateScale(24),
    marginBottom: verticalScale(5),
    color: Colors.blackColor,
    textAlign: 'center',
    fontFamily: Fonts.InterMedium,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: moderateScale(28),
    marginRight: 5,
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
    fontWeight: 'bold',
  },
  reviewsText: {
    fontSize: moderateScale(16),
    marginLeft: 5,
    color: Colors.greyColor,
    fontFamily: Fonts.InterMedium,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    marginBottom: 10,
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    width: '50%',
    borderRadius: 8,
    height: verticalScale(60),
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: moderateScale(17),
  },
  statItem1: {
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    width: '50%',
    borderRadius: 8,
    height: verticalScale(60),
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: moderateScale(17),
  },
  statItemText: {
    flexDirection: 'column',
  },
  ThumbIconView: {
    width: moderateScale(50),
    height: verticalScale(40),
    borderRadius: 12,
    backgroundColor: Colors.lightestPinkColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: moderateScale(18),
    marginTop: 5,
    color: Colors.redColor,
    fontFamily: Fonts.InterMedium,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  recentReviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ViewAllBtn: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.redColor,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  recentReviewsImage: {
    height: hp(6),
    width: hp(6),
    borderRadius: 50,
  },
  reviewerAvatar: {
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
  },
  subContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewRatingText: {
    marginLeft: 5,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
  },
  reviewTime: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
  },
  reviewText: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
    marginTop: 5,
  },
});

export default Dashboard;
