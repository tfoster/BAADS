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

const DEFAULT_MAP_CONTEXT = 'south_beach_harbor';
export default function NavigationScreen({ navigation }: RootTabScreenProps<'Navigation'>) {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<LocationObject>(null);
  const [mapContext, setMapContext] = useState([DEFAULT_MAP_CONTEXT, locations[DEFAULT_MAP_CONTEXT]]);

  const mapContextKey = mapContext[0];
  const sublocations = mapContext[1]['_sublocations'];
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
      { sublocations && Object.entries(sublocations)
          .filter(([k, l]) => !k.startsWith('_'))
          .map(([k, l]) => ((<Marker key={k} coordinate={l} title={strings.locations[k].name}>
            <Icon name={l.icon?.name || 'close'} type={l.icon?.family || 'material-community'} color={l.icon?.color || 'darkgray'}/>
          </Marker>)))
      }
      { location ? (<Marker coordinate={location?.coords ?? region}>
        <Icon name="pirate" type="material-community" color="red" />
      </Marker>) : undefined }
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  }
});
