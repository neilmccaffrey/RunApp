import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import {Routes} from '../../navigation/Routes';
import {horizontalScale} from '../../Styles/scaling';
import {useProfilePhoto} from '../../contexts/ProfilePhotoContext';

const Header = ({navigation}) => {
  const {profilePhoto} = useProfilePhoto();

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => navigation.navigate(Routes.Profile)}>
          {profilePhoto ? (
            <Image source={{uri: profilePhoto}} style={styles.photo} />
          ) : (
            <View style={styles.photo} />
          )}
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => navigation.navigate(Routes.Post)}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            size={horizontalScale(52)}
            color={'#B57EDC'}
          />
          <Text style={styles.text}>Create Event</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.showdowContainer} />
    </>
  );
};

export default Header;
