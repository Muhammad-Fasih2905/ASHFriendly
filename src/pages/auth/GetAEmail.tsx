import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgetPassword } from '../../store/user/UserAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;
const GetAEmail = () => {
    const navigation = useNavigation()
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector(state => state.commonSlice.isLoading);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
        },
    });
    const onSubmit = async (data: any) => {
        const res = await dispatch(forgetPassword(data)).unwrap();
        if (res?.success) {
            navigation.navigate('openEmail')
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
                <UserHeaderComponent title='Forgot Password?' backArrow={true} propTextStyle={{ fontFamily: Fonts.InterBold }} />
                <View style={styles.content}>
                    <Text style={styles.headerText}>Please enter the email you use to sign in and
                        we will send you resent link.</Text>
                    <View style={styles.inputContainer}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: { value: true, message: 'Email is required' },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                    message: 'The email must be a valid email address.',
                                },
                            }}
                            render={({ field: { onChange, value } }) => (
                                <InputField
                                    placeholder="Your Email"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType='email-address'
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    textContentType="none"
                                    secureTextEntry={false}
                                    inputStyle={styles.input}
                                    leftIcon={<GlobalIcon
                                        library="CustomIcon"
                                        name="mail"
                                        size={24}
                                        color={Colors.greyColor}
                                    />}
                                    error={errors.email?.message}
                                />
                            )}
                        />

                    </View>
                    <CustomButton
                        disabled={isLoading}
                        isLoading={isLoading}
                        title="Submit"
                        onPress={handleSubmit(onSubmit)}
                        buttonStyle={styles.signInButton}
                        textStyle={styles.signInButtonText}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default GetAEmail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.allScreensBgColor,
    },
    scrollView: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        padding: moderateScale(20),
    },
    headerText: {
        fontSize: moderateScale(15),
        color: Colors.greyColor,
        fontFamily: Fonts.InterMedium,
    },
    inputContainer: {
        marginBottom: verticalScale(15),
        marginVertical: verticalScale(18),

    },
    input: {
        flex: 1,

    },
    signInButton: {
        backgroundColor: Colors.blackColor,
        marginTop: verticalScale(10),
        borderRadius: 60,
        height: verticalScale(50)
    },
    signInButtonText: {
        color: Colors.whiteColor,
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterMedium
    },
})