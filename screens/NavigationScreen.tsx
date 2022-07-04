import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  requestBackgroundPermissionsAsync, requestForegroundPermissionsAsync
} from 'expo-location';

import {useEffect, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import { Icon } from '@rneui/base';

/* @hide */
import Device from 'expo-device';
/* @end */

import MapView, {Marker} from 'react-native-maps';
import {RootTabScreenProps} from '../types';

import locations from '../locations.json';
import strings from '../strings.json';

function flattenLocations(key, location) {
  const cloned = Object.assign({}, location);
  delete cloned.sublocations;
  cloned.key = key;

  let results = [cloned];
  if (location.sublocations) {
    results = results
        .concat(Object.entries(location.sublocations).reduce((a, [k, l]) => a.concat(flattenLocations(k, l)), []));
  }
  return results;
}

const flattenedLocations = Object.entries(locations).reduce((a, [k, l]) => a.concat(flattenLocations(k, l)), []);

export default function NavigationScreen({ navigation }: RootTabScreenProps<'Navigation'>) {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<LocationObject>(null);
  const [mapContext, setMapContext] = useState();
  const [region, setRegion] = useState({
    latitude: 37.78015223385197,
    longitude:  -122.38790713099024,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      /* @hide */
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
            'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      /* @end */
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await getCurrentPositionAsync({ accuracy: LocationAccuracy.Highest });
      setLocation(location);
    })();
  }, []);

  return (
    <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={region => setRegion(region)}
    >
      {flattenedLocations
          .filter(l => l.contexts?.contains(mapContext) || !mapContext && !l.contexts)
          .map((l => (<Marker key={l.key} coordinate={l} title={strings.locations[l.key].name}>
            <Icon name={l.icon || 'close'} type={l.icon_family || 'material-community'}/>
          </Marker>)))}
      { location ? <Marker coordinate={location?.coords ?? region} /> : undefined }
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  }
});
