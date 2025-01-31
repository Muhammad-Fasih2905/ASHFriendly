import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import CookingIcon from '../../assets/images/cooking1.svg';
import CookingIcon2 from '../../assets/images/eating1.svg';
import CookingIcon3 from '../../assets/images/pizza1.svg';
import Place from '../../assets/images/place3.svg';
import Place2 from '../../assets/images/place4.svg';
import Place3 from '../../assets/images/place5.svg';
import Place4 from '../../assets/images/place6.svg';
import Place5 from '../../assets/images/place7.svg';
import Restuarent from '../../assets/images/restuarent.svg';
import Savory from '../../assets/images/savory.svg';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import PlacesCard from '../../components/PlacesCard';
import SearchInput from '../../components/SearchInput';
import {
  Category,
  PlacesCardProps
} from '../../interfaces/Interfaces';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;

const ShowRestaurants = ({route}) => {
  const headerTitle = route?.params?.headerTitle;
  const [userRole, setUserRole] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>(
    route?.params?.category,
  );
  const [places, setPlaces] = useState<PlacesCardProps[]>([]);

  AsyncStorage.getItem('userRole')
    .then(role => {
      if (role !== null) {
        setUserRole(role);
      } else {
        setUserRole('defaultRole');
      }
    })
    .catch(error => {
      console.error('Error retrieving userRole:', error);
    });
  useEffect(() => {
    setPlaces([
      {
        id: '1',
        name: 'Six Seven Restaurant',
        address: '1024 Road, Loughton, United States',
        image: <CookingIcon />,
        rating: 4.7,
        distance: '4.4 km',
        type: 'restaurant',
      },
      {
        id: '2',
        name: 'Hereford Grill',
        address: '1024 Road, Loughton, United States',
        image: <CookingIcon2 />,
        rating: 4.7,
        distance: '2.6 km',
        type: 'restaurant',
      },
      {
        id: '3',
        name: "Kings Lee's Restaurant",
        address: '1024 Road, Loughton, United States',
        image: <CookingIcon3 />,
        rating: 4.7,
        distance: '1.8 km',
        type: 'restaurant',
      },
      {
        id: '4',
        name: "Newtown's Restaurant",
        address: '1024 Road, Loughton, United States',
        image: <Restuarent />,
        rating: 4.7,
        distance: '1.8 km',
        type: 'restaurant',
      },
      {
        id: '5',
        name: 'Savory Delights',
        address: '1024 Road, Loughton, United States',
        image: <Savory />,
        rating: 4.7,
        distance: '1.8 km',
        type: 'restaurant',
      },
      {
        id: '6',
        name: 'Six Seven Restaurant',
        address: '1024 Road, Loughton, United States',
        image: <Place />,
        rating: 4.7,
        distance: '4.4 km',
        type: 'hotel',
      },
      {
        id: '7',
        name: 'Hereford Grill',
        address: '1024 Road, Loughton, United States',
        image: <Place2 />,
        rating: 4.7,
        distance: '2.6 km',
        type: 'hotel',
      },
      {
        id: '8',
        name: "Kings Lee's Restaurant",
        address: '1024 Road, Loughton, United States',
        image: <Place3 />,
        rating: 4.7,
        distance: '1.8 km',
        type: 'hotel',
      },
      {
        id: '9',
        name: "Newtown's Restaurant",
        address: '1024 Road, Loughton, United States',
        image: <Place4 />,
        rating: 4.7,
        distance: '1.8 km',
        type: 'hotel',
      },
      {
        id: '10',
        name: 'Savory Delights',
        address: '1024 Road, Loughton, United States',
        image: <Place5 />,
        rating: 4.7,
        distance: '1.8 km',
        type: 'hotel',
      },
    ]);
  }, []);

  const categories: Category[] = [
    {id: '1', name: 'All', icon: 'city-1'},
    {id: '2', name: 'Restaurants', icon: 'path11774'},
    {id: '3', name: 'Hotels', icon: 'hotel-solid-svgrepo-com-1'},
  ];

  const renderCategory = ({item}: {item: Category}) => (
    <Pressable
      style={[styles.mainCategoryItem]}
      onPress={() => setActiveCategory(item.id)}>
      <View style={styles.categoryItem}>
        <View
          style={[
            styles.IconView,
            activeCategory === item.id && styles.activeCategoryItem,
          ]}>
          <GlobalIcon
            library="CustomIcon"
            name={item.icon}
            size={moderateScale(24)}
            color={
              activeCategory === item.id ? Colors.whiteColor : Colors.blackColor
            }
          />
        </View>
        <Text style={[styles.categoryText]}>{item.name}</Text>
      </View>
    </Pressable>
  );

  const filteredPlaces = places.filter(
    place =>
      activeCategory === '1' ||
      (activeCategory === '2' && place.type === 'restaurant') ||
      (activeCategory === '3' && place.type === 'hotel'),
  );
  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        title={headerTitle || 'Restaurants'}
        backArrow={false}
        headerStyle={styles.header}
        rightArrow={userRole === 'User'}
      />
      <View style={styles.subContent}>
        <View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
            contentContainerStyle={styles.categoriesFlatlistStyle}
            bounces={false}
          />
        </View>
        <SearchInput
          placeholder="Search Restaurants"
          filterIcon={true}
          searchStyleView={styles.searchInput}
        />
        <FlatList
          data={filteredPlaces}
          renderItem={({item}) => <PlacesCard {...item} />}
          keyExtractor={item => item.id}
          style={styles.placesList}
          contentContainerStyle={styles.placesListContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ShowRestaurants;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  header: {
    borderBottomWidth: 0,
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
    width: 50,
    height: 50,
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
  searchInput: {
    height: verticalScale(40),
    backgroundColor: Colors.whiteColor,
    width: moderateScale(277),
    marginHorizontal: moderateScale(13),
  },
  placesList: {
    flex: 1,
  },
  placesListContent: {
    paddingHorizontal: moderateScale(10),
  },
});
