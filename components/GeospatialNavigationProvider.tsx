import {
    getCurrentPositionAsync,
    LocationAccuracy,
    LocationObject, watchPositionAsync,
} from 'expo-location';
import {useEffect, useState} from 'react';
import {useGlobalContext} from '../GlobalContext';

import { GeospatialNavigationContext } from '../GeospatialNavigationContext';

export default function GeospatialNavigationProvider({children}) {
    const [location, setLocation] = useState<LocationObject>(null);
    const { useNavigation } = useGlobalContext();

    useEffect(() => {
        (async () => {
            if (useNavigation) {
                await watchPositionAsync({accuracy: LocationAccuracy.Highest}, (location) => {
                    setLocation(location);
                });
            }
        })();
    }, [useNavigation]);

    return (
        <GeospatialNavigationContext.Provider value={{location}}>
            {children}
        </GeospatialNavigationContext.Provider>
    );
}
