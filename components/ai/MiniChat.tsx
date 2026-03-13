'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { aiApi } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MiniChatProps {
  systemPrompt: string;
  suggestedPrompts: string[];
  placeholder?: string;
  greeting?: string;
}

export function MiniChat({
  systemPrompt,
  suggestedPrompts,
  placeholder = 'Ask your question...',
  greeting,
}: MiniChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setHasStarted(true);

    try {
      // Prepend system prompt as a hidden context user message
      const apiMessages = [
        { role: 'user' as const, content: systemPrompt },
        { role: 'assistant' as const, content: 'Understood. I will answer questions based on this context.' },
        ...updatedMessages,
      ];

      const res = await aiApi.chat(apiMessages);
      const data = res.data as { data?: { message?: string; content?: string } };
      const assistantContent =
        data?.data?.message ||
        data?.data?.content ||
        'I couldn\'t generate a response. Please try again.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantContent },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">Biddaro AI Assistant</p>
          <p className="text-xs text-orange-100">Online · Responds instantly</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Greeting bubble */}
        {greeting && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-orange-600" />
            </div>
            <div className="max-w-[85%] bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
              <p className="text-sm text-gray-800 leading-relaxed">{greeting}</p>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 items-start ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                msg.role === 'user'
                  ? 'bg-orange-500'
                  : 'bg-orange-100'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-orange-600" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-orange-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts — shown before first message */}
      {!hasStarted && suggestedPrompts.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={loading}
          className="flex-1 resize-none bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50 max-h-24 overflow-y-auto"
          style={{ minHeight: '38px' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
