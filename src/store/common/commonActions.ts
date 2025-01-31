import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export const getImage = createAsyncThunk(
  'get-image',
  async (type: string, {dispatch}) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    try {
      let req: ImagePickerResponse;
      if (type === 'camera') {
        req = await launchCamera(options);
      } else {
        req = await launchImageLibrary(options);
      }
      if (req && !req.didCancel) {
        const files = req.assets;
        if (files && files.length > 0) {
          const file = files[0];
          return {
            uri: file.uri,
            type: file.type,
            name: file.fileName,
          };
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  },
);
