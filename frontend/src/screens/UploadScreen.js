import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, SIZES, SHADOWS } from '../theme';
import { uploadFile } from '../api/client';

const UploadScreen = ({ navigation }) => {
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets ? result.assets[0] : result;

            setFileName(file.name);
            uploadDocument(file);

        } catch (err) {
            console.log('Unknown Error: ', err);
            Alert.alert("Error", "Failed to pick document");
        }
    };

    const uploadDocument = async (file) => {
        setUploading(true);
        try {
            const response = await uploadFile(file.uri, file.mimeType || 'application/octet-stream', file.name);

            if (response.status === 200 || response.status === 201) {
                setUploading(false);
                Alert.alert("Success", "Document processed!", [
                    { text: "View Details", onPress: () => navigation.replace('Library') }
                ]);
            } else {
                throw new Error("Upload returned status: " + response.status);
            }
        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
            Alert.alert("Error", "Upload failed. Check server connection or file size.");
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Upload Document</Text>
                <Text style={styles.subtitle}>Select a PDF, DOCX, or TXT file to analyze.</Text>

                <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={pickDocument}
                    disabled={uploading}
                >
                    {uploading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.uploadingText}>Processing Document...</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.icon}>📄</Text>
                            <Text style={styles.boxText}>Tap to Select File</Text>
                        </>
                    )}
                </TouchableOpacity>

                {fileName && !uploading && (
                    <Text style={styles.fileName}>Selected: {fileName}</Text>
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    content: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.h1,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    uploadBox: {
        width: '100%',
        height: 250,
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
        borderWidth: 2,
        borderColor: COLORS.cardBorder,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.l,
    },
    icon: {
        fontSize: 48,
        marginBottom: SPACING.m,
    },
    boxText: {
        color: COLORS.text,
        fontSize: SIZES.h3,
        fontWeight: '600',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    uploadingText: {
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
    },
    fileName: {
        color: COLORS.success,
        fontSize: SIZES.body,
    }
});

export default UploadScreen;
