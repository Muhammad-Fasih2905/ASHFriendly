import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../../components/CustomButton';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePreferences } from '../../store/user/UserAction';
import { Colors } from '../../utlis/Colors';
import { preferences } from '../../utlis/DummyData';
import { capitalizeFirstLetter } from '../../utlis/functions';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

type PreferenceField =
  | 'skin_tone'
  | 'gender'
  | 'age'
  | 'religion'
  | 'disability';

const {moderateScale, verticalScale} = SizeMattersConfig;
const PreferencesSetupScreen = () => {
  const navigation: any = useNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const [requiredField, setRequiredField] = useState(true);
  const [selectedValues, setSelectedValues] = useState<{[key: string]: string}>(
    {
      gender: '',
      age: '',
      religion: '',
      skin_tone: '',
      disability: '',
    },
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      gender: selectedValues.gender,
      age: selectedValues.age,
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
    const res = await dispatch(updatePreferences(data)).unwrap();
    if (res?.success) {
      navigation.navigate('emergencyContacts');
    }
  };

  const handleContinue = () => {
    navigation.navigate('emergencyContacts');
  };

  const handleSkip = () => {
    navigation.navigate('emergencyContacts');
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        title="Preferences Setup"
        navigation={navigation}
        backArrow={true}
        propTextStyle={{fontFamily: Fonts.InterBold}}
      />
      <ScrollView style={styles.preferencesContainer}>
        {preferences.map((pref, index) => {
          if (!pref.hasDropdown) {
            return (
              <View key={index}>
                <View
                  style={[
                    styles.preferenceItem,
                    {
                      paddingVertical:
                        Platform.OS == 'ios'
                          ? verticalScale(15)
                          : verticalScale(5),
                    },
                  ]}>
                  <Controller
                    rules={{
                      required: {
                        value: requiredField,
                        message: `${capitalizeFirstLetter(pref?.label)} is required`,
                      },
                    }}
                    control={control}
                    name={pref.label as PreferenceField}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={styles.searchInput}
                        placeholder={'Age'}
                        value={value}
                        onChangeText={onChange}
                        returnKeyType="done"
                        keyboardType="phone-pad"
                        placeholderTextColor={Colors.greyColor}
                      />
                    )}
                  />
                </View>
                {errors.age && (
                  <Text style={styles.error}>{errors.age.message}</Text>
                )}
              </View>
            );
          } else {
            return (
              <View key={index}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: requiredField,
                      message: `${capitalizeFirstLetter(pref?.label)} is required`,
                    },
                  }}
                  name={pref.label as PreferenceField}
                  defaultValue={selectedValues[pref.label]}
                  render={({field: {onChange, value}}) => (
                    <SelectList
                      setSelected={(newValue: string) => {
                        onChange(newValue);
                        handleSelect(pref.label as PreferenceField, newValue);
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
                {errors[pref.label] && (
                  <Text style={styles.error}>{errors[pref.label].message}</Text>
                )}
              </View>
            );
          }
        })}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
        <CustomButton
          disabled={isLoading}
          isLoading={isLoading}
          title="Continue"
          onPress={handleSubmit(onSubmit)}
          buttonStyle={styles.continueButton}
          textStyle={styles.continueButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  error: {
    color: Colors.red,
    fontFamily: Fonts.InterRegular,
    fontSize: moderateScale(11),
  },
  preferencesContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(25),
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    backgroundColor: Colors.whiteColor,
    marginVertical: verticalScale(5),
    marginBottom: 0,
    paddingHorizontal: moderateScale(10),
    borderRadius: 8,
  },
  preferenceLabel: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
    color: Colors.greyColor,
  },
  bottomContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: moderateScale(25),
  },
  dropdownInput: {
    width: '100%',
    height: verticalScale(50),
    borderColor: Colors.lightGreyColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: moderateScale(10),
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
    // marginVertical: verticalScale(13),
    marginTop: verticalScale(13),
    // marginBottom: verticalScale(4),
    alignItems: 'center',
  },
  skipText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
    color: Colors.redColor,
    textAlign: 'center',
    marginBottom: verticalScale(15),
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 30,
    height: verticalScale(40),
  },
  continueButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  searchInput: {
    // flex: 1,
    marginLeft: moderateScale(1),
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    width: '100%',
  },
});

export default PreferencesSetupScreen;
