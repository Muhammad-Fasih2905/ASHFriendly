import Voice from '@react-native-voice/voice';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const actionKeywords = ['go', 'navigate', 'open', 'see', 'show'];
const useVoice = (
  screenName: string,
  onVoiceResult?: (arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) => void,
) => {

  const animValues = useRef<Animated.Value[]>([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [speechErrorMsg, setSpeechErrorMsg] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
        Voice.destroy().then(Voice.removeAllListeners);
    }, [screenName])
);

  const onSpeechStart = async () => {
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    stopWaveformAnimation();
  };

  const stopListeningAndHideModal = async() => {
    setModalVisible(false);
    await stopListening();
    setModalLoading(false);
  };

  const onSpeechResults = useCallback(async (event: any) => {
    const {value} = event;
    console.log('result', value);
    console.log(value ? value[0] : null);
    setSpeechResult(value ? value[0] : null);

    const speechText = event.value[0].toLowerCase();

    console.log('screenName: ', screenName);
    if (screenName === 'Home') {
     onVoiceResult && onVoiceResult(setSpeechErrorMsg, stopListening, speechText, stopListeningAndHideModal, setModalLoading);
    } else if (screenName === 'RestaurantsScreens') {
      onVoiceResult && onVoiceResult(setSpeechErrorMsg, stopListening, speechText, stopListeningAndHideModal)
    }
  },[screenName])

  const handleListening = () => {
    isListening ? stopListening() : startListening();
  };

  const onSpeechError = (e: any) => {
    stopWaveformAnimation();
    setIsListening(false);
    if (e.error?.code === '7') {
      setSpeechErrorMsg('No match found. Please speak more clearly.');
    } else if (e.error?.code === '5') {
      console.log('Microphone error. Please ensure permissions are granted.');
    } else if (e.error?.code === '11') {
      setSpeechErrorMsg("Didn't understand. Please try again.");
    }
  };

  const startListening = async () => {
    setSpeechErrorMsg('');
    setModalVisible(true);
    try {
      await Voice.start('en-US', {offline: true});
      startWaveformAnimation();
      setIsListening(true);
    } catch (error) {
      console.log('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      stopWaveformAnimation();
      setIsListening(false);
    } catch (error) {
      console.log('Error stopping voice recognition:', error);
    }
  };

  const startWaveformAnimation = () => {
    animValues.forEach((animValue, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 50, 
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 10, 
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
        {iterations: -1},
      ).start();
    });
  };

  const stopWaveformAnimation = () => {
    animValues.forEach(animValue => {
      animValue.stopAnimation();
      Animated.timing(animValue, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  const onRetryPress = () => {
    setSpeechErrorMsg('');
    startListening();
  };

  const onCancelPress = async () => {
    await Voice.cancel();
    stopListening();
    setModalVisible(!modalVisible);
  };


  return {
    modalLoading,
    onRetryPress,
    onCancelPress,
    modalVisible,
    speechErrorMsg,
    setModalVisible,
    animValues,
    isListening,
    startListening,
    stopListening,
    handleListening,
  };
};

export default useVoice;
