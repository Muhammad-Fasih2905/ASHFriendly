import React, { useCallback, useState } from 'react'
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { navigationProps } from '../../interfaces/Interfaces'
import { Colors } from '../../utlis/Colors'
import UserHeaderComponent from '../../components/GlobalHeaderComponent'
import { ListItem } from '../../components/GlobalprofileListItem'
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig'
import CustomButton from '../../components/CustomButton'
import GlobalIcon from '../../utlis/GlobalIcon'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Fonts } from '../../utlis/GlobalFonts'
import { useAppDispatch } from '../../store/hooks'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { saveLocationName, setToken } from '../../store/user/UserSlice'
import { logout } from '../../store/user/UserAction'
import { persister, store } from '../../store/store'
import Tts from '../../services/textToSpeech';

const { moderateScale, verticalScale } = SizeMattersConfig;
const UserProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [isSpeaking, setIsSpeaking] = useState(false);


    React.useEffect(() => {
        Tts.addEventListener('tts-start', () => setIsSpeaking(true));
        Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
        Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

        return () => {
            Tts.stop();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                Tts.stop();
            };
        }, [])
    );

    const ConvertToSpeech = () => {
        console.log('---');
        if (!isSpeaking) {

            const content = `You are currently on My Accounts Screen! 
            Here are the details: 
            Edit Profile:''. 
            Settings:''
            Personal Preferences:''
            Emergency Contacts:''
            logout:''
            `;

            Tts.speak(content);
        } else {
            Tts.stop();
        }

    }

    const handleNaviagteProfile = () => {
        navigation.navigate('profile')
    }
    const handleYourPhotos = () => {
        navigation.navigate('preferences')
    }
    const handleQuestion = () => {
        navigation.navigate('emergencyContacts', { innerUser: true })
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
    };
    return (
        <SafeAreaView style={styles.container}>
            <UserHeaderComponent title='My Account' rightArrow={true} headerStyle={styles.header} isListening={isSpeaking}
                handleListening={() => { ConvertToSpeech() }}
            />
            <ScrollView style={styles.content} bounces={false}>
                <ListItem icon="account_circle" title="Edit Profile" onPress={handleNaviagteProfile} />
                <ListItem icon="setting-1" title="Settings" onPress={handleSettings} />
                <ListItem icon="Group" title="Personal Preferences" onPress={handleYourPhotos} />
                <ListItem icon="phone-call" library='Feather' title="Emergency Contacts" onPress={handleQuestion} />
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

export default UserProfileScreen

const styles = StyleSheet.create({
    header: {
        marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.allScreensBgColor,
    },
    content: {
        flex: 1,
        padding: moderateScale(16),
    },
    logoutButton: {
        backgroundColor: Colors.redColor,
        marginHorizontal: moderateScale(16),
        marginBottom: verticalScale(30),
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