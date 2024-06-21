import React from 'react';
import {Linking, Pressable, SafeAreaView, Text, View} from 'react-native';
import globalStyle from '../../Styles/globalStyle';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import styles from './styles';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import {scaleFontSize} from '../../Styles/scaling';
import Toast from 'react-native-toast-message';

const openInstagram = async username => {
  const appUrl = 'instagram://user?username=youkonneil';
  const webUrl = 'https://www.instagram.com/youkonneil';

  try {
    // Confirm if Instagram app can be opened or not
    const supported = await Linking.canOpenURL(appUrl);
    if (supported) {
      // Open the Instagram app
      await Linking.openURL(appUrl);
    } else {
      // Open the web URL
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'There was an error opening Instagram',
    });
  }
};

const Info = ({navigation}) => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesomeIcon icon={faChevronLeft} size={20} color={'#B57EDC'} />
      </Pressable>

      <Pressable style={styles.buttonContainer} onPress={openInstagram}>
        <View style={styles.buttonItems}>
          <LinearGradient
            colors={['#833ab4', '#fd1d1d', '#fcb045']}
            style={styles.instagramButton}>
            <FontAwesomeIcon
              icon={faInstagram}
              size={scaleFontSize(42)}
              color="#FFFFFF"
            />
          </LinearGradient>
          <Text style={styles.text}>@youkonneil</Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} color={'#B57EDC'} size={12} />
      </Pressable>
    </SafeAreaView>
  );
};

export default Info;
