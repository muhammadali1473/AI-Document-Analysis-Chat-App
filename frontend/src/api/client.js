import axios from 'axios';
import { Platform } from 'react-native';

// CHANGE THIS TO YOUR COMPUTER'S LOCAL IP ADDRESS IF RUNNING ON PHYSICAL DEVICE
const PROD_URL = "http://192.168.1.13:3000/api";
// For Android Emulator use 'http://10.0.2.2:3000/api', for Physical Device use your IP
const DEV_URL = "http://192.168.1.13:3000/api";

const BASE_URL = DEV_URL;

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 0, // 0 means no timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

import AsyncStorage from '@react-native-async-storage/async-storage';

client.interceptors.request.use(async (config) => {
    try {
        const provider = await AsyncStorage.getItem('selected_provider') || 'groq';
        const groqKey = await AsyncStorage.getItem('api_key_groq');
        const openaiKey = await AsyncStorage.getItem('api_key_openai');
        const legacyKey = await AsyncStorage.getItem('groq_api_key');

        let apiKey = null;
        if (provider === 'openai') {
            apiKey = openaiKey;
        } else {
            apiKey = groqKey || legacyKey; // Default/Fallback
        }

        if (apiKey) {
            config.headers['x-api-key'] = apiKey;
        }
        config.headers['x-provider'] = provider;

    } catch (error) {
        console.log("Error loading API config", error);
    }
    return config;
});

export const uploadFile = async (fileUri, mimeType, name) => {
    const formData = new FormData();
    formData.append('document', {
        uri: fileUri,
        type: mimeType,
        name: name,
    });

    return client.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const fetchDocuments = async () => {
    const res = await client.get('/documents');
    return res.data;
};

export const deleteDocument = async (id) => {
    await client.delete(`/documents/${id}`);
};

export const analyzeDocument = async (id, type) => {
    const res = await client.post(`/documents/${id}/analyze`, { type });
    return res.data;
};

export const chatWithDocument = async (message, documentId) => {
    const res = await client.post('/chat', { message, documentId });
    return res.data;
};

export default client;
