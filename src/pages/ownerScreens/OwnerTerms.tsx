import { htmlToText } from 'html-to-text'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import UserHeaderComponent from '../../components/GlobalHeaderComponent'
import Tts from '../../services/textToSpeech'
import { useAppSelector } from '../../store/hooks'
import { Colors } from '../../utlis/Colors'
import { Fonts } from '../../utlis/GlobalFonts'
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig'
const { moderateScale, verticalScale } = SizeMattersConfig;
const OwnerTerms = () => {

    const userRole = useAppSelector(state => state?.userSlice?.role)
    const terms_content = useAppSelector(state => state?.userSlice?.terms_content)
    const [isLoadingWebView, setIsLoadingWebView] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [fetchedText, setFetchedText] = useState('');

    useEffect(() => {
        const fetchFAQContent = async () => {
            try {
                const response = await fetch(terms_content);
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
                console.error('Failed to fetch FAQ content:', error);
                Alert.alert('Error', 'Unable to fetch FAQ content.');
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
            let speakText = `You are currently on Terms and Conditions screen! ${fetchedText}`
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
                isListening={isSpeaking}
                handleListening={() => ConvertToSpeech()}
                rightArrow={userRole === 3 ? true : false}
                title={"Terms and Conditions"}
                propTextStyle={{ textTransform: 'none'}}
                backArrow={true} headerStyle={{ ...styles.header, borderBottomWidth: userRole === 3 ? 1 : 0 }}
                 />
            {isLoadingWebView && <ActivityIndicator style={{ marginTop: moderateScale(25) }} size="large" color={Colors.redColor} />}
            <WebView
                source={{ uri: terms_content }}
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                bounces={false}
                onLoadEnd={handleWebViewLoadEnd}
            />
        </SafeAreaView>
    )
}

export default OwnerTerms

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
    },
    contentContainer: {
        flex: 1,
        padding: moderateScale(30),
        paddingVertical: verticalScale(1),
    },
    webView: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGreyColor,
        // marginBottom: verticalScale(1),
        marginBottom: verticalScale(-10),
    },
    termsText: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: Colors.blackColor,
        textAlign: 'justify',
        fontFamily: Fonts.InterMedium
    },
})