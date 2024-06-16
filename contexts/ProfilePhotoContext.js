import React, {createContext, useState, useEffect, useContext} from 'react';
import Toast from 'react-native-toast-message';
import {
  addProfilePhotoUrlToUserDoc,
  fetchProfilePhoto,
  removeProfilePhotoUrlFromUserDoc,
} from '../api/firestore';
import {useAuth} from './AuthProvider';

export const ProfilePhotoContext = createContext();

export const ProfilePhotoProvider = ({children}) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const {user} = useAuth();

  useEffect(() => {
    const getProfilePhoto = async () => {
      try {
        const photo = await fetchProfilePhoto(user);
        setProfilePhoto(photo);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    };

    if (user) {
      getProfilePhoto();
    }
  }, [user]);

  const updateProfilePhoto = async newPhoto => {
    try {
      await addProfilePhotoUrlToUserDoc(newPhoto, user);
      setProfilePhoto(newPhoto.url);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  const deletePhoto = async () => {
    try {
      await removeProfilePhotoUrlFromUserDoc(user);
      setProfilePhoto(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  return (
    <ProfilePhotoContext.Provider
      value={{profilePhoto, updateProfilePhoto, deletePhoto}}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};

export const useProfilePhoto = () => useContext(ProfilePhotoContext);
