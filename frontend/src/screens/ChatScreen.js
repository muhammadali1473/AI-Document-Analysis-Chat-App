import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, SIZES, SHADOWS } from '../theme';
import { chatWithDocument } from '../api/client';

const ChatScreen = ({ route }) => {
    const { document } = route.params || {};
    const [messages, setMessages] = useState([
        { id: '0', text: `Ask me anything about "${document?.name || 'this document'}"`, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef();

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const data = await chatWithDocument(userMsg.text, document?.id);
            const botMsg = { id: (Date.now() + 1).toString(), text: data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const msg = error.response?.data?.error || error.message || "Sorry, I couldn't get a response.";
            const errorMsg = { id: (Date.now() + 1).toString(), text: `⚠️ ${msg}`, sender: 'bot', error: true };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
            // Scroll to bottom
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgContainer, isUser ? styles.userMsg : styles.botMsg]}>
                <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat with AI</Text>
                {document && <Text style={styles.headerSubtitle}>{document.name}</Text>}
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {loading && (
                <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color={COLORS.secondary} />
                    <Text style={styles.typingText}>Thinking...</Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a question..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Text style={styles.sendIcon}>➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.m,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: SIZES.h2,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.caption,
    },
    list: {
        padding: SPACING.m,
        paddingBottom: SPACING.xl,
    },
    msgContainer: {
        maxWidth: '80%',
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        marginBottom: SPACING.m,
    },
    userMsg: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 2,
    },
    botMsg: {
        backgroundColor: COLORS.card,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 2,
    },
    msgText: {
        fontSize: SIZES.body,
        lineHeight: 22,
    },
    userText: {
        color: COLORS.white,
    },
    botText: {
        color: COLORS.text,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: SPACING.m,
        backgroundColor: COLORS.card,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        color: COLORS.white,
        padding: SPACING.m,
        borderRadius: 25,
        marginRight: SPACING.m,
        height: 50,
    },
    sendButton: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.secondary,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.light,
    },
    sendIcon: {
        color: COLORS.white,
        fontSize: 20,
    },
    typingContainer: {
        padding: SPACING.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingText: {
        color: COLORS.textSecondary,
        marginLeft: SPACING.s,
    }
});

export default ChatScreen;
