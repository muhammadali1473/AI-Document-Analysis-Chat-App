import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "../config/env.js";

// Basic implementation using OpenAI Embeddings.
// User can swap this with HuggingFaceInferenceEmbeddings or a local transformer if desired.
export const getEmbeddings = () => {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OpenAI API Key for embeddings is missing. RAG features will fail unless configured.");
        return null; // Or throw
    }
    return new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small"
    });
};
