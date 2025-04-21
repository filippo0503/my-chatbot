// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  const stream = await openai.chat.completions.create({
    model: 'gpt-4', // or 'gpt-3.5-turbo'
    messages: [{ role: 'user', content: message }],
    stream: true,
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      res.write(content);
    }
  }

  res.end();
}
