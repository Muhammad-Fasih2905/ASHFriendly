import Geocoder from 'react-native-geocoding';
export const initializeGeocoder = () => {
    Geocoder.init('AIzaSyDbOfusA5U9qee5ZPfNOTO82OH3an23m0g');
};

export const getAddressFromCoordinates = async (latitude: any, longitude: any) => {
    try {
        const response = await Geocoder.from(latitude, longitude);
        const addressComponents = response.results[0]?.address_components;
        let address = "";
        addressComponents.forEach(element => {
            address = address + " " + element.long_name;
        });
        const city = addressComponents?.find(component => component.types.includes('locality'))?.long_name;
        const country = addressComponents?.find(component => component.types.includes('country'))?.long_name;
        const shortAddress = `${city}, ${country}`;
        return address || shortAddress;
    } catch (error) {
        console.error('Error in Geocoding:', error);
        return 'Address not found';
    }
};
