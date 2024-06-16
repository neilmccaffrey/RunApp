import {StyleSheet} from 'react-native';
import {horizontalScale} from '../../Styles/scaling';

const styles = StyleSheet.create({
  detailsText: {
    marginHorizontal: horizontalScale(15),
    color: '#36454F',
  },
  seeMoreText: {
    color: 'blue',
  },
  seeMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: horizontalScale(10),
  },
});

export default styles;
