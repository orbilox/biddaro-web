'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  HardHat, Send, Bot, User, Sparkles, RefreshCw,
  Paperclip, Mic, MicOff, Copy, Check, Trash2, Plus,
  FileText, X, RotateCcw, Menu, ArrowLeft,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { aiApi, AiContentPart } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Attachment {
  id: string;
  name: string;
  kind: 'image' | 'document';
  dataUrl: string;
  size: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const LS_KEY = 'biddaro-ai-conversations';
const MAX_CONVERSATIONS = 50;
const MAX_FILE_MB = 20;

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveConversations(convs: Conversation[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(convs.slice(0, MAX_CONVERSATIONS))); } catch { /* quota */ }
}

// ─── buildPayload — converts Message[] → OpenAI multimodal payload ────────────
function buildPayload(msgs: Message[]): Array<{ role: string; content: string | AiContentPart[] }> {
  return msgs.map((m) => {
    if (!m.attachments?.length) return { role: m.role, content: m.content };
    const parts: AiContentPart[] = [];
    if (m.content && m.content !== '(see attached files)') parts.push({ type: 'text', text: m.content });
    m.attachments.forEach((att) => {
      if (att.kind === 'image') parts.push({ type: 'image_url', image_url: { url: att.dataUrl, detail: 'auto' } });
      else parts.push({ type: 'text', text: `[Attached document: ${att.name}]` });
    });
    return { role: m.role, content: parts };
  });
}

// ─── Inline markdown renderer ─────────────────────────────────────────────────
function MarkdownText({ children }: { children: string }) {
  const parts: React.ReactNode[] = [];
  const inlineRe = /(\*\*(.+?)\*\*|__(.+?)__|`([^`]+?)`|\*(.+?)\*|_(.+?)_)/g;
  let last = 0; let match; let k = 0;
  while ((match = inlineRe.exec(children)) !== null) {
    if (match.index > last) parts.push(children.slice(last, match.index));
    const full = match[0];
    if (full.startsWith('**') || full.startsWith('__')) {
      parts.push(<strong key={k++} className="font-semibold">{match[2] ?? match[3]}</strong>);
    } else if (full.startsWith('`')) {
      parts.push(<code key={k++} className="bg-gray-100 text-brand-600 px-1.5 py-0.5 rounded text-[0.8em] font-mono">{match[4]}</code>);
    } else {
      parts.push(<em key={k++} className="italic">{match[5] ?? match[6]}</em>);
    }
    last = match.index + full.length;
  }
  if (last < children.length) parts.push(children.slice(last));
  return <>{parts}</>;
}

// ─── Code block with copy button ─────────────────────────────────────────────
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-200 text-sm">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-xs text-gray-400 font-mono">{lang || 'code'}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 px-4 py-3 overflow-x-auto text-gray-200 font-mono leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

// ─── Full markdown content renderer ──────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0; let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      nodes.push(<CodeBlock key={k++} code={codeLines.join('\n')} lang={lang} />);
      i++; continue;
    }

    // Headings
    const hm = line.match(/^(#{1,3})\s+(.*)/);
    if (hm) {
      const lvl = hm[1].length;
      const cls = lvl === 1 ? 'text-base font-bold mt-4 mb-2 text-dark-900' : lvl === 2 ? 'text-sm font-bold mt-3 mb-1.5 text-dark-800' : 'text-sm font-semibold mt-2 mb-1 text-dark-700';
      nodes.push(<div key={k++} className={cls}><MarkdownText>{hm[2]}</MarkdownText></div>);
      i++; continue;
    }

    // Unordered list — collect consecutive items
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) { items.push(lines[i].replace(/^[-*+]\s/, '')); i++; }
      nodes.push(<ul key={k++} className="list-disc list-outside ml-4 space-y-1 my-2">{items.map((it, j) => <li key={j} className="text-sm leading-relaxed"><MarkdownText>{it}</MarkdownText></li>)}</ul>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, '')); i++; }
      nodes.push(<ol key={k++} className="list-decimal list-outside ml-4 space-y-1 my-2">{items.map((it, j) => <li key={j} className="text-sm leading-relaxed"><MarkdownText>{it}</MarkdownText></li>)}</ol>);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      nodes.push(<div key={k++} className="border-l-4 border-brand-300 pl-4 my-2 text-dark-500 italic text-sm"><MarkdownText>{line.slice(2)}</MarkdownText></div>);
      i++; continue;
    }

    // HR
    if (/^[-*_]{3,}$/.test(line.trim())) { nodes.push(<hr key={k++} className="border-gray-200 my-3" />); i++; continue; }

    // Blank line
    if (!line.trim()) { nodes.push(<div key={k++} className="h-1.5" />); i++; continue; }

    // Paragraph
    nodes.push(<p key={k++} className="text-sm leading-relaxed"><MarkdownText>{line}</MarkdownText></p>);
    i++;
  }
  return <div className="space-y-0.5">{nodes}</div>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, isOpen, onClose }: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto w-64 bg-dark-900 border-r border-dark-700 flex flex-col transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* New chat */}
        <div className="p-3 border-b border-dark-700">
          <button onClick={onNew} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-600 hover:border-brand-500 hover:bg-dark-800 text-dark-300 hover:text-white transition-all text-sm font-medium">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {conversations.length === 0
            ? <p className="text-dark-500 text-xs text-center py-8 px-4">No chats yet. Start one!</p>
            : conversations.map((conv) => (
              <div key={conv.id}
                className={`group flex items-center gap-2 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${conv.id === activeId ? 'bg-dark-700 text-white' : 'text-dark-300 hover:bg-dark-800 hover:text-white'}`}
                onClick={() => { onSelect(conv.id); onClose(); }}>
                <Bot className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                <span className="flex-1 text-xs truncate">{conv.title}</span>
                <button onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-dark-600 transition-all flex-shrink-0">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-dark-700">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Biddaro
          </Link>
        </div>
      </aside>
    </>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, isLast, onRegenerate, isLoading }: {
  message: Message;
  isLast: boolean;
  onRegenerate?: () => void;
  isLoading?: boolean;
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(message.content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6 group`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUser ? 'bg-brand-500' : 'bg-dark-800 border border-dark-600'}`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-400" />}
      </div>

      {/* Content column */}
      <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Attachments (images + doc chips) */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.attachments.map((att) =>
              att.kind === 'image'
                ? <img key={att.id} src={att.dataUrl} alt={att.name} className="max-w-[180px] max-h-[180px] rounded-xl object-cover border border-gray-200 shadow-sm" />
                : <div key={att.id} className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2"><FileText className="w-4 h-4 text-brand-500" /><span className="text-xs text-dark-700 max-w-[120px] truncate">{att.name}</span></div>
            )}
          </div>
        )}

        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm ${isUser ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-dark-800 rounded-tl-sm shadow-sm'}`}>
          {isUser
            ? <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
            : <MarkdownContent content={message.content} />}
          <div className={`text-xs mt-2 ${isUser ? 'text-brand-200' : 'text-dark-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Action row — AI messages only */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-dark-400 hover:text-dark-700 hover:bg-gray-100 transition-colors">
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {isLast && !isLoading && onRegenerate && (
              <button onClick={onRegenerate} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-dark-400 hover:text-dark-700 hover:bg-gray-100 transition-colors">
                <RotateCcw className="w-3 h-3" /> Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
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

// ─── Suggested prompts + Welcome ─────────────────────────────────────────────
const SUGGESTED = [
  { icon: '💰', label: 'Cost Estimate',   text: 'How much does a full kitchen remodel cost in 2025?' },
  { icon: '🔨', label: 'Materials',       text: 'What materials do I need to build a 12×16 deck?' },
  { icon: '📋', label: 'Permits',         text: 'What building permits do I need for a home addition?' },
  { icon: '🛡️', label: 'Hiring Tips',    text: 'How do I verify a contractor is legitimate and avoid scams?' },
  { icon: '⏱️', label: 'Timeline',       text: 'How long does a complete roof replacement typically take?' },
  { icon: '🏠', label: 'Bathroom Reno',  text: 'What is the average cost to renovate a small bathroom?' },
];

function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 shadow-xl">
        <Bot className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-extrabold text-dark-900 mb-2">Biddaro AI</h1>
      <p className="text-dark-500 text-base max-w-md mb-1">Your 24/7 construction expert — free, no login required.</p>
      <p className="text-dark-400 text-sm max-w-lg mb-10">
        Ask about costs, materials, permits, hiring & timelines. Supports{' '}
        <span className="text-brand-500 font-semibold">image uploads</span> and{' '}
        <span className="text-brand-500 font-semibold">voice input</span>!
      </p>
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-4">Suggested prompts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUGGESTED.map((p) => (
            <button key={p.label} onClick={() => onPrompt(p.text)}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-left hover:border-brand-400 hover:bg-brand-50 hover:shadow-sm transition-all duration-150">
              <span className="text-2xl flex-shrink-0">{p.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-dark-800">{p.label}</p>
                <p className="text-xs text-dark-400 truncate">{p.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId]           = useState<string | null>(null);
  const [input, setInput]                 = useState('');
  const [attachments, setAttachments]     = useState<Attachment[]>([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState('');
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [isRecording, setIsRecording]     = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);
    if (convs.length > 0) setActiveId(convs[0].id);
  }, []);

  // Persist on change
  useEffect(() => { saveConversations(conversations); }, [conversations]);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversations, activeId, isLoading]);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const messages   = activeConv?.messages ?? [];

  // ── Conversation management ────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    const conv: Conversation = { id: Date.now().toString(), title: 'New Chat', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setInput(''); setAttachments([]); setError('');
  }, []);

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  // ── File attachment ──────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      if (file.size > MAX_FILE_MB * 1024 * 1024) { setError(`"${file.name}" exceeds ${MAX_FILE_MB} MB.`); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const kind: Attachment['kind'] = file.type.startsWith('image/') ? 'image' : 'document';
        setAttachments((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, name: file.name, kind, dataUrl, size: file.size }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Voice input (Web Speech API) ────────────────────────────────────────────
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setError('Voice input requires Chrome or Edge.'); return; }
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }

    const rec = new SR();
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = true;
    rec.onresult = (ev: any) => setInput(Array.from(ev.results).map((r: any) => r[0].transcript).join(''));
    rec.onend  = () => setIsRecording(false);
    rec.onerror = () => { setIsRecording(false); setError('Voice input error. Please try again.'); };
    recognitionRef.current = rec;
    rec.start(); setIsRecording(true);
  };

  // ── Core API call helper ─────────────────────────────────────────────────────
  const callApi = async (convId: string, msgs: Message[]) => {
    setIsLoading(true);
    try {
      const res = await aiApi.chat(buildPayload(msgs) as any);
      const reply: string = (res.data as any).data.reply;
      const aiMsg: Message = { id: `${Date.now()}-ai`, role: 'assistant', content: reply, timestamp: Date.now() };
      setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, messages: [...msgs, aiMsg], updatedAt: Date.now() } : c));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
      throw err; // re-throw so callers can react
    } finally {
      setIsLoading(false);
    }
  };

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if ((!content && attachments.length === 0) || isLoading) return;

    setError('');

    // Ensure an active conversation exists
    let convId = activeId;
    if (!convId) {
      const conv: Conversation = { id: Date.now().toString(), title: content.slice(0, 40) || 'Image Upload', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      convId = conv.id;
    }

    const currentAttachments = [...attachments];
    setInput(''); setAttachments([]);
    if (inputRef.current) inputRef.current.style.height = 'auto';

    const userMsg: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: content || '(see attached files)',
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      timestamp: Date.now(),
    };

    // Update title on first message
    setConversations((prev) => prev.map((c) => {
      if (c.id !== convId) return c;
      const updatedMsgs = [...c.messages, userMsg];
      return { ...c, title: c.messages.length === 0 ? (content.slice(0, 40) || 'Image Upload') : c.title, messages: updatedMsgs, updatedAt: Date.now() };
    }));

    // Get up-to-date messages for the API call
    const currentMessages = [...(activeConv?.messages ?? []), userMsg];
    try {
      await callApi(convId, currentMessages);
    } catch {
      // Rollback user message on error
      setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, messages: c.messages.filter((m) => m.id !== userMsg.id) } : c));
      setInput(content); setAttachments(currentAttachments);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, attachments, activeId, activeConv, isLoading]);

  // ── Regenerate last AI response ──────────────────────────────────────────────
  const handleRegenerate = async () => {
    if (!activeConv || messages.length < 2 || isLoading) return;
    const withoutLast = messages.slice(0, -1); // strip last AI message
    setConversations((prev) => prev.map((c) => c.id === activeConv.id ? { ...c, messages: withoutLast, updatedAt: Date.now() } : c));
    setError('');
    try { await callApi(activeConv.id, withoutLast); }
    catch { setConversations((prev) => prev.map((c) => c.id === activeConv.id ? activeConv : c)); }
  };

  // ── Input helpers ────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const hasMessages = messages.length > 0;
  const lastMsg     = messages[messages.length - 1];

  // ── JSX ──────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="bg-dark-900 border-b border-dark-700 flex-shrink-0 z-40">
          <div className="px-4 h-16 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen((v) => !v)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                  <HardHat className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-base">Biddaro</span>
              </div>
            </div>

            {/* Center */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-white text-sm font-semibold hidden sm:inline">AI Construction Assistant</span>
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-500/30">GPT-4o mini</span>
              <span className="bg-brand-500/20 text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-500/30">Free</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {hasMessages && (
                <button onClick={handleNewChat} className="flex items-center gap-1.5 text-dark-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-dark-800 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /><span className="hidden sm:inline">New Chat</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── Chat area ──────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages scroll container */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 pt-6">
              {!hasMessages ? (
                <WelcomeScreen onPrompt={(t) => sendMessage(t)} />
              ) : (
                <div className="pb-4">
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isLast={idx === messages.length - 1}
                      onRegenerate={msg.role === 'assistant' ? handleRegenerate : undefined}
                      isLoading={isLoading}
                    />
                  ))}
                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* ── Error banner ──────────────────────────────────────────────── */}
          {error && (
            <div className="max-w-3xl mx-auto w-full px-4 mb-2">
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between gap-3">
                <span>{error}</span>
                <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 font-bold flex-shrink-0">✕</button>
              </div>
            </div>
          )}

          {/* ── Attachment preview strip ───────────────────────────────────── */}
          {attachments.length > 0 && (
            <div className="max-w-3xl mx-auto w-full px-4 mb-2 flex flex-wrap gap-2">
              {attachments.map((att) => (
                <div key={att.id} className="relative group">
                  {att.kind === 'image'
                    ? <img src={att.dataUrl} alt={att.name} className="w-16 h-16 rounded-lg object-cover border border-gray-300 shadow-sm" />
                    : <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"><FileText className="w-4 h-4 text-brand-500" /><span className="text-xs text-dark-700 max-w-[100px] truncate">{att.name}</span></div>
                  }
                  <button onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Input bar ─────────────────────────────────────────────────── */}
          <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 pt-3 pb-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
                {/* Textarea */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about construction, costs, materials, hiring…"
                  rows={1}
                  disabled={isLoading}
                  className="w-full resize-none bg-transparent text-sm text-dark-800 placeholder-dark-400 outline-none leading-relaxed disabled:opacity-50 min-h-[24px] max-h-[160px]"
                />

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Attach file */}
                    <button onClick={() => fileInputRef.current?.click()} disabled={isLoading}
                      title="Attach image or document"
                      className="w-8 h-8 rounded-lg text-dark-400 hover:text-brand-500 hover:bg-brand-50 flex items-center justify-center transition-colors disabled:opacity-40">
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Voice */}
                    <button onClick={toggleVoice} disabled={isLoading}
                      title={isRecording ? 'Stop recording' : 'Voice input (Chrome/Edge)'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-dark-400 hover:text-brand-500 hover:bg-brand-50'}`}>
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {isRecording && <span className="text-xs text-red-500 font-medium animate-pulse ml-1">Listening…</span>}
                  </div>

                  {/* Send */}
                  <button onClick={() => sendMessage()}
                    disabled={(!input.trim() && attachments.length === 0) || isLoading}
                    className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors">
                    {isLoading
                      ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      : <Send className="w-4 h-4 text-white" />
                    }
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-dark-400 mt-2">
                AI answers are for guidance only. Always consult a licensed professional for structural, electrical, or plumbing work.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />
    </div>
  );
}
