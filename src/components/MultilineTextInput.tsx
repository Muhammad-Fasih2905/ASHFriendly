import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import { Colors } from '../utlis/Colors';

interface MultilineInputProps extends TextInputProps {
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

const MultilineInput: React.FC<MultilineInputProps> = ({
    containerStyle,
    inputStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.input, inputStyle]}
                multiline={true}
                numberOfLines={4}
                placeholder="Type your answer"
                placeholderTextColor={Colors.greyColor}
                textAlignVertical="top"
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.lightGreyColor,
        borderRadius: 8,
        padding: 12,
        minHeight: 150,
        fontSize: 16,
        color: Colors.blackColor,
        lineHeight: 24,
        textAlignVertical: 'top',
    },
});

export default MultilineInput;