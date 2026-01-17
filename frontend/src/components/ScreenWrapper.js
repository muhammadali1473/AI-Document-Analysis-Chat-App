import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';

const ScreenWrapper = ({ children, style }) => {
    return (
        <LinearGradient
            colors={[COLORS.background, '#020617']} // Deep dark blue/black
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <SafeAreaView style={[styles.safeArea, style]}>
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    }
});
export default ScreenWrapper;
