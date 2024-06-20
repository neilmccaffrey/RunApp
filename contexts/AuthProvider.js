import React, {createContext, useState, useEffect, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {
  addDisplayNameToUserDoc,
  addProfilePhotoUrlToUserDoc,
  fetchInitialDisplayName,
  fetchProfilePhoto,
  removeProfilePhotoUrlFromUserDoc,
} from '../api/firestore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create AuthContext
export const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          const initialName = await fetchInitialDisplayName(user);
          const initialPhoto = await fetchProfilePhoto(user);
          setUser(user);
          setDisplayName(initialName);
          setPhotoURL(initialPhoto);
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: error.message,
          });
        }
      } else {
        setUser(null);
        setDisplayName('');
        setPhotoURL(null);
        await AsyncStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, [photoURL, displayName]);

  // Check for stored user on app launch
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
        const initialName = await fetchInitialDisplayName(user);
        const initialPhoto = await fetchProfilePhoto(user);
        setDisplayName(initialName);
        setPhotoURL(initialPhoto);
      }
    };
    checkUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
      }
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  // Update user profile function
  const updateUserProfile = async (newDisplayName, newPhotoURL) => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        if (newDisplayName !== displayName) {
          await addDisplayNameToUserDoc(newDisplayName, currentUser);
        }

        if (newPhotoURL !== photoURL) {
          const changedUrl = await addProfilePhotoUrlToUserDoc(
            newPhotoURL,
            currentUser,
          );
          setPhotoURL(changedUrl);
        }

        setDisplayName(newDisplayName);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
      throw error;
    }
  };

  const deletePhoto = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await removeProfilePhotoUrlFromUserDoc(currentUser);
        setPhotoURL(null);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        photoURL,
        displayName,
        deletePhoto,
        updateUserProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
