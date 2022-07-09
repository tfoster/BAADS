import * as Speech from 'expo-speech';
import {useGlobalContext} from '../GlobalContext';
import { VoiceControlContext } from '../VoiceControlContext';

export default function VoiceControlContextProvider({children}) {
    const { useVoiceControl } = useGlobalContext();
    const speak = (message: string) => {
        if (!useVoiceControl) {
            return;
        }

        Speech.speak(message);
    };

    const listen = (terms: string[]) => {
        if (!useVoiceControl) {
            return false;
        }

        return true;
    }

    return (
        <VoiceControlContext.Provider value={{speak, listen}}>
            {children}
        </VoiceControlContext.Provider>
    );
}
