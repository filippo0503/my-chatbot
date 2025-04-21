// components/ChatMessage.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
}

export default function ChatMessage({ content }: Props) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '16px',
        borderRadius: '6px',
        background: '#f8f9fa',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                marginTop: '1rem',
              }}
            >
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead
              style={{
                backgroundColor: '#e9ecef',
              }}
            >
              {children}
            </thead>
          ),
          tr: ({ children, node }) => (
            <tr
              style={{
                backgroundColor:
                  node?.position?.start.line % 2 === 0 ? '#f2f2f2' : 'white',
              }}
            >
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th
              style={{
                border: '1px solid #dee2e6',
                padding: '12px',
                textAlign: 'left',
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                border: '1px solid #dee2e6',
                padding: '12px',
                textAlign: 'left',
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
