'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export function QuoteForm({ slug, accentColor }: { slug: string; accentColor: string }) {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) { setError('Please add your name and phone number'); return; }
    setSending(true); setError('');
    try {
      // Same-origin call — proxied to the API by next.config rewrites
      const res = await fetch(`/api/v1/sites/${slug}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: message.trim() || undefined }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || 'Could not send your request');
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: accentColor }} />
        <p className="font-semibold text-gray-900">Request sent!</p>
        <p className="text-sm text-gray-500 mt-1">You&apos;ll get a call back soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
      />
      <input
        value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" inputMode="tel"
        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
      />
      <textarea
        value={message} onChange={e => setMessage(e.target.value)} rows={3}
        placeholder="What work do you need done? (optional)"
        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit" disabled={sending}
        className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold rounded-xl py-3.5 disabled:opacity-60 transition-opacity"
        style={{ backgroundColor: accentColor }}
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Request a Quote
      </button>
    </form>
  );
}
