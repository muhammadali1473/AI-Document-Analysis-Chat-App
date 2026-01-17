import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, SIZES, SHADOWS } from '../theme';
import { fetchDocuments, deleteDocument } from '../api/client';

const LibraryScreen = ({ navigation }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const data = await fetchDocuments();
            setDocuments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadDocuments();
        }, [])
    );

    const handleDelete = (id, name) => {
        Alert.alert(
            "Delete Document",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDocument(id);
                            // Optimistic update or reload
                            setDocuments(prev => prev.filter(doc => doc.id !== id));
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete document");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Details', { document: item })}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{item.type && item.type.includes('pdf') ? '📕' : '📘'}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.docDate}>{new Date(item.uploadDate).toLocaleDateString()}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
            >
                <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Your Library</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={documents}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No documents found. Upload one!</Text>
                    }
                />
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.l,
    },
    title: {
        fontSize: SIZES.h1,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    list: {
        padding: SPACING.l,
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
        ...SHADOWS.light,
        paddingRight: SPACING.s,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
    },
    deleteButton: {
        padding: SPACING.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        fontSize: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.cardBorder,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    icon: {
        fontSize: 20,
    },
    info: {
        flex: 1,
    },
    docName: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '600',
    },
    docDate: {
        color: COLORS.textSecondary,
        fontSize: SIZES.caption,
        marginTop: 4,
    },
    arrow: {
        color: COLORS.textSecondary,
        fontSize: 24,
    },
    emptyText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 50,
    }
});

export default LibraryScreen;
