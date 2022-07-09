import {useGlobalContext} from '../GlobalContext';

import {RootStackScreenProps} from '../types';
import AutoActivationConfirmationScreen from './AutoActivationConfirmationScreen';
import NavigationConfirmationScreen from './NavigationConfirmationScreen';
import VoiceConfirmationScreen from './VoiceConfirmationScreen';

export default function SetupScreen({ navigation }: RootStackScreenProps<'Setup'>) {
  const { useVoiceControl, useNavigation, useBackgroundNavigation, setSetupCompleted} = useGlobalContext();

  let screen = null;
  if (useVoiceControl === undefined) {
    screen = <VoiceConfirmationScreen />;
  } else if (useNavigation === undefined) {
    screen = <NavigationConfirmationScreen/>;
  } else if (useBackgroundNavigation === undefined) {
    screen = <AutoActivationConfirmationScreen />;
  } else {
    setSetupCompleted(true);
    navigation.navigate('Root');
  }

  return (screen);
}
