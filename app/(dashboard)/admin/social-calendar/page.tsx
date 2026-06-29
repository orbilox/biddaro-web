'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  CalendarDays, ChevronLeft, ChevronRight, Sparkles, Loader2, Wand2,
  Copy, Download, CheckCircle, Trash2, X, Image as ImageIcon, Hash, Megaphone,
  Plus, Save,
} from 'lucide-react';

interface SocialPost {
  id:           string;
  topic:        string;
  caption:      string;
  hashtags:     string | null;
  imageUrl:     string | null;
  imageError:   string | null;
  status:       string;   // planned | draft | used | archived
  scheduledFor: string | null;
}

const CADENCES = [
  { value: 'daily',    label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'mwf',      label: 'Mon / Wed / Fri' },
  { value: 'custom',   label: 'Custom days' },
];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface ModalState { date: Date; post: SocialPost | null }

export default function SocialCalendarPage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [cadence, setCadence] = useState('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 3, 5]);
  const [planning, setPlanning] = useState(false);
  const [bulk, setBulk] = useState<{ running: boolean; done: number; total: number }>({ running: false, done: 0, total: 0 });
  const [genIds, setGenIds] = useState<Set<string>>(new Set());

  // Modal + editable fields
  const [modal, setModal] = useState<ModalState | null>(null);
  const [editTopic, setEditTopic]       = useState('');
  const [editCaption, setEditCaption]   = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const from = new Date(year, month, 1, 0, 0, 0).toISOString();
      const to   = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const res = await adminApi.socialPosts({ from, to });
      setPosts(res.data.data.posts);
    } catch {
      toast.error('Failed to load calendar');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  function openDay(date: Date, post: SocialPost | null) {
    setModal({ date, post });
    setEditTopic(post?.topic || '');
    setEditCaption(post?.caption || '');
    setEditHashtags(post?.hashtags || '');
  }
  function closeModal() { setModal(null); }

  function toggleCustomDay(d: number) {
    setCustomDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  async function planMonth() {
    setPlanning(true);
    try {
      const res = await adminApi.planSocialMonth({
        year, month: month + 1, cadence,
        customDays: cadence === 'custom' ? customDays : undefined,
      });
      const { created, skipped } = res.data.data;
      toast.success(`Planned ${created} day(s)${skipped ? `, ${skipped} already existed` : ''}`);
      load();
    } catch {
      toast.error('Planning failed');
    } finally {
      setPlanning(false);
    }
  }

  // Create a brand-new slot from a note on an empty day
  async function saveNewNote() {
    if (!modal || !editTopic.trim()) { toast.error('Write a note first'); return; }
    setSaving(true);
    try {
      const res = await adminApi.createSocialPost({
        scheduledFor: new Date(modal.date.getFullYear(), modal.date.getMonth(), modal.date.getDate(), 9, 0, 0).toISOString(),
        topic: editTopic.trim(),
      });
      const post = res.data.data.post as SocialPost;
      setPosts(prev => [...prev, post]);
      setModal({ date: modal.date, post });
      toast.success('Note saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  // Save edits to topic / caption / hashtags on an existing post
  async function saveEdits() {
    if (!modal?.post) return;
    setSaving(true);
    try {
      const res = await adminApi.updateSocialPost(modal.post.id, {
        topic: editTopic,
        caption: editCaption,
        hashtags: editHashtags,
      });
      const updated = res.data.data.post as SocialPost;
      setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setModal(m => (m ? { ...m, post: updated } : m));
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function generateOne(id: string) {
    setGenIds(prev => new Set(prev).add(id));
    try {
      const res = await adminApi.generateSocialSlot(id);
      const updated = res.data.data.post as SocialPost;
      const imageError = res.data.data.imageError as string | undefined;
      setPosts(prev => prev.map(p => (p.id === id ? updated : p)));
      setModal(m => (m && m.post?.id === id ? { ...m, post: updated } : m));
      setEditCaption(updated.caption);
      setEditHashtags(updated.hashtags || '');
      if (imageError) toast.error('Image failed', imageError);
      return true;
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Generation failed');
      return false;
    } finally {
      setGenIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  }

  async function generateAllEmpty() {
    const empty = posts.filter(p => p.status === 'planned');
    if (empty.length === 0) { toast.info('No empty days to generate'); return; }
    if (!confirm(`Generate content for ${empty.length} day(s)? This uses your OpenAI + Gemini credits.`)) return;
    setBulk({ running: true, done: 0, total: empty.length });
    for (let i = 0; i < empty.length; i++) {
      const ok = await generateOne(empty[i].id);
      setBulk(b => ({ ...b, done: i + 1 }));
      if (!ok) break;
    }
    setBulk({ running: false, done: 0, total: 0 });
    toast.success('Done generating');
  }

  async function setStatus(id: string, status: string) {
    try {
      await adminApi.updateSocialPost(id, { status });
      setPosts(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
      setModal(m => (m && m.post?.id === id ? { ...m, post: { ...m.post, status } } : m));
      toast.success('Updated');
    } catch { toast.error('Update failed'); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this day?')) return;
    try {
      await adminApi.deleteSocialPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      setModal(null);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success('Copied'), () => toast.error('Copy failed'));
  }

  // ── Build calendar grid ──────────────────────────────────────────────────
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDate: Record<string, SocialPost> = {};
  for (const p of posts) {
    if (p.scheduledFor) byDate[ymd(new Date(p.scheduledFor))] = p;
  }
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const emptyCount = posts.filter(p => p.status === 'planned').length;
  const post = modal?.post || null;

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand-500" /> Social Calendar
          </h1>
          <p className="text-gray-500 text-sm mt-1">Click any day to add a note, edit it, and generate the post.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-semibold text-gray-800 w-36 text-center">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Plan bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Plan this month:</span>
        <select value={cadence} onChange={e => setCadence(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-400">
          {CADENCES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {cadence === 'custom' && (
          <div className="flex items-center gap-1">
            {DOW.map((d, i) => (
              <button key={i} onClick={() => toggleCustomDay(i)}
                className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors ${customDays.includes(i) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {d[0]}
              </button>
            ))}
          </div>
        )}
        <button onClick={planMonth} disabled={planning}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium rounded-xl px-4 py-2 hover:bg-gray-800 disabled:opacity-60">
          {planning ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />} Plan Days
        </button>

        <div className="ml-auto flex items-center gap-2">
          {bulk.running && <span className="text-sm text-gray-500">{bulk.done}/{bulk.total} generated…</span>}
          <button onClick={generateAllEmpty} disabled={bulk.running || emptyCount === 0}
            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-medium rounded-xl px-4 py-2 hover:bg-brand-700 disabled:opacity-50">
            {bulk.running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate all empty {emptyCount > 0 && `(${emptyCount})`}
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {DOW.map(d => <div key={d} className="px-2 py-2 text-xs font-semibold text-gray-500 text-center">{d}</div>)}
        </div>
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : (
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (!day) return <div key={`e${idx}`} className="min-h-[112px] border-b border-r border-gray-50 bg-gray-50/40" />;
              const date = new Date(year, month, day);
              const dpost = byDate[ymd(date)];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div
                  key={ymd(date)}
                  onClick={() => openDay(date, dpost || null)}
                  className="group min-h-[112px] border-b border-r border-gray-50 p-1.5 cursor-pointer hover:bg-brand-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isToday ? 'font-bold text-brand-600' : 'text-gray-400'}`}>{day}</span>
                    {!dpost && <Plus className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  {dpost && (
                    dpost.status === 'planned' ? (
                      <div className="rounded-lg border border-dashed border-gray-300 p-1.5">
                        <p className="text-[11px] text-gray-500 line-clamp-2">{dpost.topic}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); generateOne(dpost.id); }}
                          disabled={genIds.has(dpost.id)}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-700">
                          {genIds.has(dpost.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {genIds.has(dpost.id) ? 'Generating' : 'Generate'}
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-gray-100">
                        {dpost.imageUrl && (
                          <div className="relative h-12 w-full bg-gray-50">
                            <Image src={dpost.imageUrl} alt="" fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <p className="text-[11px] text-gray-700 line-clamp-2 p-1">{dpost.caption || dpost.topic}</p>
                        <span className={`block text-[10px] px-1 pb-1 font-medium ${dpost.status === 'used' ? 'text-green-600' : 'text-blue-600'}`}>{dpost.status}</span>
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Day modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800">
                {modal.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-3">
              {/* CASE 1 — empty day: add a note */}
              {!post && (
                <>
                  <label className="text-sm font-medium text-gray-700">Note / post idea for this day</label>
                  <textarea
                    value={editTopic}
                    onChange={e => setEditTopic(e.target.value)}
                    rows={3}
                    placeholder="e.g. Promote our construction loan offer with a happy customer story"
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-400"
                    autoFocus
                  />
                  <button onClick={saveNewNote} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium rounded-xl py-2.5 hover:bg-gray-800 disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save note
                  </button>
                </>
              )}

              {/* CASE 2 — planned slot: edit note + generate */}
              {post && post.status === 'planned' && (
                <>
                  <label className="text-sm font-medium text-gray-700">Note / topic</label>
                  <textarea
                    value={editTopic}
                    onChange={e => setEditTopic(e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-400"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdits} disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-200 disabled:opacity-60">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save note
                    </button>
                    <button onClick={() => generateOne(post.id)} disabled={genIds.has(post.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-600 text-white text-sm font-medium rounded-xl py-2.5 hover:bg-brand-700 disabled:opacity-60">
                      {genIds.has(post.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate
                    </button>
                  </div>
                  <button onClick={() => remove(post.id)} className="w-full text-xs text-red-500 hover:text-red-600 pt-1">Delete this day</button>
                </>
              )}

              {/* CASE 3 — generated post: edit caption/hashtags, manage */}
              {post && post.status !== 'planned' && (
                <>
                  {post.imageUrl ? (
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50">
                      <Image src={post.imageUrl} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="aspect-square w-full rounded-xl bg-gray-50 flex items-center justify-center text-gray-300"><ImageIcon className="w-10 h-10" /></div>
                  )}

                  {!post.imageUrl && post.imageError && (
                    <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2">
                      <span className="font-semibold">Image failed:</span> {post.imageError}
                    </div>
                  )}

                  <label className="text-xs font-medium text-gray-500">Topic / note</label>
                  <input value={editTopic} onChange={e => setEditTopic(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-400" />

                  <label className="text-xs font-medium text-gray-500">Caption</label>
                  <textarea value={editCaption} onChange={e => setEditCaption(e.target.value)} rows={4}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-400" />

                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Hash className="w-3 h-3" /> Hashtags</label>
                  <input value={editHashtags} onChange={e => setEditHashtags(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-brand-600 focus:outline-none focus:border-brand-400" />

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={saveEdits} disabled={saving}
                      className="flex items-center gap-1 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg px-3 py-1.5 disabled:opacity-60">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save edits
                    </button>
                    <button onClick={() => copy(`${editCaption}\n\n${editHashtags}`.trim())} className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5"><Copy className="w-3.5 h-3.5" /> Copy</button>
                    {post.imageUrl && <a href={post.imageUrl} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5"><Download className="w-3.5 h-3.5" /> Image</a>}
                    <button onClick={() => generateOne(post.id)} disabled={genIds.has(post.id)} className="flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg px-3 py-1.5 disabled:opacity-60">{genIds.has(post.id) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Regenerate</button>
                    {post.status !== 'used' && <button onClick={() => setStatus(post.id, 'used')} className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg px-3 py-1.5"><CheckCircle className="w-3.5 h-3.5" /> Used</button>}
                    <button onClick={() => remove(post.id)} className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty hint */}
      {!loading && posts.length === 0 && (
        <div className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
          <Megaphone className="w-4 h-4" /> Nothing planned for {MONTHS[month]} yet. Click a day to add a note, or use &ldquo;Plan Days&rdquo; above.
        </div>
      )}
    </div>
  );
}
