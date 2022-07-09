import {Button} from '@rneui/themed';
import {requestForegroundPermissionsAsync} from 'expo-location';
import {useEffect} from 'react';
import { StyleSheet} from 'react-native';

import { Text, View } from '../components/Themed';
import {useGlobalContext} from '../GlobalContext';
import {useVoiceControlContext} from '../VoiceControlContext';

export default function NavigationConfirmationScreen() {
    const { useVoiceControl, setErrorMessage, setUseNavigation, setUseBackgroundNavigation } = useGlobalContext();
    const { speak } = useVoiceControlContext();

    const onYes = () => {
        (async () => {
            const permissions = await requestForegroundPermissionsAsync();
            if (permissions.status !== 'granted') {
                const message = 'You must allow access to your location for theses feature to work.';
                speak(message);
                setErrorMessage(message);
                return;
            }

            speak('Great! I have activated the Navigation features.');
            setUseNavigation(true);
        })();
    };
    const onNo = () => {
        speak('The navigation features will be deactivated. You can reactivate them in your settings.');
        setUseNavigation(false);
        setUseBackgroundNavigation(false);
    };

    useEffect(() => {
        if (useVoiceControl) {
            speak('Would you like to use the navigation features? Yes, or No?');
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.question}>Would you like to use the navigation features?</Text>
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
