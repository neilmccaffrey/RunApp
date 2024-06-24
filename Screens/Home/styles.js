import {Dimensions, StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../Styles/scaling';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  pictures: {
    height: verticalScale(200),
    width: width - horizontalScale(10),
    marginHorizontal: horizontalScale(5),
    borderRadius: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(10),
  },
  paginationDot: {
    width: horizontalScale(8),
    height: horizontalScale(8),
    borderRadius: 6,
    backgroundColor: '#cccccc',
    marginHorizontal: horizontalScale(4),
  },
  paginationDotActive: {
    backgroundColor: '#B57EDC',
  },
  itemsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#36454F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
