import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const Button = ({title, onPress, isDisabled}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled]}
      disabled={isDisabled}
      onPress={() => onPress()}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
