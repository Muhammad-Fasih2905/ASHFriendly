import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { PlacesCardProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
export const PlacesCard: React.FC<PlacesCardProps> = ({
  id,
  name,
  address,
  main_image,
  image,
  rating,
  distance,
  rightIcon = false,
  recentSearch = false,
}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={{...styles.card, width: 'auto'}}
      onPress={() =>
        navigation.navigate('hotelDetailScreen', {establishmentId: id})
      }>
      <View style={styles.cardImage}>
        <Image
          style={styles.cardMainImage}
          source={{uri: recentSearch ? image : main_image}}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTitleView}>
          <Text style={{...styles.cardTitle}} numberOfLines={1}>
            {name}
          </Text>
          {rightIcon && (
            <View style={styles.mobileView}>
              <GlobalIcon
                library="FontAwesome"
                name="phone"
                size={moderateScale(16)}
                color={Colors.blackColor}
              />
            </View>
          )}
        </View>
        <View style={styles.cardDetails}>
          <GlobalIcon
            library="CustomIcon"
            name="Vector-4"
            size={moderateScale(15)}
            style={{top: 2}}
            color={Colors.redColor}
          />
          <Text
            numberOfLines={3}
            style={{
              ...styles.cardAddress,
            }}>
            {address.split(' ').length > 8
              ? address.split(' ').slice(0, 8).join(' ') + '...'
              : address}
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.cardDistance}>
            <GlobalIcon
              style={{top: 2}}
              library="CustomIcon"
              name="Group-1970"
              size={moderateScale(13)}
              color={Colors.redColor}
            />
            <Text style={styles.cardDistanceText}>{distance}</Text>
          </View>
          <View style={styles.cardRating}>
            <GlobalIcon
              library="CustomIcon"
              name="Group-1968"
              size={moderateScale(13)}
              color={Colors.yellowColor}
            />
            <Text style={styles.cardRatingText}>{rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default React.memo(PlacesCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    marginBottom: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: moderateScale(9),
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    marginVertical: verticalScale(12),
    paddingVertical: verticalScale(12),
  },
  cardTitleView: {
    paddingBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardImage: {},
  cardMainImage: {
    width: hp(12),
    height: hp(11),
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: moderateScale(10),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    width: '85%',
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardAddress: {
    fontSize: moderateScale(12),
    color: Colors.greenAndGreyMixColor,
    marginLeft: moderateScale(5),
    width: '70%',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(3),
    marginTop: hp(0.5),
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRatingText: {
    fontSize: moderateScale(12),
    color: Colors.greenAndGreyMixColor,
    marginLeft: moderateScale(5),
  },
  mobileView: {
    width: moderateScale(30),
    height: moderateScale(30),
    position: 'absolute',
    top: moderateScale(3),
    right: moderateScale(-5),
    borderWidth: 1,
    borderColor: Colors.greyColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDistance: {
    flexDirection: 'row',
  },
  cardDistanceText: {
    fontSize: moderateScale(12),
    color: Colors.greenAndGreyMixColor,
    marginLeft: moderateScale(5),
  },
});
