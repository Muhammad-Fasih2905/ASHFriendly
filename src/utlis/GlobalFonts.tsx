import { Platform } from "react-native";

export const androidFonts = {
    InterMedium: 'Inter_18pt-Medium',
    InterRegular: 'Inter_24pt-Regular',
    InterBold: 'Inter_18pt-Bold',
    InterBlack: 'Inter_18pt-Black',
    InterVariable: 'Inter-VariableFont_opsz,wght'
};

export const iosFonts = {
    InterMedium: 'Inter18pt-Medium',
    InterRegular: 'Inter24pt-Regular',
    InterBold: 'Inter18pt-Bold',
    InterBlack: 'Inter18pt-Black',
    InterVariable: 'Inter-VariableFont_opsz,wght'
};

export const Fonts = Platform.OS == 'ios' ? iosFonts : androidFonts;