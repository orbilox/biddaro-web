'use client';
import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Send, Loader2, MessageSquare } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { timeAgo } from '@/lib/utils';
import { messagesApi, usersApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Conversation, Message, User } from '@/types';

// ─── Conversation list item ────────────────────────────────────────────────────

function ConversationItem({
  conv,
  active,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  const { otherUser, lastMessage, unreadCount, job } = conv;
  const name = `${otherUser?.firstName ?? ''} ${otherUser?.lastName ?? ''}`.trim();
  const jobTitle = job?.title ?? '';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        active ? 'bg-brand-50 border-l-2 border-l-brand-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar
            firstName={otherUser?.firstName}
            lastName={otherUser?.lastName}
            size="md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`text-sm font-semibold truncate ${active ? 'text-brand-700' : 'text-dark-900'}`}>
              {name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-dark-400 flex-shrink-0">{timeAgo(lastMessage.createdAt)}</p>
            )}
          </div>
          {jobTitle && <p className="text-xs text-dark-400 truncate mb-1">{jobTitle}</p>}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-dark-500 truncate">{lastMessage?.content ?? 'No messages yet'}</p>
            {unreadCount > 0 && (
              <span className="flex-shrink-0 w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function ChatBubble({
  message,
  isMe,
  otherUser,
}: {
  message: Message;
  isMe: boolean;
  otherUser?: Conversation['otherUser'];
}) {
  return (
    <div className={`flex gap-2 mb-3 ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && (
        <Avatar
          firstName={otherUser?.firstName}
          lastName={otherUser?.lastName}
          size="xs"
        />
      )}
      <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isMe
              ? 'bg-brand-500 text-white rounded-tr-sm'
              : 'bg-white border border-gray-200 text-dark-800 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>
        <p className="text-xs text-dark-400">{timeAgo(message.createdAt)}</p>
      </div>
    </div>
  );
}

// ─── Inner page (reads search params) ────────────────────────────────────────

function MessagesInner() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const initUserId = searchParams.get('userId') ?? null;

  const [search, setSearch] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeOtherUserId, setActiveOtherUserId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  // Holds user info when navigated directly to a user with no existing conversation
  const [fallbackUser, setFallbackUser] = useState<Partial<User> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Load conversation list ──────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      const res = await messagesApi.conversations();
      const data = res.data.data;
      // Backend returns a plain array of conversation objects
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load messages', 'Please try again.');
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Pre-select conversation from ?userId query param ───────────────────────
  useEffect(() => {
    if (initUserId && !activeOtherUserId) {
      setActiveOtherUserId(initUserId);
    }
  }, [initUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── When active userId is set but not in conv list, fetch their info ───────
  useEffect(() => {
    if (!activeOtherUserId) { setFallbackUser(null); return; }
    const found = conversations.find((c) => c.otherUserId === activeOtherUserId);
    if (!found) {
      usersApi.getPublic(activeOtherUserId)
        .then((res) => setFallbackUser(res.data.data))
        .catch(() => setFallbackUser(null));
    } else {
      setFallbackUser(null);
    }
  }, [activeOtherUserId, conversations]);

  // ── Load thread when active conversation changes ────────────────────────────
  useEffect(() => {
    if (!activeOtherUserId) return;

    const load = async () => {
      setLoadingThread(true);
      setThreadMessages([]);
      try {
        const res = await messagesApi.getThread(activeOtherUserId);
        const data = res.data.data;
        // getMessages returns a paginated result: { data: [...messages], pagination: {...} }
        setThreadMessages(data.data || (Array.isArray(data) ? data : []));

        // Mark as read and update unread count locally
        messagesApi.markRead(activeOtherUserId).catch(() => null);
        setConversations((prev) =>
          prev.map((c) =>
            c.otherUserId === activeOtherUserId ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch {
        toast.error('Failed to load thread', 'Please try again.');
      } finally {
        setLoadingThread(false);
      }
    };

    load();
  }, [activeOtherUserId]);

  // ── Scroll to bottom on new messages ───────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeOtherUserId || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const activeConvUser = conversations.find((c) => c.otherUserId === activeOtherUserId)?.otherUser
      ?? (fallbackUser as User | undefined);

    // Optimistic update
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      senderId: user?.id ?? '',
      sender: user as User,
      receiverId: activeOtherUserId,
      receiver: activeConvUser as User,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setThreadMessages((prev) => [...prev, optimistic]);

    // Update conversation last message optimistically
    setConversations((prev) =>
      prev.map((c) =>
        c.otherUserId === activeOtherUserId
          ? { ...c, lastMessage: { ...c.lastMessage, content, createdAt: optimistic.createdAt } as Message }
          : c
      )
    );

    try {
      const res = await messagesApi.send({ receiverId: activeOtherUserId, content });
      const sent: Message = res.data.data;
      // Replace optimistic with real message
      setThreadMessages((prev) => prev.map((m) => (m.id === optimistic.id ? sent : m)));
      // Reload conversations to get accurate last message + ensure conv appears in list
      loadConversations();
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error('Failed to send', errMsg || 'Please try again.');
      // Rollback optimistic message
      setThreadMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeConv = conversations.find((c) => c.otherUserId === activeOtherUserId) ?? null;
  // Use fallback user info when conv doesn't exist yet (new conversation)
  const activeDisplayUser: Partial<User> | null =
    (activeConv?.otherUser as Partial<User>) ?? fallbackUser ?? null;

  const filtered = conversations.filter((c) => {
    const name = `${c.otherUser?.firstName ?? ''} ${c.otherUser?.lastName ?? ''}`.toLowerCase();
    const title = c.job?.title?.toLowerCase() ?? '';
    const q = search.toLowerCase();
    return name.includes(q) || title.includes(q);
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* ── Conversation list sidebar ─────────────────────────────────────── */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-dark-900 mb-3">Messages</h2>
          <Input
            placeholder="Search conversations..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((conv) => (
              <ConversationItem
                key={conv.otherUserId}
                conv={conv}
                active={conv.otherUserId === activeOtherUserId}
                onClick={() => setActiveOtherUserId(conv.otherUserId)}
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-dark-400">
                {search ? 'No conversations found' : 'No messages yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Chat area ─────────────────────────────────────────────────────── */}
      {activeOtherUserId ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 px-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar
                firstName={activeDisplayUser?.firstName}
                lastName={activeDisplayUser?.lastName}
                size="sm"
              />
              <div>
                <p className="font-semibold text-dark-900 text-sm">
                  {activeDisplayUser?.firstName ?? '—'} {activeDisplayUser?.lastName ?? ''}
                </p>
                <p className="text-xs text-dark-400 capitalize">
                  {(activeDisplayUser?.role as string | undefined)?.replace('_', ' ') ?? ''}
                  {activeConv?.job?.title ? ` · ${activeConv.job.title}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
            {loadingThread ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
              </div>
            ) : threadMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-dark-400 text-sm">
                <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                <p>No messages yet. Say hello!</p>
              </div>
            ) : (
              threadMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  isMe={msg.senderId === user?.id}
                  otherUser={activeConv?.otherUser}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex items-end gap-3 flex-shrink-0">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                rows={1}
                className="w-full resize-none border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-dark-800 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <Button
              size="sm"
              className="flex-shrink-0 mb-0.5"
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              loading={sending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* No conversation selected */
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-7 h-7 text-dark-300" />
            </div>
            <p className="text-dark-500 font-medium">Select a conversation</p>
            <p className="text-sm text-dark-400">Choose from your messages on the left</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page wrapper (Suspense required by Next.js for useSearchParams) ──────────

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    }>
      <MessagesInner />
    </Suspense>
  );
}
