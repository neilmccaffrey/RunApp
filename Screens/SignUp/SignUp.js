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
  Modal,
  ScrollView,
} from 'react-native';
import globalStyle from '../../Styles/globalStyle';
import styles from './styles';
import {Routes} from '../../navigation/Routes';
import Button from '../../components/Button/Button';
import Toast from 'react-native-toast-message';
import {getErrorMessage} from '../../components/getErrorMessage';
import {CommonActions} from '@react-navigation/native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import {useAuth} from '../../contexts/AuthProvider';

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEulaVisible, setIsEulaVisible] = useState(false);
  const [isEulaChecked, setIsEulaChecked] = useState(false);

  const {signUp, user} = useAuth();

  const handleSignUp = async () => {
    setIsEulaVisible(true);
    setIsDisabled(true);
  };

  const handleEulaAgree = async () => {
    if (!isEulaChecked) {
      Toast.show({
        type: 'error',
        text1: 'You must agree to the EULA to sign up.',
      });
      return;
    }

    setIsEulaVisible(false);
    try {
      // Trim spaces from the email input
      const trimmedEmail = email.trim();
      await signUp(trimmedEmail, password);

      Toast.show({
        type: 'success',
        text1: 'Sign up successful. Welcome!',
      });

      // Reset the email and password state
      setEmail('');
      setPassword('');

      //Navigate to Home screen and clear nav stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: Routes.Home}],
        }),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error),
      });
      setIsDisabled(false);
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
                    isDisabled={handleDisabled() || isDisabled}
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

              <Modal
                visible={isEulaVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsEulaVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                      End User License Agreement (EULA)
                    </Text>
                    <View style={styles.scrollViewContainer}>
                      <ScrollView
                        contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.modalText}>
                          1. Acceptance of Terms{'\n'}By creating an account or
                          using the Run 401 application, you agree to comply
                          with and be bound by the terms and conditions of this
                          End User License Agreement. {'\n'}
                          2. Zero Tolerance for Objectionable Content {'\n'}
                          Run 401 has a strict zero-tolerance policy towards
                          objectionable content and abusive users. Objectionable
                          content includes, but is not limited to, bullying,
                          harassment, hate speech, and any form of
                          discriminatory or harmful behavior.{'\n'} 3.
                          Definition of Objectionable Content
                          {'\n'} • Bullying: Any repeated behavior that seeks to
                          harm, intimidate, or coerce someone perceived as
                          vulnerable. • Harassment: Unwanted behavior that
                          causes alarm or distress, including, but not limited
                          to, stalking, threats, and unwanted advances. • Hate
                          Speech: Any speech, gesture, conduct, writing, or
                          display which may incite violence or prejudicial
                          action against, or by, a particular individual or
                          group, or because it disparages or intimidates a
                          protected individual or group.{'\n'} 4. User Conduct
                          {'\n'}
                          You agree not to engage in any activity that violates
                          the zero-tolerance policy for objectionable content.
                          This includes, but is not limited to: • Posting,
                          sharing, or transmitting any content that is bullying,
                          harassing, or hateful. • Using the app to promote
                          violence or hatred against individuals or groups based
                          on race, ethnicity, religion, disability, gender, age,
                          or sexual orientation. • Engaging in any behavior that
                          threatens the safety or well-being of any other user.
                          {'\n'}
                          5. Consequences of Violation{'\n'}Any user found to be
                          in violation of this policy will face immediate
                          consequences, which may include: • Temporary or
                          permanent suspension of account privileges. • Removal
                          of any offending content from the platform. •
                          Reporting to appropriate law enforcement authorities,
                          if necessary.{'\n'}6. Reporting Violations{'\n'}
                          Users are encouraged to report any violations of this
                          policy to Run 401’s support team. All reports will be
                          reviewed promptly, and appropriate action will be
                          taken to address any violations.{'\n'} 7. Changes to
                          EULA{'\n'}
                          Run 401 reserves the right to modify this EULA at any
                          time. Any changes will be communicated to users
                          through the app. Continued use of the app after such
                          changes signifies your acceptance of the updated
                          terms.
                        </Text>
                      </ScrollView>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        value={isEulaChecked}
                        onValueChange={setIsEulaChecked}
                      />
                      <Text style={styles.checkboxLabel}>
                        I agree to the EULA
                      </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleEulaAgree}>
                        <Text style={styles.buttonText}>I Agree</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => {
                          setIsEulaVisible(false);
                          setIsDisabled(false);
                        }}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default SignUp;
