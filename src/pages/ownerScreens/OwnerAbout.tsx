import { htmlToText } from 'html-to-text'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verticalScale } from 'react-native-size-matters'
import { WebView } from 'react-native-webview'
import UserHeaderComponent from '../../components/GlobalHeaderComponent'
import Tts from '../../services/textToSpeech'
import { useAppSelector } from '../../store/hooks'
import { Colors } from '../../utlis/Colors'
import { Fonts } from '../../utlis/GlobalFonts'
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig'
const { moderateScale } = SizeMattersConfig;
const OwnerAbout = () => {
    const userRole = useAppSelector(state => state?.userSlice?.role)
    const [isLoadingWebView, setIsLoadingWebView] = useState(true);
    const about_content = useAppSelector(state => state?.userSlice?.about_content)
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [fetchedText, setFetchedText] = useState('');

    useEffect(() => {
        const fetchFAQContent = async () => {
            try {
                const response = await fetch(about_content);
                const html = await response.text();
                const text = htmlToText(html, {
                    wordwrap: 130,
                    selectors: [
                        { selector: 'h1', options: { uppercase: true } },
                        { selector: 'a', format: 'inline' },
                    ],
                });

                setFetchedText(text.trim());
            } catch (error) {
                console.error('Failed to fetch About content:', error);
                Alert.alert('Error', 'Unable to fetch About content.');
            }
        };

        fetchFAQContent();
    }, []);


    React.useEffect(() => {

        Tts.addEventListener('tts-start', () => setIsSpeaking(true));
        Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
        Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

        return () => {
            Tts.stop();
        };
    }, []);


    const ConvertToSpeech = () => {
        if (!isSpeaking && fetchedText) {
            let speakText = `You are currently on About App screen! ${fetchedText}`
            Tts.speak(speakText);
        } else {
            Tts.stop();
        }
    }

    const handleWebViewLoadEnd = () => {
        setIsLoadingWebView(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <UserHeaderComponent
                title={"About App"}
                backArrow={true}
                headerStyle={{ ...styles.header, borderBottomWidth: userRole === "User" ? 1 : 0 }}
                isListening={isSpeaking}
                handleListening={() => ConvertToSpeech()}
                rightArrow={userRole === 1 ? true : false}
            />
            {isLoadingWebView && <ActivityIndicator style={{ paddingBottom: verticalScale(5) }} size="large" color={Colors.redColor} />}
            <WebView
                source={{ uri: about_content }}
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                bounces={false}
                onLoadEnd={handleWebViewLoadEnd}
            />
        </SafeAreaView>
    )
}

export default OwnerAbout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
    },
    contentContainer: {
        flex: 1,
        padding: moderateScale(30),
        paddingVertical: moderateScale(1)
    },
    webView: {
        flex: 1,
    },
    termsText: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: Colors.blackColor,
        textAlign: 'justify',
        fontFamily: Fonts.InterMedium
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGreyColor,
        marginBottom: verticalScale(-10),
    },
})