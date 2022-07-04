import { Subscription } from 'expo-modules-core';
import Device from 'expo-device';
import {
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    AndroidImportance,
    getExpoPushTokenAsync,
    getPermissionsAsync,
    Notification as InternalNotification,
    NotificationResponse,
    removeNotificationSubscription,
    requestPermissionsAsync,
    setNotificationChannelAsync,
    setNotificationHandler
} from 'expo-notifications';

import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';

const registerForPushNotificationsAsync = async () => {
    const token = (await getExpoPushTokenAsync())?.data;

    if (Device.isDevice) {
        const { status: existingStatus } = await getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null;
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await setNotificationChannelAsync('default', {
            name: 'default',
            importance: AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
};

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
});

export default function Notification() {
    const [expoPushToken, setExpoPushToken] = useState<string>();
    const [notification, setNotification] = useState<InternalNotification>();
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            setExpoPushToken(token)
        );

        notificationListener.current =
            addNotificationReceivedListener((notification: InternalNotification) => {
                setNotification(notification);
            });

        responseListener.current =
            addNotificationResponseReceivedListener((response: NotificationResponse) => {
                console.log(response);
            });

        return () => {
            removeNotificationSubscription(notificationListener.current!);
            removeNotificationSubscription(responseListener.current!);
        };
    }, []);

    return null;
}
