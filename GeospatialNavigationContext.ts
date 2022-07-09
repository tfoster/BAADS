import {LocationObject} from 'expo-location';
import {createContext, useContext} from 'react';

export interface INavigationContext {
    location?: LocationObject
}

export const GeospatialNavigationContext = createContext<INavigationContext>({});

export const useNavigationContext = () => useContext(GeospatialNavigationContext);
