import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { ListItem } from '../../components/GlobalprofileListItem'
import OwnerScreenHeader from '../../components/OnwerScreenHeader'
import { useAppDispatch } from '../../store/hooks'
import { persister, store } from '../../store/store'
import { logout } from '../../store/user/UserAction'
import { saveLocationName, setIsLogin } from '../../store/user/UserSlice'
import { Colors } from '../../utlis/Colors'
import { Fonts } from '../../utlis/GlobalFonts'
import GlobalIcon from '../../utlis/GlobalIcon'
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig'
const { moderateScale, verticalScale } = SizeMattersConfig;
const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const handleNaviagteProfile = () => {
        navigation.navigate('profile')
    }
    const handleEstablishment = () => {
        navigation.navigate('establishmentDetails', { insideEstablishment: true });

    }
    const handleYourPhotos = () => {
        navigation.navigate('uploadYourPhotosScreen', { uploadPhotos: true })

    }
    const handleQuestion = () => {
        navigation.navigate('accessibilityQuestionnaire', { handleQuestions: true })
    }
    const handleSettings = () => {
        navigation.navigate('ownerSettings')
    }
    const handleLogout = () => {
        dispatch(logout()).unwrap();
        persister.purge();
        store.dispatch({ type: 'LOGOUT' });
        AsyncStorage.clear();
        dispatch(saveLocationName(''))
        dispatch(setIsLogin(false));
    };
    return (
        <SafeAreaView style={styles.container}>
            <OwnerScreenHeader navigation={navigation} title='My Account' backArrow={false} headerStyle={styles.header} />
            <ScrollView style={styles.content} bounces={false}>
                <ListItem icon="account_circle" title="Edit Owner's Information" onPress={handleNaviagteProfile} />
                <ListItem icon="location-5-1" title="Edit Establishment's Information" onPress={handleEstablishment} />
                <ListItem icon="Group-1171275963" title="Edit Establishment Profile Photos" onPress={handleYourPhotos} />
                <ListItem icon="setting-1" title="Settings" onPress={handleSettings} />
                <ListItem icon="Group" title="Accessibility Questionaire" onPress={handleQuestion} />
            </ScrollView>
            <CustomButton
                title="Logout"
                onPress={handleLogout}
                leftIcon={
                    <GlobalIcon
                        library="Entypo"
                        name='log-out'
                        size={moderateScale(17)}
                        color={Colors.whiteColor}
                    />
                }
                buttonStyle={styles.logoutButton}
                textStyle={styles.logoutButtonText}
            />
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.allScreensBgColor,
    },
    header: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightestGrey,
        marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
    },
    content: {
        flex: 1,
        padding: moderateScale(16),
    },
    logoutButton: {
        backgroundColor: Colors.redColor,
        marginHorizontal: moderateScale(16),
        marginBottom: verticalScale(16),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(60),
    },
    logoutButtonText: {
        color: Colors.whiteColor,
        fontSize: moderateScale(16),
        textAlign: 'center',
        fontFamily: Fonts.InterBold
    },
})