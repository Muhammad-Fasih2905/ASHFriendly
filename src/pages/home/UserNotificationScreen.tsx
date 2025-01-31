import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import Tts from '../../services/textToSpeech';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNotifications } from '../../store/notification/notificationAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;

const UserNotificationScreen = () => {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.notificationSlice.notifications)

    useEffect(() => {
        dispatch(fetchNotifications())
    }, [])

    useEffect(() => {
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

        if (!isSpeaking) {
            const line0 = `You are currently on Notifications screen! There are currently no notifications!`;
            let content = `${line0}`

            Tts.speak(content);

        } else {
            Tts.stop();
        }

    }

    const onRefresh = async () => {
        setRefreshing(true);
        dispatch(fetchNotifications())
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };


    return (
        <SafeAreaView style={styles.container}>
            <UserHeaderComponent
                isListening={isSpeaking}
                handleListening={() => ConvertToSpeech()}
                title='Notifications' rightArrow={true} propTextStyle={{ fontWeight: 'bold' }} />
            <View style={styles.subInputView}>
                <FlatList
                    ListEmptyComponent={() => {
                        return <Text style={styles.notifText}>
                            no notifications
                        </Text>
                    }}
                    data={notifications}
                    renderItem={({ item }) => {
                        return <View style={styles.inputContainer}>
                            <View style={styles.inputContent}>
                                <Text style={styles.HeadText}>
                                    Queenstown Hotel is Closed
                                </Text>
                                <Text style={styles.paraText}>
                                    Today at 8am
                                </Text>
                            </View>
                        </View>
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />

            </View>
        </SafeAreaView>
    )
}

export default UserNotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.allScreensBgColor,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
        borderWidth: 1,
        borderColor: Colors.lightGreyColor,
        borderRadius: moderateScale(6),
        paddingHorizontal: moderateScale(16),
        backgroundColor: Colors.whiteColor,
        height: verticalScale(65)

    },
    input: {
        flex: 1,
        marginHorizontal: moderateScale(5),
        backgroundColor: Colors.whiteColor

    },
    inputContent: {
        flexDirection: 'column',
        gap: 5
    },
    subInputView: {
        flexDirection: 'column',
        gap: 5,
        paddingHorizontal: moderateScale(20)
    },
    HeadText: {
        fontFamily: Fonts.InterMedium,
        color: Colors.blackColor,
        fontSize: moderateScale(16),
        fontWeight: 'bold'
    },
    notifText: {
        textAlign: 'center',
        fontFamily: Fonts.InterMedium,
        color: Colors.greyColor,
        fontSize: moderateScale(19),
        marginTop: verticalScale(10),
        fontWeight: 'bold'
    },
    paraText: {
        fontFamily: Fonts.InterMedium,
        color: Colors.greyColor,
        fontSize: moderateScale(16)
    },

})