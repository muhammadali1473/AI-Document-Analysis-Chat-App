import fs from 'fs';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');


export const extractText = async (filePath, mimeType) => {
    try {
        const buffer = fs.readFileSync(filePath);
        console.log(`Extracting text from: ${filePath}, Mime: ${mimeType}`);

        // Normalize mime type checks or use extension as fallback
        const isPdf = mimeType === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf');
        const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filePath.toLowerCase().endsWith('.docx');

        if (isPdf) {
            const data = await pdfParse(buffer);
            return data.text;
        } else if (isDocx) {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } else {
            // Default to text for everything else
            return buffer.toString('utf-8');
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        throw error;
    }
};
