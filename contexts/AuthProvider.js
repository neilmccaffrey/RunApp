import React, {createContext, useState, useEffect, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {
  addDisplayNameToUserDoc,
  addProfilePhotoUrlToUserDoc,
  fetchAdminStatus,
  fetchInitialDisplayName,
  fetchProfilePhoto,
  removeProfilePhotoUrlFromUserDoc,
} from '../api/firestore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {deleteProfilePhotoFromStorage} from '../api/storage';
import firestore from '@react-native-firebase/firestore';

// Create AuthContext
export const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Handle user state changes
  const onAuthStateChanged = async user => {
    if (user) {
      try {
        const initialName = await fetchInitialDisplayName(user);
        const initialPhoto = await fetchProfilePhoto(user);
        const admin = await fetchAdminStatus(user);
        setUser(user);
        setDisplayName(initialName);
        setPhotoURL(initialPhoto);
        setIsAdmin(admin);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Preload and cache the profile photo
        if (initialPhoto) {
          FastImage.preload([{uri: initialPhoto}]);
        }
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
    if (initializing) {
      setInitializing(false);
    }
    setAuthenticating(false);
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Firestore listener for profile photo updates  - necessary to prevent explicit images from being posted
  useEffect(() => {
    let unsubscribeFirestore;
    if (user) {
      unsubscribeFirestore = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(doc => {
          const data = doc.data();
          if (data && data.profilePhoto !== photoURL) {
            setPhotoURL(data.profilePhoto || null);
          }
        });
    }

    return () => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [user, photoURL]);

  // Load user data from AsyncStorage on app launch
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setAuthenticating(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      const initialName = await fetchInitialDisplayName(user);
      const initialPhoto = await fetchProfilePhoto(user);
      setUser(user);
      setDisplayName(initialName);
      setPhotoURL(initialPhoto);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.log(error.message);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
      setAuthenticating(false);
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
        await deleteProfilePhotoFromStorage(photoURL);
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
        login,
        initializing,
        photoURL,
        displayName,
        deletePhoto,
        updateUserProfile,
        authenticating,
        setUser,
        setDisplayName,
        setPhotoURL,
        isAdmin,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
