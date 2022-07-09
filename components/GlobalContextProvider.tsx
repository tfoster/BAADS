import {createNavigationContainerRef} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Settings} from 'react-native';
import {GlobalContext} from '../GlobalContext';

const SETUP_COMPLETED_KEY = 'setupCompleted';
const USE_VOICE_CONTROL_KEY = 'USE_VOICE_CONTROL';
const USE_NAVIGATION_KEY = 'USE_NAVIGATION';
const USE_BACKGROUND_NAVIGATION_KEY = 'USE_VOICE_CONTROL';

export const navigationRef = createNavigationContainerRef();

export default function GlobalContextProvider({children}) {
    const [useVoiceControl, setUseVoiceControl] = useState<boolean>(Settings.get(USE_VOICE_CONTROL_KEY));
    const [useNavigation, setUseNavigation] = useState<boolean>(Settings.get(USE_NAVIGATION_KEY));
    const [
        useBackgroundNavigation,
        setUseBackgroundNavigation] = useState<boolean>(Settings.get(USE_BACKGROUND_NAVIGATION_KEY));
    const [setupCompleted, setSetupCompleted] = useState<boolean>(Settings.get(SETUP_COMPLETED_KEY));
    const [errorMessage, setErrorMessage] = useState<string>();
    const queuedNavigation = [];
    let pollingId;

    const navigate = (name: string, params?: any) => {
        if(!navigationRef.current) {
            queuedNavigation.push({name, params});
            if (!pollingId) {
                pollingId = setInterval(() => {
                    if (navigationRef.current) {
                        clearInterval(pollingId);
                        pollingId = undefined;
                        queuedNavigation.forEach(({name, params}) => navigationRef.current?.navigate(name, params));
                        queuedNavigation.length = 0;
                    }
                }, 100);
            }
            return;
        }

        navigationRef.current?.navigate(name, params);
    };

    useEffect(() => {
        Settings.watchKeys([USE_VOICE_CONTROL_KEY, USE_NAVIGATION_KEY, USE_BACKGROUND_NAVIGATION_KEY], () => {
            debugger;
            setUseVoiceControl(Settings.get(USE_VOICE_CONTROL_KEY));
            setUseNavigation(Settings.get(USE_NAVIGATION_KEY));
            setUseBackgroundNavigation(Settings.get(USE_BACKGROUND_NAVIGATION_KEY));
            setSetupComplete(Settings.get(SETUP_COMPLETED_KEY));
        });
    }, []);

    return (
        <GlobalContext.Provider value={{
            navigate,
            setupCompleted,
            setSetupCompleted,
            useVoiceControl,
            setUseVoiceControl,
            useNavigation,
            setUseNavigation,
            useBackgroundNavigation,
            setUseBackgroundNavigation,
            errorMessage,
            setErrorMessage
        }}>
            {children}
        </GlobalContext.Provider>
    );
}
