import {CommonActions, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../contexts/AuthProvider';
import {Routes} from '../navigation/Routes';

const useLogout = () => {
  const {setUser, setDisplayName, setPhotoURL} = useAuth();
  const navigation = useNavigation();

  const logout = async () => {
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: Routes.Login}],
        }),
      );
      await auth().signOut();
      setUser(null);
      setDisplayName('');
      setPhotoURL(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return logout;
};

export default useLogout;
