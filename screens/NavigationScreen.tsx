import {createRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import { Icon } from '@rneui/base';

import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useNavigationContext} from '../GeospatialNavigationContext';
import {useGlobalContext} from '../GlobalContext';
import {RootTabScreenProps} from '../types';

import locations from '../locations.json';
import strings from '../strings.json';
import {useVoiceControlContext} from '../VoiceControlContext';

const DEFAULT_MAP_CONTEXT = 'south_beach_harbor';
export default function NavigationScreen({ navigation }: RootTabScreenProps<'Navigation'>) {
  const { speak } = useVoiceControlContext();
  const { location } = useNavigationContext();
  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [mapContext, setMapContext] = useState([DEFAULT_MAP_CONTEXT, locations[DEFAULT_MAP_CONTEXT]]);
  const mapViewRef = createRef<MapView>();

  const mapContextKey = mapContext[0];
  const sublocations = mapContext[1]['_sublocations'];

  const [region, setRegion] = useState({
    latitude: location?.coords.latitude || 37.78015223385197,
    longitude: location?.coords.longitude || -122.38790713099024,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  function onMarkerPress(key, location) {
    const {latitude, longitude} = location;
    setDestination({latitude, longitude});
    speak(`Requesting directions to ${strings.locations[key].name}.`);
  }

  return (
    <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={region => setRegion(region)}
    >
      {
        sublocations && Object.entries(sublocations)
            .filter(([k, l]) => !k.startsWith('_'))
            .map(([k, l]) => (
                <Marker key={k} coordinate={l}
                        title={strings.locations[k].name}
                        onPress={onMarkerPress.bind(null, k, l)}>
                  <Icon name={l.icon?.name || 'close'}
                        type={l.icon?.family || 'material-community'}
                        color={l.icon?.color || 'darkgray'}/>
                </Marker>
            ))
      }
      { location ? (<Marker coordinate={location?.coords ?? region}>
        <Icon name="pirate" type="material-community" color="red" />
      </Marker>) : undefined }
      {destination ? <MapViewDirections mode={'WALKING'} precision={'high'}
                                        strokeWidth={2}
                                        strokeColor="blue"
                                        ref={mapViewRef}
                                        origin={location?.coords ?? region}
                                        destination={destination ?? region}
                                        apikey={'AIzaSyCIzxC2Czk1hW7nUuUG49yJ9TQllNQ4w6U'}
      /> : null }
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  }
});
