import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Alert } from 'react-native';
export const BASE_URL = 'https://ashfriendly.letsgetwebdesign.com/api/';
export const BASE_UNIVERSAL_URL = 'https://ashfriendly.letsgetwebdesign.com/';

interface props {
    path: string;
    isForm?: boolean;
    method?: string;
    url?: any;
    body?: any;
    token?: any;
    params?: any;
}

const apiCall = async ({
    path,
    method = 'GET',
    isForm,
    url = null,
    body = null,
    token = null,
    params = null,
}: props) => {
    let urlString = BASE_URL + path;
    let headers: any = {
        ...(isForm
            ? { 'Content-Type': 'multipart/form-data' }
            : {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        'x-api-key': 'VV0NE815rTCr7pavFVbjsggD67FsKl5g',
    };
    let options: any = {
        method,
    };
    if (token) headers['authorization'] = 'Bearer ' + token;
    options.headers = headers;
    if (body) options.data = body;
    console.log('path   : ', path);
    if (params) options.params = params;
    if (url) urlString = url;
    options.url = urlString;

    try {
        const response = await axios(options);

        if (response.data?.status_code === 401) {
            console.log(path, "path");

            console.log('status code 401 error');
        }
        const networkState = await NetInfo.fetch();

        if (networkState.isConnected === false) {
            Alert.alert('', 'No Internet Connection');
        }
        return response.data;
    } catch (error) {
        console.log('error: ', error);
        const networkState = await NetInfo.fetch();

        if (networkState.isConnected === false) {
            Alert.alert('', 'No Internet Connection');
        }

        throw error;
    }
};

export default apiCall;
