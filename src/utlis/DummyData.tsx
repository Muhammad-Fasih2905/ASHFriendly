import React from "react";
import CookingIcon from '../assets/images/cooking1.svg';
import CookingIcon2 from '../assets/images/eating1.svg';
import CookingIcon3 from '../assets/images/pizza1.svg';
import { default as HotelSwimingPool, default as Place } from '../assets/images/place3.svg';
import Place2 from '../assets/images/place4.svg';
import Place3 from '../assets/images/place5.svg';
import Place4 from '../assets/images/place6.svg';
import Place5 from '../assets/images/place7.svg';
import Restuarent from '../assets/images/restuarent.svg';
import Savory from '../assets/images/savory.svg';
import { Category, Establishment, PreferenceOption, SearchItem } from "../interfaces/Interfaces";


export const categories: Category[] = [
    { id: '1', name: 'Restaurants', icon: 'path11774', libary: 'CustomIcon' },
    { id: '2', name: 'Hotels', icon: 'hotel-solid-svgrepo-com-1', libary: 'CustomIcon' },
    { id: '3', name: 'Parks', icon: 'park', libary: 'MaterialIcons' },
    { id: '4', name: 'Gym', icon: 'sports-gymnastics', libary: 'MaterialIcons' }
];

export const featuredEstablishments: Establishment[] = [
    { id: 1, name: 'Hotel Inn', type: 'Hotel', rating: 4.7, distance: '1.8 km', main_image: require('../assets/images/place2.png'), total_reviews: 1 },
    { id: 2, name: 'Extreme Gym', type: 'Fitness Gym', rating: 4.9, distance: '2.1 km', main_image: require('../assets/images/place2.png'), total_reviews: 2 },
];

export const nearbyRestaurants: Establishment[] = [
    { id: 1, name: "King Lee's", type: 'Fast Food', rating: 4.7, distance: '2.6 km', main_image: require('../assets/images/cooking.png'), total_reviews: 1 },
    { id: 2, name: 'Hereford Grill', type: 'Chinese', rating: 4.7, distance: '3.0 km', main_image: require('../assets/images/place2.png'), total_reviews: 2 },
];

export const nearbyHotels: Establishment[] = [
    { id: 1, name: 'Hotel Inn', type: '5 Star Hotel', rating: 4.7, distance: '1.8 km', main_image: require('../assets/images/place2.png'), total_reviews: 3 },
    { id: 2, name: 'Hotel Excel', type: '4 Star Hotel', rating: 4.7, distance: '2.3 km', main_image: require('../assets/images/place2.png'), total_reviews: 4 },
];

export const reviewBar = [
    { label: 'Excellent', key: 'excellent' },
    { label: 'Good', key: 'good' },
    { label: 'Average', key: 'average' },
    { label: 'Below Average', key: 'below_average' },
    { label: 'Poor', key: 'poor' }]
export const AllPlacesData = [
    { id: '1', name: 'Six Seven Restaurant', address: '1024 Road, Loughton, United States', image: <CookingIcon />, rating: 4.7, distance: '4.4 km', type: 'restaurant' },
    { id: '2', name: 'Hereford Grill', address: '1024 Road, Loughton, United States', image: <CookingIcon2 />, rating: 4.7, distance: '2.6 km', type: 'restaurant' },
    { id: '3', name: "Kings Lee's Restaurant", address: '1024 Road, Loughton, United States', image: <CookingIcon3 />, rating: 4.7, distance: '1.8 km', type: 'restaurant' },
    { id: '4', name: "Newtown's Restaurant", address: '1024 Road, Loughton, United States', image: <Restuarent />, rating: 4.7, distance: '1.8 km', type: 'restaurant' },
    { id: '5', name: "Savory Delights", address: '1024 Road, Loughton, United States', image: <Savory />, rating: 4.7, distance: '1.8 km', type: 'restaurant' },
    { id: '6', name: 'Queenstown Hotel', address: '1024 Road, Loughton, United States', image: <Place />, rating: 4.7, distance: '4.4 km', type: 'hotel' },
    { id: '7', name: 'Stardust Hotel', address: '1024 Road, Loughton, United States', image: <Place2 />, rating: 4.7, distance: '2.6 km', type: 'hotel' },
    { id: '8', name: "Silver Seashore Resort", address: '1024 Road, Loughton, United States', image: <Place3 />, rating: 4.7, distance: '1.8 km', type: 'hotel' },
    { id: '9', name: "Hotel Excel", address: '1024 Road, Loughton, United States', image: <Place4 />, rating: 4.7, distance: '1.8 km', type: 'hotel' },
    { id: '10', name: "Autumn Vista Hotel", address: '1024 Road, Loughton, United States', image: <Place5 />, rating: 4.7, distance: '1.8 km', type: 'hotel' },
]

export const AllRestaurants = [
    { id: '1', name: 'Six Seven Restaurant', address: '1024 Road, Loughton, United States', image: <CookingIcon />, rating: 4.7, distance: '4.4 km', type: 'restaurant' },
    { id: '2', name: 'Hereford Grill', address: '1024 Road, Loughton, United States', image: <CookingIcon2 />, rating: 4.7, distance: '2.6 km', type: 'restaurant' },
    { id: '3', name: "Kings Lee's Restaurant", address: '1024 Road, Loughton, United States', image: <CookingIcon3 />, rating: 4.7, distance: '1.8 km', type: 'restaurant' },
    { id: '4', name: "Newtown's Restaurant", address: '1024 Road, Loughton, United States', image: <Restuarent />, rating: 4.7, distance: '1.8 km', type: 'restaurant' },
    { id: '5', name: "Savory Delights", address: '1024 Road, Loughton, United States', image: <Savory />, rating: 4.7, distance: '1.8 km', type: 'restaurant' },
]

export const AllHotels = [
    { id: '6', name: 'Queenstown Hotel', address: '1024 Road, Loughton, United States', image: <Place />, rating: 4.7, distance: '4.4 km', type: 'hotel' },
    { id: '7', name: 'Stardust Hotel', address: '1024 Road, Loughton, United States', image: <Place2 />, rating: 4.7, distance: '2.6 km', type: 'hotel' },
    { id: '8', name: "Silver Seashore Resort", address: '1024 Road, Loughton, United States', image: <Place3 />, rating: 4.7, distance: '1.8 km', type: 'hotel' },
    { id: '9', name: "Hotel Excel", address: '1024 Road, Loughton, United States', image: <Place4 />, rating: 4.7, distance: '1.8 km', type: 'hotel' },
    { id: '10', name: "Autumn Vista Hotel", address: '1024 Road, Loughton, United States', image: <Place5 />, rating: 4.7, distance: '1.8 km', type: 'hotel' },
]

export const preferences: PreferenceOption[] = [
    { label: 'gender', hasDropdown: true, options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], placeholder: 'Select Gender' },
    { label: 'age', hasDropdown: false },
    { label: 'religion', hasDropdown: true, options: [{ label: 'Islam', value: 'islam' }, { label: 'Christianity', value: 'christianity' }, { label: 'Hinduism', value: 'hinduism' }, { label: 'Judaism', value: 'judaism' }], placeholder: 'Select Religion' },
    { label: 'skin_tone', hasDropdown: true, options: [{ label: 'Fair', value: 'fair' }, { label: 'Medium', value: 'medium' }, { label: 'Olive', value: 'olive' }, { label: 'Dark', value: 'dark' }] , placeholder: 'Select Skin tone'},
    { label: 'disability', hasDropdown: true, options: [{ label: 'None', value: 'none' }, { label: 'Hearing impaired', value: 'hearing impaired' }, { label: 'Visually impaired', value: 'visually impaired' }, { label: 'Physical disability', value: 'physical disability' }], placeholder: "Select Disability" },
];
export const recentSearches: SearchItem[] = [
    {
        id: '1',
        name: 'Queenstown Hotel',
        address: '1024 Road, Loughton, United States',
        distance: '1.8 km',
        rating: 4.7,
        type: 'hotel',
        image: <HotelSwimingPool />,
    },
    {
        id: '2',
        name: 'Six Seven Restaurant',
        address: '1024 Road, Loughton, United States',
        distance: '1.8 km',
        rating: 4.7,
        type: 'restaurant',
        // image: <GymPlace />,
        image: <HotelSwimingPool />,
    },
    {
        id: '3',
        name: '360 Degree Gym',
        address: '1024 Road, Loughton, United States',
        distance: '1.8 km',
        rating: 4.7,
        type: 'Gym',
        image: <HotelSwimingPool />,
    },
    {
        id: '4',
        name: '360 Degree Gym',
        address: '1024 Road, Loughton, United States',
        distance: '1.8 km',
        rating: 4.7,
        type: 'Gym',
        image: <HotelSwimingPool />,
    },
];

export const facilityData = [{
    name: 'Building',
},
{
    name: 'Bathroom',
},
{
    name: 'Ramps',
},
{
    name: 'Wheelchairs',
},
{
    name: 'Bar'
},
]
export const termsContent = `lorem ipsum dolor sit amet, consectetur adipiscing elit. dignissim dui purus sit hac ac, ornare a nibh etiam. diam eget mauris, iaculis pellentesque hendrerit turpis dolor facilisi velit. ullamcorper sit adipiscing sed id nisi at integer. tristique in lectus interdum nisi augue pellentesque laoreet ullamcorper sagittis. lectus leo ut diam laoreet sit. sed non netus cum faucibus blandit. non non ut donec quisque ut suscipit mauris. est, id egestas euismod diam, sagittis condimentum vitae vestibulum. facilisi lectus feugiat pharetra diam scelerisque suspendisse mauris consequat aliquam. id ornare viverra ornare posuere gravida tellus blandit, ut vestibulum habitant tortor nec lacus ac aliquet. condimentum condimentum ut massa lacus condimentum varius. laoreet rutrum tincidunt enim, amet, et. cursus adipiscing sed sapien ac sollicitudin varius. ullamcorper ut adipiscing sed id nisl at integer. tristique in lectus interdum nisi augue pellentesque laoreet ullamcorper sagittis. lectus leo ut diam laoreet sit. sed non netus cum faucibus blandit. non non ut donec quisque ut suscipit mauris. est, id egestas euismod diam, sagittis condimentum vitae vestibulum.`;
export const termsContent1 = `lorem ipsum dolor sit amet, consectetur adipiscing elit. dignissim dui purus sit hac ac, ornare a nibh etiam. diam eget mauris, iaculis pellentesque hendrerit turpis dolor facilisi velit. ullamcorper sit adipiscing sed id nisi at integer. tristique in lectus interdum nisi augue pellentesque laoreet ullamcorper sagittis. lectus leo ut diam laoreet sit. sed non netus cum faucibus blandit. non non ut donec quisque ut suscipit mauris. est, id egestas euismod diam, sagittis condimentum vitae vestibulum. facilisi lectus feugiat pharetra diam scelerisque suspendisse mauris consequat aliquam. id ornare viverra ornare posuere gravida tellus blandit, ut vestibulum habitant tortor nec lacus ac aliquet. condimentum condimentum ut massa lacus condimentum varius. laoreet rutrum tincidunt enim, amet, et. cursus adipiscing sed sapien ac sollicitudin varius. ullamcorper ut adipiscing sed id nisl at integer. tristique in lectus interdum nisi augue pellentesque laoreet ullamcorper sagittis. lectus leo ut diam laoreet sit. sed non netus cum faucibus blandit. non non ut donec quisque ut suscipit mauris. est, id egestas euismod diam, sagittis condimentum vitae vestibulum.`;

const establishmentTypes = [
    {value: 'Hotel', label: 'Hotel', name: 'Hotel'},
    {value: 'Restaurant', label: 'Restaurant', name: 'Restaurant'},
    {value: 'Park', label: 'Park', name: 'Park'},
    {value: 'Gym', label: 'Gym', name: 'Gym'},
    {value: 'Club', label: 'Club', name: 'Club'},
  ];



  export const commandDictionary = {
    'navigate to hotel': {
      screen: 'restaurantsScreens',
      params: {name: 'Hotel', id: 2, index: 0},
      variations: [
        'navigate to hotel',
        'go to hotel screen',
        'open hotel screen',
        'see hotels',
      ],
    },
    'navigate to restaurant': {
      screen: 'restaurantsScreens',
      params: {name: 'Restaurant', id: 3, index: 1},
      variations: [
        'navigate to restaurant',
        'go to restaurant screen',
        'open restaurant screen',
        'see restaurants',
        'navigate to restaurant',
        'open restaurant',
        'see restaurant',
        'find restaurant',
        'view restaurant',
        'show restaurant',
        'go to the restaurant',
        'navigate to the restaurant',
        'open the restaurant',
        'go to restaurants',
      ],
    },
    'navigate to park': {
      screen: 'restaurantsScreens',
      params: {name: 'Park', id: 4, index: 2},
      variations: [
        'navigate to park',
        'go to park screen',
        'open park screen',
        'see parks',
        'navigate to park',
        'go to park screen',
        'open park',
        'see park',
        'find park',
        'view park',
        'show park',
        'go to the park',
        'navigate to the park',
        'open the park',
      ],
    },
    'navigate to gym': {
      screen: 'restaurantsScreens',
      params: {name: 'Gym', id: 5, index: 3},
      variations: [
        'navigate to gym',
        'navigate to gym screen',
        'go to gym screen',
        'open gym',
        'see gym',
        'find gym',
        'view gym',
        'show gym',
        'go to the gym',
        'navigate to the gym',
        'open the gym',
      ],
    },
    'navigate to club': {
      screen: 'restaurantsScreens',
      params: {name: 'Club', id: 6, index: 4},
      variations: [
        'navigate to club',
        'go to club screen',
        'open club',
        'see club',
        'find club',
        'view club',
        'show club',
        'go to the club',
        'navigate to the club',
        'open the club',
      ],
    },
    'navigate to featuredEstablishments': {
      screen: 'restaurantsScreens',
      params: {name: 'all', index: undefined},
      variations: [
        'navigate to featured establishments',
        'go to featured establishments screen',
        'open featured establishments',
        'see featured establishments',
        'see establishments',
        'navigate to establishments',
        'go to establishments screen',
        'open establishments',
        'go to establishments',
        'navigate to featured establishments',
        'go to featured establishments screen',
        'open featured establishments',
        'see featured establishments',
        'see establishments',
        'navigate to establishments',
        'go to establishments screen',
        'open establishments',
        'go to establishments',
        'view featured establishments',
        'show featured establishments',
        'find featured establishments',
        'navigate to the featured establishments',
        'open the featured establishments',
      ],
    },
  
    'navigate to nearbyHotels': {
      screen: 'restaurantsScreens',
      params: {name: 'Hotel', id: 2, index: 0},
      variations: [
        'navigate to nearby hotels',
        'go to nearby hotels screen',
        'go to nearby hotels',
        'open nearby hotels',
        'see nearby hotels',
        'see hotels near me',
        'navigate to hotels near me',
        'go to hotels near me',
        'open hotels near me',
        'find nearby hotels',
        'show nearby hotels',
        'view nearby hotels',
      ],
    },
    'navigate to nearbyRestaurants': {
      screen: 'restaurantsScreens',
      params: {name: 'Restaurant', id: 3, index: 1},
      variations: [
        'navigate to nearby restaurants',
        'go to nearby restaurants screen',
        'open nearby restaurants',
        'see nearby restaurants',
        'see restaurants near me',
        'navigate to restaurants near me',
        'go to restaurants near me',
        'open restaurants near me',
        'find nearby restaurants',
        'show nearby restaurants',
        'view nearby restaurants',
      ],
    },
  };