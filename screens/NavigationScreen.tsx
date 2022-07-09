import {createRef, Fragment, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import { Icon } from '@rneui/base';

import MapView, {Marker, Polygon} from 'react-native-maps';
import {useNavigationContext} from '../GeospatialNavigationContext';
import {RootTabScreenProps} from '../types';

import locations from '../locations.json';
import strings from '../strings.json';
import {useVoiceControlContext} from '../VoiceControlContext';

const DEFAULT_MAP_CONTEXT = 'south_beach_harbor';
export default function NavigationScreen({ navigation }: RootTabScreenProps<'Navigation'>) {
  const { speak } = useVoiceControlContext();
  const { location } = useNavigationContext();
  const [showPolygons, setShowPolygons] = useState(false);
  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [mapContext, setMapContext] = useState([DEFAULT_MAP_CONTEXT]);
  const [sublocations, setSublocations] = useState([]);
  const mapViewRef = createRef<MapView>();

  useEffect(() => {
    function walkSublocations(locs, ctx, depth) {
      if (depth >= ctx.length) {
        return [];
      }

      let results = [];
      let loc = locs[ctx[depth]];
      if (loc._sublocations) {
        results = results.concat(Object.entries(loc._sublocations).map(([key, v]) => ({...v, key})));
        results = results.concat(walkSublocations(locs, ctx, depth + 1));
      } else {
        results.push({...loc});
      }
      return results;
    }
    setSublocations(walkSublocations(locations, mapContext, 0));
  }, [mapContext, locations]);

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
          sublocations && sublocations
              .filter(l => !l.nonvisible)
              .map(l => (
                  <Fragment key={l.key}>
                    <Marker key={`${l.key}_marker`} coordinate={l}
                            title={strings.locations[l.key].name}
                            onPress={onMarkerPress.bind(null, l.key, l)}>
                      <Icon name={l.icon?.name || 'close'}
                            type={l.icon?.family || 'material-community'}
                            color={l.icon?.color || 'darkgray'}/>
                    </Marker>
                    {showPolygons && l.polygon && (<Polygon key={`${l.key}_polygon`} coordinates={l.polygon} />)}
                  </Fragment>
              ))
        }
        { location ? (
            <Marker coordinate={location?.coords ?? region}>
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
