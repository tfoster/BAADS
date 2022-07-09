import {Button} from '@rneui/themed';
import {requestBackgroundPermissionsAsync} from 'expo-location';
import {useEffect} from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import {useGlobalContext} from '../GlobalContext';
import {useVoiceControlContext} from '../VoiceControlContext';

export default function AutoActivationConfirmationScreen() {
    const { useVoiceControl, setErrorMessage, setUseBackgroundNavigation } = useGlobalContext();
    const { speak } = useVoiceControlContext();

    const onYes = () => {
        (async () => {
            const permissions = await requestBackgroundPermissionsAsync();

            if (permissions.status !== 'granted') {
                speak('You must allow access to your location for theses feature to work.');
                setErrorMessage('You must allow access to your location for theses feature to work.');
                return;
            }

            speak('Great! I will automatically open when you arrive at South Beach Harbor in the future.');
            setUseBackgroundNavigation(true);
        })();
    };
    const onNo = () => {
        speak('I will not automatically open.');
        setUseBackgroundNavigation(false);
    };

    useEffect(() => {
        speak('Would you like this application to automatically open when you arrive at South Beach Harbor? Yes, or No?');
    });

    return (
        <View style={styles.container}>
            <Text style={styles.question}>Would you like this application to automatically open when you arrive?</Text>
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
