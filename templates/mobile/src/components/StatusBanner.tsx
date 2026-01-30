'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useConnectionStore } from '../store/connection';

export const StatusBanner = () => {
    const { isOnline, socketStatus } = useConnectionStore();

    if (isOnline && socketStatus === 'connected') return null;

    return (
        <View style={[
            styles.banner,
            socketStatus === 'connecting' ? styles.connecting : styles.offline
        ]}>
            <Text style={styles.text}>
                {socketStatus === 'connecting'
                    ? '⚡ Reconnecting to Float-V Server...'
                    : '📡 Offline Mode - Using Local Data'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    offline: {
        backgroundColor: '#ef4444',
    },
    connecting: {
        backgroundColor: '#f59e0b',
    },
    text: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    }
});
