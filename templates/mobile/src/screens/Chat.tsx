import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { wsManager } from '../services/ws';
import { useChatStore } from '../store/chat';
import { navigationActions } from '../store/navigation';
import { useState, useRef, useEffect } from 'react';
import { LiquidTokens, LiquidCard } from '@float-v/lite';

export default function Chat() {
    const { goHome } = navigationActions;
    const { messages, roomId } = useChatStore();
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (!input.trim()) return;

        wsManager.send({
            type: 'message',
            text: input,
            roomId,
            userId: Date.now() // Simple unique ID
        });

        setInput('');
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.messageRow}>
            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.messageTime}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Real-Time Chat</Text>
                <View style={styles.roomBadge}>
                    <Text style={styles.roomText}>{roomId.toUpperCase()}</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Message..."
                    placeholderTextColor={LiquidTokens.colors.textTertiary}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    disabled={!input.trim()}
                    style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    roomBadge: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roomText: {
        fontSize: 10,
        fontWeight: '800',
        color: LiquidTokens.colors.textSecondary,
    },
    listContent: {
        padding: LiquidTokens.spacing.md,
        paddingBottom: 20,
    },
    messageRow: {
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    messageBubble: {
        backgroundColor: LiquidTokens.colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        maxWidth: '85%',
        ...LiquidTokens.shadows.soft,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    messageText: {
        fontSize: 16,
        color: LiquidTokens.colors.textPrimary,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 10,
        color: LiquidTokens.colors.textTertiary,
        alignSelf: 'flex-end',
        marginTop: 4,
        fontWeight: '600',
    },
    inputArea: {
        padding: LiquidTokens.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent', // Looks better on background
        borderTopWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)',
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 16,
        color: LiquidTokens.colors.textPrimary,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: LiquidTokens.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 22,
    },
    sendButtonDisabled: {
        backgroundColor: LiquidTokens.colors.textTertiary,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    }
});
