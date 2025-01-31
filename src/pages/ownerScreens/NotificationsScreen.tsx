import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OwnerScreenHeader from '../../components/OnwerScreenHeader';
import { NotificationItem } from '../../components/OwnerNotificationItem';
import { navigationProps } from '../../interfaces/Interfaces';
import {
  getEstablishmentDetails,
  getEstablishmentTypes,
} from '../../store/establishment/establishmentActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNotifications } from '../../store/notification/notificationAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;

const NotificationsScreen: React.FC<navigationProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    state => state.notificationSlice.notifications,
  );
  const [refreshing, setRefreshing] = useState(false);
  const user = useAppSelector(state => state.userSlice.user);

  useEffect(() => {
    dispatch(fetchNotifications());
    if (user?.user?.role_id == 2) {
      dispatch(getEstablishmentDetails());
      dispatch(getEstablishmentTypes());
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchNotifications());
    if (user?.user?.role_id == 2) {
      dispatch(getEstablishmentDetails());
      dispatch(getEstablishmentTypes());
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  return (
    <SafeAreaView style={styles.container}>
      <OwnerScreenHeader
        navigation={navigation}
        title="Notifications"
        backArrow={false}
        headerStyle={{
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightestGrey,
        }}
      />
      <ScrollView style={styles.notificationList} bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FlatList
          ListEmptyComponent={() => {
            return <Text style={styles.notifText}>no notifications</Text>;
          }}
          data={notifications}
          renderItem={({ item }: any) => {
            console.log(item, 'item');

            return (
              <NotificationItem
                message={item?.message || 'Jessica'}
                imageSource={item?.reviewer_image}
              />
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#333',
  },
  notifText: {
    textAlign: 'center',
    fontFamily: Fonts.InterMedium,
    color: Colors.greyColor,
    fontSize: moderateScale(19),
    marginTop: verticalScale(10),
    fontWeight: 'bold',
  },
});
