import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    splashScreen: undefined;
    signUp: undefined
    login: undefined;
    selectRole: undefined;
    getAEmail: undefined;
    locationSelect?: { showLocation?: boolean | undefined, currentLocation?: boolean, editInfo?: boolean, onLocationSelected?: (latitude: number, longitude: number, address: string) => void; };
    ShowRestaurants: { headerTitle?: string, category?: {} };
    preferencesSetup: undefined;
    emergencyContacts: { innerUser?: boolean };
    verifycodeScreen: undefined;
    Home: undefined;
    openEmail: undefined;
    establishmentDetails?: { insideEstablishment?: boolean };
    uploadYourPhotosScreen?: { uploadPhotos?: boolean };
    accessibilityQuestionnaire?: { handleQuestions?: boolean };
    dashboard: any;
    profile: undefined;
    profileScreen: undefined;
    ownerSettings: undefined;
    ownerChangePassword: undefined;
    ownerFAQS: undefined;
    ownerAbout: undefined;
    ownerPrivacyPolicy: undefined;
    ownerTerms: undefined;
    ownerReviews: { title?: string, vioceIcon?: boolean, writeReviewbtn?: boolean };
    preferences: undefined;
    hotelScreen: undefined;
    parkScreen: undefined;
    filterScreen: {back: boolean};
    hotelDetailScreen: undefined | { establishmentId: string };
    locationDirectionScreen: undefined;
    contactScreen: undefined
    test: undefined
    restaurantsScreens: { name: string, id?: number, index?: number } | undefined,
    writeUserReview: { voiceIcon?: boolean, headerTitle?: string },
    userFacilites: undefined
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
