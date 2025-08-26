import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config and constants
const port = process.env.PORT || 3001;
const customersPath = path.join(__dirname, 'customers.json');

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

app.get('/', (req, res) => {
    res.json({ 
        message: 'Voice AI Node.js API Server',
        endpoints: ['/api/customers', '/api/ai/chat'],
        status: 'running'
    });
});

// Helpers
const readCustomers = async () => {
    const data = await fs.promises.readFile(customersPath, 'utf8');
    return JSON.parse(data);
};

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

