import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Fonts} from '../utlis/GlobalFonts';
import {Colors} from '../utlis/Colors';
import {moderateScale, verticalScale} from 'react-native-size-matters';

interface AppDropdownProps {
  label?: string;
  optional?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  data?: any;
  onConfirmSelectItem?: any;
  error?: any;
  labelContainer?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: any;
  placeholderStyle?: StyleProp<TextStyle>;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  optional = false,
  placeholder,
  value,
  onChangeText,
  style = {},
  data,
  onConfirmSelectItem,
  error,
  labelContainer,
  labelStyle,
  inputStyle,
  placeholderStyle,
}) => {
  console.log(value);
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={[styles.labelContainer, labelContainer]}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {optional && <Text style={{color: 'red'}}>*</Text>}
          </Text>
        </View>
      )}
      <Dropdown
        iconStyle={{marginRight: 10}}
        placeholderStyle={[
          {
            fontFamily: Fonts.InterRegular,
          },
          placeholderStyle,
        ]}
        style={[styles.input, inputStyle]}
        data={data}
        maxHeight={300}
        labelField={data ? 'name' : 'label'}
        valueField="value"
        placeholder={placeholder}
        onConfirmSelectItem={onConfirmSelectItem}
        value={value}
        searchPlaceholder={placeholder}
        selectedTextStyle={{color: Colors.blackColor}}
        showsVerticalScrollIndicator={false}
        containerStyle={{
          marginTop: 10,
          borderRadius: moderateScale(8),
          borderWidth: 1,
          borderColor: Colors.lightGreyColor,
        }}
        onChange={onChangeText}
        renderItem={(item: any) => {
          return (
            <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
              <Text style={{color: Colors.blackColor}}>{item?.name}</Text>
            </View>
          );
        }}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginVertical: 20,
  },
  labelContainer: {
    // position: 'absolute',
    // top: -17,
  },
  label: {
    // marginBottom: 5,
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
    paddingHorizontal: moderateScale(2),
  },
  labelFocused: {
    color: 'blue',
  },
  input: {
    width: '100%',
    // height: moderateScale(42),
    paddingVertical: verticalScale(16),
    color: Colors.blackColor,
    fontSize: moderateScale(16),
    borderColor: Colors.lightGreyColor,
    borderWidth: 1,
    backgroundColor: 'white',
    fontFamily: Fonts.InterRegular,
    borderRadius: 7,
    paddingLeft: 12,
    marginTop: 20,
  },
  error: {
    color: Colors.red,
    fontFamily: Fonts.InterRegular,
    fontSize: moderateScale(12),
    marginLeft: 5,
  },
});
