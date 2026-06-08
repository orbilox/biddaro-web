'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, Plus, Trash2, MapPin, Upload, X, Loader2,
  AlertTriangle, CheckCircle, Info, Flame, Download,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloorPin {
  id: string;
  x: number;   // 0–1 relative to image
  y: number;   // 0–1 relative to image
  title: string;
  severity: string;  // normal|warning|critical
  notes: string;
}

interface FloorPlan {
  id: string;
  name: string;
  imageUrl: string;
  pins: FloorPin[];
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sevColor(sev: string) {
  if (sev === 'critical') return '#EF4444';
  if (sev === 'warning')  return '#F59E0B';
  return '#10B981';
}

function sevBg(sev: string) {
  if (sev === 'critical') return 'bg-red-100 text-red-700 border-red-200';
  if (sev === 'warning')  return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-green-100 text-green-700 border-green-200';
}

function SevIcon({ sev }: { sev: string }) {
  if (sev === 'critical') return <AlertTriangle className="w-3 h-3" />;
  if (sev === 'warning')  return <AlertTriangle className="w-3 h-3" />;
  return <CheckCircle className="w-3 h-3" />;
}

// ─── Heatmap canvas overlay ───────────────────────────────────────────────────

// Maps severity → RGBA components for radial gradient
const SEV_RGBA: Record<string, { r: number; g: number; b: number }> = {
  critical: { r: 239, g: 68,  b: 68  },
  warning:  { r: 245, g: 158, b: 11  },
  normal:   { r: 16,  g: 185, b: 129 },
};
const SEV_WEIGHT: Record<string, number> = { critical: 1.0, warning: 0.65, normal: 0.35 };

function drawHeatmap(
  canvas: HTMLCanvasElement,
  pins: FloorPin[],
  radius: number,
  opacity: number,
) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const pin of pins) {
    const cx = pin.x * canvas.width;
    const cy = pin.y * canvas.height;
    const r  = radius;
    const { r: pr, g: pg, b: pb } = SEV_RGBA[pin.severity] ?? SEV_RGBA.normal;
    const weight = SEV_WEIGHT[pin.severity] ?? 0.35;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0,   `rgba(${pr},${pg},${pb},${(opacity * weight).toFixed(2)})`);
    grad.addColorStop(0.4, `rgba(${pr},${pg},${pb},${(opacity * weight * 0.55).toFixed(2)})`);
    grad.addColorStop(1,   `rgba(${pr},${pg},${pb},0)`);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

function HeatmapCanvas({
  pins,
  radius,
  opacity,
}: {
  pins: FloorPin[];
  radius: number;
  opacity: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawHeatmap(canvas, pins, radius, opacity);
  }, [pins, radius, opacity]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={900}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}

// ─── Pin popup ────────────────────────────────────────────────────────────────

function PinPopup({
  pin,
  onUpdate,
  onDelete,
  onClose,
}: {
  pin: FloorPin;
  onUpdate: (updated: FloorPin) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [title, setTitle]       = useState(pin.title);
  const [severity, setSeverity] = useState(pin.severity);
  const [notes, setNotes]       = useState(pin.notes);

  return (
    <div className="absolute z-30 bg-white rounded-xl shadow-xl border border-dark-200 p-4 w-64" style={{ top: -8, left: 24 }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-dark-700 uppercase tracking-wide">Edit Pin</span>
        <button onClick={onClose} className="text-dark-300 hover:text-dark-600"><X className="w-3.5 h-3.5" /></button>
      </div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Pin title…"
        className="w-full text-sm border border-dark-200 rounded-lg px-2.5 py-1.5 mb-2 focus:outline-none focus:border-brand-400"
      />
      <div className="flex gap-1.5 mb-2">
        {(['normal', 'warning', 'critical'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`flex-1 text-xs font-semibold py-1 rounded-lg border capitalize transition-colors ${
              severity === s ? sevBg(s) : 'bg-dark-50 border-dark-200 text-dark-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes…"
        rows={2}
        className="w-full text-sm border border-dark-200 rounded-lg px-2.5 py-1.5 mb-3 resize-none focus:outline-none focus:border-brand-400"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onUpdate({ ...pin, title, severity, notes })}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
        >
          Save
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Interactive floor plan canvas ────────────────────────────────────────────

function FloorPlanCanvas({
  plan,
  onPinsChange,
}: {
  plan: FloorPlan;
  onPinsChange: (pins: FloorPin[]) => void;
}) {
  const [pins, setPins]           = useState<FloorPin[]>(plan.pins ?? []);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [adding, setAdding]       = useState(false);
  const [heatmap, setHeatmap]     = useState(false);
  const [radius, setRadius]       = useState(120);
  const [opacity, setOpacity]     = useState(0.7);
  const imgRef       = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const critCount = pins.filter(p => p.severity === 'critical').length;
  const warnCount = pins.filter(p => p.severity === 'warning').length;
  const normCount = pins.filter(p => p.severity === 'normal').length;

  function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    if (!adding) return;
    const rect = imgRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const newPin: FloorPin = {
      id: Math.random().toString(36).slice(2),
      x, y,
      title: 'New defect',
      severity: 'warning',
      notes: '',
    };
    const updated = [...pins, newPin];
    setPins(updated);
    onPinsChange(updated);
    setActivePin(newPin.id);
    setAdding(false);
  }

  function updatePin(updated: FloorPin) {
    const next = pins.map(p => p.id === updated.id ? updated : p);
    setPins(next);
    onPinsChange(next);
  }

  function deletePin(id: string) {
    const next = pins.filter(p => p.id !== id);
    setPins(next);
    onPinsChange(next);
    setActivePin(null);
  }

  function downloadHeatmap() {
    const container = containerRef.current;
    if (!container) return;
    // Find the heatmap canvas inside the container
    const heatCanvas = container.querySelector('canvas') as HTMLCanvasElement | null;
    if (!heatCanvas) { toast.error('Enable heatmap first'); return; }
    const img = imgRef.current;
    if (!img) return;

    // Composite: draw background image + heatmap onto an offscreen canvas
    const off = document.createElement('canvas');
    off.width  = img.naturalWidth  || 1200;
    off.height = img.naturalHeight || 900;
    const ctx = off.getContext('2d')!;
    ctx.drawImage(img, 0, 0, off.width, off.height);

    // Re-draw heatmap at native res
    const heatOff = document.createElement('canvas');
    heatOff.width  = off.width;
    heatOff.height = off.height;
    const scaleX = off.width  / heatCanvas.width;
    const scaleY = off.height / heatCanvas.height;
    drawHeatmap(heatOff, pins, radius * scaleX, opacity);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(heatOff, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    // Draw pin labels
    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i];
      const cx = pin.x * off.width;
      const cy = pin.y * off.height;
      ctx.beginPath();
      ctx.arc(cx, cy - 14, 10, 0, Math.PI * 2);
      ctx.fillStyle = sevColor(pin.severity);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), cx, cy - 14);
    }

    off.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-heatmap.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      {pins.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-dark-500">{pins.length} pin{pins.length !== 1 ? 's' : ''}</span>
          {critCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> {critCount} Critical
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> {warnCount} Warning
            </span>
          )}
          {normCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> {normCount} Normal
            </span>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => { setAdding(a => !a); setHeatmap(false); }}
          className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors ${
            adding
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-dark-200 text-dark-700 hover:border-brand-300'
          }`}
        >
          <MapPin className="w-4 h-4" />
          {adding ? 'Click on plan to place…' : 'Add Pin'}
        </button>

        {pins.length > 0 && (
          <>
            <button
              onClick={() => { setHeatmap(h => !h); setAdding(false); }}
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors ${
                heatmap
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white border-dark-200 text-dark-700 hover:border-orange-300'
              }`}
            >
              <Flame className="w-4 h-4" />
              {heatmap ? 'Heatmap On' : 'Heatmap'}
            </button>

            {heatmap && (
              <>
                <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-xl px-3 py-2">
                  <span className="text-xs text-dark-500 font-medium whitespace-nowrap">Radius</span>
                  <input
                    type="range" min={40} max={250} value={radius}
                    onChange={e => setRadius(+e.target.value)}
                    className="w-20 accent-orange-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-xl px-3 py-2">
                  <span className="text-xs text-dark-500 font-medium whitespace-nowrap">Intensity</span>
                  <input
                    type="range" min={0.2} max={1} step={0.05} value={opacity}
                    onChange={e => setOpacity(+e.target.value)}
                    className="w-20 accent-orange-500"
                  />
                </div>
              </>
            )}

            <button
              onClick={downloadHeatmap}
              disabled={!heatmap}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-dark-200 text-dark-700 bg-white hover:bg-dark-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Enable heatmap first, then download"
            >
              <Download className="w-4 h-4" /> Export PNG
            </button>
          </>
        )}
      </div>

      {/* Image + pins + heatmap */}
      <div ref={containerRef} className="relative inline-block w-full border border-dark-200 rounded-xl overflow-hidden bg-dark-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={plan.imageUrl}
          alt={plan.name}
          className={`w-full object-contain max-h-[600px] ${adding ? 'cursor-crosshair' : 'cursor-default'}`}
          onClick={handleImageClick}
          draggable={false}
          crossOrigin="anonymous"
        />

        {/* Heatmap canvas overlay */}
        {heatmap && (
          <HeatmapCanvas pins={pins} radius={radius} opacity={opacity} />
        )}

        {/* Render pins */}
        {pins.map((pin, idx) => (
          <div
            key={pin.id}
            className="absolute"
            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%`, transform: 'translate(-50%, -100%)' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setActivePin(a => a === pin.id ? null : pin.id); }}
              className="w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 text-white text-[10px] font-bold"
              style={{ backgroundColor: sevColor(pin.severity) }}
              title={pin.title}
            >
              {idx + 1}
            </button>

            {/* Popup */}
            {activePin === pin.id && (
              <PinPopup
                pin={pin}
                onUpdate={(updated) => { updatePin(updated); setActivePin(null); }}
                onDelete={() => deletePin(pin.id)}
                onClose={() => setActivePin(null)}
              />
            )}
          </div>
        ))}

        {/* Heatmap legend */}
        {heatmap && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-dark-100 text-xs space-y-1.5">
            <p className="font-bold text-dark-700 mb-1">Severity</p>
            {[
              { label: 'Critical', color: '#EF4444' },
              { label: 'Warning',  color: '#F59E0B' },
              { label: 'Normal',   color: '#10B981' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-dark-600">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pin legend */}
      {pins.length > 0 && !heatmap && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {pins.map((pin, i) => (
            <div key={pin.id} className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${sevBg(pin.severity)}`}>
              <span className="font-bold text-xs w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{pin.title || 'Untitled'}</p>
                {pin.notes && <p className="text-xs opacity-75 mt-0.5 line-clamp-1">{pin.notes}</p>}
              </div>
              <SevIcon sev={pin.severity} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Upload modal ─────────────────────────────────────────────────────────────

function UploadModal({
  projectId,
  onCreated,
  onClose,
}: {
  projectId: string;
  onCreated: (plan: FloorPlan) => void;
  onClose: () => void;
}) {
  const [name, setName]       = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!name.trim() || !imageUrl.trim()) return;
    setSubmitting(true);
    try {
      const res = await inspectApi.createFloorPlan(projectId, { name, imageUrl, pins: [] });
      onCreated((res.data as { data: FloorPlan }).data);
      toast.success('Floor plan added');
      onClose();
    } catch {
      toast.error('Failed to add floor plan');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-dark-900">Add Floor Plan</h3>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-700"><X className="w-5 h-5" /></button>
        </div>
        <div>
          <label className="block text-xs font-semibold text-dark-500 mb-1">Plan Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Ground Floor, Level 2"
            className="w-full border border-dark-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-dark-500 mb-1">Image URL</label>
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://… (paste image URL or upload to S3 first)"
            className="w-full border border-dark-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
          <p className="text-xs text-dark-400 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Upload the floor plan image via your S3 bucket or any public image host.
          </p>
        </div>
        {imageUrl && (
          <div className="rounded-xl overflow-hidden border border-dark-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="preview" className="w-full max-h-32 object-cover" onError={() => setImageUrl('')} />
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 border border-dark-200 text-dark-600 font-semibold py-2 rounded-xl text-sm hover:bg-dark-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting || !name.trim() || !imageUrl.trim()}
            className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FloorPlansPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [plans, setPlans]       = useState<FloorPlan[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const savePending = useRef<NodeJS.Timeout | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await inspectApi.listFloorPlans(projectId);
      const data = (res.data as { data: FloorPlan[] }).data;
      setPlans(data);
      if (data.length > 0 && !selected) setSelected(data[0].id);
    } catch {
      toast.error('Failed to load floor plans');
    } finally {
      setLoading(false);
    }
  }, [projectId, selected]);

  useEffect(() => { load(); }, [load]);

  // Auto-save pins with debounce
  function handlePinsChange(planId: string, pins: FloorPin[]) {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, pins } : p));
    if (savePending.current) clearTimeout(savePending.current);
    savePending.current = setTimeout(async () => {
      setSaving(true);
      try {
        await inspectApi.updateFloorPlan(planId, { pins });
      } catch {
        toast.error('Failed to save pins');
      } finally {
        setSaving(false);
      }
    }, 800);
  }

  async function deletePlan(fid: string) {
    setDeletingId(fid);
    try {
      await inspectApi.deleteFloorPlan(fid);
      const next = plans.filter(p => p.id !== fid);
      setPlans(next);
      if (selected === fid) setSelected(next[0]?.id ?? null);
      toast.success('Floor plan deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  }

  const activePlan = plans.find(p => p.id === selected) ?? null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/inspect/projects/${projectId}`} className="p-2 hover:bg-dark-100 rounded-lg transition-colors text-dark-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-dark-900">Floor Plan Markup</h1>
            <p className="text-sm text-dark-400">Place defect pins · toggle Heatmap to see severity hotspots</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-dark-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving…
            </span>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 bg-dark-100 animate-pulse rounded-2xl" />
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Upload className="w-12 h-12 text-dark-200 mb-4" />
          <h3 className="text-dark-700 font-semibold mb-1">No floor plans yet</h3>
          <p className="text-sm text-dark-400 mb-4">Upload a site plan to start placing defect pins</p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Floor Plan
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Plan tabs sidebar */}
          <div className="w-48 flex-shrink-0 space-y-2">
            {plans.map(p => {
              const pCrit = (p.pins ?? []).filter(x => x.severity === 'critical').length;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`group relative rounded-xl border p-3 cursor-pointer transition-all ${
                    selected === p.id
                      ? 'border-brand-400 bg-brand-50 shadow-sm'
                      : 'border-dark-200 hover:border-dark-300 bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-dark-800 truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-dark-400">{(p.pins ?? []).length} pin{(p.pins ?? []).length !== 1 ? 's' : ''}</span>
                    {pCrit > 0 && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 rounded-full">
                        {pCrit} ⚠
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deletePlan(p.id); }}
                    disabled={deletingId === p.id}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-dark-300 hover:text-red-500 transition-all"
                  >
                    {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active plan canvas */}
          {activePlan && (
            <div className="flex-1 min-w-0 bg-white border border-dark-100 rounded-2xl p-5">
              <h2 className="font-bold text-dark-900 mb-4">{activePlan.name}</h2>
              <FloorPlanCanvas
                key={activePlan.id}
                plan={activePlan}
                onPinsChange={pins => handlePinsChange(activePlan.id, pins)}
              />
            </div>
          )}
        </div>
      )}

      {showUpload && (
        <UploadModal
          projectId={projectId}
          onCreated={plan => {
            setPlans(prev => [...prev, plan]);
            setSelected(plan.id);
          }}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}
