import { ChatGroq } from "@langchain/groq";
import { config as envConfig } from "../config/env.js"; // Renamed to avoid confusion

// Helper to get the correct LLM instance based on request context
const getLLM = (apiKey, provider = 'groq') => {
    // If no specific key provided, try falling back to env (only for default provider)
    const finalKey = apiKey || envConfig.groqApiKey;

    if (!finalKey) {
        throw new Error(`API Key for ${provider} is missing. Please configure it in Settings.`);
    }

    if (provider === 'openai') {
        try {
            // Dynamic import to avoid crash if not installed
            // or just assume standard import if built successfully
            // reusing logic similar to ChatGroq
            // For now, simpler implementation:
            // check if we can import
            // const { ChatOpenAI } = await import("@langchain/openai");
            // return new ChatOpenAI({ openAIApiKey: finalKey, modelName: "gpt-4" });

            // Since we are synchronous here (or need to be async), 
            // we will throw for now if not set up, or use a workaround.
            // Given the context, let's assume the user purely wants Groq for now OR 
            // we accept we might need to be async.
            throw new Error("OpenAI support requires backend dependency installation. Please ensure @langchain/openai is installed.");
        } catch (e) {
            throw e;
        }
    }

    // Default to Groq
    return new ChatGroq({
        apiKey: finalKey,
        model: "llama-3.3-70b-versatile",
        temperature: 0.3
    });
};

// We need to change these to accept options
export const generateQuestions = async (text, options = {}) => {
    const { apiKey, provider } = options;
    const llm = getLLM(apiKey, provider);

    const sample = text.substring(0, 20000); // Limit context
    const prompt = `Based on the following document content, generate 5 to 7 relevant and insightful questions that a user might ask. Return ONLY the questions as a numbered list.
    
    Document Content:
    ${sample}
    `;

    try {
        const res = await llm.invoke(prompt);
        return res.content;
    } catch (e) {
        console.error("LLM Error:", e);
        throw e;
    }
};

export const extractTopics = async (text, options = {}) => {
    const { apiKey, provider } = options;
    const llm = getLLM(apiKey, provider);

    const sample = text.substring(0, 20000);
    const prompt = `Identify the main topics and themes in the following document. Return them as a JSON array of strings (e.g. ["Topic 1", "Topic 2"]). Do not include any markdown formatting or extra text, just the JSON array.
     
     Document Content:
     ${sample}`;

    try {
        const res = await llm.invoke(prompt);
        const content = res.content.trim();
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return content.split(',').map(s => s.trim());
    } catch (e) {
        console.error("Stats extraction error", e);
        return ["General"];
    }
};

export const summarizeDocument = async (text, options = {}) => {
    const { apiKey, provider } = options;
    const llm = getLLM(apiKey, provider);

    const sample = text.substring(0, 20000);
    const prompt = `Provide a concise summary of the following document in about 1 paragraph.
     
     Document Content:
     ${sample}`;

    const res = await llm.invoke(prompt);
    return res.content;
};

export const chatWithContext = async (query, context, options = {}) => {
    const { apiKey, provider } = options;
    const llm = getLLM(apiKey, provider);

    const prompt = `You are a helpful AI assistant. Answer the user's question based ONLY on the provided context. If the answer is not in the context, state that you don't have enough information from the document.
     
     Context:
     ${context}
     
     User Question: ${query}
     `;

    const res = await llm.invoke(prompt);
    return res.content;
};
