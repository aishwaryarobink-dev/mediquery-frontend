import React, { useState, useRef, useEffect } from 'react';
import './App.scss';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const currentMessages = [...messages, userMsg];

    setMessages([...currentMessages, { role: 'assistant', content: '', source: null }]);
    setInput('');
    setLoading(true);

    try {
      const cleanMessages = currentMessages.map(({ role, content }) => ({
        role,
        content
      }));
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: cleanMessages }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE format: split by newlines
        const lines = buffer.split('\n');

        // Keep the last incomplete line in buffer
        buffer = lines[lines.length - 1];

        // Process complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6); // Remove "data: " prefix

            if (dataStr === '[DONE]') {
              // End of stream
              break;
            }

            try {
              const json = JSON.parse(dataStr);
              const sleep = (ms) => new Promise(res => setTimeout(res, ms));
              console.log("STREAM JSON:", json);
              if (json.text) {
                const source = json.source;
                for (const char of json.text) {
                  accumulatedText += char;

                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = accumulatedText;
                    if (source && !updated[updated.length - 1].source) {
                      updated[updated.length - 1].source = source;
                    }
                    return updated;
                  });

                  await sleep(8);
                }
              } else if (json.error) {
                accumulatedText = `Error: ${json.error}`;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = accumulatedText;
                  return updated;
                });
              }
            } catch (parseErr) {
              console.error("Failed to parse SSE data:", dataStr, parseErr);
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream Error:", err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = `Error: ${err.message}`;
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medi-layout">
      {/* Sidebar for Navigation */}
      <nav className="sidebar">
        <div className="sidebar-brand">MQ</div>
        <ul className="sidebar-menu">
          <li className="active">
            <i className="icon-chat"></i>
          </li>
          <li>
            <i className="icon-history"></i>
          </li>
        </ul>
        <div className="user-avatar">AR</div>
      </nav>

      {/* Main Chat Area */}
      <main className="chat-interface">
        <header className="header">
          <div className="header-text">
            <h1>MediQuery</h1>
            <span className="status-indicator">Powered by Llama 3.1 & RAG</span>
          </div>
          <div className="disclaimer-badge">Clinical Info Only</div>
        </header>

        <div className="chat-viewport">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-row ${msg.role}`}>
              <div className="chat-bubble">
                {msg.content === '' && msg.role === 'assistant' ? (
                  <div className="loader">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <>
                    {msg.content}

                    {msg.role === 'assistant' && msg.source === 'kb' && (
                      <div className="source-label">
                        Source: Knowledge Base
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-bar">
          <div className="input-wrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a medical question (e.g., Symptoms of Hypertension)..."
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <p className="legal-footer">
            Always consult a healthcare professional for medical diagnosis and treatment.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;