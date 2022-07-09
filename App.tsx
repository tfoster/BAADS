import { StatusBar } from 'expo-status-bar';
import {AppRegistry} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GeospatialNavigationProvider from './components/GeospatialNavigationProvider';
import GlobalContextProvider, {navigationRef} from './components/GlobalContextProvider';
import VoiceControlContextProvider from './components/VoiceControlContextProvider';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import appInfo from './app.json';

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <GlobalContextProvider>
                    <VoiceControlContextProvider>
                        <GeospatialNavigationProvider>
                            <Navigation colorScheme={colorScheme} ref={navigationRef} />
                            <StatusBar />
                        </GeospatialNavigationProvider>
                    </VoiceControlContextProvider>
                </GlobalContextProvider>
            </SafeAreaProvider>
        );
    }
}

AppRegistry.registerComponent(appInfo.expo.name, () => App);
