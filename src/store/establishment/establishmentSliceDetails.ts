import { createSlice } from '@reduxjs/toolkit';
import { Alert, Platform, ToastAndroid } from 'react-native';

interface Contact {
    phone: string;
    email: string | null;
    website: string | null;
}
interface Address {
    full: string;
    line1: string;
    line2: string;
}
interface Image {
    id: number;
    url: string;
    is_main: boolean;
}
interface EstablishmentData {
    id: number;
    name: string;
    rating: number;
    total_reviews: number;
    address: Address;
    description: string | null;
    images: Image[];
    facilities: string[];
    contact: Contact;
    average_rating: number
}

interface EstablishmentState {
    isLoading: boolean;
    establishmentDetails: EstablishmentData | any;
    message: string | null;
}

const initialState: EstablishmentState = {
    isLoading: false,
    establishmentDetails: null,
    message: null,
};

const establishmentDetailSlice = createSlice({
    name: 'establishmentDetail',
    initialState,
    reducers: {
        setLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        saveEstablishmentDetails: (state, { payload }) => {
            state.establishmentDetails = payload?.data;
        },
        showMessage: (state, { payload }) => {
            state.message = payload;
            if (Platform.OS === 'android') {
                ToastAndroid.show(payload, ToastAndroid.SHORT);
            } else {
                Alert.alert('', payload);
            }
        },
    },
});

export const { setLoading, showMessage, saveEstablishmentDetails } = establishmentDetailSlice.actions;

export default establishmentDetailSlice.reducer;