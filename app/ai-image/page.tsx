'use client';
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  HardHat, ArrowLeft, Sparkles, Upload, ImageIcon, Download,
  Wand2, RefreshCw, X, Loader2, ChevronRight, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { imageGenApi } from '@/lib/api';

// ─── Suggested prompts ─────────────────────────────────────────────────────────
const suggestedPrompts = [
  'Modern kitchen renovation with white cabinets and quartz countertops',
  'Add a wooden deck to this outdoor space',
  'Paint the walls light gray and add recessed lighting',
  'Transform into an open-concept living room with hardwood floors',
  'Renovate bathroom with a walk-in shower and double vanity',
  'Convert to a cozy home office with built-in shelving',
  'Add large windows and natural light to brighten the space',
  'Install new flooring with modern tile or luxury vinyl planks',
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function AIImagePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handler ────────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.');
      return;
    }
    setError('');
    setUploadedFile(file);
    setGeneratedImage(null);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadedPreview(null);
    setGeneratedImage(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Generate ────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!uploadedFile || !prompt.trim() || isGenerating) return;
    setError('');
    setIsGenerating(true);
    try {
      const res = await imageGenApi.generate(uploadedFile, prompt.trim());
      const imageUrl = (res.data as { data: { imageUrl: string } }).data.imageUrl;
      setGeneratedImage(imageUrl);
      setGenerationCount((c) => c + 1);
    } catch (err: unknown) {
      const anyErr = err as { response?: { data?: { message?: string } }; name?: string };
      if (anyErr?.name === 'AbortError') {
        setError('Request timed out. The AI service may be busy — please try again.');
      } else {
        setError(
          anyErr?.response?.data?.message ||
          'Failed to generate image. Please try again.'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Download ────────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `biddaro-ai-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const canGenerate = !!uploadedFile && !!prompt.trim() && !isGenerating;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left */}
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

          {/* Center */}
          <div className="hidden sm:flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-brand-400" />
            <span className="text-white text-sm font-semibold">AI Image Studio</span>
            <span className="bg-brand-500/20 text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-500/30">
              Free
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.AI_ASSISTANT}
              className="hidden sm:flex items-center gap-1.5 text-dark-400 hover:text-white transition-colors text-xs px-3 py-1.5 rounded-lg hover:bg-dark-800"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Assistant
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Page title ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 mb-4">
            <Wand2 className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-brand-600 text-xs font-semibold uppercase tracking-wider">
              Powered by Stable Diffusion · 100% Free
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-dark-900 mb-2">
            AI Construction Image Studio
          </h1>
          <p className="text-dark-500 text-base max-w-xl mx-auto">
            Upload a reference photo of your space and describe the renovation —
            AI will generate a stunning visualisation in seconds.
          </p>
        </div>
      </div>

      {/* ─── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* ── Left: Upload ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-dark-700 uppercase tracking-wide">
                1 · Upload Your Photo
              </h2>
              {uploadedFile && (
                <button
                  onClick={clearUpload}
                  className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploadedPreview && fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
                ${uploadedPreview
                  ? 'border-transparent cursor-default'
                  : isDragging
                    ? 'border-brand-500 bg-brand-50 cursor-copy'
                    : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/30 cursor-pointer'
                }`}
              style={{ minHeight: '320px' }}
            >
              {uploadedPreview ? (
                /* Image preview */
                <img
                  src={uploadedPreview}
                  alt="Uploaded"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-80 gap-4 p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-brand-100' : 'bg-gray-100'}`}>
                    <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-brand-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-dark-700 font-semibold text-base mb-1">
                      {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-dark-400 text-sm">
                      JPEG, PNG, WebP · Max 10 MB
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-dark-400">
                    {['Kitchen', 'Bathroom', 'Living Room', 'Backyard', 'Bedroom'].map((r) => (
                      <span key={r} className="bg-gray-100 px-2.5 py-1 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>

            {/* Change image button when file is selected */}
            {uploadedFile && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 text-sm text-dark-500 hover:text-dark-900 bg-white border border-gray-200 rounded-xl py-2.5 transition-colors hover:border-gray-300"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change image
              </button>
            )}
          </div>

          {/* ── Right: Result ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-dark-700 uppercase tracking-wide">
                3 · Generated Result
              </h2>
              {generatedImage && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg px-3 py-1.5 transition-colors font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              )}
            </div>

            {/* Result panel */}
            <div
              className="rounded-2xl border-2 overflow-hidden bg-white flex items-center justify-center"
              style={{ minHeight: '320px' }}
              // ── Match border style to content
            >
              {isGenerating ? (
                /* Loading state */
                <div className="flex flex-col items-center justify-center h-80 gap-5 px-8 text-center border-dashed border-brand-200">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                  </div>
                  <div>
                    <p className="text-dark-800 font-semibold text-base mb-1">Generating your image…</p>
                    <p className="text-dark-400 text-sm max-w-xs">
                      This usually takes 10–20 seconds. Hang tight!
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ) : generatedImage ? (
                /* Generated image */
                <div className="relative w-full">
                  <img
                    src={generatedImage}
                    alt="AI generated"
                    className="w-full h-80 object-cover"
                  />
                  {/* Generation count badge */}
                  {generationCount > 1 && (
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                      #{generationCount}
                    </div>
                  )}
                  {/* Download overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-end justify-center pb-4 opacity-0 hover:opacity-100">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-white text-dark-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Image
                    </button>
                  </div>
                </div>
              ) : (
                /* Placeholder */
                <div className="flex flex-col items-center justify-center h-80 gap-4 px-8 text-center border-dashed border-2 border-gray-200 rounded-2xl w-full m-0">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-dark-500 font-semibold text-base mb-1">
                      Your result will appear here
                    </p>
                    <p className="text-dark-400 text-sm max-w-xs">
                      Upload a photo and enter your prompt, then click Generate.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Re-generate button when result exists */}
            {generatedImage && !isGenerating && (
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex items-center justify-center gap-2 text-sm text-dark-500 hover:text-dark-900 bg-white border border-gray-200 rounded-xl py-2.5 transition-colors hover:border-gray-300 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Generate again
              </button>
            )}
          </div>
        </div>

        {/* ── Prompt + Generate ─────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-dark-700 uppercase tracking-wide mb-4">
            2 · Describe the Transformation
          </h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Modern kitchen renovation with white cabinets, quartz countertops, and stainless steel appliances"
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-dark-800 placeholder-dark-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 transition-all leading-relaxed mb-4"
          />

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-dark-400">{prompt.length}/500 characters</span>
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              rightIcon={
                isGenerating
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Wand2 className="w-4 h-4" />
              }
            >
              {isGenerating ? 'Generating…' : 'Generate Image'}
            </Button>
          </div>
        </div>

        {/* ── Error banner ──────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Suggested prompts ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
            💡 Try one of these prompts
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="flex items-center gap-2.5 text-left bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark-700 hover:border-brand-400 hover:bg-brand-50 hover:text-dark-900 transition-all duration-150 group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-dark-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
                <span className="leading-snug">{p}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ────────────────────────────────────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-amber-800 text-sm flex items-start gap-3 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
          <p>
            <strong>Note:</strong> AI-generated images are for visualization purposes only and may not be
            architecturally accurate. Always consult a licensed contractor before making structural decisions.
            Results may vary — try different prompts for best output.
          </p>
        </div>

        {/* ── How it works ──────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Upload a Photo', desc: 'Take a photo of any room, space, or outdoor area you want to transform.' },
            { step: '02', title: 'Describe the Change', desc: 'Write a clear description of the renovation or style change you want to see.' },
            { step: '03', title: 'Download & Share', desc: 'Get your AI-transformed image in seconds. Download it and share with contractors.' },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 text-white text-xs font-bold flex items-center justify-center mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-dark-900 text-sm mb-1">{item.title}</h3>
              <p className="text-dark-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
