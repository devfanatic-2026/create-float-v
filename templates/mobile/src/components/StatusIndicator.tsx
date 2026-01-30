import { View, Text, StyleSheet } from 'react-native';
import { useConnectionStore } from '../store/connection';
import { LiquidTokens } from '@float-v/lite';

export function StatusIndicator() {
    const { isOnline, socketStatus, isSyncing } = useConnectionStore();

    let statusColor = LiquidTokens.colors.error;
    let statusLabel = 'OFFLINE';

    if (socketStatus === 'connecting') {
        statusColor = LiquidTokens.colors.warning;
        statusLabel = 'CONNECTING';
    } else if (isOnline) {
        statusColor = LiquidTokens.colors.success;
        statusLabel = 'ONLINE';
    }

    return (
        <View style={styles.container}>
            <View style={styles.chip}>
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
                <Text style={styles.label}>
                    {statusLabel}
                </Text>
                {isSyncing && (
                    <View style={styles.syncBadge}>
                        <Text style={styles.syncText}>SYNCING</Text>
                    </View>
                )}
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.wsText}>
                {socketStatus.toUpperCase()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: LiquidTokens.spacing.md,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: '800',
        color: LiquidTokens.colors.textPrimary,
        letterSpacing: 0.5,
    },
    syncBadge: {
        marginLeft: 8,
        paddingHorizontal: 4,
        paddingVertical: 1,
        backgroundColor: LiquidTokens.colors.primary,
        borderRadius: 4,
    },
    syncText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'white',
    },
    wsText: {
        fontSize: 9,
        fontWeight: '700',
        color: LiquidTokens.colors.textTertiary,
        letterSpacing: 0.5,
    }
});
