import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import multer from 'multer';
import sdk from 'microsoft-cognitiveservices-speech-sdk';
import OpenAI from 'openai';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config and constants
const port = process.env.PORT || 3001;
const customersPath = path.join(__dirname, 'customers.json');

// Azure Speech
const speechKey = process.env.SPEECH_KEY;
const speechRegion = process.env.SPEECH_REGION;

// OpenRouter (Mistral) config
const openRouterKey = process.env.OPENROUTER_API_KEY;
const openRouterBaseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const openRouterModel = process.env.OPENROUTER_MODEL || 'mistralai/mistral-small-3.2-24b-instruct:free';

let openai = null;
if (openRouterKey) {
    openai = new OpenAI({ apiKey: openRouterKey, baseURL: openRouterBaseUrl });
} else {
    console.warn('[startup] OpenRouter API key not set.');
}

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'voice-ai-node-api',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Voice AI Node.js API Server',
        endpoints: ['/health', '/api/customers', '/api/ai/chat'],
        status: 'running'
    });
});

// Multer for uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Helpers
const readCustomers = async () => {
    const data = await fs.promises.readFile(customersPath, 'utf8');
    return JSON.parse(data);
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

// Customers endpoints
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await readCustomers();
        res.json(customers);
    } catch (err) {
        console.error('[customers] read error', err);
        res.status(500).send('Error reading customer data');
    }
});

app.get('/api/customers/:id', async (req, res) => {
    try {
        const customers = await readCustomers();
        const customer = customers.find((c) => c.id === req.params.id);
        if (!customer) return res.status(404).send('Customer not found');
        res.json(customer);
    } catch (err) {
        console.error('[customers/:id] read error', err);
        res.status(500).send('Error reading customer data');
    }
});

// Customer lookup by phone number
app.get('/api/customers/lookup/phone/:phone', async (req, res) => {
    try {
        const customers = await readCustomers();
        const phoneParam = req.params.phone;
        
        // Find customer by last 4 digits of phone number (demo implementation)
        const customer = customers.find((c) => 
            c.phone && c.phone.includes(phoneParam.slice(-4))
        );
        
        if (!customer) {
            return res.status(404).json({ 
                error: 'Customer not found', 
                message: 'No customer found with that phone number' 
            });
        }
        
        res.json(customer);
    } catch (err) {
        console.error('[customers/lookup/phone] error', err);
        res.status(500).send('Error looking up customer');
    }
});

// Azure Speech token (optional for client-side SDKs)
app.get('/api/speech-to-text/token', async (req, res) => {
    if (!speechKey || !speechRegion) {
        return res.status(400).send('Azure Speech credentials are not set.');
    }
    try {
        const tokenResponse = await axios.post(
            `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
            null,
            { headers: { 'Ocp-Apim-Subscription-Key': speechKey } }
        );
        res.json({ token: tokenResponse.data, region: speechRegion });
    } catch (err) {
        console.error('[speech token] error', err?.message || err);
        res.status(500).send('Error getting speech token');
    }
});

// Azure Speech-to-Text via server-side SDK (upload Blob)
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
    if (!speechKey || !speechRegion) {
        return res.status(400).send('Azure Speech credentials are not set.');
    }
    if (!req.file) {
        return res.status(400).send('No audio file uploaded');
    }

    try {
        // Choose the proper container format for push stream based on mimetype
        const mime = req.file.mimetype || '';
        let pushStream;
        if (mime.includes('webm')) {
            const format = sdk.AudioStreamFormat.getCompressedFormat(
                sdk.AudioStreamContainerFormat.WEBM
            );
            pushStream = sdk.AudioInputStream.createPushStream(format);
        } else if (mime.includes('ogg')) {
            const format = sdk.AudioStreamFormat.getCompressedFormat(
                sdk.AudioStreamContainerFormat.OGG_OPUS
            );
            pushStream = sdk.AudioInputStream.createPushStream(format);
        } else {
            // Fallback (SDK will try to interpret raw/PCM)
            pushStream = sdk.AudioInputStream.createPushStream();
        }

        pushStream.write(req.file.buffer);
        pushStream.close();

        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechRecognitionLanguage = 'en-US';

        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        recognizer.recognizeOnceAsync(
            (result) => {
                try {
                    if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                        return res.json({ transcript: result.text });
                    }
                    console.error('[speech-to-text] not recognized', result);
                    return res.status(500).send('Speech not recognized');
                } finally {
                    recognizer.close();
                }
            },
            (err) => {
                console.error('[speech-to-text] recognize error', err);
                try { recognizer.close(); } catch {}
                return res.status(500).send('Error during speech recognition');
            }
        );
    } catch (err) {
        console.error('[speech-to-text] error', err);
        return res.status(500).send('Error processing audio');
    }
});

// AI chat (non-streaming for simplicity/stability)
app.post('/api/ai/chat', async (req, res) => {
    const { transcript, customer } = req.body || {};
    
    console.log('AI chat request:', { 
        transcript: transcript ? `"${transcript}"` : 'empty/null',
        customer: customer ? `ID: ${customer.id}` : 'missing' 
    });
    
    if (!transcript || transcript.trim() === '') {
        return res.status(400).json({ 
            error: 'transcript is required and cannot be empty',
            received: transcript 
        });
    }
    
    if (!customer) {
        return res.status(400).json({ 
            error: 'customer data is required' 
        });
    }
    
    if (!openai || !openRouterModel) {
        return res.status(500).send('OpenRouter is not configured');
    }

    const systemLines = [
        'You are a helpful AI customer service representative for TelecomCorp, a telecommunications company.',
        'You can help with billing inquiries, plan changes, technical support, account information, and general questions.',
        'Always be polite, professional, and empathetic. Provide clear, concise answers.',
        'Use only the provided customer data. If information is not available, acknowledge this and offer to help find it.',
        'For technical issues, provide basic troubleshooting steps when appropriate.',
        'For billing disputes or complex issues, offer to escalate to a human representative.',
        'If a customer is not yet identified, politely ask them to provide their phone number or name for verification.',
        '',
        'IMPORTANT: Your responses will be read aloud by text-to-speech software.',
        'Follow these TTS guidelines:',
        '- Use only standard punctuation: periods, commas, question marks, exclamation points',
        '- Avoid special characters like: @, #, $, %, &, *, +, =, [], {}, |, \\, /, <>, etc.',
        '- Write out symbols: say "dollar" instead of "$", "percent" instead of "%"',
        '- Use "dash" or "hyphen" instead of "-" when referring to symbols',
        '- Spell out abbreviations that might be unclear: "ID" as "I D", "URL" as "U R L"',
        '- Use natural speech patterns with proper sentence structure',
        '- Avoid bullet points, numbered lists, or formatting characters',
        '- Use words like "first", "second", "also", "additionally" instead of list formatting',
        '',
        'Common services you can help with:',
        '- Check account balance and payment history',
        '- Explain current plan and usage',
        '- Troubleshoot internet/TV/phone issues',
        '- Schedule service appointments',
        '- Upgrade or downgrade plans',
        '- Payment assistance and options',
    ];
    
    const customerLines = [
        `Customer ID: ${customer.id}`,
        `Name: ${customer.name}`,
        `Current Plan: ${customer.plan}`,
        `Account Status: ${customer.status}`,
        `Current Balance: ${customer.balance}`,
        customer.lastPayment ? `Last Payment: ${customer.lastPayment}` : 'No recent payment on file',
        customer.billing ? `Usage: ${customer.billing.usage}` : undefined,
        customer.billing ? `Next Bill Due: ${customer.billing.nextDue}` : undefined,
        customer.billing ? `Payment Method: ${customer.billing.paymentMethod}` : undefined,
        customer.support ? `Support Tickets: ${customer.support.tickets}` : undefined,
        customer.support ? `Customer Satisfaction: ${customer.support.satisfaction}/5.0` : undefined,
        customer.services ? `Internet: ${customer.services.internet}` : undefined,
        customer.services ? `TV Service: ${customer.services.tv}` : undefined,
        customer.services ? `Phone Service: ${customer.services.phone}` : undefined,
        customer.support?.recentIssues ? `Recent Issues: ${customer.support.recentIssues.join(', ')}` : undefined,
    ].filter(Boolean);
    
    const systemPrompt = [...systemLines, '', 'Current Customer Information:', ...customerLines].join('\n');

    try {
        const response = await openai.chat.completions.create({
            model: openRouterModel,
            max_tokens: 500,
            temperature: 0.7,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: transcript },
            ],
        });
        const message = response?.choices?.[0]?.message?.content?.trim();
        if (!message) {
            return res.status(502).send('Empty response from OpenRouter');
        }
        res.json({ response: message });
    } catch (err) {
        console.error('[ai/chat] error', err?.message || err);
        res.status(500).send('Error processing AI request');
    }
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
});

