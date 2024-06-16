import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Routes} from '../../navigation/Routes';
import {passwordReset} from '../../api/auth';
import Button from '../../components/Button/Button';
import styles from './styles';
import globalStyle from '../../Styles/globalStyle';
import Toast from 'react-native-toast-message';
import {getErrorMessage} from '../../components/getErrorMessage';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      await passwordReset(email);
      // Navigate to login screen
      navigation.navigate(Routes.Login);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error),
      });
    }
  };

  const handleReturnToLoginPress = () => {
    // Navigate to login screen
    navigation.navigate(Routes.Login);
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <View style={styles.forgotPasswordTextView}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </View>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />

          <Button title={'Reset Password'} onPress={handlePasswordReset} />

          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleReturnToLoginPress}>
            <Text style={styles.retunButtonText}>Return to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
