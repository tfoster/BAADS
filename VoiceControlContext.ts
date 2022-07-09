import {createContext, useContext} from 'react';

export interface IVoiceControlContext {
    speak?: (message: string) => void;
    listen?: (terms: string[]) => void;
}

export const VoiceControlContext = createContext<IVoiceControlContext>({});

export const useVoiceControlContext = () => useContext(VoiceControlContext);
