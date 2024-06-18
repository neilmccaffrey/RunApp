import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import MainNavigation from './navigation/MainNavigation';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './contexts/AuthProvider';
import {ProfilePhotoProvider} from './contexts/ProfilePhotoContext';
import {requestUserPermission} from './api/notifications';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    // Request permissions
    requestUserPermission();

    // Listen to foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // Display your custom notification UI here
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Display your custom notification UI here
    });

    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <ProfilePhotoProvider>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
        <Toast />
      </ProfilePhotoProvider>
    </AuthProvider>
  );
};

export default App;
