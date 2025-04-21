// pages/index.tsx
import { useState } from 'react';
import ChatMessage from '@/components/ChatMessage';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(''); // Clear previous

    const res = await fetch('/api/chat/edge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setResponse((prev) => prev + chunk);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chatbot</h1>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        placeholder="Ask me anything..."
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          background: '#0070f3',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        {loading ? 'Loding...' : 'Send'}
      </button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>AI Assistant:</h3>
          <ChatMessage content={response} />
        </div>
      )}
    </div>
  );
}
