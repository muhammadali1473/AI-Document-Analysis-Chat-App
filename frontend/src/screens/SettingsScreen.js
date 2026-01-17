import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, SIZES, SHADOWS } from '../theme';

const PROVIDERS = [
    { id: 'groq', name: 'Groq (Llama 3, Mixtral)', placeholder: 'gsk_...' },
    { id: 'openai', name: 'OpenAI (GPT-4)', placeholder: 'sk-...' },
];

const SettingsScreen = ({ navigation }) => {
    const [selectedProvider, setSelectedProvider] = useState('groq');
    const [keys, setKeys] = useState({ groq: '', openai: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedProvider = await AsyncStorage.getItem('selected_provider');
            const savedGroq = await AsyncStorage.getItem('api_key_groq');
            const savedOpenAI = await AsyncStorage.getItem('api_key_openai');

            // Legacy support
            const legacyKey = await AsyncStorage.getItem('groq_api_key');

            if (savedProvider) setSelectedProvider(savedProvider);

            setKeys({
                groq: savedGroq || legacyKey || '',
                openai: savedOpenAI || ''
            });
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const saveSettings = async () => {
        setLoading(true);
        try {
            const currentKey = keys[selectedProvider];
            if (!currentKey || currentKey.trim() === '') {
                Alert.alert('Error', `Please enter a valid API Key for ${PROVIDERS.find(p => p.id === selectedProvider).name}`);
                setLoading(false);
                return;
            }

            // Save active provider choice
            await AsyncStorage.setItem('selected_provider', selectedProvider);

            // Save keys individually
            await AsyncStorage.setItem('api_key_groq', keys.groq);
            await AsyncStorage.setItem('api_key_openai', keys.openai);

            // Clear legacy if moving forward
            await AsyncStorage.removeItem('groq_api_key');

            Alert.alert('Success', 'Configuration saved successfully!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select AI Provider</Text>
                    <View style={styles.providerContainer}>
                        {PROVIDERS.map((provider) => (
                            <TouchableOpacity
                                key={provider.id}
                                style={[
                                    styles.providerCard,
                                    selectedProvider === provider.id && styles.providerCardActive
                                ]}
                                onPress={() => setSelectedProvider(provider.id)}
                            >
                                <Text style={[
                                    styles.providerName,
                                    selectedProvider === provider.id && styles.providerNameActive
                                ]}>
                                    {provider.name}
                                </Text>
                                {selectedProvider === provider.id && <Text style={styles.checkMark}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>
                        {PROVIDERS.find(p => p.id === selectedProvider)?.name} API Key
                    </Text>
                    <Text style={styles.description}>
                        Enter your API key below. This key is stored securely on your device and sent directly to your local backend.
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={keys[selectedProvider]}
                        onChangeText={(text) => setKeys(prev => ({ ...prev, [selectedProvider]: text }))}
                        placeholder={PROVIDERS.find(p => p.id === selectedProvider)?.placeholder}
                        placeholderTextColor={COLORS.textSecondary}
                        autoCapitalize="none"
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveSettings}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : 'Save Configuration'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.l,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: SPACING.m,
    },
    backText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
    },
    title: {
        fontSize: SIZES.h1,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    content: {
        padding: SPACING.l,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        marginBottom: SPACING.m,
    },
    providerContainer: {
        gap: SPACING.m,
    },
    providerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.card,
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    providerCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.card, // Could slightly tint if possible
    },
    providerName: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        fontWeight: '500',
    },
    providerNameActive: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    checkMark: {
        color: COLORS.primary,
        fontSize: SIZES.h3,
    },
    card: {
        backgroundColor: COLORS.card,
        padding: SPACING.l,
        borderRadius: SIZES.radius,
        ...SHADOWS.medium,
    },
    label: {
        color: COLORS.text,
        fontSize: SIZES.h3,
        fontWeight: '600',
        marginBottom: SPACING.xs,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
        marginBottom: SPACING.l,
        lineHeight: 20,
    },
    input: {
        backgroundColor: COLORS.background,
        color: COLORS.text,
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        marginBottom: SPACING.xl,
        fontSize: SIZES.body,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: SIZES.h3,
        fontWeight: '600',
    }
});

export default SettingsScreen;
