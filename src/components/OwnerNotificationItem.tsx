import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NotificationItemProps } from '../interfaces/Interfaces';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getReviewDetails } from '../store/reviews/ReviewsAction';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;
export const NotificationItem: React.FC<NotificationItemProps> = ({
  message,
  imageSource,
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userSlice.user);
  const establishmentOwnerDetails: any = useAppSelector(
    state => state.establishmentSlice.establishmentOwnerDetails,
  );

  const handleRoute = async () => {
    if (user?.user?.role_id == 2) {
      const res = await dispatch(
        getReviewDetails({
          id: establishmentOwnerDetails?.establishment?.id,
        }),
      ).unwrap();
      if (res.success == true) {
        navigation.navigate('ownerReviews', { title: 'Reviews', vioceIcon: true });
      }
      return;
    }
  };

  return (
    <Pressable onPress={handleRoute} style={styles.notificationItem}>
      <View style={styles.avatar}>
        <Image
          style={{ height: 50, width: 50, borderRadius: 50 }}
          source={{ uri: imageSource }}
        />
      </View>
      <Text style={styles.notificationText}>
        <Text style={styles.boldText}>{message}</Text>
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightestGrey,
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(10),
  },
  avatar: {
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  boldText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
  },
  resturentText: {
    color: Colors.blackColor,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterBold,
  },
});
