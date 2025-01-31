import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItemProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
import CustomButton from './CustomButton';
const { moderateScale, verticalScale } = SizeMattersConfig
export const ListItem: React.FC<ListItemProps> = ({ icon, title, library = "CustomIcon", onPress }) => (
    <CustomButton
        onPress={onPress}
        buttonStyle={styles.listItem}
        textStyle={styles.listItemText}
        title={title}
        leftIcon={
            <GlobalIcon
                library={library}
                name={icon}
                size={moderateScale(24)}
                color={Colors.redColor}
            />
        }
        rightIcon={
            <GlobalIcon
                library="Entypo"
                name="chevron-right"
                size={moderateScale(22)}
                color={Colors.redColor}

            />
        }
    />
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(12),
        borderWidth: 1,
        borderColor: Colors.lightestGrey,
        backgroundColor: Colors.whiteColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    listItemText: {
        flex: 1,
        marginLeft: moderateScale(12),
        fontSize: moderateScale(16),
        color: Colors.blackColor,
    },
});