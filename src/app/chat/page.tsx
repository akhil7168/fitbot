'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square, Trash2, AlertCircle, X, Zap, Bot } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { SUGGESTED_PROMPTS } from '@/lib/constants';
import { format } from 'date-fns';

export default function ChatPage() {
  const { messages, isLoading, error, sendMessage, clearChat, stopStreaming, dismissError } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    let html = text
      .replace(/### (.*?)(\n|$)/g, '<h4>$1</h4>')
      .replace(/## (.*?)(\n|$)/g, '<h3>$1</h3>')
      .replace(/# (.*?)(\n|$)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^\- (.*?)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
      .replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, (match) => `<ul>${match}</ul>`)
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    
    if (!html.startsWith('<')) html = `<p>${html}</p>`;
    return html;
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">
            <Bot size={20} />
          </div>
          <div className="chat-header-info">
            <h3>FitBot AI Coach</h3>
            <div className="chat-status">
              <span className="chat-status-dot" />
              {isLoading ? 'Thinking...' : 'Online — Ready to help'}
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={clearChat}>
            <Trash2 size={14} />
            Clear Chat
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={dismissError}>
            <X size={12} /> Dismiss
          </button>
        </div>
      )}

      {/* Messages or Empty State */}
      {messages.length === 0 ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">
            <Zap size={36} />
          </div>
          <h2>Welcome to FitBot AI</h2>
          <p>Your personal AI fitness coach. Ask me anything about workouts, nutrition, exercises, and wellness.</p>
          <div className="suggested-prompts">
            {SUGGESTED_PROMPTS.map((sp, i) => (
              <button
                key={i}
                className="suggested-prompt"
                onClick={() => handleSuggestedPrompt(sp.prompt)}
              >
                <span className="suggested-prompt-icon">{sp.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{sp.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {sp.prompt.length > 60 ? sp.prompt.slice(0, 60) + '...' : sp.prompt}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? <Bot size={18} /> : '👤'}
              </div>
              <div>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{
                    __html: msg.role === 'assistant'
                      ? renderMarkdown(msg.content || '')
                      : msg.content.replace(/\n/g, '<br/>'),
                  }}
                />
                {msg.isStreaming && !msg.content && (
                  <div className="typing-indicator" style={{ marginTop: 8 }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                )}
                <div className="message-timestamp">
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about workouts, nutrition, exercises..."
            rows={1}
            disabled={isLoading}
          />
          {isLoading ? (
            <button className="chat-send-btn chat-stop-btn" onClick={stopStreaming} title="Stop generating">
              <Square size={18} />
            </button>
          ) : (
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
              title="Send message (Enter)"
            >
              <Send size={18} />
            </button>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          FitBot can make mistakes. Consult a professional for medical advice.
        </div>
      </div>
    </div>
  );
}
