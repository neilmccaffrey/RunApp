import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleInfo,
  faPenToSquare,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import {Routes} from '../../navigation/Routes';
import {horizontalScale} from '../../Styles/scaling';
import {useAuth} from '../../contexts/AuthProvider';
import FastImage from 'react-native-fast-image';

const Header = ({navigation}) => {
  const {isAdmin, photoURL} = useAuth();

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => navigation.navigate(Routes.Profile)}>
          {photoURL ? (
            <FastImage
              style={styles.photo}
              source={{
                uri: photoURL,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
              placeholder={<ActivityIndicator size="large" color="#B57EDC" />}
            />
          ) : (
            <Image
              style={styles.photo}
              source={require('../../assets/images/default-profile-pic.jpg')}
            />
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

        {isAdmin && (
          <TouchableOpacity onPress={() => navigation.navigate(Routes.Admin)}>
            <FontAwesomeIcon
              icon={faUnlock}
              size={horizontalScale(50)}
              color={'#B57EDC'}
            />
            <Text style={styles.text}>Admin</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.showdowContainer} />
    </>
  );
};

export default Header;
