import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import {Routes} from '../../navigation/Routes';
import {horizontalScale} from '../../Styles/scaling';
import {useAuth} from '../../contexts/AuthProvider';
import messaging from '@react-native-firebase/messaging';

const Header = ({navigation}) => {
  const {photoURL} = useAuth();

  const getToken = async () => {
    const token = await messaging().getToken();
    if (token) {
      Alert.alert('FCM Token', token); // Display the token in an alert
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => navigation.navigate(Routes.Profile)}>
          {photoURL ? (
            <Image source={{uri: photoURL}} style={styles.photo} />
          ) : (
            <View style={styles.photo} />
          )}
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            getToken();
          }}>
          <Text>Get Token</Text>
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
