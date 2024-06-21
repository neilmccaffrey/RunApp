import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleInfo, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import {Routes} from '../../navigation/Routes';
import {horizontalScale} from '../../Styles/scaling';
import {useAuth} from '../../contexts/AuthProvider';

const Header = ({navigation}) => {
  const {photoURL} = useAuth();

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
          style={styles.profile}
          onPress={() => navigation.navigate(Routes.Post)}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            size={horizontalScale(50)}
            color={'#B57EDC'}
          />
          <Text style={styles.text}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Info)}>
          <FontAwesomeIcon
            icon={faCircleInfo}
            size={horizontalScale(50)}
            color={'#B57EDC'}
          />
          <Text style={styles.text}>Info</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.showdowContainer} />
    </>
  );
};

export default Header;
