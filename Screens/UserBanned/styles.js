import {StyleSheet} from 'react-native';
import {scaleFontSize} from '../../Styles/scaling';

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: scaleFontSize(30),
  },
});

export default styles;
