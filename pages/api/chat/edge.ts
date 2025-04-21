// pages/api/chat/edge.ts
import { OpenAI } from 'openai';

export const config = {
    runtime: 'edge', // 👈 force Edge Runtime for streaming
};

const openai = new OpenAI({
    apiKey: "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",
});

export default async function handler(req: Request) {
    const { message } = await req.json();

    const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
        stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) {
                    controller.enqueue(encoder.encode(content));
                }
            }
            controller.close();
        },
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
