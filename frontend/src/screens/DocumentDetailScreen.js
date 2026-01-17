import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, SIZES, SHADOWS } from '../theme';
import { analyzeDocument } from '../api/client';

const DocumentDetailScreen = ({ route, navigation }) => {
    const { document } = route.params;
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(null); // 'questions', 'topics', 'summary'

    const handleAnalyze = async (type) => {
        if (activeTab === type && analysisResult) return; // Already showing

        setActiveTab(type);
        setLoading(true);
        setAnalysisResult(null);

        try {
            const data = await analyzeDocument(document.id, type);
            // data.result contains the text or list
            setAnalysisResult(data.result);
        } catch (error) {
            console.error(error);
            setAnalysisResult("Failed to fetch analysis");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />;
        if (!analysisResult) return <Text style={styles.placeholderText}>Select an option above to analyze the document.</Text>;

        if (activeTab === 'topics' && Array.isArray(analysisResult)) {
            return (
                <View style={styles.tagContainer}>
                    {analysisResult.map((topic, i) => (
                        <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>{topic}</Text>
                        </View>
                    ))}
                </View>
            );
        }

        return <Text style={styles.resultText}>{analysisResult}</Text>;
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{document.name}</Text>
                <Text style={styles.meta}>Added: {new Date(document.uploadDate).toLocaleDateString()}</Text>

                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => navigation.navigate('Chat', { document })}
                >
                    <Text style={styles.chatButtonText}>💬 Chat with Document</Text>
                </TouchableOpacity>

                <Text style={styles.sectionHeader}>AI Analysis</Text>

                <View style={styles.tabs}>
                    <TouchableOpacity style={[styles.tab, activeTab === 'summary' && styles.activeTab]} onPress={() => handleAnalyze('summary')}>
                        <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>Summary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === 'questions' && styles.activeTab]} onPress={() => handleAnalyze('questions')}>
                        <Text style={[styles.tabText, activeTab === 'questions' && styles.activeTabText]}>Questions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === 'topics' && styles.activeTab]} onPress={() => handleAnalyze('topics')}>
                        <Text style={[styles.tabText, activeTab === 'topics' && styles.activeTabText]}>Topics</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.resultContainer}>
                    {renderContent()}
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: SPACING.l,
    },
    title: {
        fontSize: SIZES.h2,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    meta: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.l,
    },
    chatButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginBottom: SPACING.xl,
        ...SHADOWS.medium,
    },
    chatButtonText: {
        color: COLORS.white,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: SIZES.h2,
        color: COLORS.white,
        fontWeight: '600',
        marginBottom: SPACING.m,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
    },
    tab: {
        marginRight: SPACING.s,
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        backgroundColor: COLORS.card,
    },
    activeTab: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    tabText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.white,
    },
    resultContainer: {
        backgroundColor: COLORS.card,
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        minHeight: 100,
    },
    resultText: {
        color: COLORS.text,
        fontSize: SIZES.body,
        lineHeight: 24,
    },
    placeholderText: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: COLORS.cardBorder,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        color: COLORS.text,
    }
});

export default DocumentDetailScreen;
