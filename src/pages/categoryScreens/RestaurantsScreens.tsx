import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import PlacesCard from '../../components/PlacesCard';
import SearchInput from '../../components/SearchInput';
import { Category, PlacesCardProps } from '../../interfaces/Interfaces';
import { socket } from '../../services/socket';
import Tts from '../../services/textToSpeech';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getFilteredEstablishmentSearchResult,
  getFilteredSearchResult,
  getRecentSearches,
} from '../../store/user/UserAction';
import { updateSpecificEstablishment } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;

const per_page = 5;
const RestaurantsScreens = memo(() => {
  const navigation = useNavigation();
  const route = useRoute().params as any;

  const userRole = useAppSelector(state => state.userSlice.role);
  const dispatch = useAppDispatch();
  const recent_searches = useAppSelector(
    state => state.userSlice.recent_searches,
  );
  const filteredSearchResult = useAppSelector(
    state => state.userSlice.filteredSearchResult,
  );
  const filteredEstablishmentSearchResult = useAppSelector(
    state => state.userSlice.filteredEstablishmentSearchResult,
  );
  const totalRecords = useAppSelector(
    state => state.userSlice.filteredResultMetaData?.total,
  );
  const categories = useAppSelector(
    state => state.userSlice.allEstablishmentTypes,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);


  const per_page = 5;
  const initialCategory = route?.name;
  const initialCategoryId = route?.id;
  const initialSearchFocused = false;
  const initialIsFlatListReady = false;
  const initialSearchInputText = '';
  const initialLoadingMore = false;
  const initialCurrentPage = 1;
  const initialNoRecordsToShow = false;


  const currentPage = useRef(initialCurrentPage);
  const [refreshing, setRefreshing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingMore, setLoadingMore] = useState(initialLoadingMore);
  const [searchFocused, setSearchFocused] = useState(initialSearchFocused);
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [isFlatListReady, setIsFlatListReady] = useState(
    initialIsFlatListReady,
  );
  const [searchInputText, setSearchInputText] = useState(
    initialSearchInputText,
  );
  const [noRecordsToShow, setNoRecordsToShow] = useState(
    initialNoRecordsToShow,
  );

  const textInputRef = useRef<TextInput>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.stop();
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const spokenText = event.value[0];
    console.log('spoken text', spokenText);
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({text: spokenText});
    }
    setSearchInputText(spokenText);
    fetchSearchResult(spokenText);
  };

  const onSpeechError = (e: any) => {
    setIsListening(false);
    if (e.error?.code === '7') {
      console.log('No match found. Please speak more clearly.');
    } else if (e.error?.code === '5') {
      console.log('Microphone error. Please ensure permissions are granted.');
    } else if (e.error?.code === '11') {
      console.log("Didn't understand. Please try again.");
    }
  };

  const startListening = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission denied');
          return;
        }
      }
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  useEffect(() => {
    socket.on('newReview', data => {
      console.log('socket data-------', data);
      if (data.success == true) {
        const establishment = data.data.establishment || {};
        dispatch(
          updateSpecificEstablishment({
            id: establishment.id,
            rating: establishment.average_rating,
          }),
        );
      }
    });

    return () => {
      socket.off('newReview');
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        Tts.stop();
      };
    }, []),
  );

  const checkESTAB = () => {
    return `${categories.map(item => item.name).join('! , ')}!`;
  };

  const readFromApi = (arr: PlacesCardProps[]) => {
    if (arr.length === 0) {
      return 'so the records are currently not available';
    }
    if (arr.length === 1) {
      return `we have ${arr
        .map(item => {
          return `${item?.name}! It is located at ${item?.address}! and is ${item?.distance} away! It has a rating of ${item?.rating}`;
        })
        .join('! , ')}`;
    }
    return `we have ${arr
      .map(item => {
        return `${item?.name}! It is located at ${item?.address}! and is ${item?.distance} away! It has a rating of ${item?.rating}`;
      })
      .join('! , ')}`;
  };

  const ConvertToSpeech = () => {
    let line1 = '';
    let line2 = '';
    let line3 = '';
    if (!isSpeaking) {
      if (!searchFocused) {
        line1 = `You are currently on ${activeCategory} Screen! After the heading! we have got ${checkESTAB()} as categories!!`;
        line2 = `Below the categories! we have a Search Placeholder! which says Search Establishment! On its right! there is also a filter button!`;
        line3 = `Since current category is ${activeCategory}, ${readFromApi(
          filteredEstablishmentSearchResult,
        )}`;
      } else if (
        searchFocused &&
        recent_searches?.length === 0 &&
        searchInputText === ''
      ) {
        line1 = 'You have not searched anything recently';
      } else if (
        searchFocused &&
        recent_searches?.length > 0 &&
        searchInputText === ''
      ) {
        line1 = `In recent searches! ${readFromApi(recent_searches)}`;
      } else if (searchInputText !== '') {
        line1 = `In our search results! ${readFromApi(filteredSearchResult)}`;
      }

      const content = `${line1} ${line2} ${line3}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };
  useEffect(() => {
    if (currentPage.current === 1) {
      fetchEstablishmentDetails(route?.id, 1, 5);
    }
  }, []);

  const fetchEstablishmentDetails = async (
    id: number,
    page?: number,
    per_page: 5,
  ) => {
    if (searchFocused || searchInputText !== '') {
      return;
    }
    try {
      const requestBody = {
        id: id,
        current_page: page || currentPage.current,
        per_page: per_page,
      };
      const response = await dispatch(
        getFilteredEstablishmentSearchResult(requestBody),
      ).unwrap();

      if (response?.success) {
        if (response.data.length >= response?.meta?.total) {
          return;
        } else {
          currentPage.current += 1;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    if (route?.index && isFlatListReady) {
      handleCategorySelect(route?.index);
    }
  }, [route?.index && isFlatListReady]);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await dispatch(getRecentSearches()).unwrap();
      } catch (error) {
        console.log(error);
      }
    };
    if (searchFocused) {
      fetchRecentSearches();
    }
  }, [navigation, searchFocused]);

  const fetchMoreData = async () => {
    if (isLoading || loadingMore || noRecordsToShow) {
      return;
    }
    if (filteredEstablishmentSearchResult?.length >= totalRecords) {
      setNoRecordsToShow(true);
      return;
    }

    setLoadingMore(true);

    try {
      const response = await dispatch(
        getFilteredEstablishmentSearchResult({
          id: activeCategoryId,
          current_page: currentPage.current,
          per_page: per_page,
        }),
      ).unwrap();
      if (response?.success) {
        if (response.data.length >= response?.meta?.total) {
          currentPage.current += 1;
          setNoRecordsToShow(true);
          return;
        } else {
          currentPage.current += 1;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchSearchResult = async (text: string) => {
    try {
      const response = await dispatch(getFilteredSearchResult(text)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchInputText = (text: string) => {
    setSearchInputText(text);
    fetchSearchResult(text);
  };

  const onContentSizeChange = () => {
    setIsFlatListReady(true);
  };

  const flatListRef = useRef<any>(null);

  const handleCategorySelect = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const renderCategory = useCallback(
    ({item, index}: {item: Category; index: number}) => (
      <Pressable
        style={[styles.mainCategoryItem]}
        onPress={() => {
          fetchEstablishmentDetails(item.id, 1, 5);
          setActiveCategoryId(item.id);
          setNoRecordsToShow(false);
          currentPage.current = 1;
          setActiveCategory(item.name);
          handleCategorySelect(index);
        }}>
        <View style={styles.categoryItem}>
          <View
            style={[
              styles.IconView,
              activeCategory === item.name && styles.activeCategoryItem,
            ]}>
            <Image
              source={{uri: item.image}}
              style={styles.estabTypesImage}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.categoryText]}>{item.name}</Text>
        </View>
      </Pressable>
    ),
    [activeCategory],
  );

  const renderItem = useCallback(
    ({item}: {item: any}) => <PlacesCard {...item} rightIcon={false} />,
    [],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    fetchEstablishmentDetails(activeCategoryId, 1, 5);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <UserHeaderComponent
            handleListening={() => {
              ConvertToSpeech();
            }}
            isListening={isSpeaking}
            title={searchInputText ? 'Search' : activeCategory == "all" ? "Featured Establishments" : activeCategory}
            backArrow={searchFocused}
            headerStyle={styles.header}
            rightArrow={userRole === 3}
          />
        }
        data={[0]}
        renderItem={({}) => (
          <Pressable
            key={0}
            onPress={() => Keyboard.dismiss()}
            style={styles.subContent}>
            <View>
              {!searchFocused && (
                <FlatList
                  ref={flatListRef}
                  data={categories}
                  renderItem={renderCategory}
                  keyExtractor={item => item?.id?.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesList}
                  contentContainerStyle={styles.categoriesFlatlistStyle}
                  onContentSizeChange={onContentSizeChange}
                  bounces={false}
                  onScrollToIndexFailed={({index}) => {
                    flatListRef.current?.scrollToOffset({
                      offset: index * 1000,
                      animated: true,
                    });
                    const wait = new Promise(resolve =>
                      setTimeout(resolve, 500),
                    );
                    wait.then(() => {
                      flatListRef.current?.scrollToIndex({
                        index,
                        animated: true,
                      });
                    });
                  }}
                />
              )}
            </View>

            <SearchInput
              textInputRef={textInputRef}
              isListening={isListening}
              onVoiceSearchIconPress={() =>
                isListening ? stopListening() : startListening()
              }
              FocusHandler={() => setSearchFocused(true)}
              BlurHandler={() => setSearchFocused(false)}
              placeholder={
                activeCategory === 'restaurants'
                  ? 'Search Restaurants'
                  : activeCategory === 'hotels'
                  ? 'Search Hotels'
                  : activeCategory === 'parks'
                  ? 'Search Parks'
                  : activeCategory === 'gym'
                  ? 'Search Gym'
                  : activeCategory === 'all'
                  ? 'Search Establishment'
                  : 'Search'
              }
              filterIcon={!searchFocused}
              searchStyleView={styles.searchInput}
              getSearchInputText={getSearchInputText}
            />

            {searchFocused &&
              recent_searches?.length === 0 &&
              searchInputText === '' && (
                <View style={styles.emptyRecentSearch}>
                  <Text style={styles.emptyRecentSearchText}>
                    No recent searches
                  </Text>
                </View>
              )}
            {searchFocused &&
              recent_searches?.length > 0 &&
              searchInputText === '' && (
                <FlatList
                  data={recent_searches}
                  renderItem={({item}) => (
                    <PlacesCard {...item} recentSearch={true} />
                  )}
                  keyExtractor={item => item.id}
                  style={styles.placesList}
                  contentContainerStyle={styles.placesListContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                />
              )}
            {searchInputText !== '' && (
              <View style={styles.recentSearches}>
                <View style={styles.recentSearchesContainer}>
                  <FlatList
                    data={filteredSearchResult}
                    renderItem={({item}) => (
                      <PlacesCard {...item} rightIcon={true} />
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.placesListContent}
                    bounces={false}
                  />
                </View>
              </View>
            )}
            {!searchFocused && isLoading && currentPage.current === 1 ? (
              <ActivityIndicator
                size={'large'}
                color={Colors.redColor}
                style={{marginTop: verticalScale(22)}}
              />
            ) : (
              !searchFocused && 
              filteredEstablishmentSearchResult?.length === 0 &&
              currentPage.current === 1 && (
                <Text
                  style={[
                    styles.emptyRecentSearchText,
                    {textAlign: 'center', marginTop: verticalScale(100)},
                  ]}>
                  No results found
                </Text>
              )
            )}
            {!searchFocused && searchInputText === '' && (
              <View style={styles.recentSearches}>
                <View style={styles.recentSearchesContainer}>
                  <FlatList
                    data={filteredEstablishmentSearchResult}
                    renderItem={renderItem}
                    keyExtractor={item => item?.id?.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.placesListContent}
                    bounces={false}
                    onEndReached={() => {
                      !noRecordsToShow && fetchMoreData();
                    }}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={() =>
                      loadingMore && (
                        <ActivityIndicator
                          size={'large'}
                          color={Colors.redColor}
                        />
                      )
                    }
                  />
                </View>
              </View>
            )}
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.placesListContent}
        bounces={false}
      />
    </SafeAreaView>
  );
});

export default RestaurantsScreens;

const styles = StyleSheet.create({
  recentSearches: {
    flex: 1,
    flexDirection: 'column',
  },
  estabTypesImage: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: 100,
    backgroundColor: Colors.whiteColor,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
    height: ResponsiveSizes.hp(6),
  },

  recentSearchesContainer: {
    paddingBottom: verticalScale(70),
  },
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  header: {
    borderBottomWidth: 0,
    marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
  },
  mainCategoryItem: {
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    width: moderateScale(150),
    height: verticalScale(40),
    borderRadius: 35,
    flexDirection: 'row',
    paddingHorizontal: moderateScale(6),
    paddingVertical: verticalScale(6),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  subContent: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: moderateScale(10),
  },
  activeCategoryItem: {
    backgroundColor: Colors.redColor,
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
  },
  activeCategoryText: {
    color: Colors.whiteColor,
  },
  IconView: {
    width: 40,
    height: 40,
    backgroundColor: Colors.lightestGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
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
    height: verticalScale(56),
  },

  placesList: {
    flex: 1,
  },
  placesListContent: {
    paddingHorizontal: moderateScale(10),
  },
  emptyRecentSearch: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endOfResult: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  emptyRecentSearchText: {
    fontSize: 20,
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
  },
});
