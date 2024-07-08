import React, {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthProvider';
import {Routes} from './Routes';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home/Home';
import Post from '../Screens/Post/Post';
import Login from '../Screens/Login/Login';
import SignUp from '../Screens/SignUp/SignUp';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import Profile from '../Screens/Profile/Profile';
import UpdatePost from '../Screens/UpdatePost/UpdatePost';
import {ActivityIndicator, View} from 'react-native';
import Info from '../Screens/Info/Info';
import styles from './styles';
import Admin from '../Screens/Admin/Admin';
import UserBanned from '../Screens/UserBanned/UserBanned';
import {isBanned} from '../api/firestore';

const Stack = createStackNavigator();

const MainNavigation = () => {
  const {user, initializing} = useAuth();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        const banned = await isBanned(user.uid);
        if (banned) {
          setInitialRoute(Routes.UserBanned);
        } else {
          setInitialRoute(Routes.Home);
        }
      } else {
        setInitialRoute(Routes.Login);
      }
    };

    if (!initializing) {
      checkUserStatus();
    }
  }, [user, initializing]);

  if (initializing || !initialRoute) {
    // Render a loading indicator while determining initial route
    return (
      <View style={styles.acitivityIndicator}>
        <ActivityIndicator size="large" color="#B57EDC" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{header: () => null, headerShown: false}}>
      <Stack.Screen name={Routes.Login} component={Login} />
      <Stack.Screen name={Routes.SignUp} component={SignUp} />
      <Stack.Screen name={Routes.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={Routes.Home} component={Home} />
      <Stack.Screen name={Routes.Post} component={Post} />
      <Stack.Screen name={Routes.UpdatePost} component={UpdatePost} />
      <Stack.Screen name={Routes.Profile} component={Profile} />
      <Stack.Screen name={Routes.Info} component={Info} />
      <Stack.Screen name={Routes.Admin} component={Admin} />
      <Stack.Screen name={Routes.UserBanned} component={UserBanned} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
