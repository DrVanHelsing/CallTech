import OpenAI from 'openai';
import 'dotenv/config';

const apiKey = process.env.OPENROUTER_API_KEY;
const baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const model = process.env.OPENROUTER_MODEL || 'mistralai/mistral-small-3b-32k';

if (!apiKey) {
  console.error('Missing OpenRouter API key.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey,
  baseURL,
});

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello in one sentence.' },
      ],
      max_tokens: 32,
    });
    console.log('OpenRouter response:', response.choices[0].message.content);
  } catch (err) {
    console.error('OpenRouter test failed:', err);
    process.exit(2);
  }
}

test();
