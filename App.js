import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MainNavigation from './navigation/MainNavigation';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './contexts/AuthProvider';
import {ProfilePhotoProvider} from './contexts/ProfilePhotoContext';

const App = () => {
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
