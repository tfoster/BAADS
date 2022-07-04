import { StyleSheet } from 'react-native';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function ScheduleScreen({ navigation }: RootTabScreenProps<'Schedule'>) {
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
