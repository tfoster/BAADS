import {Component, useEffect, useState} from 'react';
import {useGlobalContext} from '../GlobalContext';

import {RootStackScreenProps} from '../types';
import AutoActivationConfirmationScreen from './AutoActivationConfirmationScreen';
import NavigationConfirmationScreen from './NavigationConfirmationScreen';
import VoiceConfirmationScreen from './VoiceConfirmationScreen';

export default function SetupScreen({ navigation }: RootStackScreenProps<'Setup'>) {
  const { useVoiceControl, useNavigation, useBackgroundNavigation, setSetupCompleted} = useGlobalContext();
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    if (useVoiceControl === undefined) {
      setScreen(<VoiceConfirmationScreen/>);
    } else if (useNavigation === undefined) {
      setScreen(<NavigationConfirmationScreen/>);
    } else if (useBackgroundNavigation === undefined) {
      setScreen(<AutoActivationConfirmationScreen/>);
    } else {
      setSetupCompleted(true);
      navigation.navigate('Root');
    }
  }, [useVoiceControl, useNavigation, useBackgroundNavigation, setSetupCompleted]);

  return (screen);
}
