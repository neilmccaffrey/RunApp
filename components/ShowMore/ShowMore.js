import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

const ShowMore = ({text}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [seeMore, setSeeMore] = useState(false);

  //check text layout line length to determine if See More text should be shown
  const handleTextLayout = event => {
    const {lines} = event.nativeEvent;
    if (lines.length > 3) {
      setSeeMore(true);
    } else if (lines.length === 3) {
      const thirdLineLength = lines[2].text.length;
      const secondLineLength = lines[1].text.length;
      //if the 3rd lines length is more than half of the second lines length show See More
      if (thirdLineLength > secondLineLength / 2) {
        setSeeMore(true);
      }
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <Text
        style={styles.detailsText}
        onTextLayout={handleTextLayout}
        numberOfLines={isExpanded ? undefined : 3}
        ellipsizeMode="tail">
        {text}
      </Text>
      {!isExpanded && seeMore && (
        <View style={styles.seeMoreContainer}>
          <Text style={styles.seeMoreText} onPress={handleToggle}>
            See More
          </Text>
        </View>
      )}
    </View>
  );
};

export default ShowMore;
