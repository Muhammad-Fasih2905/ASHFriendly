import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { InputFieldProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import { ResponsiveSizes } from '../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig
const InputField: React.FC<InputFieldProps> = ({
    keyboardType = 'default',
    placeholder = '',
    onChangeText,
    value,
    inputStyle,
    autoCorrect,
    autoCapitalize,
    textContentType,
    secureTextEntry,
    multiline,
    label,
    iconName,
    iconLibrary = 'Entypo',
    isValid,
    leftIcon,
    rightIcon,
    editable,
    containerStyle,
    topContainerStyle,
    labeltext,
    error,
    InputTextRef,
    
    ...props
}) => {
    return (
        <View style={[styles.container, topContainerStyle]}>
            {label && <Text style={[styles.label, labeltext]}>{label}</Text>}
            <View style={[containerStyle, styles.inputContainer]}>
                {leftIcon && (
                    <View style={styles.iconContainer}>
                        {leftIcon}
                    </View>
                )}
                <TextInput
                
                    {...props}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    value={value}
                    style={[styles.input, inputStyle]}
                    autoCorrect={autoCorrect}
                    autoCapitalize={autoCapitalize}
                    textContentType={textContentType}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={Colors.greyColor}
                    multiline={multiline}
                    editable={editable}
                    ref={InputTextRef}
                />
                {rightIcon && (
                    <View style={styles.iconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>
            {error && <Text style={{ color: Colors.red }}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: ResponsiveSizes.hp(2),
    },
    label: {
        fontSize: moderateScale(14),
        marginBottom: verticalScale(8),
        color: Colors.blackColor,
        fontFamily: Fonts.InterMedium
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.lightGreyColor,
        borderRadius: moderateScale(8),
        backgroundColor: Colors.whiteColor,
    },
    input: {
        flex: 1,
        fontSize: moderateScale(16),
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(12),
        color: Colors.blackColor,
    },
    iconContainer: {
        padding: moderateScale(10),
    },
    // input: {
    //     fontSize: 16,
    //     paddingVertical: 12,
    //     backgroundColor: Colors.whiteColor,
    //     color: Colors.blackColor,

    // },
});

export default InputField;
