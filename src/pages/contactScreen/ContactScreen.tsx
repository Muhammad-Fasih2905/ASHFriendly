import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Share from 'react-native-share';
import VerifiedBadge from '../../assets/images/verifiedBadge.svg';
import ContactModal from '../../components/ContactModal';
import CustomButton from '../../components/CustomButton';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import ImageCarousel from '../../components/ImageCarousel';
import { socket } from '../../services/socket';
import Tts from '../../services/textToSpeech';
import { showMessage } from '../../store/common/commonSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getReviewDetails } from '../../store/reviews/ReviewsAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const { moderateScale, verticalScale } = SizeMattersConfig;
const ContactScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const getEstablishmentsDetails: any = useAppSelector(
    state => state.userSlice.currentEstablishmentDetails,
  );
  const token = useAppSelector(state => state.userSlice.token);
  const [isSpeaking, setIsSpeaking] = useState(false);

  React.useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  const openContactNow = () => {
    setIsModalVisible(true);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const ReviewScreen = async (id: number) => {
    const res = await dispatch(getReviewDetails({ id: id })).unwrap();
    if (res?.success === true) {
      socket.emit('joinReviewFeed');
      navigation.navigate('ownerReviews', {
        title: 'Reviews',
        vioceIcon: true,
        writeReviewbtn: true,
      });
    }
  };
  const handleWhatsAppPress = () => {
    const phoneNumber = getEstablishmentsDetails?.contact?.phone;
    const message = 'Hey!';
    const shareOptions = {
      title: 'Share via WhatsApp',
      message,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: phoneNumber?.replace(/\D/g, ''),
    };
    setIsModalVisible(false);
    Share.open(shareOptions)
      .then(res => {
        console.log('Share successful:', res);
        setIsModalVisible(false);
      })
      .catch(err => {
        console.error('Error sharing to WhatsApp:', err);
        showMessage('Failed to share on WhatsApp.');
        setIsModalVisible(false);
      });
  };
  const handleCopyToClipboard = () => {
    if (getEstablishmentsDetails?.contact?.phone !== undefined) {
      Clipboard.setString(getEstablishmentsDetails?.contact?.phone.toString());
      setIsModalVisible(false);
    } else {
      console.error('Contact number is undefined.');
      setIsModalVisible(false);
    }
  };

  const readFromApi = () => {
    if (getEstablishmentsDetails?.facilities?.length === 0) {
      return `${getEstablishmentsDetails?.name} does not have any available facilities at the moment`;
    }
    return ` The place has ${getEstablishmentsDetails?.facilities?.map(
      (facility: string, index: number) => {
        return `${index === getEstablishmentsDetails?.facilities?.length - 1
            ? 'and'
            : ''
          } ${facility?.name}`;
      },
    )}`;
  };

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const name = getEstablishmentsDetails?.name || 'not available';
      const fullAddress =
        getEstablishmentsDetails?.address?.full || 'not available';
      const email = getEstablishmentsDetails?.contact?.email || 'not available';
      const website =
        getEstablishmentsDetails?.contact?.website || 'not available';
      const total_reviews = getEstablishmentsDetails?.total_reviews || 0;
      const rating = getEstablishmentsDetails?.rating || 0;

      const content = `Here are the details: 
      The name is ${name}
      The address is ${fullAddress}. 
      The place has a rating of ${rating} and has received ${total_reviews} ${total_reviews === 1 ? 'review' : 'reviews'
        }
            Now Available Facilities
            ${readFromApi()}. At the bottom of the screen, there is a contact now button.`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  return (
    <View style={styles.container}>
      <ImageCarousel images={getEstablishmentsDetails?.images || []} />
      <UserHeaderComponent
        title={''}
        backArrow={true}
        headerStyle={styles.header}
        rightArrow={true}
        arrowColor={Colors.whiteColor}
        isListening={isSpeaking}
        handleListening={() => ConvertToSpeech()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.contentContainer}>
          <View style={styles.hotelInfoContainer}>
            <View style={styles.nameRatingContainer}>
              <View style={styles.tilteSubView}>
                <VerifiedBadge />
                <Text style={styles.hotelName}>
                  {getEstablishmentsDetails?.name}
                </Text>
              </View>
              <Pressable
                style={styles.ratingContainer}
                onPress={() => ReviewScreen(getEstablishmentsDetails?.id ?? 0)}>
                <GlobalIcon
                  library="CustomIcon"
                  name="Group-1968"
                  size={16}
                  color={Colors.yellowColor}
                />
                <Text style={styles.ratingText}>
                  {getEstablishmentsDetails?.rating}
                </Text>
                <Text style={styles.reviewsText}>
                  ({getEstablishmentsDetails?.total_reviews} Reviews)
                </Text>
              </Pressable>
            </View>
            <Text style={styles.address}>
              {getEstablishmentsDetails?.address?.full || ''}
            </Text>
          </View>

          <Text style={styles.description}>
            {getEstablishmentsDetails?.description}
          </Text>

          <View style={styles.facilitiesContainer}>
            <Text style={styles.facilitiesTitle}>Available Facilities</Text>
            <View style={styles.facilitiesList}>
              {getEstablishmentsDetails?.facilities?.length === 0 ? (
                <View style={styles.availableFacilitiesView}>
                  <Text style={styles.availableFacilitiesText}>
                    No Facilities
                  </Text>
                </View>
              ) : (
                getEstablishmentsDetails?.facilities?.map((facility, index) => (
                  <Pressable
                    key={index}
                    style={styles.facilityItem}
                    onPress={() => navigation.navigate('userFacilites')}>
                    <Text style={styles.facilityText}>{facility?.name}</Text>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        </View>
        <View style={styles.btnView}>
          <CustomButton
            title="Contact Now"
            onPress={openModal}
            leftIcon={
              <GlobalIcon
                library="FontAwesome"
                name="phone"
                size={24}
                color={Colors.whiteColor}
              />
            }
            buttonStyle={styles.contactButton}
            textStyle={styles.contactButtonText}
          />
        </View>
      </ScrollView>
      <ContactModal
        visible={isModalVisible}
        onClose={closeModal}
        contactNum={Number(getEstablishmentsDetails?.contact?.phone)}
        copyBtn={handleCopyToClipboard}
        whatsappFun={handleWhatsAppPress}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    borderBottomWidth: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: verticalScale(10),
  },
  imageContainer: {
    height: verticalScale(250),
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: verticalScale(16),
    alignSelf: 'center',
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: Colors.whiteColor,
    marginHorizontal: moderateScale(4),
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
  },
  contentContainer: {
    padding: moderateScale(16),
    flex: 1,
  },
  hotelInfoContainer: {
    marginBottom: verticalScale(16),
  },
  nameRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    justifyContent: 'space-between',
  },
  tilteSubView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotelName: {
    width: '60%',
    fontSize: moderateScale(20),
    color: Colors.blackColor,
    marginLeft: moderateScale(5),
    fontFamily: Fonts.InterBold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    marginLeft: moderateScale(4),
    fontFamily: Fonts.InterBold,
  },
  reviewsText: {
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    marginLeft: moderateScale(4),
    textDecorationLine: 'underline',
    fontFamily: Fonts.InterMedium,
  },
  address: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
  },
  description: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(16),
    fontFamily: Fonts.InterMedium,
  },
  facilitiesContainer: {
    marginBottom: verticalScale(16),
  },
  facilitiesTitle: {
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    marginBottom: verticalScale(8),
    fontFamily: Fonts.InterBold,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: Colors.redColor,
    marginRight: moderateScale(8),
    marginBottom: verticalScale(8),
  },
  facilityText: {
    fontSize: moderateScale(14),
    color: Colors.redColor,
  },
  contactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.redColor,
    borderRadius: moderateScale(54),
    width: moderateScale(300),
    height: verticalScale(42),
  },
  contactButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
    fontFamily: Fonts.InterBold,
  },
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(4),
  },
  availableFacilitiesView: {
    flex: 1,
    marginVertical: ResponsiveSizes.hp(1),
  },
  availableFacilitiesText: {
    color: Colors.blackColor,
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    textAlign: 'center',
  },
});
