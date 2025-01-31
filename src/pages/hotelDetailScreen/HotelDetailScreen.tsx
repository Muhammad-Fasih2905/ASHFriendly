import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import VerifiedBadge from '../../assets/images/verifiedBadge.svg';
import { HotelDetailScreenProps } from '../../interfaces/Interfaces';
import { socket } from '../../services/socket';
import { getEstablishmentsDetails } from '../../store/establishment/establishmentActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getReviewDetails } from '../../store/reviews/ReviewsAction';
import {
  getEstablishmentDetails,
  getRecentSearches,
} from '../../store/user/UserAction';
import { setGlobalOrigin } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { apiKey } from '../../utlis/Constant';
import {
  getAccurateLocationAddress,
  requestLocationPermission,
  sharePost,
} from '../../utlis/functions';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;
const { wp, hp } = ResponsiveSizes;

const HotelDetailScreen: React.FC<HotelDetailScreenProps> = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const establishmentId = route?.params?.establishmentId;
  const [largeImageIndex, setLargeImageIndex] = useState(0);
  const token = useAppSelector(state => state.userSlice.token);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const EstabDetails: any = useAppSelector(
    state => state.userSlice.currentEstablishmentDetails,
  );
  const [screenLoading, setScreenLoading] = useState(false);

  useEffect(() => {
    const fetchEstablishmentDetails = async () => {
      try {
        const response = await dispatch(
          getEstablishmentDetails(establishmentId),
        ).unwrap();
        const index = response?.data?.images?.findIndex(item => item.is_main);
        setLargeImageIndex(index);
      } catch (error) {
        console.log(error);
      }
    };

    if (establishmentId) {
      fetchEstablishmentDetails();
    }
  }, [establishmentId]);

  const openCall = () => {
    Linking.openURL(`tel:${EstabDetails?.contact?.phone}`);
  };

  const [region, setRegion] = useState({
    latitude: EstabDetails?.coordinates?.latitude || 22,
    longitude: EstabDetails?.coordinates?.longitude || 22,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    const permission = await requestLocationPermission();
    if (!permission) {
      console.log('need location permission');
      return;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          const locationName = await getAccurateLocationAddress(
            latitude,
            longitude,
            apiKey,
          );
          let origin = {
            latitude: latitude,
            longitude: longitude,
            title: locationName,
          };

          resolve(origin);
        },

        error => {
          reject(error);
          console.log('Error getting current location: ', error);
        },
      );
    });
  };

  const handleDirection = async () => {
    setScreenLoading(true);
    const res = await dispatch(
      getEstablishmentsDetails({ token: token, id: EstabDetails?.id }),
    ).unwrap();
    if (res?.success === true) {
      const origin = await getCurrentLocation();
      dispatch(setGlobalOrigin(origin));
      setScreenLoading(false);
      navigation?.navigate('locationDirectionScreen');
    }
    else {
      setScreenLoading(false);
    }
  };
  const navToPrevScreen = async () => {
    dispatch(getRecentSearches());
    navigation?.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          color={Colors.redColor}
          style={{ marginTop: hp(22) }}
          size={'large'}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{EstabDetails?.name}</Text>
            <Pressable onPress={navToPrevScreen}>
              <GlobalIcon
                library="Feather"
                name="x"
                size={moderateScale(22)}
                color={Colors.blackColor}
              />
            </Pressable>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
            >
              <Marker coordinate={region} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={[styles.markerContainer]}>
                  <GlobalIcon
                    library="CustomIcon"
                    name="Vector-4"
                    size={40}
                    color={Colors.redColor}
                  />
                  <Text
                    style={{
                      color: Colors.redColor,
                      paddingLeft: wp(1),
                      fontSize: moderateScale(20),
                    }}>
                    {EstabDetails?.name}
                  </Text>
                </View>
              </Marker>
            </MapView>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <View>
                <Pressable
                  style={styles.badgeTextView}
                  onPress={() => navigation?.navigate('contactScreen')}>
                  <VerifiedBadge />
                  <Text style={styles.hotelName}>{EstabDetails?.name}</Text>
                </Pressable>
                <Pressable
                  style={styles.ratingContainer}
                  onPress={async () => {
                    socket.emit('joinReviewFeed');
                    const res = await dispatch(
                      getReviewDetails({ id: EstabDetails?.id }),
                    ).unwrap();
                    if (res.success == true) {
                      navigation?.navigate('ownerReviews', {
                        title: 'Reviews',
                        vioceIcon: true,
                        writeReviewbtn: true,
                      });
                    }
                  }}>
                  <GlobalIcon
                    library="CustomIcon"
                    name="Group-1968"
                    size={moderateScale(16)}
                    color={Colors.yellowColor}
                  />
                  <Text
                    style={
                      styles.ratingText
                    }>{`${EstabDetails?.rating} (${EstabDetails?.total_reviews} Reviews)`}</Text>
                </Pressable>
              </View>
              <Pressable onPress={navToPrevScreen}>
                <GlobalIcon
                  library="Feather"
                  name="x"
                  size={moderateScale(22)}
                  color={Colors.blackColor}
                />
              </Pressable>
            </View>

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryText}>
                {EstabDetails?.establishment_type?.name}
              </Text>
              <GlobalIcon
                library="MaterialCommunityIcons"
                name="car-side"
                size={moderateScale(16)}
                color={Colors.greenAndGreyMixColor}
              />
            </View>

            <View style={styles.actionButtons}>
              <Pressable
                style={[styles.actionButton, styles.directionsButton]}
                onPress={handleDirection}>
                <GlobalIcon
                  library="FontAwesome5"
                  name="directions"
                  size={moderateScale(14)}
                  color={Colors.whiteColor}
                />
                <Text style={styles.buttonText}>Directions</Text>
              </Pressable>
              <Pressable onPress={openCall} style={styles.actionButton}>
                <GlobalIcon
                  library="FontAwesome5"
                  name="phone-alt"
                  size={moderateScale(14)}
                  color={Colors.redColor}
                />
                <Text style={[styles.buttonText, styles.redText]}>Call</Text>
              </Pressable>
              <Pressable
                onPress={() => sharePost(EstabDetails?.id, EstabDetails.name, EstabDetails.images[0].url, "image/jpg", setScreenLoading)}
                style={styles.actionButton}>
                <GlobalIcon
                  library="Entypo"
                  name="share"
                  size={moderateScale(14)}
                  color={Colors.redColor}
                />
                <Text style={[styles.buttonText, styles.redText]}>Share</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
              contentContainerStyle={styles.scrollContentImages}
              bounces={false}>
              <View style={styles.largeImageContainer}>
                {EstabDetails?.images?.map((item, index) => {
                  if (item.is_main) {
                    return (
                      <Image
                        key={index}
                        source={{ uri: item?.url }}
                        style={styles.largeImage}
                      />
                    );
                  }
                })}
              </View>
              <View style={styles.mainimagesView}>
                {EstabDetails?.images?.map((item, index, array) => {
                  if (item.is_main) {
                    return;
                  }
                  if (
                    largeImageIndex % 2 == 0 ? index % 2 !== 0 : index % 2 === 0
                  ) {
                    return (
                      <View key={index} style={styles.smallImagesContainer}>
                        <Image
                          source={{ uri: item?.url }}
                          style={styles.smallImage}
                        />
                        {array[index + 1]?.url && (
                          <Image
                            source={{ uri: array[index + 1]?.url }}
                            style={styles.smallImage}
                          />
                        )}
                      </View>
                    );
                  }
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      )}
      {screenLoading && (
        <View style={styles.mainLoading}>
          <ActivityIndicator color={Colors.redColor} size={'large'} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(16),
    position: 'absolute',
    width: '90%',
    backgroundColor: Colors.whiteColor,
    zIndex: 1,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: ResponsiveSizes.hp(2),
  },
  headerTitle: {
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    fontFamily: Fonts.InterRegular,
  },
  mapContainer: {
    height: verticalScale(266),
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    height: 40,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    marginLeft: moderateScale(-12),
    marginTop: verticalScale(-24),
  },
  infoContainer: {
    padding: moderateScale(16),
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    paddingVertical: hp(6),
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hotelName: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(4),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    fontFamily: Fonts.InterMedium,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  categoryText: {
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    marginRight: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  timeText: {
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    marginLeft: moderateScale(4),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(16),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(10),
    borderRadius: moderateScale(27),
    borderWidth: 1,
    borderColor: '#E53935',
    marginHorizontal: moderateScale(4),
    width: moderateScale(100),
  },
  directionsButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(12),
    fontFamily: Fonts.InterRegular,
    color: Colors.whiteColor,
  },
  redText: {
    color: Colors.redColor,
  },
  imageScroll: {
    marginTop: verticalScale(16),
  },
  scrollContentImages: {
    flexDirection: 'row',
  },
  largeImageContainer: {
    marginRight: moderateScale(8),
  },
  largeImage: {
    width: moderateScale(200),
    height: verticalScale(200),
    borderRadius: moderateScale(8),
  },
  mainimagesView: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  smallImagesContainer: {
    justifyContent: 'space-between',
    gap: 10,
  },
  smallImage: {
    width: moderateScale(130),
    height: verticalScale(96),
    borderRadius: moderateScale(8),
  },
  badgeTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mainLoading: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: Dimensions.get("window").height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HotelDetailScreen;
