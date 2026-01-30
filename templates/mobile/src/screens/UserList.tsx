import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { api } from '../services/api';
import { User } from '../services/local-db';
import { navigationActions } from '../store/navigation';
import { useConnectionStore } from '../store/connection';
import { useState, useEffect } from 'react';
import { LiquidTokens, LiquidCard } from '@float-v/lite';

export default function UserList() {
    const { navigate, goHome } = navigationActions;
    const { isOnline } = useConnectionStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.users.getAll();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isOnline]);

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('UserForm', { id: item.id })}
        >
            <LiquidCard
                variant={item.id < 0 ? 'glass' : 'surface'}
                style={[styles.userCard, item.id < 0 && styles.pendingCard]}
            >
                <View style={styles.userInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.role}</Text>
                        </View>
                    </View>
                    <View style={styles.statusContainer}>
                        <View style={[
                            styles.statusDot,
                            { backgroundColor: item.status === 'online' ? LiquidTokens.colors.success : item.status === 'away' ? LiquidTokens.colors.warning : '#ccc' }
                        ]} />
                        {item.id < 0 && <Text style={styles.pendingText}>SYNCING</Text>}
                    </View>
                </View>
            </LiquidCard>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Users</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigate('UserForm', {})}
                >
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={LiquidTokens.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadData}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LiquidTokens.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: LiquidTokens.spacing.md,
        paddingVertical: LiquidTokens.spacing.md,
    },
    backText: {
        color: LiquidTokens.colors.primary,
        fontSize: 17,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: LiquidTokens.colors.textPrimary,
        letterSpacing: -0.4,
    },
    addButton: {
        backgroundColor: LiquidTokens.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 18,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: LiquidTokens.spacing.md,
        paddingBottom: 40,
    },
    userCard: {
        marginBottom: LiquidTokens.spacing.sm,
        padding: LiquidTokens.spacing.md,
    },
    pendingCard: {
        borderColor: LiquidTokens.colors.warning,
        borderWidth: 0.5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: LiquidTokens.colors.textPrimary,
    },
    details: {
        flex: 1,
        marginLeft: LiquidTokens.spacing.md,
    },
    userName: {
        fontSize: 17,
        fontWeight: '600',
        color: LiquidTokens.colors.textPrimary,
    },
    userEmail: {
        fontSize: 14,
        color: LiquidTokens.colors.textSecondary,
        marginTop: 1,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.04)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: LiquidTokens.colors.textSecondary,
        textTransform: 'uppercase',
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    pendingText: {
        fontSize: 9,
        fontWeight: '800',
        color: LiquidTokens.colors.warning,
        marginTop: 4,
    }
});
