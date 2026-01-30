import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { navigationActions } from '../store/navigation';
import { LiquidTokens, LiquidCard } from '@float-v/lite';

export default function Home() {
    const { navigate } = navigationActions;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Float-V Mobile</Text>
                <Text style={styles.subtitle}>Ultra-Modern Ecosystem</Text>
            </View>

            <View style={styles.grid}>
                <TouchableOpacity onPress={() => navigate('Users')} activeOpacity={0.8} style={styles.fullWidth}>
                    <LiquidCard variant="glass" style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>👥</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>Users & Sync</Text>
                            <Text style={styles.cardDesc}>Offline-first CRUD operations</Text>
                        </View>
                    </LiquidCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Products')} activeOpacity={0.8} style={styles.halfWidth}>
                    <LiquidCard variant="surface" style={styles.cardSmall}>
                        <Text style={styles.iconSmall}>🛒</Text>
                        <Text style={styles.cardTitleSmall}>Products</Text>
                    </LiquidCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Chat')} activeOpacity={0.8} style={styles.halfWidth}>
                    <LiquidCard variant="surface" style={styles.cardSmall}>
                        <Text style={styles.iconSmall}>💬</Text>
                        <Text style={styles.cardTitleSmall}>Live Chat</Text>
                    </LiquidCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('AIChat')} activeOpacity={0.8} style={styles.fullWidth}>
                    <LiquidCard variant="glass" intensity="dark" style={[styles.card, styles.aiCard]}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>🤖</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.cardTitle, styles.whiteText]}>AI Assistant</Text>
                            <Text style={[styles.cardDesc, styles.whiteTextSecondary]}>Agentic RAG Integration</Text>
                        </View>
                    </LiquidCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Settings')} activeOpacity={0.8} style={styles.fullWidth}>
                    <LiquidCard variant="flat" style={styles.settingsCard}>
                        <Text style={styles.settingsText}>⚙️ Connection Settings</Text>
                    </LiquidCard>
                </TouchableOpacity>
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
        padding: LiquidTokens.spacing.lg,
        paddingBottom: 40,
    },
    header: {
        marginBottom: LiquidTokens.spacing.xl,
        marginTop: 10,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -1,
        color: LiquidTokens.colors.textPrimary,
    },
    subtitle: {
        fontSize: 17,
        fontWeight: '500',
        color: LiquidTokens.colors.textSecondary,
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: LiquidTokens.spacing.md,
    },
    fullWidth: {
        width: '100%',
        marginBottom: LiquidTokens.spacing.sm,
    },
    halfWidth: {
        width: '47.5%',
        marginBottom: LiquidTokens.spacing.sm,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: LiquidTokens.spacing.lg,
        height: 100,
    },
    cardSmall: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: LiquidTokens.spacing.md,
        height: 110,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: LiquidTokens.spacing.md,
    },
    icon: {
        fontSize: 24,
    },
    iconSmall: {
        fontSize: 32,
        marginBottom: 8,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: LiquidTokens.colors.textPrimary,
        letterSpacing: -0.4,
    },
    cardDesc: {
        fontSize: 14,
        color: LiquidTokens.colors.textSecondary,
        marginTop: 2,
    },
    cardTitleSmall: {
        fontSize: 15,
        fontWeight: '600',
        color: LiquidTokens.colors.textPrimary,
    },
    aiCard: {
        backgroundColor: '#1c1c1e',
    },
    whiteText: {
        color: '#FFFFFF',
    },
    whiteTextSecondary: {
        color: 'rgba(255,255,255,0.6)',
    },
    settingsCard: {
        padding: LiquidTokens.spacing.md,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    settingsText: {
        color: LiquidTokens.colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    }
});
