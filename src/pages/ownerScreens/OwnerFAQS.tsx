import { htmlToText } from 'html-to-text'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'
import UserHeaderComponent from '../../components/GlobalHeaderComponent'
import Tts from '../../services/textToSpeech'
import { useAppSelector } from '../../store/hooks'
import { Colors } from '../../utlis/Colors'
import { Fonts } from '../../utlis/GlobalFonts'
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig'

const { moderateScale, verticalScale } = SizeMattersConfig;
const OwnerFAQS = () => {
    const userRole = useAppSelector(state => state?.userSlice?.role)
    const faqs_content = useAppSelector(state => state?.userSlice?.faqs_content)
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [fetchedText, setFetchedText] = useState('');
    const [isLoadingWebView, setIsLoadingWebView] = useState(true);

    React.useEffect(() => {
        Tts.addEventListener('tts-start', () => setIsSpeaking(true));
        Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
        Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

        return () => {
            Tts.stop();
        };
    }, []);

    useEffect(() => {
        const fetchFAQContent = async () => {
            try {
                const response = await fetch(faqs_content);
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
            finally {
            }
        };

        fetchFAQContent();
    }, []);

    const ConvertToSpeech = () => {
        if (!isSpeaking && fetchedText) {
            let speakText = `You are currently on Faqs screen! ${fetchedText}`
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
            <UserHeaderComponent title={"FAQ's"} backArrow={true} headerStyle={{ ...styles.header, borderBottomWidth: userRole === 2 ? 1 : 0 }} rightArrow={userRole === 3 ? true : false} propTextStyle={{ textTransform: 'none' }}
                isListening={isSpeaking}
                handleListening={() => { ConvertToSpeech() }}
            />
                {isLoadingWebView && <ActivityIndicator style={{paddingBottom: verticalScale(5)}} size="large" color={Colors.redColor} />}
            <WebView
                source={{ uri: faqs_content }}
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                bounces={false}
                onLoadEnd={handleWebViewLoadEnd}
                />
        </SafeAreaView>
    )
}

export default OwnerFAQS

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
    },
    loadingWrapper:
        { flex: 1, justifyContent: 'center', alignItems: 'center' },
    webView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: moderateScale(16),
        paddingTop: moderateScale(2)
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGreyColor
    },
    headerText: {
        fontSize: moderateScale(20),
        marginBottom: verticalScale(8),
        color: Colors.blackColor,
        fontFamily: Fonts.InterBold
    },
    subHeaderText: {
        fontSize: moderateScale(14),
        marginBottom: verticalScale(24),
        color: Colors.blackColor,
        fontFamily: Fonts.InterMedium
    },
})