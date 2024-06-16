import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {signInWithEmailAndPassword} from '../../api/auth';
import globalStyle from '../../Styles/globalStyle';
import styles from './styles';
import {Routes} from '../../navigation/Routes';
import Button from '../../components/Button/Button';
import Toast from 'react-native-toast-message';
import {getErrorMessage} from '../../components/getErrorMessage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(email, password);
      // Navigate to Home screen
      navigation.navigate(Routes.Home);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error),
      });
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate(Routes.SignUP);
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate(Routes.ForgotPassword);
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
          <View style={styles.loginTextView}>
            <Text style={styles.loginText}>Login</Text>
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
            title={'Login'}
            onPress={handleLogin}
            isDisabled={handleDisabled()}
          />

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleForgotPasswordPress}>
            <Text style={styles.signupButtonText}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUpPress}>
            <Text style={styles.signupButtonText}>
              Don't have an account yet? Click here to sign up!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
