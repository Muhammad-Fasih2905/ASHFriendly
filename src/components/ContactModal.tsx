import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Pressable,
} from 'react-native';
import GlobalIcon from '../utlis/GlobalIcon';
import Clipboard from '@react-native-clipboard/clipboard';
import CallIcon from '../assets/images/called.svg';
import {SizeMattersConfig} from '../utlis/SizeMattersConfig';
import {Colors} from '../utlis/Colors';
import {ContactModalProps} from '../interfaces/Interfaces';
import {Fonts} from '../utlis/GlobalFonts';
import {ResponsiveSizes} from '../utlis/ResponsiveSizes';
import {showMessage} from '../store/common/commonSlice';
const {moderateScale, verticalScale} = SizeMattersConfig;
const {wp, hp} = ResponsiveSizes;
const ContactModal: React.FC<ContactModalProps> = ({
  visible,
  onClose,
  contactNum,
  copyBtn,
  whatsappFun,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <GlobalIcon
              library="Entypo"
              name="cross"
              size={28}
              color={Colors.greyColor}
            />
          </Pressable>
          <CallIcon />
          <Text style={styles.modalTitle}>Contact Now</Text>
          <View style={{flexDirection: 'row', gap: 10, alignSelf: 'center'}}>
            <Text style={styles.modalPhone}>{contactNum}</Text>
            <Pressable onPress={copyBtn}>
              <GlobalIcon
                library="Feather"
                name="copy"
                size={24}
                color={'red'}
              />
            </Pressable>
          </View>
          <Pressable style={styles.whatsappButton} onPress={whatsappFun}>
            <View style={[styles.btnWrapper]}>
              <GlobalIcon
                library="FontAwesome"
                name="whatsapp"
                size={moderateScale(17)}
                // color={Colors.greenColor}
              />
            </View>
            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonIcon: {
    marginRight: moderateScale(10),
  },
  btnWrapper: {
    borderRadius: 50,
    // padding: hp(0.5),
    // width: hp(1),
    padding: 4,
    paddingHorizontal: 5,
    // height: hp(1),
    backgroundColor: Colors.greenColor,
    // borderWidth: 5,
    // borderColor: Colors.greenColor,
  },
  contactButtonText: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: Colors.whiteColor,
    borderRadius: moderateScale(20),
    padding: moderateScale(35),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
    elevation: 5,
    width: moderateScale(300),
    height: hp(31),
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
  },
  modalPhone: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(5),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    gap: 8,
  },
  whatsappButtonText: {
    color: Colors.blackColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
});

export default ContactModal;
