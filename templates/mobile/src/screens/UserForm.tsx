import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { useFloatForm, LiquidTokens, LiquidCard } from '@float-v/lite';
import { api } from '../services/api';
import { navigationActions, useNavigationStore } from '../store/navigation';
import { useEffect, useState } from 'react';

export default function UserForm() {
    const { params } = useNavigationStore();
    const { goHome, goBack } = navigationActions;
    const isEdit = !!params.id;
    const [loading, setLoading] = useState(false);

    const form = useFloatForm({
        initialValues: {
            name: '',
            email: '',
            role: 'user',
            status: 'offline'
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (isEdit) {
                    await api.users.update(params.id, {
                        ...values,
                        role: values.role as any,
                        status: values.status as any
                    });
                    Alert.alert('Success', 'User updated successfully');
                } else {
                    await api.users.create({
                        ...values,
                        role: values.role as any,
                        status: values.status as any,
                        avatar: `https://i.pravatar.cc/150?u=${values.email}`, // Dummy avatar
                        createdAt: new Date().toISOString()
                    });
                    Alert.alert('Success', 'User created successfully');
                }
                goBack();
            } catch (e) {
                Alert.alert('Error', 'Failed to save user');
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        if (isEdit) {
            loadUser();
        }
    }, [isEdit]);

    const loadUser = async () => {
        setLoading(true);
        try {
            const user = await api.users.getById(params.id);
            if (user) {
                form.reset(user);
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to load user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} activeOpacity={0.7}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEdit ? 'Edit User' : 'New User'}
                </Text>
                <TouchableOpacity onPress={() => form.handleSubmit()} disabled={loading} activeOpacity={0.7}>
                    <Text style={[styles.saveText, loading && styles.disabledText]}>
                        {loading ? '...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput
                    style={styles.input}
                    value={form.values.name}
                    onChangeText={(text) => form.setValue('name', text)}
                    placeholder="Enter full name"
                    placeholderTextColor={LiquidTokens.colors.textTertiary}
                />

                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                    style={styles.input}
                    value={form.values.email}
                    onChangeText={(text) => form.setValue('email', text)}
                    placeholder="name@example.com"
                    placeholderTextColor={LiquidTokens.colors.textTertiary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>ACCESS ROLE</Text>
                <View style={styles.roleGrid}>
                    {['user', 'admin', 'moderator'].map((role) => (
                        <TouchableOpacity
                            key={role}
                            activeOpacity={0.8}
                            onPress={() => form.setValue('role', role)}
                            style={[
                                styles.roleButton,
                                form.values.role === role && styles.roleButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.roleButtonText,
                                form.values.role === role && styles.roleButtonTextActive
                            ]}>
                                {role.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Debug Info */}
                <LiquidCard variant="glass" style={styles.debugCard}>
                    <Text style={styles.debugLabel}>VIBE STATE IDENTIFIER</Text>
                    <Text style={styles.debugText}>
                        {JSON.stringify(form.values, null, 2)}
                    </Text>
                </LiquidCard>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LiquidTokens.colors.background,
    },
    content: {
        paddingBottom: 40,
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
        fontWeight: '400',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: LiquidTokens.colors.textPrimary,
        letterSpacing: -0.4,
    },
    saveText: {
        color: LiquidTokens.colors.primary,
        fontSize: 17,
        fontWeight: '700',
    },
    disabledText: {
        color: LiquidTokens.colors.textTertiary,
    },
    form: {
        paddingHorizontal: LiquidTokens.spacing.lg,
        marginTop: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: LiquidTokens.colors.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        padding: 16,
        fontSize: 17,
        color: LiquidTokens.colors.textPrimary,
        marginBottom: 24,
    },
    roleGrid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleButtonActive: {
        backgroundColor: LiquidTokens.colors.primary,
    },
    roleButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: LiquidTokens.colors.textSecondary,
    },
    roleButtonTextActive: {
        color: 'white',
    },
    debugCard: {
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderColor: 'rgba(0,0,0,0.05)',
    },
    debugLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: LiquidTokens.colors.textTertiary,
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        color: LiquidTokens.colors.textSecondary,
    }
});
