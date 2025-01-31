import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { Colors } from '../utlis/Colors';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs access to show notifications',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === 'ios') {
    messaging()
      .requestPermission()
      .then(res => {
        console.log('Notification permission granted', res);
        return res;
      })
      .catch(error => {
        console.error('Notification permission error: ', error);
      });
  }
  return true;
};

export const CloudMessaging_OnMessage = () =>
  messaging().onMessage(async remoteMessage => {
    inAppNotification(remoteMessage);
  });

export const CloudMessaging_GetToken = async () => {
  const token = await messaging().getToken();
  return token;
};

const inAppNotification = async (remoteMessage: any) => {
  await notifee.requestPermission();
  console.log(remoteMessage);
  
  try {
    const channelId = await notifee.createChannel({
      id: 'main',
      name: 'Main',
      sound: 'default',
      vibration: false,
      badge: true,
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage,
      android: {
        smallIcon: 'ic_launcher',
        color: Colors.allScreensBgColor,
        largeIcon: 'test',
        sound: 'default',
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.log(error, 'error notit');
  }
};

export const notificationActions = (navigation: any) => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        navigation.navigate('dashboard');
      }
    });
  notifee.onForegroundEvent(({type, detail}: any) => {
    if (type === EventType.PRESS) {
      navigation.navigate('dashboard');
    }
  });
  notifee.onBackgroundEvent(async ({type, detail}: any) => {
    if (type === EventType.PRESS) {
      navigation.navigate('dashboard');
    }
  });
};
