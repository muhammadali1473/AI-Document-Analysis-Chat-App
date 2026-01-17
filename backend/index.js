import express from 'express';
import cors from 'cors';
import { config } from './src/config/env.js';
import apiRoutes from './src/routes/api.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
    res.send('AI Document Analysis API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment:`);
    console.log(`- Port: ${config.port}`);
    console.log(`- Groq Key Configured: ${!!config.groqApiKey}`);
});
