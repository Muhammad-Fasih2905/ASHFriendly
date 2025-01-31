import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface props {
  visiable: boolean;
  mode: 'date' | 'time';
  confirm: (e: any) => void;
  cancel: () => void;
}
const DatePicker = ({ visiable, confirm, mode, cancel }: props) => {
  const date = new Date();
  function subtractYears(date, years) {
    date.setFullYear(date.getFullYear() - years);
    return date;
  }
  return (
    <DateTimePickerModal
      isVisible={visiable}
      mode={mode}
      onConfirm={confirm}
      onCancel={cancel}
      modalPropsIOS
      confirmTextIOS={'confirm'}
      cancelTextIOS={'cancel'}
      maximumDate={new Date()}
      date={subtractYears(date, 18)}
    />
  );
};

export default DatePicker;
