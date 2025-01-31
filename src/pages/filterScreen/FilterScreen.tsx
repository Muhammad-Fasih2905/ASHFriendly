import { Slider } from '@miblanchard/react-native-slider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import CustomButton from '../../components/CustomButton';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import Tts from '../../services/textToSpeech';
import { getFilter } from '../../store/establishment/establishmentActions';
import { getAllFacilities } from '../../store/user/UserAction';
import { saveFilteredEstablishmentFilterResult } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;

type FilterFormData = {
  type: string;
  state: string;
  city: string;
  distance: number;
  establishmentTypes: number[];
  facilities: string[];
};

interface GooglePlacesInputProps {
  control: Control<FilterFormData>;
  name: keyof FilterFormData;
  placeholder: string;
  label: string;
  query: {
    key: string;
    language: string;
    types: string;
  };
}

const FilterScreen = ({route}: any) => {
  const back = route.params.back;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const availableFacilities = useAppSelector(state => state.userSlice.availableFacilities);
  const allEstablishmentTypes = useAppSelector(
    state => state.userSlice.allEstablishmentTypes,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    dispatch(getAllFacilities());
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
    }, []),
  );

  const readFromApi = () => {
    return allEstablishmentTypes.map(item => item?.name).join('! ,');
  };

  const ConvertToSpeech = () => {
    let line1 = '';
    let line2 = '';
    let line3 = '';
    if (!isSpeaking) {
      line1 = `You are currently on filter screen! Here we can filter by country! and city! can choose a distance between 0 and 100 km! we can also filter via establishment types which are ${readFromApi()}! . Then we 
have available facilities which are Building!, Bathroom!, Ramps!, Bar! and Wheelchair! At the bottom of the screen! we have a Save Changes button`;
      const content = `${line1}${line2}${line3}`;

      Tts.getInitStatus().then(() => {
        Tts.speak(content);
      });
    } else {
      Tts.stop();
    }
  };

  const {control, handleSubmit, setValue, watch, getValues} =
    useForm<FilterFormData>({
      defaultValues: {
        state: '',
        city: '',
        distance: 0,
        establishmentTypes: [],
        facilities: [],
      },
    });

  const handleEstablishmentSelect = useCallback(
    (item: number) => {
      if (getValues('establishmentTypes').includes(item)) {
        const filtered = getValues('establishmentTypes').filter(i => {
          return i !== item;
        });
        setValue('establishmentTypes', filtered);
      } else
        setValue('establishmentTypes', [
          ...getValues('establishmentTypes'),
          item,
        ]);
    },
    [setValue],
  );
  const handleFacilitySelect = useCallback(
    (item: string) => {
      console.log(item, 'item');

      if (getValues('facilities').includes(item)) {
        const filtered = getValues('facilities').filter(i => {
          return i !== item;
        });
        setValue('facilities', filtered);
      } else setValue('facilities', [...getValues('facilities'), item]);
    },
    [setValue],
  );

  const handleSave = async (data: FilterFormData) => {
    const {establishmentTypes, ...obj} = data;
    let updatedData = {
      ...obj,
      establishment_types: establishmentTypes,
    };
    console.log('update Data', updatedData);
    const res = await dispatch(getFilter(updatedData)).unwrap();
    console.log("res", res?.data);
    if (res?.success) {
      dispatch(saveFilteredEstablishmentFilterResult(res.data));
      navigation.goBack();
      if (back) {
      } else {
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">
        <UserHeaderComponent
          handleListening={() => ConvertToSpeech()}
          isListening={isSpeaking}
          title="Filters"
          backArrow
          headerStyle={styles.header}
          rightArrow
          propTextStyle={styles.headerText}
        />
        <View style={styles.mainContent}>
          <GooglePlacesInput
            control={control}
            name="state"
            placeholder="Search for a country"
            label="Country"
            query={{
              key: 'AIzaSyDbOfusA5U9qee5ZPfNOTO82OH3an23m0g',
              language: 'en',
              types: '(regions)',
            }}
          />
          <GooglePlacesInput
            control={control}
            name="city"
            placeholder="Search for a city"
            label="City"
            query={{
              key: 'AIzaSyDbOfusA5U9qee5ZPfNOTO82OH3an23m0g',
              language: 'en',
              types: '(cities)',
            }}
          />
          <View style={styles.section}>
            <Controller
              name="distance"
              control={control}
              render={({field: {onChange, value}}) => (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.sectionTitle}>Distance</Text>
                    <Text
                      style={[
                        styles.sectionTitle,
                        {fontFamily: Fonts.InterRegular, fontSize: 15},
                      ]}>
                      Within {value}km
                    </Text>
                  </View>
                  <Slider
                    value={value}
                    onValueChange={val => onChange(val[0])}
                    minimumValue={0}
                    maximumValue={100}
                    step={2}
                    minimumTrackTintColor={Colors.redColor}
                    maximumTrackTintColor={Colors.greyColor}
                    thumbTintColor={Colors.redColor}
                  />
                </>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Establishment Type</Text>
            <Controller
              control={control}
              name="establishmentTypes"
              render={({field: {value}}) => (
                <View style={styles.chipContainer}>
                  {allEstablishmentTypes.map(
                    (type: {name: string; id: number}) => (
                      <Pressable
                        key={type.id}
                        style={[
                          styles.chip,
                          {marginBottom: 10},
                          value.includes(type.id) && styles.chipSelected,
                        ]}
                        onPress={() => handleEstablishmentSelect(type.id)}>
                        <Text
                          style={
                            value.includes(type.id)
                              ? styles.chipTextSelected
                              : styles.chipText
                          }>
                          {type.name}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Facilities</Text>
            <Controller
              control={control}
              name="facilities"
              render={({field: {onChange, value}}) => (
                <View style={styles.chipContainer}>
                  {availableFacilities?.length > 0 && availableFacilities?.map(
                    (facility, index) => (
                      <Pressable
                        key={index}
                        style={[
                          styles.chip,
                          {marginBottom: 10},
                          value.includes(facility.toLowerCase()) &&
                            styles.chipSelected,
                        ]}
                        onPress={() =>
                          handleFacilitySelect(facility.toLowerCase())
                        }>
                        <Text
                          style={
                            value.includes(facility.toLowerCase())
                              ? styles.chipTextSelected
                              : styles.chipText
                          }>
                          {facility}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>
              )}
            />
          </View>

          <CustomButton
            isLoading={isLoading}
            title="Save Changes"
            onPress={handleSubmit(handleSave)}
            buttonStyle={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  control,
  name,
  placeholder,
  query,
  label,
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange}}) => (
          <View
            style={[styles.inputContainer, {marginBottom: verticalScale(8)}]}>
            <GooglePlacesAutocomplete
              placeholder={placeholder}
              fetchDetails
              onPress={data => {
                setInputValue(data.description);
                onChange(data.description);
                Keyboard.dismiss();
              }}
              textInputProps={{
                value: inputValue,
                onChangeText: text => {
                  setInputValue(text);
                  onChange(text);
                },
                placeholderTextColor: '#888888',
              }}
              renderLeftButton={() => (
                <View style={styles.leftIcon}>
                  <GlobalIcon
                    library="Ionicons"
                    color={Colors.greyColor}
                    name="location-outline"
                  />
                </View>
              )}
              query={query}
              enablePoweredByContainer={false}
              styles={googlePlaceStyles}
            />
          </View>
        )}
      />
    </>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  scrollView: {
  },
  container: {flex: 1, backgroundColor: Colors.allScreensBgColor},
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyColor,
    marginTop: verticalScale(2),
  },
  mainContent: {paddingHorizontal: moderateScale(16)},
  label: {
    fontSize: moderateScale(18),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  section: {
    marginBottom: verticalScale(20),
    marginTop: verticalScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: verticalScale(12),
  },
  chip: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.lightestPink,
    marginRight: moderateScale(10),
    marginBottom: moderateScale(1),
  },
  chipSelected: {backgroundColor: Colors.redOrange},
  chipText: {
    color: Colors.blackColor,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterRegular,
  },
  chipTextSelected: {color: Colors.whiteColor},
  saveButton: {
    backgroundColor: Colors.redColor,
    marginTop: verticalScale(12),
    borderRadius: 60,
    height: verticalScale(45),
  },
  saveButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  inputContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: verticalScale(12),
  },
  leftIcon: {justifyContent: 'center', alignItems: 'center', paddingLeft: 10},
});

const googlePlaceStyles = {
  textInput: {fontSize: 16, color: '#000', backgroundColor: Colors.allScreensBgColor},
  textInputContainer: {
    backgroundColor: Colors.transparent,
    width: '99%',
  },
  separator: {
    backgroundColor: Colors.whiteColor,
  },
  row: {backgroundColor: Colors.transparent},
  predefinedPlacesDescription: {color: Colors.blackColor},
  description: {color: Colors.blackColor},
  listView: {borderColor: '#ccc', borderWidth: 1, borderRadius: 5},
};
