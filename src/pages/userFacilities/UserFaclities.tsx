import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { facilityProps } from '../../interfaces/Interfaces';
import Tts from '../../services/textToSpeech';
import { useAppSelector } from '../../store/hooks';
import { Colors } from '../../utlis/Colors';
import { facilityData } from '../../utlis/DummyData';
import { Fonts } from '../../utlis/GlobalFonts';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;
const { wp, hp } = ResponsiveSizes;
const UserFaclities: React.FC = () => {
  const currentEstablishment = useAppSelector(
    state => state.userSlice.currentEstablishmentDetails,
  );
  const [selectedFacility, setSelectedFacility] = useState<number | null>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [maleVoice, setMaleVoice] = useState(null);

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

  const readFromApi = () => {
    if (facilityData.length === 0) {
      return 'The place has no facilities at the moment';
    }
    return `The place has ${facilityData.map((item, index) => {
      return `${index === facilityData.length - 1 ? 'and a' : ''} ${item.name}`;
    })}`;
  };

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `You are on Facilities screen. ${readFromApi()}! 
            Moreover,  Building meets ADA standards!
            Ramp is available at entrance!
            Wheelchair parking is available at ramps!
            and Side Walks are available with room for wheel chairs!
                        & Walkers!
            `;
      let content = `${line0}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  const renderFacility = ({
    item,
    index,
  }: {
    item: facilityProps;
    index: number;
  }) => {
    const isSelected = selectedFacility === index;
    return (
      <View style={styles.facilitiesList}>
        <Pressable
          style={[
            styles.facilityItem,
            isSelected && styles.facilityItemSelected,
          ]}
          onPress={() => setSelectedFacility(index)}>
          <Text
            style={[
              styles.facilityText,
              isSelected && styles.facilityTextSelected,
            ]}>
            {item?.name}
          </Text>
        </Pressable>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        isListening={isSpeaking}
        handleListening={() => ConvertToSpeech()}
        title={'Facilities'}
        backArrow={true}
        headerStyle={styles.header}
        rightArrow={true}
        arrowColor={Colors.blackColor}
      />
      <View>
        {currentEstablishment?.facilities?.length > 0 && (
          <FlatList
            data={currentEstablishment?.facilities}
            renderItem={renderFacility}
            keyExtractor={facility => facility?.name?.toString()}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: 'row',
              marginHorizontal: wp(4),
              height: hp(7),
              paddingHorizontal: 12,
            }}
          />
        )}
        <View style={{ marginTop: hp(1), marginHorizontal: hp(1) }}>
          <Text style={styles.text}>
            {currentEstablishment?.facilities[selectedFacility]?.description ||
              ''}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserFaclities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  header: {
    borderBottomWidth: 0,
    flexDirection: 'row',
    gap: 120,
  },
  facilitiesList: {
    flexDirection: 'row',
  },
  facilityItem: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: Colors.redColor,
    marginRight: moderateScale(8),
    marginBottom: verticalScale(8),
    width: wp(30),
    height: hp(5),
    alignItems: 'center',
    marginVertical: 5,
  },
  facilityText: {
    fontSize: moderateScale(14),
    color: Colors.redColor,
  },
  AllText: {
    flexDirection: 'column',
    width: wp(100),
    height: hp(25),
    paddingHorizontal: wp(8),
    gap: 16,
    marginVertical: hp(5),
  },
  text: {
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
    fontSize: 15,
  },
  facilityItemSelected: {
    backgroundColor: Colors.redColor,
  },
  facilityTextSelected: {
    color: Colors.whiteColor,
  },
});
