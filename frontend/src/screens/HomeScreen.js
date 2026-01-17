import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ActionCard from '../components/ActionCard';
import { COLORS, SPACING, SIZES } from '../theme';

const HomeScreen = ({ navigation }) => {
    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>AI Document Analyst</Text>
                    <Text style={styles.subGreeting}>Unlock insights from your documents instantly.</Text>
                </View>

                <View style={styles.actions}>
                    <ActionCard
                        title="Upload Document"
                        subtitle="Analyze PDF, DOCX, or TXT"
                        onPress={() => navigation.navigate('Upload')}
                        colors={[COLORS.primary, COLORS.primaryDark]}
                    />
                    <ActionCard
                        title="Document Library"
                        subtitle="Access your processed files"
                        onPress={() => navigation.navigate('Library')}
                        colors={[COLORS.secondary, '#be185d']}
                    />
                    <ActionCard
                        title="Settings"
                        subtitle="Configure API keys"
                        onPress={() => navigation.navigate('Settings')}
                        colors={[COLORS.card, COLORS.cardBorder]}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: SPACING.l,
    },
    header: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
    },
    greeting: {
        fontSize: SIZES.h1,
        color: COLORS.white,
        fontWeight: '800',
        marginBottom: SPACING.s,
    },
    subGreeting: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    actions: {
        gap: SPACING.m,
    }
});

export default HomeScreen;
