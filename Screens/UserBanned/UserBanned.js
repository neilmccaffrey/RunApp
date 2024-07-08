import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import styles from './styles';
import globalStyle from '../../Styles/globalStyle';

const UserBanned = () => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>User is BANNED</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserBanned;
