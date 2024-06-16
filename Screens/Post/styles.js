import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: verticalScale(12),
    marginLeft: horizontalScale(12),
  },
  boxContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: horizontalScale(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  detailsInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: verticalScale(10),
  },
  label: {
    marginRight: horizontalScale(5),
    width: '20%',
    color: '#36454F',
  },
  locationText: {
    color: '#36454F',
  },
  requiredText: {
    color: 'red',
    fontSize: scaleFontSize(12),
    fontStyle: 'italic',
  },
  detailsLabel: {
    marginRight: horizontalScale(5),
    marginTop: verticalScale(10),
    width: '20%',
    color: '#36454F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B57EDC',
    borderRadius: 10,
    paddingVertical: verticalScale(10),
    paddingLeft: horizontalScale(8),
    width: '80%',
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#B57EDC',
    borderRadius: 10,
    paddingVertical: verticalScale(10),
    paddingLeft: horizontalScale(8),
    height: 125,
    width: '80%',
  },
  createPostTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostText: {
    fontSize: scaleFontSize(25),
    fontWeight: 'bold',
    color: '#36454F',
  },
  addPhoto: {
    position: 'relative',
    borderWidth: 3,
    borderColor: '#36454F',
    borderRadius: 10,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(90),
    width: horizontalScale(80),
  },
  plus: {
    position: 'absolute',
    top: verticalScale(5),
    right: horizontalScale(5),
    color: '#B57EDC',
    fontSize: scaleFontSize(30),
  },
  photo: {
    position: 'relative',
    borderRadius: 10,
    height: verticalScale(90),
    width: horizontalScale(80),
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trashCan: {
    position: 'absolute',
    top: verticalScale(5),
    right: horizontalScale(5),
  },
});

export default styles;
