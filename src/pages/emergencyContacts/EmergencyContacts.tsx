import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import Tts from '../../services/textToSpeech';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/Store';
import {
  emergencyContact,
  fetchEmergencyContacts,
} from '../../store/user/UserAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
type RouteParams = {
  innerUser?: boolean;
};
const EmergencyContacts = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const conditionInner = route?.params?.innerUser;
  const token = useAppSelector((state: RootState) => state.userSlice?.token);
  const emergency_number = useAppSelector(
    state => state.userSlice.emergency_contact,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const isScreenLoading = useAppSelector(
    state => state.commonSlice.isScreenLoading,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchEmergencyContacts());
    }
  }, []);

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `We are on Emergency Contacts Screen. We can set Emergency Contact 1 and Emergency Contact 2!
            At the bottom of the screen! we have a Save Changes Button`;
      let content = `${line0}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      emergency_contacts: ['', ''],
    },
  });
  useEffect(() => {
    if (emergency_number) {
      emergency_number?.forEach((item, index) => {
        setValue(`emergency_contacts.${index}`, item);
      });
    }
  }, [emergency_number, setValue]);
  const handleSkip = () => {
    navigation.navigate('verifycodeScreen');
  };

  const onSubmit = async (data: any) => {
    const res = await dispatch(emergencyContact(data)).unwrap();
    if (res?.success) {
      if (conditionInner == true) {
        navigation.goBack();
      } else {
        navigation.navigate('verifycodeScreen');
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
        <UserHeaderComponent
          isListening={isSpeaking}
          handleListening={() => ConvertToSpeech()}
          title={'Emergency Contacts'}
          backArrow={true}
          headerStyle={styles.header}
          rightArrow={!token ? false : true}
          propTextStyle={{fontFamily: Fonts.InterBold}}
        />

        {isScreenLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size={'large'} color={Colors.redColor} />
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => Keyboard.dismiss()}
              style={styles.mainViewinput}>
              <Controller
                name="emergency_contacts.0"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Emergency Contacts 1 is required',
                  },
                  pattern: {
                    value: /^\+1\d{10,}$/i,
                    message:
                      'Please enter a valid phone number e.g., +17606880076.',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <InputField
                    placeholder="+1 (027) 266-7137"
                    onChangeText={onChange}
                    value={value?.toString()}
                    label="Emergency Contact 1"
                    inputStyle={styles.input}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="none"
                    secureTextEntry={false}
                    error={
                      errors?.emergency_contacts != undefined
                        ? errors.emergency_contacts[0]?.message
                        : ''
                    }
                  />
                )}
              />

              <Controller
                name="emergency_contacts.1"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Emergency Contacts 2 is required',
                  },
                  pattern: {
                    value: /^\+1\d{10,}$/i,
                    message:
                      'Please enter a valid phone number e.g., +17606880076.',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <InputField
                    placeholder="+1 (027) 266-7137"
                    onChangeText={onChange}
                    value={value?.toString()}
                    label="Emergency Contact 2"
                    inputStyle={styles.input}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="none"
                    secureTextEntry={false}
                    error={
                      errors?.emergency_contacts != undefined
                        ? errors.emergency_contacts[1]?.message
                        : ''
                    }
                  />
                )}
              />
            </Pressable>

            <View style={styles.bottomContainer}>
              {conditionInner ? null : (
                <Pressable onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip for now</Text>
                </Pressable>
              )}
              <CustomButton
                disabled={isLoading}
                isLoading={isLoading}
                title={conditionInner ? 'Save Changes' : ' Continue'}
                onPress={handleSubmit(onSubmit)}
                buttonStyle={{
                  ...styles.continueButton,
                  backgroundColor: conditionInner
                    ? Colors.redColor
                    : Colors.blackColor,
                }}
                textStyle={styles.continueButtonText}
              />
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EmergencyContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  loadingWrapper: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  bottomContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: moderateScale(25),
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyColor,
  },
  continueButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 30,
    height: verticalScale(45),
  },
  continueButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  skipText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
    color: Colors.redColor,
    textAlign: 'center',
    marginBottom: verticalScale(15),
    textDecorationLine: 'underline',
  },

  input: {
  },
  inputText: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  mainInputView: {
    flexDirection: 'column',
    paddingHorizontal: moderateScale(20),
  },
  mainViewinput: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
});
