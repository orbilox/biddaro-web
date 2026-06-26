'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  Sparkles, RefreshCw, Copy, Download, CheckCircle, Archive,
  Trash2, Image as ImageIcon, Loader2, Hash, Megaphone,
} from 'lucide-react';

interface SocialPost {
  id:          string;
  topic:       string;
  platform:    string;
  caption:     string;
  hashtags:    string | null;
  imagePrompt: string | null;
  imageUrl:    string | null;
  status:      string;   // draft | used | archived
  source:      string;   // auto | manual
  createdAt:   string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function statusBadge(status: string) {
  if (status === 'used')     return 'bg-green-100 text-green-700';
  if (status === 'archived') return 'bg-gray-100 text-gray-500';
  return 'bg-blue-100 text-blue-700';
}

export default function SocialPostsPage() {
  const [posts, setPosts]       = useState<SocialPost[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [generating, setGen]    = useState(false);
  const [filter, setFilter]     = useState('');
  const [topic, setTopic]       = useState('');

  async function load(f = filter) {
    setLoading(true);
    try {
      const res = await adminApi.socialPosts({ limit: 60, status: f || undefined });
      setPosts(res.data.data.posts);
      setTotal(res.data.data.total);
    } catch {
      toast.error('Failed to load social posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function applyFilter(f: string) {
    setFilter(f);
    load(f);
  }

  async function generateNow() {
    setGen(true);
    try {
      await adminApi.generateSocialPost(topic.trim() || undefined);
      toast.success('New post generated');
      setTopic('');
      load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Generation failed — check that OPENAI_API_KEY is set');
    } finally {
      setGen(false);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied`),
      () => toast.error('Copy failed'),
    );
  }

  async function setStatus(id: string, status: string) {
    try {
      await adminApi.updateSocialPost(id, { status });
      setPosts(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
      toast.success(status === 'used' ? 'Marked as used' : status === 'archived' ? 'Archived' : 'Updated');
    } catch {
      toast.error('Update failed');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await adminApi.deleteSocialPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      setTotal(t => Math.max(0, t - 1));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  const noImages = !loading && posts.length > 0 && posts.every(p => !p.imageUrl);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-brand-500" />
            Social Posts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            AI-generated captions &amp; images for your social media — review, copy, and post.
          </p>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-brand-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Generate bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Optional: a topic to write about (leave blank for an automatic theme)"
          className="flex-1 min-w-[220px] text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-400"
        />
        <button
          onClick={generateNow}
          disabled={generating}
          className="flex items-center gap-2 bg-brand-600 text-white text-sm font-medium rounded-xl px-4 py-2 hover:bg-brand-700 disabled:opacity-60 transition-colors"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? 'Generating…' : 'Generate Now'}
        </button>
      </div>

      {/* Image-config hint */}
      {noImages && (
        <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
          <ImageIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Posts are generating captions but no images. To add AI images, set <code className="font-mono">GEMINI_API_KEY</code> (and AWS S3 keys) in your Railway environment.
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {[
          { value: '',         label: 'All' },
          { value: 'draft',    label: 'Draft' },
          { value: 'used',     label: 'Used' },
          { value: 'archived', label: 'Archived' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => applyFilter(value)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === value ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{total} total</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No posts yet</p>
          <p className="text-gray-400 text-sm mt-1">Click &ldquo;Generate Now&rdquo; or wait for the daily automation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative aspect-square bg-gray-50">
                {post.imageUrl ? (
                  <Image src={post.imageUrl} alt={post.topic} fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(post.status)}`}>
                  {post.status}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 text-white">
                  {timeAgo(post.createdAt)}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="text-xs text-gray-400 line-clamp-1">{post.topic}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-5">{post.caption}</p>
                {post.hashtags && (
                  <p className="text-xs text-brand-600 flex items-start gap-1">
                    <Hash className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{post.hashtags}</span>
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto pt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => copy(`${post.caption}\n\n${post.hashtags || ''}`.trim(), 'Caption')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                  {post.imageUrl && (
                    <a
                      href={post.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Image
                    </a>
                  )}
                  {post.status !== 'used' && (
                    <button
                      onClick={() => setStatus(post.id, 'used')}
                      className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Used
                    </button>
                  )}
                  {post.status !== 'archived' && (
                    <button
                      onClick={() => setStatus(post.id, 'archived')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" /> Archive
                    </button>
                  )}
                  <button
                    onClick={() => remove(post.id)}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
