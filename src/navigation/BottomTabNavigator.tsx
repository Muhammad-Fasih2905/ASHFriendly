import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CloudMessaging_GetToken,
  CloudMessaging_OnMessage,
  notificationActions,
  requestNotificationPermission,
} from '../firebase';
import { CustomTabBarProps } from '../interfaces/Interfaces';
import Dashboard from '../pages/ownerScreens/Dashboard';
import NotificationsScreen from '../pages/ownerScreens/NotificationsScreen';
import { useAppDispatch } from '../store/hooks';
import { storeFCMTokenInDB } from '../store/notification/notificationAction';
import { Colors } from '../utlis/Colors';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
import { AccountStack } from './Stacks';
const {verticalScale} = SizeMattersConfig;
const Tab = createBottomTabNavigator();
const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, {paddingBottom: insets.bottom}]}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
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
                borderTopRightRadius: index == 2 ? 26 : 0,
              },
            ]}>
            {Icon && <Icon color={isFocused ? '#B32425' : '#000000'} />}
          </Pressable>
        );
      })}
    </View>
  );
};
const BottomTabNavigator = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

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
    notificationActions(navigation);

    return () => {
      CloudMessaging_OnMessage();
      notificationActions(navigation);
    };
  }, []);

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute', 
          bottom: 110,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: ({color}: {color: string}) => (
            <GlobalIcon library="CustomIcon" name="s" size={27} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
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
        name="mainProfile"
        component={AccountStack}
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
  );
};
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Platform.OS == 'ios' ? verticalScale(65) : verticalScale(55),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default BottomTabNavigator;
