import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import FilterIcon from '../assets/images/filterIcon.svg';
import { SearchInputProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const SearchInput: React.FC<SearchInputProps> = ({
  textInputRef,
  isListening,
  onVoiceSearchIconPress,
  placeholder,
  filterIcon,
  searchStyleView,
  FocusHandler,
  BlurHandler,
  getSearchInputText,
}) => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  return (
    <View style={styles.mapSubHead}>
      <View style={[styles.searchContainer, searchStyleView]}>
        <GlobalIcon
          library="CustomIcon"
          name="Vector"
          size={24}
          color={Colors.greyColor}
        />
        <TextInput
          ref={textInputRef}
          onFocus={() => FocusHandler && FocusHandler()}
          onBlur={() => BlurHandler && BlurHandler()}
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchText}
          onChangeText={text => {
            getSearchInputText(text);
            setSearchText(text);
          }}
          placeholderTextColor={Colors.greenAndGreyMixColor}
        />
        <Pressable onPress={onVoiceSearchIconPress}>
          <GlobalIcon
            library="CustomIcon"
            name="Group-1171275968"
            size={25}
            color={isListening ? Colors.greenColor : Colors.blackColor}
          />
        </Pressable>
      </View>
      {filterIcon && (
        <Pressable
          onPress={() => navigation?.navigate('filterScreen', {back: true})}
          style={styles.filterView}>
          <FilterIcon />
        </Pressable>
      )}
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  mapSubHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(5),
    gap: 17,
  },
  filterView: {
    width: moderateScale(45),
    height: verticalScale(35),
    backgroundColor: Colors.redOrange,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: 8,
    paddingHorizontal: moderateScale(15),
    height: verticalScale(48),
    width: moderateScale(300),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    // fontFamily: Fonts.InterRegular,
  },
});
