import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import UserHeaderComponent from '../../components/GlobalHeaderComponent'
import { ListItem } from '../../components/GlobalprofileListItem'
import Tts from '../../services/textToSpeech'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { app_info, faqs_info } from '../../store/user/UserAction'
import { Colors } from '../../utlis/Colors'
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig'

const { moderateScale, verticalScale } = SizeMattersConfig;
const OwnerSettings = () => {
    const navigation = useNavigation()
    const userRole = useAppSelector(state => state?.userSlice?.role)
    const isLoading = useAppSelector(state => state.commonSlice.isLoading);
    const dispatch = useAppDispatch()
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [maleVoice, setMaleVoice] = useState(null);

    React.useEffect(() => {
        Tts.addEventListener('tts-start', () => setIsSpeaking(true));
        Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
        Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

        return () => { 
            Tts.stop(); 
        };
    }, []);
    
    const handleChangesPassword = () => {
        navigation.navigate('ownerChangePassword')
    }
    const handleFAQS = async () => {
        const res = await dispatch(faqs_info()).unwrap()
        if (res?.success === true) {
            navigation.navigate('ownerFAQS')
        }
    }
    const handleAbout = async () => {
        const res = await dispatch(app_info()).unwrap()
        if (res?.success === true) {
            navigation.navigate('ownerAbout')
        }
    }
    const handleterms = async () => {
        const res = await dispatch(app_info()).unwrap()
        if (res?.success === true) {
            navigation.navigate('ownerTerms')
        }
    }
    const handlPrivacyPolicy = async () => {
        const res = await dispatch(app_info()).unwrap()
        if (res?.success === true) {
            navigation.navigate('ownerPrivacyPolicy')
        }
    }
    const ConvertToSpeech = () => { 
        if (!isSpeaking) { 

            const content = `Here is settings details: 
            Change password:''. 
            faqs:''
            about app:''
            privacy policy:''
            term and conditions:''
            `;

            Tts.speak(content);
        } else {
            Tts.stop(); 
        }

    }
    
    return (
        <SafeAreaView style={styles.container}>
            <UserHeaderComponent title={"Settings"} backArrow={true} headerStyle={styles.header} rightArrow={userRole === 3 ? true : false} 
             isListening={isSpeaking}
             handleListening={()=>{ ConvertToSpeech() }}
            />
        <ScrollView style={styles.content} bounces={false}>
                <ListItem icon="lock" title="Change Password" library='FontAwesome' onPress={handleChangesPassword} />
                <ListItem icon="comment-question" title="FAQ’s" library='MaterialCommunityIcons' onPress={handleFAQS} />
                <ListItem icon="info-with-circle" title="About App" library='Entypo' onPress={handleAbout} />
                <ListItem icon="shield-plus" title="Privacy Policy" library='MaterialCommunityIcons' onPress={handlPrivacyPolicy} />
                <ListItem icon="message-alert" title="Terms and Conditions" library='MaterialCommunityIcons' onPress={handleterms} />
            </ScrollView>
            
            {isLoading && <View style={styles.loader}>
                <ActivityIndicator size={"large"} color={Colors.redColor} />
            </View>}
        </SafeAreaView>
    )
}

export default OwnerSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.allScreensBgColor,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGreyColor,
        marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
    },
    content: {
        flex: 1,
        padding: moderateScale(16),
    },
    loader: {position: 'absolute', width: '100%', height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)'}
})