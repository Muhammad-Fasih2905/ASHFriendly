import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { CustomModalProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const VerifyModal: React.FC<CustomModalProps> = ({visible, onClose}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <GlobalIcon
            library="CustomIcon"
            name="order-tracking-1"
            size={75}
            color={Colors.redColor}
          />
          <Text style={styles.modalText}>Verification Under Review</Text>
          <Text style={styles.modalPara}>
            Your profile verification is currently under review. We appreciate
            your patience and will respond soon.
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Continue To Dashboard</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: moderateScale(18),
    color: Colors.blackColor,
    marginBottom: 20,
    fontFamily: Fonts.InterBold,
  },
  modalPara: {
    fontSize: moderateScale(16),
    color: Colors.greyColor,
    marginBottom: 20,
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.redColor,
    width: '100%',
    borderRadius: 54,
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterBold,
  },
});

export default VerifyModal;
