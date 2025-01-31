import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/CustomButton';
import VerifyModal from '../../components/VerifyScreenModal';
import { showMessage } from '../../store/common/commonSlice';
import {
  saveMetaData,
  saveQuestions,
} from '../../store/establishment/establishmentSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/Store';
import { getOtp, sendOtp } from '../../store/user/UserAction';
import { setToken } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale, scale } = SizeMattersConfig;
const VerifyCodeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '']);
  const [modalVisible, setModalVisible] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const isLoading: any = useAppSelector(
    (state: RootState) => state.commonSlice.isLoading,
  );
  const user: any = useAppSelector((state: RootState) => state.userSlice?.user);
  const signupToken: any = useAppSelector(
    (state: RootState) => state.userSlice?.signupToken,
  );
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(sendOtp({ email: user?.user?.email }));
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    if (text === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      const otpCode = code.join('');
      if (otpCode.length < 4) {
        setError('Please enter the complete 4-digit OTP code.');
        return;
      }

      const res = await dispatch(
        getOtp({ email: user?.user?.email, otp: otpCode }),
      ).unwrap();

      if (res?.success) {
        if (user?.user?.role_id === 3) {
          dispatch(setToken(user?.token));
        } else {
          setModalVisible(true);
        }
      } else {
        setCode(['', '', '', '']);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const closeModal = () => {
    dispatch(setToken(signupToken));
    setModalVisible(false);
    dispatch(saveQuestions([]));
    dispatch(saveMetaData({}));
    navigation.navigate('dashboard');
  };
  const handleResendCode = async () => {
    setCode(['', '', '', '']);
    const res = await dispatch(sendOtp({ email: user?.user?.email })).unwrap();
    if (res.success == true) {
      dispatch(showMessage(res.message));
    } else {
      dispatch(showMessage(res.message));
    }
  };
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.subtitle}>
            Please enter code we have just sent to email:
          </Text>
          <Text style={styles.email}>{user?.user?.email}</Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                placeholderTextColor={Colors?.blackColor}
                style={styles.codeInput}
                value={digit}
                onChangeText={text => handleCodeChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                ref={ref => (inputRefs.current[index] = ref)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
              />
            ))}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={{ marginTop: verticalScale(5) }}>
            <Text style={styles.resendText}>
              Didn't receive OTP?
              <Text onPress={handleResendCode} style={styles.resendLink}>
                Resend code
              </Text>
            </Text>
          </View>
          <CustomButton
            disabled={isLoading}
            isLoading={isLoading}
            title="Verify"
            onPress={handleVerify}
            buttonStyle={styles.verifyButton}
            textStyle={styles.verifyButtonText}
          />
        </View>
        <VerifyModal visible={modalVisible} onClose={closeModal} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
    padding: moderateScale(20),
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
    textAlign: 'center',
  },
  email: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
    color: Colors.redColor,
    marginTop: verticalScale(5),
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(0),
    width: '80%',
  },
  codeInput: {
    width: scale(50),
    height: scale(50),
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: moderateScale(8),
    fontSize: moderateScale(24),
    textAlign: 'center',
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
  },
  resendText: {
    fontSize: moderateScale(14),
    // fontFamily: Fonts.InterRegular,
    color: Colors.greyColor,
  },
  resendLink: {
    color: Colors.redColor,
    fontFamily: Fonts.InterMedium,
  },
  verifyButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 30,
    height: verticalScale(50),
    width: '100%',
  },
  verifyButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  errorText: {
    color: Colors.redColor,
    fontSize: moderateScale(12),
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
});

export default VerifyCodeScreen;
