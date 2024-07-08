import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import globalStyle from '../../Styles/globalStyle';
import styles from './styles';
import {Routes} from '../../navigation/Routes';
import Button from '../../components/Button/Button';
import Toast from 'react-native-toast-message';
import {getErrorMessage} from '../../components/getErrorMessage';
import {useAuth} from '../../contexts/AuthProvider';
import {CommonActions} from '@react-navigation/native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {isBanned} from '../../api/firestore';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);

      // Reset the email and password state
      setEmail('');
      setPassword('');

      // Fetch the user from Firebase Auth
      const user = auth().currentUser;
      // check if user isBanned and route to banned page if so
      const banned = await isBanned(user.uid);

      if (banned) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: Routes.UserBanned}],
          }),
        );
      } else {
        // Reset the navigation stack and navigate to Home screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: Routes.Home}],
          }),
        );
      }
    } catch (error) {
      console.log(error.message);
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error),
      });
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate(Routes.SignUp);
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

  const onSwipeGesture = ({nativeEvent}) => {
    if (nativeEvent.translationY > 20) {
      Keyboard.dismiss();
    }
  };

  return (
    <GestureHandlerRootView style={globalStyle.flex}>
      <PanGestureHandler onGestureEvent={onSwipeGesture}>
        <KeyboardAvoidingView behavior={'padding'} style={globalStyle.flex}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView
              style={[globalStyle.backgroundWhite, globalStyle.flex]}>
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Login;
