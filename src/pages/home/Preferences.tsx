import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Colors} from '../../utlis/Colors';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import {
  navigationProps,
  SelectedValuesPrefrences,
} from '../../interfaces/Interfaces';
import {DropdownItem} from '../../components/DropDownListItem';
import {SizeMattersConfig} from '../../utlis/SizeMattersConfig';
import CustomButton from '../../components/CustomButton';
import {Fonts} from '../../utlis/GlobalFonts';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {Controller, useForm} from 'react-hook-form';
import {
  fetchPersonalPreferences,
  updatePreferences,
} from '../../store/user/UserAction';
import {SelectList} from 'react-native-dropdown-select-list';
import {preferences} from '../../utlis/DummyData';
import {ResponsiveSizes} from '../../utlis/ResponsiveSizes';
import Tts from '../../services/textToSpeech';

const {moderateScale, verticalScale} = SizeMattersConfig;
type PreferenceField = 'skin_tone' | 'gender' | 'religion' | 'disability';

const Preferences = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const preferencesData = useAppSelector(
    state => state?.userSlice?.preferencesData,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const isScreenLoading = useAppSelector(
    state => state.commonSlice.isScreenLoading,
  );
  const [selectedValues, setSelectedValues] =
    useState<SelectedValuesPrefrences>({
      gender: preferencesData?.gender || '',
      religion: preferencesData?.religion || '',
      skin_tone: preferencesData?.skin_tone || '',
      disability: preferencesData?.disability || '',
    });
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    dispatch(fetchPersonalPreferences());
  }, [])

  useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    setSelectedValues({
      gender: preferencesData?.gender || '',
      religion: preferencesData?.religion || '',
      skin_tone: preferencesData?.skin_tone || '',
      disability: preferencesData?.disability || '',
    });
  }, [preferencesData]);

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `You are currently on Personal Preferences Screen. We can select our Gender! Religion! Skin Tone! and Disability! (if any!) !
            At the bottom of the screen! we have a Save Changes Button
        `;
      let content = `${line0}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      gender: selectedValues.gender,
      religion: selectedValues.religion,
      skin_tone: selectedValues.skin_tone,
      disability: selectedValues.disability,
    },
  });
  const handleSelect = (label: PreferenceField, value: string) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [label]: value,
    }));
    setValue(label, value);
  };
  const onSubmit = async (data: any) => {
    console.log('data: ', data);
    const res = await dispatch(updatePreferences(data)).unwrap();
    // console.log('res:======>> ', res);
    if (res?.success) {
      // console.log(res, '===>');
      navigation.goBack();
    }
  };
  const handleContinue = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        isListening={isSpeaking}
        handleListening={() => ConvertToSpeech()}
        title="Personal Preferences"
        rightArrow={true}
        backArrow={true}
      />
      {isScreenLoading ? (
        <ActivityIndicator
          color={Colors.redColor}
          style={{marginTop: verticalScale(0), flex: 1}}
          size={'large'}
        />
      ) : (
        <>
          <View style={styles.content}>
            {preferences
              .filter(pref => pref.label !== 'age')
              .map((pref, index) => {
                return (
                  <View key={index}>
                    <Text style={styles.labelText}>
                      {pref.label
                        .split(' ')
                        .map(
                          word => word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </Text>
                    <Controller
                      control={control}
                      name={pref.label as PreferenceField}
                      defaultValue={selectedValues[pref.label]}
                      render={({field: {onChange, value}}) => (
                        <SelectList
                          setSelected={(newValue: string) => {
                            onChange(newValue);
                            handleSelect(
                              pref.label as PreferenceField,
                              newValue,
                            );
                          }}
                          data={
                            pref.options?.map(option => ({
                              key: option.value,
                              value: option.label,
                            })) || []
                          }
                          placeholder={pref.placeholder}
                          search={false}
                          boxStyles={styles.dropdownInput}
                          dropdownStyles={{
                            borderRadius: 0,
                            borderWidth: 0,
                            backgroundColor: Colors.whiteColor,
                          }}
                          dropdownTextStyles={{
                            color: Colors.blackColor,
                            fontFamily: Fonts.InterBold,
                          }}
                          defaultOption={{key: value, value: value}}
                          fontFamily={Fonts.InterBold}
                          inputStyles={{
                            color: Colors.blackColor,
                            textTransform: 'capitalize',
                          }}
                        />
                      )}
                    />
                  </View>
                );
              })}
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton
              disabled={isLoading}
              isLoading={isLoading}
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              buttonStyle={{
                ...styles.continueButton,
                backgroundColor: Colors.redColor,
              }}
              textStyle={styles.continueButtonText}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: moderateScale(12),
    flex: 1,
  },
  continueButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 30,
    height: verticalScale(43),
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    marginBottom: ResponsiveSizes.hp(3),
    paddingHorizontal: ResponsiveSizes.wp(5),
  },
  continueButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  dropdownInput: {
    width: '100%',
    height: verticalScale(45),
    borderColor: Colors.lightGreyColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: moderateScale(10),
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
    marginVertical: verticalScale(10),
    alignItems: 'center',
  },
  labelText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    paddingHorizontal: 3,
  },
});
