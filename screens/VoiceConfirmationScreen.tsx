import {Button} from '@rneui/themed';
import {StyleSheet} from 'react-native';

import { Text, View } from '../components/Themed';
import {useGlobalContext} from '../GlobalContext';
import {useVoiceControlContext} from '../VoiceControlContext';

export default function VoiceConfirmationScreen() {
    const { setUseVoiceControl } = useGlobalContext();
    const { speak } = useVoiceControlContext();

    const onYes = () => {
        speak('Great! I will use voice control.');
        setUseVoiceControl(true);
    };

    const onNo = () => {
        setUseVoiceControl(false);
    };

    speak('Would you like to use voice control? Yes, or No?');

    return (
        <View style={styles.container}>
            <Text style={styles.question}>Would you like to use voice control?</Text>
            <View style={styles.buttonContainer}>
                <Button title="Yes" onPress={onYes} />
                <Button title="No" onPress={onNo} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    question: {

    },
    buttonContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    }
});
