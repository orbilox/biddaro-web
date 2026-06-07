'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Trash2, Loader2, Square, ArrowUpRight,
  Type, Minus, RotateCcw, CheckCircle,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

// ── Shape types ──────────────────────────────────────────────────────────────

type ShapeType = 'rect' | 'arrow' | 'line' | 'text';

interface Shape {
  id: string;
  type: ShapeType;
  x1: number; y1: number;   // canvas-relative coords (0–1 ratio)
  x2: number; y2: number;
  color: string;
  label?: string;
  strokeWidth: number;
}

interface Capture {
  id: string;
  imageUrl: string | null;
  annotation: string | null;
  type: string;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 10); }

const COLORS = [
  { label: 'Red (Critical)',    hex: '#EF4444' },
  { label: 'Amber (Warning)',   hex: '#F59E0B' },
  { label: 'Blue (Normal)',     hex: '#3B82F6' },
  { label: 'Green (OK)',        hex: '#10B981' },
  { label: 'Purple',            hex: '#8B5CF6' },
];

const STROKE_WIDTHS = [2, 3, 5, 8];

// ── Canvas renderer ───────────────────────────────────────────────────────────

function renderShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  cw: number,
  ch: number,
  selectedId?: string,
) {
  for (const s of shapes) {
    const x1 = s.x1 * cw, y1 = s.y1 * ch;
    const x2 = s.x2 * cw, y2 = s.y2 * ch;
    ctx.strokeStyle = s.color;
    ctx.fillStyle   = s.color;
    ctx.lineWidth   = s.strokeWidth;
    ctx.setLineDash(selectedId === s.id ? [6, 3] : []);

    if (s.type === 'rect') {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      // Semi-transparent fill
      ctx.globalAlpha = 0.08;
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.globalAlpha = 1;
    } else if (s.type === 'arrow') {
      // Line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      // Arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = Math.max(14, s.strokeWidth * 4);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
      ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
    } else if (s.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (s.type === 'text') {
      const fontSize = Math.max(14, s.strokeWidth * 4);
      ctx.font = `bold ${fontSize}px sans-serif`;
      // Background pill
      const text = s.label || '?';
      const tw = ctx.measureText(text).width;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x1 - 4, y1 - fontSize - 2, tw + 8, fontSize + 6);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.fillText(text, x1, y1);
      ctx.fillStyle = s.color;
    }
    ctx.setLineDash([]);
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CaptureAnnotatePage() {
  const { id: projectId, cid } = useParams<{ id: string; cid: string }>();
  const router = useRouter();

  const [capture, setCapture] = useState<Capture | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<ShapeType>('rect');
  const [color, setColor] = useState('#EF4444');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [pendingLabel, setPendingLabel] = useState('');
  const [labelPrompt, setLabelPrompt] = useState<{ x: number; y: number; shape: Shape } | null>(null);

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const imgRef     = useRef<HTMLImageElement | null>(null);
  const drawing    = useRef(false);
  const startPos   = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const draftShape = useRef<Shape | null>(null);

  // ── Load capture ───────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await inspectApi.getCapture(projectId, cid);
        const cap = (res.data as { data: Capture }).data;
        setCapture(cap);
        if (cap.annotation) {
          try {
            const parsed = JSON.parse(cap.annotation);
            if (Array.isArray(parsed.shapes)) setShapes(parsed.shapes);
          } catch { /* ignore corrupt annotation */ }
        }
      } catch {
        toast.error('Failed to load capture');
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId, cid]);

  // ── Redraw canvas ──────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = img.naturalWidth  || img.width  || 800;
    canvas.height = img.naturalHeight || img.height || 600;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderShapes(ctx, shapes, canvas.width, canvas.height, selectedId ?? undefined);
    if (draftShape.current) {
      renderShapes(ctx, [draftShape.current], canvas.width, canvas.height);
    }
  }, [shapes, selectedId]);

  useEffect(() => { redraw(); }, [redraw]);

  // ── Mouse / touch helpers ─────────────────────────────────────────────────
  function getCanvasPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX / canvas.width,
      y: (e.clientY - rect.top)  * scaleY / canvas.height,
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return;
    drawing.current = true;
    const pos = getCanvasPos(e);
    startPos.current = pos;
    draftShape.current = {
      id: uid(), type: tool,
      x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y,
      color, strokeWidth,
      label: tool === 'text' ? '' : undefined,
    };
    setSelectedId(null);
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing.current || !draftShape.current) return;
    const pos = getCanvasPos(e);
    draftShape.current = { ...draftShape.current, x2: pos.x, y2: pos.y };
    redraw();
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing.current || !draftShape.current) return;
    drawing.current = false;
    const pos = getCanvasPos(e);
    const finalShape: Shape = { ...draftShape.current, x2: pos.x, y2: pos.y };
    draftShape.current = null;

    // Ignore tiny clicks (< 2% of canvas)
    const dx = Math.abs(finalShape.x2 - finalShape.x1);
    const dy = Math.abs(finalShape.y2 - finalShape.y1);
    if (dx < 0.02 && dy < 0.02 && tool !== 'text') { redraw(); return; }

    if (tool === 'text') {
      // Prompt for label text
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      setPendingLabel('');
      setLabelPrompt({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        shape: finalShape,
      });
    } else {
      setShapes(ss => [...ss, finalShape]);
      setSelectedId(finalShape.id);
    }
    redraw();
  }

  function confirmLabel() {
    if (!labelPrompt) return;
    if (pendingLabel.trim()) {
      const s: Shape = { ...labelPrompt.shape, label: pendingLabel.trim() };
      setShapes(ss => [...ss, s]);
      setSelectedId(s.id);
    }
    setLabelPrompt(null);
    setPendingLabel('');
  }

  function deleteSelected() {
    if (!selectedId) return;
    setShapes(ss => ss.filter(s => s.id !== selectedId));
    setSelectedId(null);
  }

  function clearAll() {
    setShapes([]);
    setSelectedId(null);
    draftShape.current = null;
    redraw();
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function save() {
    setSaving(true);
    try {
      await inspectApi.updateCapture(projectId, cid, {
        annotation: JSON.stringify({ shapes }),
      });
      toast.success('Annotations saved');
      router.back();
    } catch {
      toast.error('Failed to save annotations');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!capture || !capture.imageUrl) {
    return (
      <div className="p-8 text-center text-dark-400">
        This capture has no photo to annotate.
        <button onClick={() => router.back()} className="mt-4 block mx-auto text-brand-600 underline text-sm">Go back</button>
      </div>
    );
  }

  const TOOL_BTNS: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
    { type: 'rect',  icon: <Square className="w-4 h-4" />,      label: 'Rectangle' },
    { type: 'arrow', icon: <ArrowUpRight className="w-4 h-4" />, label: 'Arrow' },
    { type: 'line',  icon: <Minus className="w-4 h-4" />,        label: 'Line' },
    { type: 'text',  icon: <Type className="w-4 h-4" />,         label: 'Text Label' },
  ];

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold text-sm">Photo Annotation</h1>
            <p className="text-gray-400 text-xs">Mark defects and areas of concern</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{shapes.length} annotation{shapes.length !== 1 ? 's' : ''}</span>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save & Close'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 bg-gray-800 border-r border-gray-700 p-3 flex flex-col gap-4 overflow-y-auto">
          {/* Tools */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tool</p>
            <div className="space-y-1">
              {TOOL_BTNS.map(t => (
                <button
                  key={t.type}
                  onClick={() => setTool(t.type)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    tool === t.type
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c.hex ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Stroke */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Stroke</p>
            <div className="flex gap-2 items-center">
              {STROKE_WIDTHS.map(w => (
                <button
                  key={w}
                  onClick={() => setStrokeWidth(w)}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    strokeWidth === w ? 'bg-brand-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={`${w}px`}
                >
                  <div className="rounded-full bg-white" style={{ width: Math.min(w * 2 + 2, 20), height: Math.min(w * 2 + 2, 20) }} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-1.5">
            {selectedId && (
              <button
                onClick={deleteSelected}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/40 text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected
              </button>
            )}
            <button
              onClick={clearAll}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-900 p-4 relative">
          <div className="relative inline-block" style={{ lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={capture.imageUrl}
              alt="Capture"
              className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
              onLoad={redraw}
              draggable={false}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ cursor: tool === 'text' ? 'text' : 'crosshair' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => {
                if (drawing.current) {
                  drawing.current = false;
                  draftShape.current = null;
                  redraw();
                }
              }}
            />
          </div>

          {/* Label prompt */}
          {labelPrompt && (
            <div
              className="absolute bg-white rounded-xl shadow-2xl p-3 z-20 border border-gray-200"
              style={{ left: labelPrompt.x + 12, top: labelPrompt.y + 12, minWidth: 220 }}
            >
              <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-brand-500" /> Label text
              </p>
              <input
                autoFocus
                value={pendingLabel}
                onChange={e => setPendingLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmLabel(); if (e.key === 'Escape') setLabelPrompt(null); }}
                placeholder="e.g. Crack found here"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={confirmLabel}
                  className="flex-1 bg-brand-600 text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Add
                </button>
                <button
                  onClick={() => setLabelPrompt(null)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-500 flex items-center gap-4 flex-shrink-0">
        <span>Click &amp; drag to draw</span>
        <span>·</span>
        <span>Click a shape to select it, then Delete to remove</span>
        <span>·</span>
        <span>Text tool: click where you want the label, then type</span>
      </div>
    </div>
  );
}
