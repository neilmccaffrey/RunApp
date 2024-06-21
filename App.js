import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import MainNavigation from './navigation/MainNavigation';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './contexts/AuthProvider';
import {ProfilePhotoProvider} from './contexts/ProfilePhotoContext';
import {requestUserPermission} from './api/notifications';
import BootSplash from 'react-native-bootsplash';

const App = () => {
  useEffect(() => {
    // Request permission for push notifications
    requestUserPermission();
  }, []);

  return (
    <AuthProvider>
      <ProfilePhotoProvider>
        <NavigationContainer onReady={() => BootSplash.hide()}>
          <MainNavigation />
        </NavigationContainer>
        <Toast />
      </ProfilePhotoProvider>
    </AuthProvider>
  );
};

export default App;
