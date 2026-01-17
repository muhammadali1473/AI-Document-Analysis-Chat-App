import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Use absolute path or relative to CWD
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'documents.json');

const initDB = () => {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([]));
    }
};

initDB();

export const getAllDocuments = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

export const addDocument = (doc) => {
    const docs = getAllDocuments();
    const newDoc = {
        id: uuidv4(),
        ...doc,
        uploadDate: new Date().toISOString()
    };
    docs.push(newDoc);
    fs.writeFileSync(DB_PATH, JSON.stringify(docs, null, 2));
    return newDoc;
};

export const getDocumentById = (id) => {
    const docs = getAllDocuments();
    return docs.find(d => d.id === id);
};

export const deleteDocumentModel = (id) => {
    let docs = getAllDocuments();
    const newDocs = docs.filter(d => d.id !== id);
    fs.writeFileSync(DB_PATH, JSON.stringify(newDocs, null, 2));
};
