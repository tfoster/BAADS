import { StyleSheet } from 'react-native';

import { View } from '../components/Themed';
import {useGlobalContext} from '../GlobalContext';
import { RootTabScreenProps } from '../types';

export default function ScheduleScreen({ navigation }: RootTabScreenProps<'Schedule'>) {
  const { setupCompleted } = useGlobalContext();

  if (!setupCompleted) {
    navigation.navigate('Setup');
  }

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
