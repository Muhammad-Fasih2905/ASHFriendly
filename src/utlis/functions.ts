import axios from 'axios';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Share from 'react-native-share';
import { MapOptions } from '../interfaces/interfaces';
import { BASE_UNIVERSAL_URL } from '../services';

export const convert_data = (api_data: any) => {
  return (
    (api_data?.length > 0 ? api_data : []).map(
      (item: { id: number; name: string }) => {
        return {
          value: item.id.toString(),
          name: item.name,
          label: item.name,
        };
      },
    ) || []
  );
};

export const requestCameraAndGalleryPermissions = async () => {
  try {
    if (Platform.OS === 'ios') {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      if (cameraPermission !== RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return false;
      }

      const galleryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (galleryPermission !== RESULTS.GRANTED) {
        console.log('Gallery permission denied');
        return false;
      }
    } else if (Platform.OS === 'android') {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      const readStoragePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      if (
        cameraPermission !== PermissionsAndroid.RESULTS.GRANTED ||
        readStoragePermission !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera or gallery permission denied');
        return false;
      }
    }

    console.log('All permissions granted');
    return true;
  } catch (error) {
    console.error('Error requesting permissions', error);
    return false;
  }
};

export const requestAudioRecordPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Cool Photo App Camera Permission',
        message: 'Cool Recorder App needs access to your recorder ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('audio permission granted');
      return true;
    } else {
      console.log('audio permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};

export const getLocationAddress = async (
  latitude: number,
  longitude: number,
  apiKey: string,
  radius: number = 100,
): Promise<string> => {
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  try {
    const response = await axios.get(url, {
      params: {
        location: `${latitude},${longitude}`,
        radius,
        key: apiKey,
      },
    });

    const results = response.data.results;

    if (results.length > 0) {
      console.log('results', results);
      const place = results[0];
      const vicinity = place.vicinity || '';
      console.log('vicinity:', vicinity);
      return place.name || 'Unknown Place';
    } else {
      console.warn('No places found.');
      return 'No places found.';
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw new Error(
      'Failed to fetch location details. Please try again later.',
    );
  }
};

interface GeocodingResult {
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  place_id: string;
}

interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export const getAccurateLocationAddress = async (
  latitude: number,
  longitude: number,
  apiKey: string,
): Promise<
  string> => {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json';

  try {
    const response = await axios.get<GeocodingResponse>(url, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: apiKey,
        result_type: 'street_address|route|establishment',
        language: 'en',
      },
    });

    if (response.data.status !== 'OK' || response.data.results.length === 0) {
      throw new Error('No address found for these coordinates');
    }

    const result = response.data.results[0];
    const addressComponents = result.address_components;
    return result.formatted_address || 'Unknown Place';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch location details: ${error.response?.data?.error_message || error.message
        }`,
      );
    }
    throw error;
  }
};

export const openGoogleMaps = async ({
  origin,
  destination,
  travelMode,
  waypoints = [],
  avoid = [],
}: MapOptions): Promise<void> => {
  if (
    !origin?.latitude ||
    !origin?.longitude ||
    !destination?.latitude ||
    !destination?.longitude
  ) {
    Alert.alert('Error', 'Invalid coordinates provided');
    return;
  }
  const originString = `${origin.latitude},${origin.longitude}`;
  const destinationString = `${destination.latitude},${destination.longitude}`;
  const waypointsString = waypoints
    .map(point => `${point.latitude},${point.longitude}`)
    .join('|');
  let url: string;

  if (Platform.OS === 'ios') {
    url = `comgooglemaps://?saddr=${encodeURIComponent(
      originString,
    )}&daddr=${encodeURIComponent(
      destinationString,
    )}&directionsmode=${travelMode}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&origin=${originString}&destination=${destinationString}&travelmode=${travelMode}`;
  }

  try {
    if (Platform.OS === 'ios') {
      const isGoogleMapsInstalled = await Linking.canOpenURL(
        'comgooglemaps://',
      );
      if (!isGoogleMapsInstalled) {
        url = `https://www.google.com/maps/dir/?api=1&origin=${originString}&destination=${destinationString}&travelmode=${travelMode}`;
      }
    }
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${originString}&destination=${destinationString}&travelmode=${travelMode}`;
      const canOpenWeb = await Linking.canOpenURL(webUrl);

      if (canOpenWeb) {
        await Linking.openURL(webUrl);
      } else {
        Alert.alert(
          'Error',
          'Unable to open maps. Please make sure you have a web browser installed.',
        );
      }
    }
  } catch (error) {
    console.error('Error opening maps:', error);
    Alert.alert(
      'Error',
      'An error occurred while trying to open maps. Please try again.',
    );
  }
};

export const requestLocationPermission = async () => {
  let result = await check(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  );
  if (result === RESULTS.DENIED) {
    result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
  }
  return result === RESULTS.GRANTED;
};

export const formatDistance = (distance: string): string => {
  const numericValue = parseFloat(distance?.replace(/[^\d.]/g, ''));
  const unit = distance?.match(/[a-zA-Z]+/)?.[0] || '';

  if (numericValue >= 1000) {
    const shortenedValue = (numericValue / 1000).toFixed(1).replace(/\.0$/, '');
    return `${shortenedValue}K ${unit}`.trim();
  }

  return `${numericValue} ${unit}`.trim();
};

export const sharePost = async (
  currentPostId: string | null,
  name: string | null,
  mediaUrl?: string,
  mimeType?: any,
  setScreenLoading: any
) => {
  setScreenLoading(true);
  const defaultImageUrl =
    'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_640.jpg';
  const media = mediaUrl === '' ? defaultImageUrl : mediaUrl;

  const shareOptions: any = {
    message: `Check out my post here : ${BASE_UNIVERSAL_URL}${name?.replace(
      ' ',
      '',
    )}/${currentPostId}`,
    type: mimeType,
  };
  console.log(shareOptions);

  try {
    const extension = mimeType.split('/')[1];
    const localFile = `${RNFS.CachesDirectoryPath}/temp_media.${extension}`;
    await RNFS.downloadFile({
      fromUrl: media,
      toFile: localFile,
    }).promise;

    if (Platform.OS === 'ios') {
      if (mimeType.startsWith('image/')) {
        const base64Data = await RNFS.readFile(localFile, 'base64');
        shareOptions.url = `data:${mimeType};base64,${base64Data}`;
      } else {
        shareOptions.url = media;
      }
    } else {
      shareOptions.url = `file://${localFile}`;
    }

    await Share.open(shareOptions);
    setScreenLoading(false);
    try {
      const exists = await RNFS.exists(localFile);
      if (exists) {
        await RNFS.unlink(localFile);
      }
    } catch (cleanupError) {
      console.log('Cleanup error:', cleanupError);
    }
  } catch (error) {
    console.log('Sharing error:', error);
    setScreenLoading(false);
    throw new Error(`Failed to share media: ${error}`);
  }
};

export const capitalizeFirstLetter = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
