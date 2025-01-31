import React, { Dispatch, SetStateAction } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Colors } from '../utlis/Colors';

interface VoiceModalTypes {
  speechErrorMsg: string;
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  animValues: React.MutableRefObject<Animated.Value[]>;
  setSpeechErrorMsg: React.SetStateAction<string>;
  onCancelPress: any;
  onRetryPress: any;
  modalLoading: boolean;
}
const {width} = Dimensions.get('window');

const VoiceModal: React.FC<VoiceModalTypes> = ({
  modalLoading,
  onRetryPress,
  speechErrorMsg,
  setModalVisible,
  animValues,
  onCancelPress,
  modalVisible,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Start Speaking!</Text>

          {!modalLoading && (
            <View style={styles.waveformContainer}>
              {animValues.map((animValue: number, index: number) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.bar,
                    {
                      height: animValue,
                    },
                  ]}
                />
              ))}
            </View>
          )}
          {modalLoading && (
            <ActivityIndicator size={'large'} color={Colors.red} />
          )}
          <Text style={styles.modalText}>{speechErrorMsg}</Text>
          {speechErrorMsg.length > 0 && (
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onRetryPress}>
              <Text style={styles.textStyle}>Retry</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onCancelPress}>
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default VoiceModal;

const styles = StyleSheet.create({
  waveformContainer: {
    height: hp(5),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: hp(5),
    marginBottom: hp(2),
  },
  bar: {
    width: width / 20,
    marginHorizontal: 5,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: '45%',
    width: '70%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '80%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: hp(1),
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.greyColor,
  },
});
