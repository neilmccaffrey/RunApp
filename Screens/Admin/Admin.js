import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import globalStyle from '../../Styles/globalStyle';

const Admin = () => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Text>Kamehameha!</Text>
    </SafeAreaView>
  );
};

export default Admin;
