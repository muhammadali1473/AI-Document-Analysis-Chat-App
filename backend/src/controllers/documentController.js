import { extractText } from '../utils/fileHandler.js';
import { addDocument, getAllDocuments, deleteDocumentModel, getDocumentById } from '../models/documentModel.js';
import { generateQuestions, extractTopics, summarizeDocument } from '../services/llm.js';

// Stub for RAG processing
const processDocumentVectors = async (text, docId) => {
    // In a real app, split text and upsert to Pinecone here.
    console.log(`Processing vectors for doc ${docId} (Length: ${text.length})`);
};

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { originalname, path: filePath, mimetype, size } = req.file;
        console.log(`Received file: ${originalname}, Size: ${size} bytes`);

        // 1. Extract Text
        // Note: fs needs the file to exist. Multer saves it.
        const text = await extractText(filePath, mimetype);

        // 2. Save Metadata
        const doc = addDocument({ name: originalname, type: mimetype, path: filePath });

        // 3. Background Processing
        processDocumentVectors(text, doc.id).catch(err => console.error("Vector processing failed", err));

        // 4. Initial Analysis (Optional, can be triggered separately)
        // const summary = await summarizeDocument(text);

        res.status(201).json({
            message: 'File uploaded successfully',
            document: doc,
            textPreview: text.substring(0, 500)
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
};

export const listDocuments = (req, res) => {
    const docs = getAllDocuments();
    res.json(docs);
};

export const removeDocument = (req, res) => {
    const { id } = req.params;
    deleteDocumentModel(id);
    res.json({ message: 'Document deleted' });
};

export const analyzeDocument = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // 'questions', 'topics', 'summary'

    const doc = getDocumentById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    try {
        const text = await extractText(doc.path, doc.type);
        let result;

        const options = {
            apiKey: req.headers['x-api-key'],
            provider: req.headers['x-provider']
        };

        if (type === 'questions') {
            result = await generateQuestions(text, options);
        } else if (type === 'topics') {
            result = await extractTopics(text, options);
        } else if (type === 'summary') {
            result = await summarizeDocument(text, options);
        } else {
            return res.status(400).json({ error: "Invalid analysis type" });
        }

        res.json({ result });
    } catch (error) {
        console.error("Analysis erro:", error);
        res.status(500).json({ error: "Analysis failed" });
    }
};
