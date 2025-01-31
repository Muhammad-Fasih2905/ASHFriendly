import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "./Colors";

export const googlePlaceStyles = {
    textInput: {
        flex: 1,
        fontSize: moderateScale(16),
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(12),
        color: Colors.blackColor,

    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.lightGreyColor,
        borderRadius: moderateScale(8),
        backgroundColor: Colors.whiteColor,
        width: '100%',
    },
    separator: {
        backgroundColor: Colors.whiteColor,
    },
    row: { backgroundColor: Colors.transparent },
    predefinedPlacesDescription: { color: Colors.blackColor },
    description: { color: Colors.blackColor },
    listView: { borderColor: Colors.whiteColor, borderWidth: 1, borderRadius: 5, },
};