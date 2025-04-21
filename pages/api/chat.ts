import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Validate that it's a POST request.
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Extract the message content from the request body.
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Bad Request: Missing or invalid "message" in payload' });
    }

    // Call OpenAI's chat model.
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    // Return the chat response back to the client.
    return res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
