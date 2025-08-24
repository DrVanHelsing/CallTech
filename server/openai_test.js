import { OpenAI } from 'openai';
import 'dotenv/config';

const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

if (!apiKey || !endpoint || !deployment) {
  console.error('Missing OpenAI API key, endpoint, or deployment name.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey,
  baseURL: endpoint,
  defaultHeaders: { 'api-key': apiKey },
});

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello in one sentence.' },
      ],
      max_tokens: 20,
    });
    console.log('OpenAI response:', response.choices[0].message.content);
  } catch (err) {
    console.error('OpenAI test failed:', err);
    process.exit(2);
  }
}

test();
