import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomSheetBackdropProps, BottomSheetModal} from '@gorhom/bottom-sheet';
import {heightPercentageToDP} from 'react-native-responsive-screen';

interface AppBottomSheetProps {
  bottomSheetModalRef?: React.MutableRefObject<BottomSheetModal | null>;
  snapPoints?: string[];
  backdropComponent?: React.FC<BottomSheetBackdropProps>;
  handleSheetChanges?: (index: number) => void;
  children?: React.ReactNode;
  horizontalPadding?: number;
  onDismiss?: () => void;
}

const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  bottomSheetModalRef,
  snapPoints,
  backdropComponent,
  handleSheetChanges,
  children,
  horizontalPadding = heightPercentageToDP(2),
  onDismiss,
}) => {
  return (
    <BottomSheetModal
      enableContentPanningGesture={false}
      backdropComponent={backdropComponent}
      ref={bottomSheetModalRef}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      index={0}
      onDismiss={onDismiss}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View
        style={[
          styles.contentContainer,
          {paddingHorizontal: horizontalPadding},
        ]}>
        {children}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    // flex: 1,
  },
});

export default AppBottomSheet;
