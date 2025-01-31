import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LocationSvg from '../assets/images/location.svg';
import { Colors } from '../utlis/Colors';
import GlobalIcon from '../utlis/GlobalIcon';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
      >
        <Circle
          center={region}
          radius={400}
          strokeColor="rgba(255, 102, 102, 0.5)"
          fillColor="rgba(255, 102, 102, 0.2)"
        />
        <Marker coordinate={region} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={[styles.markerContainer, { backgroundColor: Colors.whiteColor, borderRadius: 100 }]}>
            <GlobalIcon
              library="Ionicons"
              name="navigate-circle"
              size={40}
              color={Colors.redColor}
            />
          </View>
        </Marker>
      </MapView>

      <View style={styles.locationIcon}>
        <LocationSvg />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default MapScreen;
