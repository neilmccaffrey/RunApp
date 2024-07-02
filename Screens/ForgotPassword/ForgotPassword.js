import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Routes} from '../../navigation/Routes';
import {passwordReset} from '../../api/auth';
import Button from '../../components/Button/Button';
import styles from './styles';
import globalStyle from '../../Styles/globalStyle';
import Toast from 'react-native-toast-message';
import {getErrorMessage} from '../../components/getErrorMessage';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {CommonActions} from '@react-navigation/native';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      const emailToLowerCase = email.toLowerCase();
      await passwordReset(emailToLowerCase);
      // Reset the email state
      setEmail('');

      //Navigate to login screen and clear nav stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: Routes.Login}],
        }),
      );
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

  const onSwipeGesture = ({nativeEvent}) => {
    if (nativeEvent.translationY > 20) {
      Keyboard.dismiss();
    }
  };

  //swipe to go back
  const onHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > 100) {
        navigation.goBack();
      }
    }
  };
  return (
    <GestureHandlerRootView style={globalStyle.flex}>
      <PanGestureHandler
        onGestureEvent={onSwipeGesture}
        onHandlerStateChange={onHandlerStateChange}>
        <KeyboardAvoidingView behavior={'padding'} style={globalStyle.flex}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView
              style={[globalStyle.backgroundWhite, globalStyle.flex]}>
              <View style={styles.container}>
                <View style={styles.boxContainer}>
                  <View style={styles.forgotPasswordTextView}>
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password
                    </Text>
                  </View>
                  <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                  />

                  <Button
                    title={'Reset Password'}
                    onPress={handlePasswordReset}
                    isDisabled={!email}
                  />

                  <TouchableOpacity
                    style={styles.returnButton}
                    onPress={handleReturnToLoginPress}>
                    <Text style={styles.retunButtonText}>Return to login</Text>
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

export default ForgotPassword;
