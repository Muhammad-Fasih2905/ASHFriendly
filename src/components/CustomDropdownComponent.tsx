import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { CustomDropdownProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  placeholder,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleDropdown = () => {
    setModalVisible(!modalVisible);
  };

  const onItemPress = (item: string) => {
    setSelectedItem(item);
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View>
      <Pressable style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedItem && styles.placeholderText,
          ]}>
          {selectedItem || placeholder}
        </Text>
        <GlobalIcon
          library="Ionicons"
          name={modalVisible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={Colors.greyColor}
        />
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              renderItem={({item}) => (
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => onItemPress(item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </Pressable>
              )}
              keyExtractor={item => item}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    height: verticalScale(45),
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: moderateScale(10),
  },
  dropdownButtonText: {
    fontSize: moderateScale(14),
    // fontFamily: Fonts.InterRegular,
    color: Colors.blackColor,
  },
  placeholderText: {
    color: Colors.greyColor,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownList: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
    maxHeight: verticalScale(300),
  },
  dropdownItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyColor,
  },
  dropdownItemText: {
    fontSize: moderateScale(14),
    // fontFamily: Fonts.InterRegular,
    color: Colors.greyColor,
  },
});

export default CustomDropdown;
