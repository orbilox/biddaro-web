'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  HardHat, Send, Bot, User, ArrowLeft, Sparkles, RefreshCw,
  HardHat as HardHatIcon, Hammer, DollarSign, FileText, Shield, Clock,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { aiApi } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Suggested prompts ────────────────────────────────────────────────────────
const suggestedPrompts = [
  { icon: DollarSign,  label: 'Kitchen remodel cost',    text: 'How much does a kitchen remodel cost?' },
  { icon: Hammer,      label: 'Deck materials list',     text: 'What materials do I need to build a 12×16 deck?' },
  { icon: FileText,    label: 'Permit requirements',     text: 'What permits do I need for a home addition?' },
  { icon: Shield,      label: 'Hiring safely',           text: 'How do I verify a contractor is legitimate and avoid scams?' },
  { icon: Clock,       label: 'Roof timeline',           text: 'How long does a full roof replacement take?' },
  { icon: HardHatIcon, label: 'Bathroom renovation',     text: 'What is the average cost to renovate a small bathroom?' },
];

// ─── Welcome screen ────────────────────────────────────────────────────────────
function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 shadow-xl">
        <Bot className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-3xl font-extrabold text-dark-900 mb-3">
        Biddaro AI Assistant
      </h1>
      <p className="text-dark-500 text-lg max-w-xl mb-2">
        Your 24/7 construction expert — free, no login required.
      </p>
      <p className="text-dark-400 text-sm max-w-lg mb-12">
        Ask anything about costs, materials, permits, hiring contractors, timelines, and more.
      </p>

      {/* Suggested prompts */}
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-4">
          Try asking about…
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedPrompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <button
                key={prompt.label}
                onClick={() => onPrompt(prompt.text)}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-left hover:border-brand-400 hover:bg-brand-50 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-4 h-4 text-brand-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-dark-800 truncate">{prompt.label}</p>
                  <p className="text-xs text-dark-400 truncate">{prompt.text}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-brand-500'
            : 'bg-dark-800 border border-dark-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-brand-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-brand-500 text-white rounded-tr-sm'
            : 'bg-white border border-gray-200 text-dark-800 rounded-tl-sm shadow-sm'
        }`}
      >
        {message.content}
        <div className={`text-xs mt-1.5 ${isUser ? 'text-brand-200' : 'text-dark-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row mb-6">
      <div className="w-9 h-9 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-brand-400" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5 h-5">
          <span className="w-2 h-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setError('');
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const payload = updatedMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await aiApi.chat(payload);
      const reply: string = (res.data as { data: { reply: string } }).data.reply;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const anyErr = err as { response?: { data?: { message?: string } } };
      const msg =
        anyErr?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
      // Remove the user message we just added so they can retry
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
    setError('');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: back + logo */}
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-1.5 text-dark-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="w-px h-5 bg-dark-700" />
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <HardHat className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-base">Biddaro</span>
            </Link>
          </div>

          {/* Center: title */}
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-white text-sm font-semibold">AI Construction Assistant</span>
            <span className="bg-brand-500/20 text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-500/30">
              Free
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-dark-400 hover:text-white transition-colors text-xs px-3 py-1.5 rounded-lg hover:bg-dark-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            )}
            <Link href={ROUTES.REGISTER}>
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Chat area ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        {/* Messages or welcome */}
        <div className="flex-1 overflow-y-auto px-4 pt-6">
          {!hasMessages ? (
            <WelcomeScreen onPrompt={(text) => sendMessage(text)} />
          ) : (
            <div className="pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ─── Error banner ────────────────────────────────────────────── */}
        {error && (
          <div className="mx-4 mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 font-bold flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* ─── Input bar ───────────────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 pt-3 pb-4">
          <div className="flex gap-3 items-end bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about construction, costs, materials, hiring…"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent text-sm text-dark-800 placeholder-dark-400 outline-none leading-relaxed disabled:opacity-50 min-h-[24px] max-h-[160px]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <p className="text-center text-xs text-dark-400 mt-2">
            AI answers are for guidance only. Always consult a licensed professional for structural, electrical, or plumbing work.
          </p>
        </div>
      </main>
    </div>
  );
}
