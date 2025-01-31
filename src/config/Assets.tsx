import { ImageRequireSource } from 'react-native';
import BottomMainIcon from '../assets/images/BottomMainIcon.png';
import HotelBathroom from '../assets/images/HotelBathroom.png';
import Place from '../assets/images/Place.png';
import AppLogo from '../assets/images/appLogo.png';
import avtarImage from '../assets/images/avtarImage.png';
import GoogleMapPic from '../assets/images/googleMap.png';
import hotelRoom from '../assets/images/hotel-room.png';
import hotelName from '../assets/images/hotelName.png';
import resturentAvatar from '../assets/images/resturentAvatar.png';
import uploadPic from '../assets/images/uploadPic.png';
import userReviewProfile from '../assets/images/userReviewProfile.png';
const imageMap = {
    'appLogo.png': AppLogo,
    'resturentAvatar.png': resturentAvatar,
    'Place.png': Place,
    'HotelBathroom.png': HotelBathroom,
    'hotel-room.png': hotelRoom,
    'BottomMainIcon.png': BottomMainIcon,
    'GoogleMapPic.png': GoogleMapPic,
    'hotelName.png': hotelName,
    'uploadPic.png': uploadPic,
    'userReviewProfile.png': userReviewProfile,
    'avtarImage.png': avtarImage
};


export function getImageSource(imagePath: string): ImageRequireSource {
    return imageMap[imagePath];
}

