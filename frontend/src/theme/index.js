export const COLORS = {
    primary: '#6366f1', // Indigo 500
    primaryDark: '#4338ca', // Indigo 700
    secondary: '#ec4899', // Pink 500
    accent: '#8b5cf6', // Violet 500
    background: '#0f172a', // Slate 900
    card: '#1e293b', // Slate 800 - Glass effect base
    cardBorder: '#334155',
    text: '#f1f5f9', // Slate 100
    textSecondary: '#94a3b8', // Slate 400
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    white: '#ffffff',
    black: '#000000',
    overlay: 'rgba(0,0,0,0.7)',
};

export const SPACING = {
    xs: 6,
    s: 12,
    m: 18,
    l: 24,
    xl: 36,
    xxl: 48,
};

export const SIZES = {
    radius: 16,
    icon: 24,
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
};

export const SHADOWS = {
    light: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
};
