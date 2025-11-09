// FIX: The file had placeholder content. This fix provides the full backend server implementation.
// FIX: Changed express import to resolve type errors.
import express from 'express';
import cors from 'cors';
import { generateSchema, processDocumentWithSchema } from './geminiProcessor';
import { executionsCollection, schemasCollection } from './firestore';
import { Status, Execution, SchemaTemplate } from './types';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// FIX: A more explicit CORS configuration to handle pre-flight requests
const corsOptions = {
  origin: '*', // Allow all origins for development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes


app.use(express.json({ limit: '50mb' }));

const router = express.Router();

// Route to generate a schema from a document
router.post('/generate-schema', async (req: express.Request, res: express.Response) => {
    const { base64Data, mimeType } = req.body;
    if (!base64Data || !mimeType) {
        return res.status(400).json({ message: 'Missing base64Data or mimeType' });
    }

    try {
        const schema = await generateSchema(base64Data, mimeType);
        res.json(schema);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('/generate-schema error:', error);
        res.status(500).json({ message });
    }
});

// Route to process a document
router.post('/process-document', async (req: express.Request, res: express.Response) => {
    const { userPrompt, schema, fileData, fileName, userId } = req.body;

    if (!schema || !fileData || !fileName || !userId) {
        return res.status(400).json({ message: 'Missing required fields for document processing.' });
    }

    const executionId = uuidv4();
    const initialExecution: Execution = {
        id: executionId,
        fileName,
        status: Status.Generating,
        timestamp: new Date().toISOString(),
        userId,
    };

    try {
        // Save initial "in-progress" state to Firestore
        await executionsCollection.doc(executionId).set(initialExecution);
        
        const resultData = await processDocumentWithSchema({ userPrompt, schema, fileData });

        const finalExecution: Execution = {
            ...initialExecution,
            status: Status.Completed,
            resultData,
        };
        await executionsCollection.doc(executionId).set(finalExecution);

        res.json(finalExecution);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('/process-document error:', error);
        
        const failedExecution: Execution = {
            ...initialExecution,
            status: Status.Failed,
            error: message,
        };
        
        await executionsCollection.doc(executionId).set(failedExecution, { merge: true }).catch(err => {
            console.error('Failed to update execution to failed status:', err);
        });

        res.status(500).json({ message });
    }
});


// Route to get execution history for a user
router.get('/history', async (req: express.Request, res: express.Response) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid userId' });
    }
    try {
        const snapshot = await executionsCollection.where('userId', '==', userId).orderBy('timestamp', 'desc').get();
        const history = snapshot.docs.map(doc => doc.data() as Execution);
        res.json(history);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('/history error:', error);
        res.status(500).json({ message });
    }
});

// Route to get saved schema templates for a user
router.get('/schemas', async (req: express.Request, res: express.Response) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid userId' });
    }
    try {
        const snapshot = await schemasCollection.where('userId', '==', userId).get();
        const schemas = snapshot.docs.map(doc => doc.data() as SchemaTemplate);
        res.json(schemas);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('/schemas GET error:', error);
        res.status(500).json({ message });
    }
});

// Route to save a new schema template
router.post('/schemas', async (req: express.Request, res: express.Response) => {
    const { name, schema, userId } = req.body;
    if (!name || !schema || !userId) {
        return res.status(400).json({ message: 'Missing name, schema, or userId' });
    }
    try {
        const id = uuidv4();
        const newTemplate: SchemaTemplate = { id, name, schema, userId };
        await schemasCollection.doc(id).set(newTemplate);
        res.status(201).json(newTemplate);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('/schemas POST error:', error);
        res.status(500).json({ message });
    }
});


app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
