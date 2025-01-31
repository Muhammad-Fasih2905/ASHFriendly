import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';
import PanicAlert from '../components/PanicAlert';
import { getImageSource } from '../config/Assets';
import {
  CloudMessaging_GetToken,
  CloudMessaging_OnMessage,
  requestNotificationPermission
} from '../firebase';
import { CustomTabBarProps } from '../interfaces/Interfaces';
import RestaurantsScreens from '../pages/categoryScreens/RestaurantsScreens';
import UserNotificationScreen from '../pages/home/UserNotificationScreen';
import LocationSelectionScreen from '../pages/location/LocationSelectionScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { storeFCMTokenInDB } from '../store/notification/notificationAction';
import { sendPanicAlert } from '../store/user/UserAction';
import { Colors } from '../utlis/Colors';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
import { HomeStack, UserAccountStack } from './Stacks';
const {verticalScale} = SizeMattersConfig;
const Tab = createBottomTabNavigator();

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  openModal,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const BottomMainIcon = getImageSource('BottomMainIcon.png');

  const getToken = async () => {
    const permissionGranted = await requestNotificationPermission();
    if (permissionGranted) {
      try {
        const token = await CloudMessaging_GetToken();
        const response = await dispatch(storeFCMTokenInDB(token));
      } catch (error) {
        console.log('notification token error ----> ', error);
      }
    } else {
      console.log('Notification permission denied.');
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    getToken();
    CloudMessaging_OnMessage();

    return () => {
      CloudMessaging_OnMessage();
    };
  }, []);

  return (
    <View style={{backgroundColor: Colors.allScreensBgColor}}>
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Platform.OS == 'ios' ? 20 : insets.bottom,
          },
        ]}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === 'Center') {
              openModal();
            } else {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }
          };

          const Icon = options.tabBarIcon;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                {
                  borderTopLeftRadius: index == 0 ? 26 : 0,
                  borderTopRightRadius: index == 4 ? 26 : 0,
                },
              ]}>
              {route.name === 'Center' ? (
                <View style={styles.centerButton}>
                  <View style={styles.centerButtonInner}>
                    <Image source={BottomMainIcon} />
                  </View>
                </View>
              ) : (
                Icon && <Icon color={isFocused ? '#B32425' : '#000000'} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const UserBottomTabNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const BottomMainIcon = getImageSource('BottomMainIcon.png');
  const user = useAppSelector(state => state.userSlice.user);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = async () => {
    const res = await dispatch(
      sendPanicAlert({location: user?.address}),
    ).unwrap();
    if (res.success == true) {
      setIsModalVisible(false);
      openModal2();
    } else {
      setIsModalVisible(false);
    }
  };

  const openModal2 = () => {
    setModalVisible(true);
  };

  const closeModal2 = () => {
    setModalVisible(false);
    navigation.navigate('home', {
      screen: 'Main',
      params: {
        screen: 'Home',
      },
    });
  };
  return (
    <>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} openModal={openModal} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute', 
            bottom: 0,
            backgroundColor: Colors.allScreensBgColor,
          },
        }}>
        <Tab.Screen
          name="Main"
          options={{
            tabBarIcon: ({color}: {color: string}) => (
              <GlobalIcon
                library="CustomIcon"
                name="s"
                size={27}
                color={color}
              />
            ),
          }}
          component={HomeStack}
        />
        <Tab.Screen
          name="Search"
          component={LocationSelectionScreen}
          initialParams={{showLocation: false, currentLocation: true}}
          options={{
            tabBarIcon: ({color}: {color: string}) => (
              <GlobalIcon
                library="CustomIcon"
                name="Vector"
                size={27}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Center"
          component={RestaurantsScreens}
          options={{
            tabBarIcon: () => <Image source={BottomMainIcon} />,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={UserNotificationScreen}
          options={{
            tabBarIcon: ({color}: {color: string}) => (
              <GlobalIcon
                library="CustomIcon"
                name="Group-1171275945"
                size={27}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={UserAccountStack}
          options={{
            tabBarIcon: ({color}: {color: string}) => (
              <GlobalIcon
                library="CustomIcon"
                name="Vector-1"
                size={27}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <CustomModal
        onClose={closeModal}
        visible={isModalVisible}
        isHome={false}
        title="Confirmation"
        subTitle="Are you sure you want to send
panic alert to your emergency contacts?"
      />
      <PanicAlert
        onClose={closeModal2}
        visible={modalVisible}
        title="Panic Alert Sent"
      />
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: Platform.OS == 'ios' ? verticalScale(65) : verticalScale(45),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.whiteColor,
  },
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonInner: {
    width: 70,
    height: 70,
  },
});

export default UserBottomTabNavigator;
