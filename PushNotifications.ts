  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   dispatch(fcmToken(token));
  // };
  // async function requestUserPermission() {
  //   if (Platform.OS === 'android') {
  //     const req = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //     );
  //   } else {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //     if (enabled) {
  //     }
  //   }
  // }


  // const inAppNotification = async (remoteMessage: any) => {
  //   await notifee.requestPermission()
  //   const channelId = await notifee.createChannel({
  //     id: 'main',
  //     name: 'Main',
  //     sound: 'default',
  //     vibration: false,
  //     badge: true,
  //     importance: AndroidImportance.HIGH,
  //   });
  //   await notifee.displayNotification({
  //     title: remoteMessage.notification.title,
  //     body: remoteMessage.notification.body,
  //     android: {
  //       smallIcon: 'ic_launcher',
  //       color: appColors.primary,
  //       largeIcon: 'https://irtapp.s3.amazonaws.com/api/images/0rCpNQ2v20UmK12xUtfkv8LKJaWcCkCboMiPtaHB.png',
  //       sound: 'default',
  //       channelId,
  //       pressAction: {
  //         id: 'default',
  //       },

  //     },
  //     ios: {
  //       sound: 'default',
  //     }
  //   });
  // }
  // const notificationListener = async () => {
  //   messaging().onMessage(remoteMessage => {
  //     console.log('remoteMessage')
  //     inAppNotification(remoteMessage)
  //   });
  // };
  // const notificationActions = () => {
  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     navigation.navigate('notifications')
  //   });
  //   messaging().getInitialNotification().then((remoteMessage) => {
  //     if (remoteMessage) {
  //       navigation.navigate('notifications')
  //     }
  //   });
  //   notifee.onForegroundEvent(({ type }) => {
  //     if (type === EventType.PRESS) {
  //       navigation.navigate('notifications')
  //     };
  //   });
  // }



  // useEffect(() => {
  //   getToken();
  //   requestUserPermission();
  //   notificationListener();
  //   notificationActions();
  //   return () => {
  //     notificationListener();
  //     notificationActions();
  //   };
  // }, []);