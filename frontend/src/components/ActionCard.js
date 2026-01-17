import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SHADOWS, SPACING, SIZES } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const ActionCard = ({ title, subtitle, onPress, icon, colors }) => {
    const gradientColors = colors || [COLORS.card, '#2e3b4e'];

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
            <LinearGradient colors={gradientColors} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                {icon}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.m,
        borderRadius: SIZES.radius,
        ...SHADOWS.medium,
        overflow: 'hidden', // for gradient
    },
    gradient: {
        padding: SPACING.l,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 120,
    },
    content: {
        flex: 1,
    },
    title: {
        color: COLORS.white,
        fontSize: SIZES.h2,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body,
    }
});

export default ActionCard;
