import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // if (enabled) {
  //   console.log('Authorization status:', authStatus);
  // }
}

export async function getDeviceToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

// Get FCM token
messaging()
  .getToken()
  .then(token => {
    console.log(token);
  });

// Listen to token refresh
messaging().onTokenRefresh(token => {
  console.log(token);
});

// Handle foreground messages
messaging().onMessage(async remoteMessage => {
  console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
