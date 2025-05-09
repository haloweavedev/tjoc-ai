'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useCallback } from 'react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat', // Ensure this matches your backend endpoint
    initialMessages: [
      { id: '1', role: 'user', content: 'Hello, can you help me with holistic health?' },
      { id: '2', role: 'assistant', content: 'Of course! I\'d be happy to help with your holistic health questions. What specific aspect would you like to explore?' }
    ]
  });

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [scrollToBottom, messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto py-8 font-[family-name:var(--font-geist-sans)] bg-white">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-center text-[#171717]">TJOC AI</h1>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white border border-gray-300 rounded-lg shadow-sm mb-4">
        {messages.length === 0 && !isLoading && (
          <p className="text-center text-gray-500">
            How can I help you on your journey today?
          </p>
        )}
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg shadow ${
                m.role === 'user'
                  ? 'bg-[#448516] text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <span className="font-semibold capitalize mr-2">{m.role === 'assistant' ? 'AI' : m.role}:</span>
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700">
          <p className="font-semibold">Error:</p>
          <p>{error.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-tjoc-primary focus:border-transparent outline-none bg-white text-black"
          value={input}
          placeholder="Ask about holistic health..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-[#448516] text-white rounded-lg shadow-sm hover:bg-[#3a7012] focus:outline-none focus:ring-2 focus:ring-[#448516] focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
