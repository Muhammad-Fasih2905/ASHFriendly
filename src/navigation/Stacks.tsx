import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import GetAEmail from '../pages/auth/GetAEmail';
import Login from '../pages/auth/Login';
import OpenEmail from '../pages/auth/OpenEmail';
import SelectRoleScreen from '../pages/auth/SelectRoleScreen';
import SignUp from '../pages/auth/SignUp';
import ParkScreen from '../pages/categoryScreens/ParkScreen';
import RestaurantsScreens from '../pages/categoryScreens/RestaurantsScreens';
import ShowRestaurants from '../pages/categoryScreens/ShowRestaurants';
import ContactScreen from '../pages/contactScreen/ContactScreen';
import EmergencyContacts from '../pages/emergencyContacts/EmergencyContacts';
import FilterScreen from '../pages/filterScreen/FilterScreen';
import Home from '../pages/home/Home';
import Preferences from '../pages/home/Preferences';
import UserProfileScreen from '../pages/home/UserProfileScreen';
import HotelDetailScreen from '../pages/hotelDetailScreen/HotelDetailScreen';
import LocationDirectionScreen from '../pages/location/LocationDirectionScreen';
import LocationSelectionScreen from '../pages/location/LocationSelectionScreen';
import AccessibilityQuestionnaire from '../pages/ownerScreens/AccessibilityQuestionnaireScreen';
import EstablishmentDetails from '../pages/ownerScreens/EstablishmentDetails';
import OwnerAbout from '../pages/ownerScreens/OwnerAbout';
import OwnerChangePassword from '../pages/ownerScreens/OwnerChangePassword';
import OwnerFAQS from '../pages/ownerScreens/OwnerFAQS';
import OwnerPrivacyPolicy from '../pages/ownerScreens/OwnerPrivacyPolicy';
import OwnerReviews from '../pages/ownerScreens/OwnerReviews';
import OwnerSettings from '../pages/ownerScreens/OwnerSettings';
import OwnerTerms from '../pages/ownerScreens/OwnerTerms';
import Profile from '../pages/ownerScreens/Profile';
import ProfileScreen from '../pages/ownerScreens/ProfileScreen';
import UploadYourPhotosScreen from '../pages/ownerScreens/UploadYourPhotosScreen';
import PreferencesSetupScreen from '../pages/Preferences/PreferencesSetupScreen';
import UserFaclities from '../pages/userFacilities/UserFaclities';
import WriteUserReviews from '../pages/userReviews/WriteUserReviews';
import VerifyCodeScreen from '../pages/verifyCode/VerifyCodeScreen';
import { useAppSelector } from '../store/hooks';
import BottomTabNavigator from './BottomTabNavigator';
import UserBottomTabNavigator from './UserBottomTabNavigator';

const Stack = createNativeStackNavigator();
export const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetails}
      />
      <Stack.Screen
        name="uploadYourPhotosScreen"
        component={UploadYourPhotosScreen}
      />
      <Stack.Screen
        name="accessibilityQuestionnaire"
        component={AccessibilityQuestionnaire}
      />
      <Stack.Screen
        name="establishmentDetails"
        component={EstablishmentDetails}
      />
      <Stack.Screen name="verifycodeScreen" component={VerifyCodeScreen} />
    </Stack.Navigator>
  );
};

export const UserAccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={UserProfileScreen} />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetails}
      />
      <Stack.Screen
        name="uploadYourPhotosScreen"
        component={UploadYourPhotosScreen}
      />
      <Stack.Screen
        name="accessibilityQuestionnaire"
        component={AccessibilityQuestionnaire}
      />
      <Stack.Screen
        name="establishmentDetails"
        component={EstablishmentDetails}
      />
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="preferences" component={Preferences} />
      <Stack.Screen name="emergencyContacts" component={EmergencyContacts} />
      <Stack.Screen name="ownerSettings" component={OwnerSettings} />
      <Stack.Screen
        name="ownerChangePassword"
        component={OwnerChangePassword}
      />
    </Stack.Navigator>
  );
};
export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="restaurantsScreens" component={RestaurantsScreens} />
    </Stack.Navigator>
  );
};

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="verifycodeScreen" component={VerifyCodeScreen} />
      <Stack.Screen name="signUp" component={SignUp} />

      <Stack.Screen name="selectRole" component={SelectRoleScreen} />
      <Stack.Screen name="getAEmail" component={GetAEmail} />
      <Stack.Screen name="locationSelect" component={LocationSelectionScreen} />
      <Stack.Screen
        name="preferencesSetup"
        component={PreferencesSetupScreen}
      />
      <Stack.Screen name="emergencyContacts" component={EmergencyContacts} />
      <Stack.Screen name="openEmail" component={OpenEmail} />
      <Stack.Screen
        name="establishmentDetails"
        component={EstablishmentDetails}
      />
      <Stack.Screen
        name="uploadYourPhotosScreen"
        component={UploadYourPhotosScreen}
      />
      <Stack.Screen
        name="accessibilityQuestionnaire"
        component={AccessibilityQuestionnaire}
      />
    </Stack.Navigator>
  );
};

export const AppStack = () => {
  const navigation = useNavigation();
  const role = useAppSelector(state => state.userSlice.role);

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              handleUrl(url);
            }
          });
        }
      })
      .catch(err => {
        console.warn('An error occurred', err);
      });

    Linking.addEventListener('url', event => {
      Linking.canOpenURL(event.url).then(supported => {
        if (supported) {
          handleUrl(event.url);
        }
      });
    });
  }, []);

  const handleUrl = (url: string) => {
    if (url) {
      const id = url.split('/').pop();
      navigation.navigate('hotelDetailScreen', {establishmentId: id});
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={role === 2 ? 'dashboard' : 'home'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={UserBottomTabNavigator} />
      <Stack.Screen name="dashboard" component={BottomTabNavigator} />
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} />
      <Stack.Screen name="ownerSettings" component={OwnerSettings} />
      <Stack.Screen
        name="ownerChangePassword"
        component={OwnerChangePassword}
      />
      <Stack.Screen name="ownerFAQS" component={OwnerFAQS} />
      <Stack.Screen name="ownerAbout" component={OwnerAbout} />
      <Stack.Screen name="ownerPrivacyPolicy" component={OwnerPrivacyPolicy} />
      <Stack.Screen name="ownerTerms" component={OwnerTerms} />
      <Stack.Screen name="ownerReviews" component={OwnerReviews} />
      <Stack.Screen name="preferences" component={Preferences} />
      <Stack.Screen name="parkScreen" component={ParkScreen} />
      <Stack.Screen name="filterScreen" component={FilterScreen} />
      <Stack.Screen name="hotelDetailScreen" component={HotelDetailScreen} />
      <Stack.Screen
        name="locationDirectionScreen"
        component={LocationDirectionScreen}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="contactScreen" component={ContactScreen} />
      <Stack.Screen name="ShowRestaurants" component={ShowRestaurants} />
      <Stack.Screen name="writeUserReview" component={WriteUserReviews} />
      <Stack.Screen name="userFacilites" component={UserFaclities} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="restaurantsScreens" component={RestaurantsScreens} />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetails}
      />
      <Stack.Screen name="locationSelect" component={LocationSelectionScreen} />
    </Stack.Navigator>
  );
};
