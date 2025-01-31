import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput, TextInputProps, TextStyle, ViewStyle } from "react-native";
import { MapViewDirectionsMode } from "react-native-maps-directions";
import { NavigationProps, RootStackParamList } from "../utlis/NavigationTypes";

export interface navigationProps {
    navigation: NavigationProps;
    onTransition: any
}

export interface CustomButtonProps {
    title: string | any;
    onPress: () => void;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean
}
export interface InputFieldProps extends TextInputProps {
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
    containerStyle?: ViewStyle;
    topContainerStyle?: ViewStyle
    inputStyle?: TextStyle;
    labeltext?: TextStyle;
    autoCorrect: boolean,
    textContentType: 'none',
    autoCapitalize: 'none',
    secureTextEntry: boolean,
    multiline?: boolean;
    label?: string;
    iconName?: string;
    iconLibrary?: string;
    isValid?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    editable?: boolean;
    error?: string;
    InputTextRef?: React.Ref<TextInput>
}
export interface LogoComponentProps {
    width?: number;
    height?: number;
    style?: object;
}
export interface LoginComponentProps {
    style?: object;
}

export interface SignUpForm {
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    password: string;
    password2: string;
}
export interface emailForm {
    email: string;
}
export interface PreferenceOption {
    label: string;
    hasDropdown: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string
}
export interface PreferencesHeaderProps {
    navigation: StackNavigationProp<any>;
    title: string
};
export interface GetEmailHeaderProps {
    navigation: StackNavigationProp<any>;
};
export interface OwnerScreenHeaderProps {
    navigation: StackNavigationProp<any>;
    title: string;
    backArrow?: boolean;
    headerStyle?: ViewStyle;
    titleSty?: TextStyle;
    insideEstablishment?: boolean;
    uploadPhotos?: boolean
}
export interface CustomDropdownProps {
    options: string[];
    placeholder: string;
    onSelect: (item: string) => void;
}
export interface establishment {
    name: string;
    establishmentType: string;
    address: string;
    address1: string;
    phoneNumber: string;
    location: string
}
export interface Question {
    id: number;
    text: string;
    type: 'radio' | 'text';
    options?: string[];
}
export interface CustomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
    openModal?: () => void
}
export interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
}
export interface Category {
    id: number;
    name: string;
    image: string,
    icon: any;
    libary: any
}

export interface Establishment {
    id: number;
    name: string;
    type: string;
    rating?: number;
    distance: string;
    main_image: string | any;
    total_reviews?: number;
}
export interface ImageItem {
    id: number;
    url: string;
    is_main: boolean;
}

export interface ImageCarouselProps {
    images: ImageItem[];
}
export interface EstablishmentSearchProps {
    id: string;
    name: string;
    type: string;
    rating: number;
    distance: string;
    image: any;
}
export interface NotificationItemProps {
    message?: string;
    imageSource?: string;
}
export interface ListItemProps {
    icon: string;
    title: string;
    onPress: () => void;
    library?: string
}
export interface EstablishmentDetailsProps {
    navigation: NavigationProps;
    route: RouteProp<RootStackParamList, 'establishmentDetails'>;
};
export interface UploadYourPhotosProps {
    navigation: NavigationProps;
    route: RouteProp<RootStackParamList, 'uploadYourPhotosScreen'>;

}
export interface accessibilityQuestionProps {
    navigation: NavigationProps;
    route: RouteProp<RootStackParamList, 'accessibilityQuestionnaire'>;

}
export interface FAQItemProps {
    question: string;
    answer: string;
}
export interface Review {
    id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    image: any;
    reviewImage?: any
}
export interface ReviewApi {
    id: number;
    rating: number;
    created_at: string;
    comment: string;
    images: [];
    user: {
        id: number;
        name: string;
        profile_image: any
    }
}
export interface OwnerReviewsProps {
    navigation: NavigationProps;
    route: any
}
export interface UserHeaderProps {
    ConvertToSpeech?: ()=> void;
    handleListening?: ()=> void;
    isListening?: boolean;
    isSpeaking?: boolean;
    title: string;
    backArrow?: boolean;
    headerStyle?: ViewStyle;
    rightArrow?: boolean
    propTextStyle?: TextStyle;
    arrowColor?: String
}
export interface SearchInputProps {
    placeholder: string;
    filterIcon?: boolean;
    searchStyleView?: ViewStyle,
    FocusHandler?: any;
    BlurHandler?: any;
    getSearchInputText?: any;
    onVoiceSearchIconPress?: ()=> void;
    isListening?: React.SetStateAction<boolean>;
    textInputRef?: React.RefObject<TextInput>
}
export interface PlacesCardProps {
    id: string;
    name: string;
    image: string;
    address: string;
    rating: number;
    distance: string;
    main_image: string;
    type: string;
    rightIcon?: boolean;
    navigation?: NavigationProps;
    recentSearch?: boolean
}
export interface PlacesScreenProps {
    renderPlaces: string;
}

export interface HomeProps extends navigationProps {
    resetPlaces?: boolean;
}
export interface SearchItem {
    id: string;
    name: string;
    address: string;
    image: any;
    rating: number;
    distance: string;
    type: 'restaurant' | 'hotel' | 'Gym';
}
export interface HotelDetailScreenProps {
    navigation?: StackNavigationProp<any>;
}
export interface TravelModeItemProps {
    icon: string | undefined;
    time: string |  number;
    isSelected?: boolean;
    onPress: ()=> void
}

export interface ContactModalProps {
    visible: boolean;
    onClose: () => void;
    contactNum?: number;
    copyBtn?: () => void;
    whatsappFun?: () => void
}
export interface DatePickerProps {
    setValue?: (name: 'dob', value: string) => void;
}

export interface SelectedValuesPrefrences {
    gender: string;
    religion: string;
    skin_tone: string;
    disability: string;
}
export interface CustomModalNewProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    subTitle?: string;
    isHome?: boolean;
    openModal?: () => void;

}
export interface facilityProps {
    name: string;
}
export interface SearchLocationItem {
    id: number;
    name: string;
    lat: number;
    lng: number;
}

export interface originObjTypes {
    latitude: number,
    longitude: number,
    title: string
}

export interface DistanceTimeTypes {
    distance: number | string,
    duration: number | string,
    mode: MapViewDirectionsMode,
}
export interface AllModesDistanceTimeTypes {
    distance: number | string,
    duration: number | string,
    mode: MapViewDirectionsMode,
    Icon: string
}


export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface MapOptions {
    origin: Coordinates;
    destination: Coordinates;
    travelMode: 'driving' | 'walking' | 'bicycling' | 'transit';
    waypoints?: Coordinates[];
    avoid?: ('tolls' | 'highways' | 'ferries')[];
}