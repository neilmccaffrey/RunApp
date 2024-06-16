import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {signUpWithEmailAndPassword} from '../../api/auth';
import globalStyle from '../../Styles/globalStyle';
import styles from './styles';
import {Routes} from '../../navigation/Routes';
import Button from '../../components/Button/Button';
import Toast from 'react-native-toast-message';
import {getErrorMessage} from '../../components/getErrorMessage';

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await signUpWithEmailAndPassword(email, password);
      // Toast for successful account creation
      Toast.show({
        type: 'success',
        text1: 'Sign up successful. You can now login!',
      });
      // Navigate to Login screen
      navigation.navigate(Routes.Login);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error),
      });
    }
  };

  const handleLoginPress = () => {
    navigation.navigate(Routes.Login);
  };

  const handleDisabled = () => {
    if (!email || !password) {
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <View style={styles.signUpTextView}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <Button
            title={'Sign Up'}
            isDisabled={handleDisabled()}
            onPress={handleSignUp}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>
              Already have an account? Click here to login!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;