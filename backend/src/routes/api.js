import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadDocument, listDocuments, removeDocument, analyzeDocument } from '../controllers/documentController.js';
import { chatWithContext } from '../services/llm.js';
import { extractText } from '../utils/fileHandler.js';
import { getDocumentById } from '../models/documentModel.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: Infinity, // No limit
        fieldSize: Infinity // No limit for field values
    }
});

// Documents Routes
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/documents', listDocuments);
router.delete('/documents/:id', removeDocument);
router.post('/documents/:id/analyze', analyzeDocument);

// Chat Route
router.post('/chat', async (req, res) => {
    try {
        const { message, documentId } = req.body;
        console.log("Chat request received:", { message, documentId });

        let context = "";
        if (documentId) {
            const doc = getDocumentById(documentId);
            if (doc) {
                // For now, load entire text as context (Simple RAG for Prototype)
                // This allows the app to work immediately without Vector DB complexity
                const fullText = await extractText(doc.path, doc.type);
                // Limit context to ~20k chars to fit context window roughly
                context = fullText.substring(0, 20000);
                console.log(`Loaded context for doc ${documentId}. Length: ${context.length}`);
            } else {
                console.log(`Document ${documentId} not found in DB`);
            }
        }

        console.log("Sending prompt to LLM...");
        const options = {
            apiKey: req.headers['x-api-key'],
            provider: req.headers['x-provider']
        };
        const response = await chatWithContext(message, context, options);
        console.log("LLM Response received");
        res.json({ response });
    } catch (error) {
        console.error("Chat error object:", JSON.stringify(error, null, 2));
        console.error("Chat error stack:", error.stack);

        // If Groq API Key is missing
        if (error.message && error.message.includes("API Key")) {
            return res.status(500).json({ error: "Groq API Key is missing on server." });
        }
        res.status(500).json({ error: "Chat failed: " + error.message });
    }
});

export default router;
