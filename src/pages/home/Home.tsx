import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import NearbyIcon from '../../assets/images/nearbyIcon.svg';
import StarCoinIcon from '../../assets/images/starCoinIcon.svg';
import ViewAll from '../../components/ViewAll';
import {
  Category,
  Establishment,
  PlacesCardProps,
} from '../../interfaces/Interfaces';
import { socket } from '../../services/socket';
import Tts from '../../services/textToSpeech';
import { getEstablishments } from '../../store/establishment/establishmentActions';
import { saveEstablishments } from '../../store/establishment/establishmentSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getEstablishmentDetails,
  getEstablishmentTypes,
} from '../../store/user/UserAction';
import { Colors } from '../../utlis/Colors';
import {
  formatDistance,
  requestAudioRecordPermission
} from '../../utlis/functions';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const token = useAppSelector(state => state.userSlice.token);
  const establishments = useAppSelector(
    state => state.establishmentSlice.establishments,
  );
  const user = useAppSelector(state => state.userSlice.user);
  const establishmentTypes = useAppSelector(
    state => state.userSlice.allEstablishmentTypes,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const selectedEstablishment = useRef<null | number>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const checkESTAB = () => {
    return `${establishmentTypes.map(item => item.name).join('! , ')}!`;
  };

  const readFromApi = (arr: PlacesCardProps[]) => {
    if (arr.length === 0) {
      return 'which are currently not available!';
    }
    if (arr.length === 1) {
      return `which is ${arr
        .map(item => {
          return `${item?.name}. It is ${item?.distance} away and has rating of ${item?.rating}`;
        })
        .join('! , ')}!`;
    }
    return arr
      .map(item => {
        return `${item?.name}. It is ${item?.distance} away and has rating of ${item?.rating}`;
      })
      .join('! , ');
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        Tts.stop();
      };
    }, []),
  );

  useEffect(() => {
    dispatch(getEstablishmentTypes());
    dispatch(getEstablishments(token));
    requestAudioRecordPermission();
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `Hello!!! At the top of the screen, the location is set to ${
        user?.user?.address ? `${user?.user?.address}!` : 'none'
      }!!`;
      const line1 = `!Below the location! there are places to go! ${checkESTAB()}! as categories!`;
      const line2 = `Now we have Featured Establishments! ${readFromApi(
        establishments.featured_establishments,
      )}!`;
      const line3 = `Then we have got nearby restaurants!  ${readFromApi(
        establishments.nearby_restaurants,
      )}!`;
      const line4 = `After that, we have nearby hotels!  ${readFromApi(
        establishments.nearby_hotels,
      )}!`;

      let content = `${line0}! ${line1}${line2}${line3}${line4}`;
      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });
    socket.emit('joinEstablishmentFeed');

    socket.on('newEstablishment', (data: any) => {
      console.log('NEW Establishment heree', data);
      if (data.success == true) {
        console.log(data, '===> New Establishment');
        const {nearby_hotels, nearby_restaurants, ...obj} = establishments;
        console.log(nearby_hotels, 'nearby_hotels');
        console.log(nearby_restaurants, 'nearby_restaurants');
        console.log(obj, 'obj');
        const newEstablishment = {
          ...obj,
          nearby_hotels:
            data.data.type == 'Hotel'
              ? [...nearby_hotels, data.data]
              : nearby_hotels,
          nearby_restaurants:
            data.data.type == 'Restaurant'
              ? [...nearby_restaurants, data.data]
              : nearby_restaurants,
        };
        dispatch(saveEstablishments({type: 'all', data: newEstablishment}));
      }
    });

    return () => {
      socket.off('newEstablishment');
    };
  }, [establishments]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getEstablishmentTypes());
    dispatch(getEstablishments(token));
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderEstablishment = ({item}: {item: Establishment}) => {
    const handlePassId = async (id: number | any) => {
      setScreenLoading(true);
      const res = await dispatch(getEstablishmentDetails(id)).unwrap();
      if (res?.success === true) {
        setScreenLoading(false);
        navigation.navigate('contactScreen');
      } else {
        setScreenLoading(false);
      }
    };
    return (
      <Pressable
        onPress={() => handlePassId(item?.id)}
        style={styles.establishmentItem}>
        <View style={styles.establishmentImage}>
          <Image
            style={{
              width: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height: hp(20),
            }}
            source={{uri: item?.main_image}}
          />
        </View>
        <View style={styles.establishmentInfo}>
          <View
            style={[
              styles.nameAndDistanceView,
              item.name.length > 10 && {alignItems: 'flex-start'},
            ]}>
            <Text
              style={[
                styles.establishmentName,
                item.name.length > 10 && {width: hp(15)},
              ]}>
              {item.name}
            </Text>
            <View style={styles.distanceContainer}>
              <GlobalIcon
                library="CustomIcon"
                name="Group-1970"
                size={moderateScale(16)}
                color={Colors.blueColor}
              />
              <Text style={styles.distanceText}>
                {formatDistance(item.distance)}
              </Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.establishmentType}>{item.type}</Text>
            <GlobalIcon
              library="CustomIcon"
              name="Group-1968"
              size={moderateScale(16)}
              color={Colors.yellowColor}
            />
            <Text style={styles.ratingText}>{item.rating}</Text>
            {isLoading && selectedEstablishment.current === item?.id && (
              <ActivityIndicator color={Colors.redColor} />
            )}
          </View>
        </View>
      </Pressable>
    );
  };
  const renderCategory = ({item, index}: {item: Category; index: number}) => {
    return (
      <Pressable
        style={styles.mainCategoryItem}
        onPress={() =>
          navigation.navigate('restaurantsScreens', {
            name: item.name,
            id: item?.id,
            index: index,
          })
        }>
        <View style={styles.categoryItem}>
          <View style={styles.IconView}>
            <Image
              source={{uri: item.image}}
              style={styles.estabTypesImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.categoryText}>{item.name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.locationTitle}>Location</Text>
            <Pressable style={[styles.locationSelector, {width: hp(30)}]}>
              <Text style={styles.locationText}>{user?.user?.address}</Text>
              <GlobalIcon
                library="Entypo"
                name="chevron-small-down"
                size={moderateScale(24)}
                color={Colors.greenAndGreyMixColor}
              />
            </Pressable>
          </View>
          <Pressable onPress={() => ConvertToSpeech()}>
            <GlobalIcon
              library="CustomIcon"
              name="Vector-2"
              size={30}
              color={isSpeaking ? Colors.greenColor : Colors.redColor}
            />
          </Pressable>
        </View>

        <Text
          style={{
            ...styles.sectionTitle,
            marginLeft: moderateScale(25),
          }}>
          Places to go
        </Text>
        <FlatList
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <Text>No places available</Text>
            )
          }
          data={establishmentTypes}
          renderItem={renderCategory}
          keyExtractor={item => item.id?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles?.categoriesFlatlistStyle}
          bounces={false}
        />

        <View style={styles.sectionHeader}>
          <View style={styles.subHeadingView}>
            <StarCoinIcon />
            <Text style={styles.sectionTitle}>Featured Establishments</Text>
          </View>

          <ViewAll
            onPress={() =>
              navigation.navigate('restaurantsScreens', {
                name: 'all',
                index: undefined,
              })
            }
          />
        </View>
        {establishments?.featured_establishments?.length > 0 ? (
          <FlatList
            data={establishments.featured_establishments}
            renderItem={renderEstablishment}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.establishmentsList}
            contentContainerStyle={styles.establishmentFlatListStyle}
            bounces={false}
          />
        ) : (
          <View
            style={{
              height: hp(15),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.InterBold,
                color: Colors.blackColor,
              }}>
              No Record Found
            </Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.subHeadingView}>
            <NearbyIcon />
            <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          </View>
          <ViewAll
            onPress={() =>
              navigation.navigate('restaurantsScreens', {
                name: 'Restaurant',
                id: 3,
                index: 1,
              })
            }
          />
        </View>
        {establishments?.nearby_restaurants?.length > 0 ? (
          <FlatList
            data={establishments?.nearby_restaurants}
            renderItem={renderEstablishment}
            keyExtractor={item => item.id?.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.establishmentsList}
            contentContainerStyle={styles.establishmentFlatListStyle}
            bounces={false}
          />
        ) : (
          <View
            style={{
              height: hp(15),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.InterBold,
                color: Colors.blackColor,
              }}>
              No Record Found
            </Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.subHeadingView}>
            <NearbyIcon />
            <Text style={styles.sectionTitle}>Nearby Hotels</Text>
          </View>
          <ViewAll
            onPress={() =>
              navigation.navigate('restaurantsScreens', {
                name: 'Hotel',
                id: 2,
                index: 0,
              })
            }
          />
        </View>
        {establishments?.nearby_hotels?.length > 0 ? (
          <FlatList
            data={establishments?.nearby_hotels}
            renderItem={renderEstablishment}
            keyExtractor={item => item.id?.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.establishmentsList}
            contentContainerStyle={styles.establishmentFlatListStyle}
            bounces={false}
          />
        ) : (
          <View
            style={{
              height: hp(15),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.InterBold,
                color: Colors.blackColor,
              }}>
              No Record Found
            </Text>
          </View>
        )}
      </ScrollView>

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
    backgroundColor: Colors.allScreensBgColor,
  },
  estabTypesImage: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: 0,
  },
  header: {
    padding: verticalScale(19),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'column',
  },
  locationTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  locationText: {
    fontSize: moderateScale(16),
    color: Colors.greenAndGreyMixColor,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  categoriesList: {
    marginTop: verticalScale(8),
  },
  categoriesFlatlistStyle: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(10),
  },
  mainCategoryItem: {
    backgroundColor: Colors.whiteColor,
    width: wp(44),
    height: hp(7),
    borderRadius: 35,
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    paddingVertical: verticalScale(6),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  categoryText: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
    marginRight: wp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: moderateScale(16),
    gap: 12,
  },
  subHeadingView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    gap: 10,
    marginHorizontal: moderateScale(12),
  },
  IconView: {
    width: 45,
    height: 45,
    backgroundColor: Colors.lightestGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  ViewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  viewAllText: {
    color: Colors.redColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterRegular,
  },
  establishmentsList: {
  },
  establishmentFlatListStyle: {
    flexGrow: 1,
    gap: 20,
    flexDirection: 'row',
    paddingVertical: verticalScale(7),
    paddingHorizontal: moderateScale(12),
    marginBottom: moderateScale(15),
  },
  establishmentItem: {
    width: wp(61),
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingBottom: hp(1),
  },
  establishmentImage: {
    width: '100%',
    borderRadius: 8,
  },
  establishmentInfo: {
    marginTop: verticalScale(8),
  },
  nameAndDistanceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(8),
  },
  establishmentName: {
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  establishmentType: {
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    fontFamily: Fonts.InterRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(7),
    gap: 12,
    paddingVertical: verticalScale(4),
  },
  ratingText: {
    color: Colors.greenAndGreyMixColor,
    fontFamily: Fonts.InterRegular,
    fontSize: moderateScale(14),
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    fontFamily: Fonts.InterRegular,
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

export default Home;
