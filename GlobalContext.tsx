import {createContext, useContext} from 'react';

export interface IGlobalContext {
    navigate?: (name: string, params?: any) => void;
    useVoiceControl?: boolean;
    setUseVoiceControl?: (value: boolean) => void;
    useNavigation?: boolean;
    setUseNavigation?: (value: boolean) => void;
    useBackgroundNavigation?: boolean;
    setUseBackgroundNavigation?: (value: boolean) => void;
    errorMessage?: string;
    setErrorMessage?: (message: string) => void;
    setupCompleted?: boolean;
    setSetupCompleted?: (value: boolean) => void;
}

export const GlobalContext = createContext<IGlobalContext>({});

export const useGlobalContext = () => useContext(GlobalContext);
