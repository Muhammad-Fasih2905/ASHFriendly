import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Alarm from '../assets/images/alaramIcon.svg';
import { CustomModalNewProps } from '../interfaces/Interfaces';
import { useAppSelector } from '../store/hooks';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
import CustomButton from './CustomButton';
const {moderateScale, verticalScale} = SizeMattersConfig;
const CustomModal: React.FC<CustomModalNewProps> = ({
  visible,
  onClose,
  title,
  subTitle,
  isHome,
  openModal,
}) => {
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);

  const handleHome = () => {
    if (openModal) {
      openModal();
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable onPress={onClose}>
            <GlobalIcon
              library="FontAwesome"
              name="times"
              size={moderateScale(20)}
              color={Colors.blackColor}
            />
          </Pressable>
          {isHome ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Alarm />
              <Text style={styles.modalTitle}>Panic Alert Sent</Text>
              <CustomButton
                title="Back to Home"
                onPress={handleHome}
                buttonStyle={styles.signInButton}
                textStyle={styles.signInButtonText}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Alarm />
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalSubTitle}>{subTitle}</Text>
              <CustomButton
                disabled={isLoading}
                isLoading={isLoading}
                title="Send"
                onPress={handleHome}
                buttonStyle={styles.signInButton}
                textStyle={styles.signInButtonText}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: Colors.whiteColor,
    borderRadius: moderateScale(20),
    padding: moderateScale(35),
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
    elevation: 5,
    width: moderateScale(300),
  },
  closeButton: {
    position: 'absolute',
    right: moderateScale(10),
    top: moderateScale(10),
  },
  modalIcon: {
    marginBottom: verticalScale(15),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(10),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
    marginVertical: verticalScale(12),
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: moderateScale(15),
    marginBottom: verticalScale(10),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
    marginVertical: verticalScale(12),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  signInButton: {
    backgroundColor: Colors.redColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    height: verticalScale(40),
    width: moderateScale(240),
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
});
